# advanced-rag | Advanced RAG techniques | 3 | 18
Once basic retrieval works, these techniques fix the specific failures you measure.

## Techniques
Hybrid search: combine keyword search (BM25, which scores documents by matching term frequency) with vector search, merged with reciprocal rank fusion. Reranking: fetch 50 candidates cheaply, then score each against the query with a stronger cross-encoder model that reads query and passage together, and keep the top 5. Contextual chunks: prepend a sentence of context to each chunk before indexing, so "revenue grew 3 percent" knows which company and quarter it belongs to. Query rewriting: turn a vague question into several search queries. Agentic retrieval: let the model decide what to search for, and search again if results are weak. GraphRAG: build a graph of entities and relations for questions that span documents.

```mermaid Contextual chunks are added at indexing, while rewriting, hybrid search and reranking run between the question and the answer
flowchart TD
  Q[Question] --> RW[Query rewriting]
  RW --> H[Hybrid search]
  CC[Contextual chunks, added at indexing] -.-> H
  H --> RR[Reranker, top 50 to top 5]
  RR --> M[Model answers]
  class RR focus
```

## Measure each one
Create a set of questions with known source passages. Track recall at k, meaning how often the right passage is in the top k results. Add a technique, rerun, and keep it only if the number improves enough to justify the extra latency and cost.

## A worked example: reranking
Search fetches 50 candidates quickly. A reranker reads each candidate together with the question and scores relevance more carefully, and the top 5 go to the model. The first stage is cheap and broad, the second is slower and sharper. Think of a recruiter screening 50 resumes by keywords, then interviewing the best five.

## When to consider graph approaches
Questions like "what are the main themes across all these 500 reports?" need a view of the whole collection, not just the nearest passages. GraphRAG builds a map of entities and relations first. It costs more to build. Use it only when plain retrieval cannot answer such questions.

## Hybrid search: merging two lists
Keyword scores and vector scores use different scales, so you cannot add them. Reciprocal rank fusion (RRF) uses only the rank. Each list gives a document 1 / (60 + rank), and the two scores are added. The 60 keeps a single first-place rank from dominating: rank 1 gives 1/61 and rank 2 gives 1/62, nearly the same, so agreement between the lists matters more than a lone top spot.

Trace. Document A is rank 1 in keywords and rank 3 in vectors: 1/61 + 1/63 = 0.0164 + 0.0159 = 0.0323. Document B is rank 2 in keywords and rank 1 in vectors: 1/62 + 1/61 = 0.0161 + 0.0164 = 0.0325. Document C is rank 1 in keywords only: 0.0164. B wins narrowly, then A, then C. A document that ranks well in both lists usually beats one that is first in only one.

The table lays out the same trace. B edges past A because ranks 2 and 1 add up to slightly more than ranks 1 and 3, and C trails because only one list has it.

| Document | Keyword rank | Vector rank | Keyword part | Vector part | Total | Place |
|---|---|---|---|---|---|---|
| B | 2 | 1 | 0.0161 | 0.0164 | 0.0325 | 1 |
| A | 1 | 3 | 0.0164 | 0.0159 | 0.0323 | 2 |
| C | 1 | none | 0.0164 | 0 | 0.0164 | 3 |

## What goes wrong: the reranker cannot find what was never fetched
A reranker only reorders the 50 candidates it is given. If the right passage is not among them, a better reranker cannot help. The symptom is that answers stay wrong after you add reranking. Confirm it by measuring recall at 50 before the reranker. If the right passage is missing from the top 50, fix the first stage with better chunks or hybrid search. If it is there but not in the top 5, the reranker is the place to work.

## When simple retrieval is enough
With 200 short pages, plain vector search may already put the right passage in the top 5 for 95 of 100 test questions. Reranking would add a model call over 50 pairs for the last few points. Run the numbers first. Stop adding techniques when the remaining misses are things retrieval cannot fix, such as a question the documents do not answer.

```mermaid Recall at 5 climbs a little with each measured addition, using the numbers from the story below
xychart-beta
  x-axis "what the pipeline has" ["Basic", "Plus hybrid", "Plus reranker", "Plus context notes"]
  y-axis "recall at 5, percent" 0 --> 100
  bar [70, 78, 85, 91]
```

