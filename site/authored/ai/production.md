# advanced-rag | Advanced RAG techniques | 3 | 18
Once basic retrieval works, these techniques fix the specific failures you measure.

## Techniques
Hybrid search: combine keyword search (BM25, which scores documents by matching term frequency) with vector search, merged with reciprocal rank fusion. Reranking: fetch 50 candidates cheaply, then score each against the query with a stronger cross-encoder model that reads query and passage together, and keep the top 5. Contextual chunks: prepend a sentence of context to each chunk before indexing, so "revenue grew 3 percent" knows which company and quarter it belongs to. Query rewriting: turn a vague question into several search queries. Agentic retrieval: let the model decide what to search for, and search again if results are weak. GraphRAG: build a graph of entities and relations for questions that span documents.

## Measure each one
Create a set of questions with known source passages. Track recall at k, meaning how often the right passage is in the top k results. Add a technique, rerun, and keep it only if the number improves enough to justify the extra latency and cost.

## A worked example: reranking
Search fetches 50 candidates quickly. A reranker reads each candidate together with the question and scores relevance more carefully, and the top 5 go to the model. The first stage is cheap and broad, the second is slower and sharper. Think of a recruiter screening 50 resumes by keywords, then interviewing the best five.

## When to consider graph approaches
Questions like "what are the main themes across all these 500 reports?" need a view of the whole collection, not just the nearest passages. GraphRAG builds a map of entities and relations first. It costs more to build. Use it only when plain retrieval cannot answer such questions.

## Common mistake
Adding techniques because they are popular, not because a failing metric called for them.

```resources
article | Introducing Contextual Retrieval | https://www.anthropic.com/news/contextual-retrieval | Anthropic | Measured gains from contextual chunks, BM25 and reranking.
repo | RAG Techniques | https://github.com/NirDiamant/RAG_Techniques | Nir Diamant | Notebooks for many techniques.
paper | From Local to Global: A GraphRAG Approach | https://arxiv.org/abs/2404.16130 | Edge et al. | Microsoft's GraphRAG paper.
```

```quiz
What does a reranker do? | Creates embeddings ; Rescores a short list of candidates by reading query and passage together ; Splits documents | 1 | It is slower but more accurate, so it runs on a short list.
How do you decide to keep a new technique? | It is popular ; Recall improves enough to justify added cost and latency ; It uses an agent | 1 | Measure on your own questions.
```

```story
A basic RAG bot answers 70 percent of questions well. The team adds three things in turn: a keyword search alongside the vector search, a reranker, and a one-sentence context note on each chunk. Recall goes from 0.70 to 0.78 to 0.85 to 0.91. Each step was small. All were measured.
```

# cost-and-latency | Cost, latency and caching | 2 | 12
Token cost and wait time are product features. A few levers cut both by a large factor.

## The math
Cost per call is input tokens times the input price plus output tokens times the output price, and output tokens usually cost several times more than input. Example: input costs $3 per million tokens and output $15 per million. A call with 20,000 input tokens costs 20,000 × 3 / 1,000,000 = $0.06. Its 1,000 output tokens cost 1,000 × 15 / 1,000,000 = $0.015. The total is $0.075. An agent making 30 such calls costs about $2.25 per task. Context re-sent each step is the main cost.

## Levers
Prompt caching: providers reuse the computed state of an unchanged prompt prefix, charging much less for cached input and responding faster. Keep stable content first. Model routing: use a small model for easy steps. Shorter context: trim tool results. Batch APIs: lower prices for non-urgent work. Streaming: improves perceived speed. Output limits: cap length.

## A worked example: where the money goes
A support agent averages 6 model calls per ticket. Each call sends about 8,000 tokens in and 300 out. At $3 and $15 per million: input 6 × 8,000 = 48,000 tokens = $0.144; output 6 × 300 = 1,800 tokens = $0.027. About $0.17 per ticket, 90 percent of it input. Trimming context or caching the shared prefix cuts the biggest part.

## Levers in order
Cache the unchanged beginning of the prompt. Trim old tool output. Use a small model for easy steps. Batch non-urgent work. Cap output length. Measure after each change.

## Common mistake
Optimizing output length when the cost is mostly input.

```resources
docs | Prompt caching | https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching | Anthropic | How to structure prompts for cache hits.
article | Context Engineering for AI Agents: Lessons from Building Manus | https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus | Manus | KV-cache hit rate as a key metric for agents.
tool | Artificial Analysis | https://artificialanalysis.ai/ | Artificial Analysis | Compare price and speed across providers.
```