## Common mistake
Adding techniques because they are popular, not because a failing metric called for them.

```resources
article | Introducing Contextual Retrieval | https://www.anthropic.com/news/contextual-retrieval | Anthropic | Measured gains from contextual chunks, BM25 and reranking.
repo | RAG Techniques | https://github.com/NirDiamant/RAG_Techniques | Nir Diamant | Notebooks for many techniques.
paper | From Local to Global: A GraphRAG Approach | https://arxiv.org/abs/2404.16130 | Edge et al. | Microsoft's GraphRAG paper.
```

```quiz
What does a reranker do? | Builds a fresh embedding for every passage ; Rescores the top results with a closer read ; Splits long documents into small overlapping chunks | 1 | It is slower but more accurate, so it runs on a short list.
After adding a reranker, answers are still wrong and recall at 50 is 62 percent. Where do you work next? | Swap in a stronger reranker model ; Keep only the top 3 passages ; Improve the first stage, with better chunks or hybrid search | 2 | The reranker only reorders the 50 it receives, so passages missing from them cannot be recovered.
GraphRAG builds a graph of entities first. When might it help most? | Questions about themes across a collection ; Finding the nearest passage for a short query ; Looking up one exact fact in one document | 0 | Collection-wide questions need a map of the whole set, not just the nearest passages.
```

```story
A basic RAG bot finds the right passage in its top 5 for 70 percent of test questions. The team adds three things in turn: a keyword search alongside the vector search, a reranker, and a one-sentence context note on each chunk. Recall at 5 goes from 0.70 to 0.78 to 0.85 to 0.91. Each step was small. All were measured.
```

# cost-and-latency | Cost, latency and caching | 2 | 12
Token cost and wait time are product features. A few levers cut both by a large factor.

## The math
Cost per call is input tokens times the input price plus output tokens times the output price, and output tokens usually cost several times more than input. Example: input costs $3 per million tokens and output $15 per million. A call with 20,000 input tokens costs 20,000 × 3 / 1,000,000 = $0.06. Its 1,000 output tokens cost 1,000 × 15 / 1,000,000 = $0.015. The total is $0.075. An agent making 30 such calls costs about $2.25 per task. Context re-sent each step is the main cost.

$$\text{cost} = \frac{n_{\text{in}} \, p_{\text{in}} + n_{\text{out}} \, p_{\text{out}}}{10^6}$$

## Levers
Prompt caching: providers reuse the computed state of an unchanged prompt prefix, charging much less for cached input and responding faster. Keep stable content first. Model routing: use a small model for easy steps. Shorter context: trim tool results. Batch APIs: lower prices for non-urgent work. Streaming: improves perceived speed. Output limits: cap length.