```quiz
A call has 20,000 input tokens at $3 per million. What is the input cost? | $0.06 ; $0.60 ; $6 | 0 | 20,000 / 1,000,000 × 3 = 0.06.
Where should stable instructions go to benefit from caching? | At the start of the prompt ; At the end ; Anywhere | 0 | Caches match on the unchanged prefix.
```

```story
A startup's agent works well, then a customer uploads a huge file and the agent loops on it. By morning the bill is $900. A per-user token cap and a daily spend alert, both ten lines of code, would have stopped it at $20. Cost control is a feature you build before you need it.
```

# deploying-ai-apps | Deploying an AI app | 2 | 15
An AI feature is still a web service. Most outages come from ordinary things, plus a few AI-specific ones.

## Basics
Keep secrets in environment variables set on the host, not in the repo. Build in a clean environment with a pinned Node or Python version. Push to GitHub and let the host build from it. After each deploy run a smoke test: one real request through the whole path, including a model call. Use a staging environment with its own keys and spend cap, and deploy to production only what passed staging.

## Health and signals
Add a health endpoint that returns 200 when the app can reach its database and its model provider's credentials work. Platforms use it to restart unhealthy instances. Handle SIGTERM: stop accepting new requests, finish in-flight ones including streaming responses, close connections and then exit. Without this, deploys cut users off mid-answer.

## AI-specific
Set per-user and global rate limits and a daily spend cap, since a loop or an abuser can turn into a large bill. Alert on error rate, latency, token usage and cost. Keep a fallback model. Store prompts in version control and tag each deploy with the prompt and model versions. Expect provider outages and show a useful message.

## Domains and data
Point a custom domain with DNS and HTTPS. Back up the database and test the restore. Run migrations before the new code needs them.

## A worked example: a safe release
1. Merge to main; the host builds. 2. Deploy to staging with its own keys and a low spend cap. 3. Smoke test: ask one real question. 4. Run the eval set against staging. 5. Promote to production. 6. Watch error rate, latency and cost for fifteen minutes. 7. If anything looks wrong, roll back to the previous version. Each step is boring and each has saved someone.

## What the health endpoint checks
That the app is up, the database answers and the model provider accepts your key. Platforms call it often and restart instances that fail.

## Common mistake
No cap on spending. A bug can turn a quiet day into an expensive one.

```resources
docs | The Twelve-Factor App | https://12factor.net/ | Heroku | Config, logs, processes and disposability for deployable apps.
docs | Render: deploy a web service | https://render.com/docs/web-services | Render | A typical build, deploy and health check flow.
docs | Node.js process signal events | https://nodejs.org/api/process.html#signal-events | Node.js | Handling SIGTERM and exiting cleanly.
repo | LiteLLM | https://github.com/BerriAI/litellm | BerriAI | A proxy with budgets, rate limits and model fallbacks.
```