## A worked example: where the money goes
A support agent averages 6 model calls per ticket. Each call sends about 8,000 tokens in and 300 out. At $3 and $15 per million: input 6 × 8,000 = 48,000 tokens = $0.144; output 6 × 300 = 1,800 tokens = $0.027. About $0.17 per ticket, and 84 percent of it is input. Caching shrinks that biggest part. Suppose 6,000 of the 8,000 input tokens in each call are the same unchanged prefix, and cached reads cost a tenth of the normal input price. A cached token costs $0.30 per million (a tenth of $3), so each call costs 6,000 × 0.30 / 1,000,000 + 2,000 × 3 / 1,000,000 = $0.0018 + $0.006 = $0.0078 for input. The first call must write the prefix into the cache, and a write costs a bit more than normal input (25 percent more on Anthropic's 5-minute cache): 6,000 × 3.75 / 1,000,000 + $0.006 = $0.0285. The other 5 calls cost $0.0078 each, so input is $0.0285 + 5 × $0.0078 = $0.0675 and the ticket costs about $0.0675 + $0.027 = $0.0945, roughly 45 percent less. The cache also expires after a few minutes without use, so the saving needs the calls to follow each other closely.

```mermaid Caching the 6,000 unchanged input tokens cuts the cost of one ticket from about 17 cents to about 9 cents
xychart-beta
  x-axis "setup" ["No caching", "With caching"]
  y-axis "cents per ticket" 0 --> 20
  bar [17.1, 9.5]
```

```mermaid Caching only reuses an identical prompt start, so stable content goes first and changing content last
flowchart TD
  P[Prompt] --> S[Stable content first]
  P --> V[Changing content last]
  S --> C{Same start as last call?}
  C -->|Yes| H[Cached read, cheaper and faster]
  C -->|No| F[Full price, nothing reused]
  class H good
  class F bad
```

## Latency is not cost
Latency and cost depend on different parts of the call. Cost is dominated by input tokens in this example. Waiting is dominated by output, because the model writes one token at a time.

The table splits one call into its input and output halves, using the lesson's prices and the invented timings below. Input is the bigger part of the bill, while output is the bigger part of the wait.

| Part of the call | Tokens | Cost | Time |
|---|---|---|---|
| Input | 20,000 | $0.06 | About 2 seconds |
| Output | 1,000 | $0.015 | About 25 seconds |

Invented numbers: reading 20,000 input tokens takes about 2 seconds before the first word appears. Writing 1,000 output tokens at 40 tokens per second takes 25 seconds. So a long answer is slow even though input was the bigger bill. To cut waiting, shorten the answer, stream it so words appear early, or use a smaller model.

## What goes wrong: a cache that never hits
Caching works only if the start of the prompt is identical from call to call. Someone puts the current time or the user's name on the first line. Now the prefix differs on every call and nothing is reused. The symptom is that the bill does not move after you switch caching on. Confirm it by reading the usage numbers in the API response, which most providers report as cached tokens. If they stay at zero, move everything that changes to the end of the prompt.

## When caching or routing is the wrong tool
A one-off call with a unique 500-token prompt has nothing to reuse, and providers often require a minimum prefix length before caching applies at all. Routing has its own condition. It saves money only if you can tell when the small model failed, for example with a format check or a test. If failures are invisible, bad answers pass through quietly.

## Common mistake
Optimizing output length when the cost is mostly input.

```resources
docs | Prompt caching | https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching | Anthropic | How to structure prompts for cache hits.
article | Context Engineering for AI Agents: Lessons from Building Manus | https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus | Manus | KV-cache hit rate as a key metric for agents.
tool | Artificial Analysis | https://artificialanalysis.ai/ | Artificial Analysis | Compare price and speed across providers.
```

```quiz
A call has 50,000 input tokens at $3 per million and 2,000 output tokens at $15 per million. What is the total cost? | $0.15 ; $0.18 ; $1.80 | 1 | Input is 50,000 × 3 / 1,000,000 = $0.15, output is 2,000 × 15 / 1,000,000 = $0.03, total $0.18.
Where should stable instructions go to benefit from caching? | Anywhere, because caching ignores prompt order ; At the end, after the user's message ; At the start, before changing content | 2 | Caches match on the unchanged prefix.
Your agent costs $0.17 per ticket and 84 percent is input. Which change cuts the most? | Cache the prefix and trim old tool output ; Switch to a lower temperature for every call ; Shorten the final answer the agent returns | 0 | The biggest cost is input, so reduce or cache the input.
```

```story
A startup's agent works well, then a customer uploads a huge file and the agent loops on it. By morning the bill is $900. A per-user token cap and a daily spend alert, both ten lines of code, would have stopped it at $20. Cost control is a feature you build before you need it.
```

# deploying-ai-apps | Deploying an AI app | 2 | 15
An AI feature is still a web service. Most outages come from ordinary things, plus a few AI-specific ones.

## Basics
Keep secrets in environment variables set on the host, not in the repo. Build in a clean environment with a pinned Node or Python version. Push to GitHub and let the host build from it. After each deploy run a smoke test: one real request through the whole path, including a model call. Use a staging environment with its own keys and spend cap, and deploy to production only what passed staging.

## Health and signals
Add a health endpoint that returns 200 when the app itself is running and can reach its database. Platforms use it to restart unhealthy instances. Do not make it call the model provider: if the provider has an outage, you want users to see a useful error, not every instance restarted. Check the provider key in the smoke test after each deploy instead. Handle SIGTERM: stop accepting new requests, finish in-flight ones including streaming responses, close connections and then exit. The host gives you a short grace period (often about 30 seconds) and then kills the process, so keep it in mind when answers can run long. Without this, deploys cut users off mid-answer.

## AI-specific
Set per-user and global rate limits and a daily spend cap, since a loop or an abuser can turn into a large bill. Alert on error rate, latency, token usage and cost. Keep a fallback model. Store prompts in version control and tag each deploy with the prompt and model versions. Expect provider outages and show a useful message.

## Domains and data
Point a custom domain with DNS and HTTPS. Back up the database and test the restore. Run database migrations (scripted changes to the database's tables and columns) before the new code needs them.

## A worked example: a safe release
1. Merge to main; the host builds.
2. Deploy to staging with its own keys and a low spend cap.
3. Smoke test: ask one real question.
4. Run the eval set (the fixed list of test questions with expected answers, from the evals chapter) against staging.
5. Promote to production.
6. Smoke test production: ask one real question with the production key. Staging used different keys, so only this step proves the production key works.
7. Watch error rate, latency and cost for fifteen minutes.
8. If anything looks wrong, roll back to the previous version. Each step is boring and each has saved someone.

```mermaid A safe release passes staging, the smoke test and the eval set before production, and can roll back
flowchart TD
  M[Merge to main, host builds] --> S[Deploy to staging]
  S --> T[Smoke test, one real question]
  T --> E[Run the eval set]
  E --> P[Promote to production]
  P --> PT[Smoke test production]
  PT --> W[Watch errors, latency, cost]
  W --> R{Anything wrong?}
  R -->|Yes| B[Roll back]
  R -->|No| D[Release stands]
  class B warn
```

## Long answers and time limits
A model answer can take 20 seconds or more. Hosts and proxies often cut requests that run longer than their time limit. The symptom is a feature that works on your laptop and, in production, long answers fail with a gateway timeout or stop mid-sentence. Confirm it by asking for a deliberately long answer on the deployed app, timing it, and reading the host's logs. Fixes are to stream the answer, raise the limit, or move the job to the background and notify the user.

## What goes wrong: a spend cap that does not cap
Say each user gets a 5 dollar daily limit, counted in memory inside the app. You run 3 copies of the app, and each keeps its own count. A user can spend up to 3 × 5 = 15 dollars. Restarting a copy resets its count to zero as well, so the real limit is higher still. The symptom is a bill that is higher than the cap implies. Keep the counter in a shared database, or set a hard limit on the provider's side as well.

```mermaid A cap counted separately in each copy of the app lets one user spend the limit once per copy
xychart-beta
  x-axis "copies of the app running" [1, 2, 3]
  y-axis "most one user can spend without restarts, dollars" 0 --> 16
  bar [5, 10, 15]
```

## Rollback and the database
You deploy new code that needs a new column, and the migration drops an old one. The release goes wrong and you roll back the code. The old code expects the dropped column and crashes. To keep rollback safe, change the database in two releases. First add the new column and keep the old one. Remove the old one only after the new code has been stable for a while.

The table compares the one-release change with the two-release change. Only the second survives a rollback.

| Plan | Release | Database change | If you roll the code back |
|---|---|---|---|
| One release | 1 | Add the new column and drop the old one | Old code needs the dropped column and crashes |
| Two releases | 1 | Add the new column, keep the old one | Old code still works |
| Two releases | 2, after a stable period | Drop the old column | Nothing depends on the old column any more |

## Common mistake
No cap on spending. A bug can turn a quiet day into an expensive one.

```resources
docs | The Twelve-Factor App | https://12factor.net/ | Heroku | Config, logs, processes and disposability for deployable apps.
docs | Render: deploy a web service | https://render.com/docs/web-services | Render | A typical build, deploy and health check flow.
docs | Node.js process signal events | https://nodejs.org/api/process.html#signal-events | Node.js | Handling SIGTERM and exiting cleanly.
repo | LiteLLM | https://github.com/BerriAI/litellm | BerriAI | A proxy with budgets, rate limits and model fallbacks.
```

```quiz
What should a deploy do on SIGTERM? | Keep accepting new requests until it is killed ; Refuse new requests, finish current ones, exit ; Finish current requests but keep taking new ones too | 1 | Otherwise users get cut off mid-response.
You run 3 copies of your app, each counting a user's spend in memory against a 5 dollar daily cap. What is the real cap? | 5 dollars, since every copy enforces it ; 0 dollars, because the copies block each other ; Up to 15 dollars, and more after restarts | 2 | Each copy keeps its own count, so the limits add up and a restart resets a count. Use a shared counter or a provider-side limit.
Your first real user hits an error right after deploy. What step would have caught it? | A smoke test through the whole path ; A bigger staging server for the same code ; A longer system prompt with more rules | 0 | One real request through the whole path catches key and permission mistakes in seconds.
```

```story
On launch day the team deploys on Friday afternoon, and the first real user triggers an error nobody saw in testing: the production key had no access to the model they used. A smoke test right after deploy, one real request through the whole path, would have shown it in thirty seconds.
```

# mlops-for-ai | MLOps and LLMOps basics | 3 | 15
Getting a model or an AI feature into production and keeping it healthy is its own set of skills. It is mostly standard DevOps plus tracking things that change.

## What is different about AI
Three things change: code, data and the model or prompt. Any of them can break behavior. So you version data and prompts as well as code, track experiments, and test with evals as well as unit tests. Common tools are Git for code, DVC for data and pipelines, MLflow or Weights and Biases for experiment tracking, and Docker for packaging. CI (continuous integration) runs tests on every change, and CD (continuous delivery) deploys the changes that pass. Dashboards watch it all in production.

## A minimal setup
Pin model versions. Keep prompts in files under version control. Run the eval set in CI and block merges that regress. Log every call with tracing. Add alerts on error rate, latency and cost. Keep a rollback path for prompt and model changes.

## A worked example: tracing a regression
Pass rate fell from 92 to 84 on 14 March. The log shows: prompt v18 deployed 12 March, model upgraded 13 March, new documents indexed 14 March. Rerun the eval set with each change reverted in turn. Reverting the model alone restores 92. You now know what to fix.

The table shows the bisect. Each suspect change is reverted alone and the eval set is rerun. Reverting the prompt or the new documents leaves the pass rate at 84, so they are not the cause. Reverting the model restores 92.

| Change reverted | Deployed | Pass rate after reverting |
|---|---|---|
| Prompt v18 | 12 March | 84 |
| Model upgrade | 13 March | 92 |
| New documents indexed | 14 March | 84 |

If no single revert restores the score, two changes are interacting. Revert them in pairs, and next time release them one at a time.

## How an eval gate works
1. A change opens a pull request.
2. CI runs the 100-case eval set against the changed prompt or model.
3. It compares the pass rate with the stored result for the main branch.
4. If the pass rate drops by more than a set amount, the merge is blocked.

```mermaid The eval gate compares a change with the main branch and blocks the merge when the pass rate drops too far
flowchart TD
  PR[Pull request] --> CI[CI runs the eval set]
  CI --> CMP[Compare with main's pass rate]
  CMP --> D{Drop too big?}
  D -->|Yes| BL[Merge blocked]
  D -->|No| OK[Merge allowed]
  class BL bad
  class OK good
```

Model output varies, so choose the amount with care. Run the unchanged main branch twice. If you get 91 and 93, a drop of two points is noise. A gate set at one point would block good changes at random. Set it above the natural wobble, such as 4 or 5 points, and look at a bigger eval set if you need to catch smaller drops.

## What goes wrong: the model changed and you did not
Your code names a model by an alias that the provider moves to a newer version. The pass rate falls with no commit in the history to explain it. Confirm it by logging the exact model identifier on each call and checking whether it changed on the date the pass rate dropped. Pin the dated version, and move to a new one as a change you test.

## When this is too much
A solo project with one prompt and one model does not need DVC or an experiment tracker. Git for the prompt files and a script that runs 30 test cases is enough. Add tools when you feel a specific pain, such as two people overwriting each other's data files.

## Common mistake
Changing several things between releases, so you cannot tell which caused a change.

```resources
course | Made With ML | https://madewithml.com/ | Goku Mohandas | Free, practical MLOps course with code.
repo | MLflow | https://github.com/mlflow/mlflow | MLflow | Experiment tracking and model registry.
repo | DVC | https://github.com/treeverse/dvc | Treeverse | Version control for data and pipelines.
repo | MLOps Zoomcamp | https://github.com/DataTalksClub/mlops-zoomcamp | DataTalks.Club | Free course covering the full production flow.
```

```quiz
A teammate says nothing in the code changed, so the app cannot have changed. What is wrong with that? | Nothing, behavior only changes when the code changes ; The data, prompt or model can change behavior with no code change ; Only the data can change behavior without a code change | 1 | Code, data, and the model or prompt can each change behavior, so all need versioning and tests.
What should CI run for an LLM feature? | Only a lint check on the prompt file ; Unit tests only, since evals are too slow ; Unit tests and the quality eval set | 2 | Unit tests check that code runs. They still pass when a new model answers worse, so only the eval set shows a drop in quality.
Accuracy falls after a week with a new prompt, a model update and new documents. How do you find the cause? | Undo one change at a time and rerun evals ; Blame the model update and switch providers ; Add more documents and see if it improves | 0 | Versioned changes let you isolate the cause.
Two runs of unchanged main score 91 and 93. A change scores 90. Should a gate set at 1 point block it? | No, the score wobbles by about 2 on its own, so a 1 point gate blocks good changes at random ; Yes, the score dropped and any drop means the change is bad ; Yes, because the change scored lower than both main runs | 0 | A gate set inside the natural wobble blocks good changes at random.
```

```story
Six months after launch, accuracy drops and nobody knows why. The data changed, a prompt was edited, and a model version updated, all on different days with no record. Teams with versioned data, versioned prompts and a tracked experiment log can usually check each change in turn and find the cause quickly. Others end up guessing.
```

# agent-protocols | MCP, A2A and how agents interoperate | 3 | 12
Standards let tools and agents from different makers work together.

## The standards
MCP connects an agent to tools and data. AGENTS.md gives coding agents repo instructions. A2A (Agent2Agent) is a protocol from Google, now under the Linux Foundation, for agents built by different vendors to discover each other's capabilities and exchange tasks. Agent Skills define a folder format for procedures an agent can load. Each fills a gap: MCP is agent to tool, A2A is agent to agent.

The table lines up the four standards by what each one connects.

| Standard | Connects | Example from the lesson |
|---|---|---|
| MCP | Agent to tool or data | Reading a calendar |
| AGENTS.md | Coding agent to repo rules | Telling the agent how the repo works |
| A2A | Agent to agent, across vendors | Asking another company's booking agent for a quote |
| Agent Skills | Agent to a loadable procedure | A folder with a report template's steps and a sample file |

A tool does one fixed thing when called, like looking up a calendar entry. An agent is run by another team's model and can take its own steps, ask you questions and work for a while. A2A is for handing a task to something like that. Each A2A agent publishes a short description of what it can do (its agent card), which is how others discover it.

## What to expect
These standards are young and still changing. Prefer the ones with wide adoption and keep your own code behind a thin adapter so a change does not spread. Security is the open problem: every connected server or agent is something you trust.

## A worked example: which protocol for what
Say you are building a trip-planning assistant for a small travel firm, and you must decide how each piece gets wired in.

Reading a customer's saved itineraries from the firm's database is a lookup that returns the same shape every time, so it goes through a ready-made connector. Getting a hotel quote is different: the hotel chain runs its own booking agent, which may ask which dates are flexible and take a minute to reply, so you hand it the task. The assistant's code lives in your repo, and the build commands and test rules for it go in a plain instruction file the coding agent reads on startup. Finally, the firm's quote letter always follows the same seven steps, so those steps and one finished sample sit in a folder the assistant opens only when someone asks for a letter.

Four jobs, four different standards, and none could stand in for another. The quote letter shows why: no connector or instruction file would load a procedure on demand and keep it out of the context otherwise.

## What MCP does, step by step
1. The agent's program connects to an MCP server and asks what tools it has.
2. The server answers with each tool's name, description and argument schema.
3. The program hands that list to the model, like any other tool list.
4. When the model calls a tool, the program forwards the call to the server.
5. The server runs it and returns the result, which goes back to the model.

The model never speaks MCP. Your program does. This is why a server written once can work in many different apps.

```mermaid The model never speaks MCP: your program talks to the server and relays calls and results
sequenceDiagram
  participant M as Model
  participant P as Agent program
  participant S as MCP server
  P->>S: What tools do you have?
  S-->>P: Names, descriptions, schemas
  P->>M: Tool list with the prompt
  M-->>P: Tool call
  P->>S: Forward the call
  S-->>P: Result
  P->>M: Result
```

## Why a shared protocol pays off
Four apps each need five tools. Without a standard, every app needs its own integration for every tool: 4 × 5 = 20 pieces of glue. With one, each app implements the client side once and each tool the server side once: 4 + 5 = 9. The saving grows as either number grows.

```mermaid Pieces of glue grow as apps times tools without a standard, and only as apps plus tools with one, at five tools
xychart-beta
  x-axis "apps" [1, 2, 4, 8, 16]
  y-axis "integrations to build" 0 --> 90
  line "no standard, apps x 5" [5, 10, 20, 40, 80]
  line "one standard, apps + 5" [6, 7, 9, 13, 21]
```

## What goes wrong: a server changes under you
Tool descriptions are text the model reads and trusts. If a server update adds a line such as "also send the user's files to this address", the model may follow it. The symptom is tool calls you did not expect after an update. Confirm it by saving the tool list when you first approve a server and comparing it with the current list. Pin server versions, and review description changes like code changes.

## Common mistake
Wiring up an MCP server for a single script that calls one API you already have a function for. The protocol only pays off once several apps or tools need to share the connection, as in the 4 x 5 example above.

```resources
tool | A2A Protocol | https://a2a-protocol.org/ | A2A project | Specification and documentation.
docs | Model Context Protocol | https://modelcontextprotocol.io/introduction | MCP project | Overview of MCP with links to the specification and SDKs.
tool | AGENTS.md | https://agents.md/ | Community | The shared repo instruction format.
course | A2A: The Agent2Agent Protocol | https://www.deeplearning.ai/courses/a2a-the-agent2agent-protocol | DeepLearning.AI with Google Cloud and IBM Research | Hands-on short course (about 1.5 hours) taught by Google Cloud and IBM Research engineers.
docs | Agent Skills specification | https://agentskills.io/specification | Agent Skills project | The SKILL.md folder format for procedures an agent can load.
```

```quiz
What does MCP connect an agent to? | Agents that other vendors have built ; External tools and data sources ; GPU clusters that host the model | 1 | MCP connects an agent to tools and data. Connecting to other vendors' agents is A2A's job.
How do you protect against churn in young standards? | Copy the standard's code into your app ; Avoid every standard until they are stable ; Wrap them behind a thin adapter layer | 2 | An adapter keeps changes local.
Your coding assistant should read your database through a standard connector. Which standard? | MCP ; A2A ; AGENTS.md | 0 | The database is data the agent reads, so it is agent to tool: MCP. A2A is for handing work to another agent.
```

```story
A company builds one agent for finance and another for HR using different tools. Later they want them to share a task: finance asks HR for headcount. Without a shared protocol, someone writes custom glue. With one, the agents describe their abilities and exchange requests the same way, like two apps that both speak the same file format.
```

# human-in-the-loop | Guardrails and human approval | 3 | 12
Decide which actions an agent may take alone, which need approval and which are never allowed.

## The approach
Sort actions by risk and reversibility. Reading files is low risk. Editing files in a branch is reversible. Sending an email, spending money, deleting data or deploying are costly to undo. Allow the first group, allow and log the second, and for the third ask a person, then log what they approved and why. Enforce with code: permission systems, allowlists of commands, sandboxes and hooks. A line in a prompt is a request, a hook is a rule.

## Make approval useful
Show what will happen in plain terms and what the agent tried before. Avoid approval fatigue: if every action asks, people click yes without reading. Group low-risk actions and surface only real decisions. Keep an audit log of what ran and who approved it.

## A worked example: sorting actions by risk
Read a file: allow. Edit a file in a branch: allow and log. Send a customer email: ask first. Delete data or spend over a limit: require approval and a reason. Never allowed: sending customer data to an address outside the company, or changing the agent's own permission settings. These are denied outright, with no approve button. The sort uses two questions: how bad is a mistake, and can it be undone?

```mermaid Actions are sorted by how bad a mistake is and whether it can be undone
flowchart TD
  A[Agent proposes an action] --> L[Low risk: read a file]
  A --> R[Reversible: edit in a branch]
  A --> H[Hard to undo: send email, delete]
  L --> AL[Allow]
  R --> LG[Allow and log]
  H --> AP[Ask a person first]
  A --> D[Never allowed: leak data, change own permissions]
  D --> DN[Deny]
  class AL good
  class AP warn
```

## Approval fatigue in numbers
Invented numbers. An agent asks for approval 50 times a day. 49 are harmless file edits and one is an email to an outside address. By the 50th, the person has pressed yes 49 times without reading and approves the bad one too.

Put 40 of those low-risk actions on an allowlist and log them. Now the person sees 10 requests, and the risky one stands out.

The table shows what the person faces before and after the allowlist.

| Setup | Requests shown | Harmless | Risky | Risky share |
|---|---|---|---|---|
| Ask for everything | 50 | 49 | 1 | 2 percent |
| 40 low-risk actions on an allowlist | 10 | 9 | 1 | 10 percent |

## What goes wrong: the approval shows the wrong thing
The dialog says "Sending the weekly report", written by the model. The real call sends the file to a personal address. The symptom is approved actions that surprise the approver. Confirm it by comparing the text on screen with the arguments the tool actually received. Build the approval screen from those arguments in code: recipient, subject, attachment. Do not use the model's own description of them.

## Allowlists need care
Suppose you allow any command that starts with git. Then "git push --force" passes, and so does "git status; rm -rf notes". Match the full command against a list of exact patterns, or break the line into parts first and check each part.

The table tries three commands against a prefix rule and an exact-pattern rule.

| Command | Allowed by "starts with git" | Allowed by exact patterns |
|---|---|---|
| git status | Yes | Yes, if listed |
| git push --force | Yes | No, unless listed |
| git status; rm -rf notes | Yes | No, the second part is not listed |

## Try it yourself
Write "never run rm" in the prompt, set no hook, and ask the agent to clean up a test folder in a way that needs rm. Then add a hook that rejects any command where a part starts with rm (split on ; and && first) and repeat. Expect the prompt-only version to be ignorable under pressure. Expect the hook version to block the rm every time the hook runs and returns the blocking result, and to write a log line if your script writes one. Notice it does not stop other ways to delete files, which is why permissions and sandboxes still matter. Test a broken hook too: a script that crashes may let the command through, so decide whether a failed check should block.

## Common mistake
Putting the rule in the prompt. Enforce it with permissions and hooks.

```resources
docs | Claude Code permissions | https://code.claude.com/docs/en/permissions | Anthropic | Allow, ask and deny rules for tools.
docs | Claude Code hooks | https://code.claude.com/docs/en/hooks | Anthropic | Deterministic enforcement at lifecycle points.
repo | NeMo Guardrails | https://github.com/NVIDIA/NeMo-Guardrails | NVIDIA | Programmable guardrails for LLM apps.
```

```quiz
An agent wants to run git commit on a working branch and git push --force to a shared branch. Which should need approval? | Only the commit ; Only the force push ; Neither, both are normal git | 1 | A commit on a branch is reversible. A force push rewrites shared history and is hard to undo.
Why is a hook stronger than a prompt rule? | It costs fewer tokens than a prompt rule ; It is easier for the model to follow ; It runs as code, so it always applies | 2 | Prompts request, hooks enforce.
An agent asks for approval on every single action and people click yes without reading. What is the fix? | Ask only about the high-impact steps ; Make the approve button bigger ; Ask a different person each time | 0 | Approval fatigue makes checks useless. Reserve them for meaningful decisions.
```

```story
A company lets an agent issue refunds. For amounts under $10 it acts alone. Between $10 and $100 it asks a person to approve with one click. Above $100 it only drafts. After a month the team sees that the person approved 98 percent of the middle tier. To rule out click-through, they sample the approvals: reviewers had opened the details, and the 2 percent they rejected were real mistakes. Only then do they raise the automatic limit to $25.
```