```quiz
What should a deploy do on SIGTERM? | Exit immediately ; Stop new requests, finish in-flight ones, then exit ; Ignore it | 1 | Otherwise users get cut off mid-response.
Why set a spend cap? | A loop or abuse can create a large bill quickly ; Models are free ; It speeds up responses | 0 | Caps limit the damage of runaway usage.
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

## Minimum setup
Git for code and prompts. A place to version datasets. A log of experiments with settings and scores. CI that runs the eval set. A dashboard for error rate, latency and cost. None of it is exotic.

## Common mistake
Changing several things between releases, so you cannot tell which caused a change.

```resources
course | Made With ML | https://madewithml.com/ | Goku Mohandas | Free, practical MLOps course with code.
repo | MLflow | https://github.com/mlflow/mlflow | MLflow | Experiment tracking and model registry.
repo | DVC | https://github.com/iterative/dvc | Iterative | Version control for data and pipelines.
repo | MLOps Zoomcamp | https://github.com/DataTalksClub/mlops-zoomcamp | DataTalks.Club | Free course covering the full production flow.
```

```quiz
What three things can change an AI system's behavior? | Only the model ; Code, data and the model or prompt ; Only the code | 1 | All three need versioning and tests.
What should CI run for an LLM feature? | Only unit tests ; Unit tests and the eval set ; Nothing | 1 | The eval set catches quality regressions that unit tests miss.
```

```story
Six months after launch, accuracy drops and nobody knows why. The data changed, a prompt was edited, and a model version updated, all on different days with no record. Teams with versioned data, versioned prompts and a tracked experiment log find the cause in an hour. Others guess for a week.
```

# agent-protocols | MCP, A2A and how agents interoperate | 3 | 12
Standards let tools and agents from different makers work together.

## The standards
MCP connects an agent to tools and data. AGENTS.md gives coding agents repo instructions. A2A (Agent2Agent) is a protocol from Google, now under the Linux Foundation, for agents built by different vendors to discover each other's capabilities and exchange tasks. Agent Skills define a folder format for procedures an agent can load. Each fills a gap: MCP is agent to tool, A2A is agent to agent.

## What to expect
These standards are young and still changing. Prefer the ones with wide adoption and keep your own code behind a thin adapter so a change does not spread. Security is the open problem: every connected server or agent is something you trust.

## A worked example: which protocol for what
Your agent needs to read a calendar: MCP (agent to tool). Your coding agent needs to know the repo rules: AGENTS.md. Your travel agent needs to ask another company's booking agent for a quote: A2A (agent to agent). Three protocols, three jobs.

## Keeping options open
These are young. Keep your code behind a thin layer so a protocol change touches one file. Check how a protocol handles authentication before connecting anything with real access.

## Common mistake
Adopting a protocol because it is new, not because you have the problem it solves.

```resources
tool | A2A Protocol | https://a2a-protocol.org/ | A2A project | Specification and documentation.
docs | Model Context Protocol | https://modelcontextprotocol.io/introduction | MCP project | Specification and SDKs.
tool | AGENTS.md | https://agents.md/ | Community | The shared repo instruction format.
course | A2A: The Agent2Agent Protocol | https://www.deeplearning.ai/short-courses/a2a-the-agent2agent-protocol/ | DeepLearning.AI and Google | Short course by the designers.
```

```quiz
MCP connects an agent to what? | Another agent ; Tools and data ; A GPU | 1 | A2A is the agent-to-agent protocol.
How do you protect against churn in young standards? | Avoid them entirely ; Keep a thin adapter between them and your code ; Pin to one vendor | 1 | An adapter keeps changes local.
```

```story
A company builds one agent for finance and another for HR using different tools. Later they want them to share a task: finance asks HR for headcount. Without a shared protocol, someone writes custom glue. With one, the agents describe their abilities and exchange requests the same way, like two apps that both speak the same file format.
```

# human-in-the-loop | Guardrails and human approval | 3 | 12
Decide which actions an agent may take alone, which need approval and which are never allowed.

## The approach
Sort actions by risk and reversibility. Reading files is low risk. Editing files in a branch is reversible. Sending an email, spending money, deleting data or deploying are costly to undo. Allow the first group, log the second and require approval for the third. Enforce with code: permission systems, allowlists of commands, sandboxes and hooks. A line in a prompt is a request, a hook is a rule.

## Make approval useful
Show what will happen in plain terms and what the agent tried before. Avoid approval fatigue: if every action asks, people click yes without reading. Group low-risk actions and surface only real decisions. Keep an audit log of what ran and who approved it.

## A worked example: sorting actions by risk
Read a file: allow. Edit a file in a branch: allow and log. Send a customer email: ask first. Delete data or spend over a limit: require approval and a reason. The sort uses two questions: how bad is a mistake, and can it be undone?

## Avoid approval fatigue
If every action asks, people click yes without reading. Group low-risk steps, ask only for real decisions and show a clear, short summary of what will happen.

## Common mistake
Putting the rule in the prompt. Enforce it with permissions and hooks.

```resources
docs | Claude Code permissions | https://code.claude.com/docs/en/iam | Anthropic | Allow, ask and deny rules for tools.
docs | Claude Code hooks | https://code.claude.com/docs/en/hooks | Anthropic | Deterministic enforcement at lifecycle points.
repo | NeMo Guardrails | https://github.com/NVIDIA/NeMo-Guardrails | NVIDIA | Programmable guardrails for LLM apps.
```

```quiz
Which action should usually need human approval? | Reading a file ; Sending an email to customers ; Searching the repo | 1 | It is outward-facing and hard to reverse.
Why is a hook stronger than a prompt rule? | It is code the harness runs, so it does not depend on the model complying ; It is shorter ; It is free | 0 | Prompts request, hooks enforce.
```

```story
A company lets an agent issue refunds. For amounts under $10 it acts alone. Between $10 and $100 it asks a person to approve with one click. Above $100 it only drafts. After a month the team sees that the person approved 98 percent of the middle tier, so they raise the automatic limit to $25. Trust was earned with data.
```

