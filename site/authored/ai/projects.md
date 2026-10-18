# project-chat-assistant | Project: a streaming chat assistant | 1 | 120
Build a small app with one clear job, such as a translator or a gift advisor. It teaches the call, the messages array, the system prompt and handling failures.

## The brief
A web page with a text box. The user sends text and sees the answer stream in. The assistant has one job set by a system prompt, for example: translate the text into the language the user picks and return only the translation.

## Steps
1. Make one request from a script and print the answer and the token usage. 2. Move the call to a backend route so the key stays on the server. 3. Keep a messages array so follow-up questions work. 4. Stream the answer to the page. 5. Handle 429 and 5xx responses with backoff and a friendly message. 6. Render markdown safely. 7. Add three few-shot examples to the system prompt and compare output before and after.

## Check yourself
Ten test inputs including a very long one and one that tries to override the system prompt. Record what happens. Add a max output length and a per-user rate limit. Write down the cost of 100 requests from the token counts.

## Stretch
Add a temperature control and see how it changes translations. Pin a model snapshot and write the one line in the README that says why.

```resources
course | Prompt Engineering Interactive Tutorial | https://github.com/anthropics/prompt-eng-interactive-tutorial | Anthropic | Practice the system prompt and few-shot steps.
docs | Streaming messages | https://docs.anthropic.com/en/docs/build-with-claude/streaming | Anthropic | The streaming API for step 4.
repo | DOMPurify | https://github.com/cure53/DOMPurify | cure53 | For step 6.
```

```quiz
Where should the API call run? | In the browser ; On a backend route that holds the key ; In the database | 1 | Keys in browser code can be copied by anyone.
What proves the few-shot examples helped? | A gut feeling ; The same test inputs before and after ; A longer prompt | 1 | Compare outputs on a fixed set of inputs.
```

```story
A student builds a translator bot and shows a friend. The friend types a sentence that tells the bot to ignore its instructions and write a poem. It writes a poem. That ten-second surprise teaches more about system prompts, safety and testing than a chapter of reading. Build it, then try to break it.
```

# project-docs-rag | Project: ask questions about your documents | 1 | 240
Build a retrieval-augmented chatbot over a folder of documents. It teaches embeddings, chunking, vector search and how to measure retrieval.

## The brief
Pick a small set of documents you know well, such as a product manual or your own notes. The user asks a question and gets an answer with citations to the passages used.

## Steps
1. Split the documents into chunks of about 300 tokens with overlap and keep the source and heading as metadata. 2. Embed each chunk and store it in a vector database (pgvector, Chroma or Supabase). 3. Embed a question and fetch the top five chunks. 4. Prompt the model to answer only from the chunks, cite them and say when the answer is not there. 5. Print the retrieved chunks next to every answer so failures are easy to see.

## Measure it
Write twenty questions with the document that answers each. Compute recall at five. Try one change at a time: chunk size, adding keyword search, adding a reranker. Keep the changes that improve the number.

## Stretch
Add metadata filters, such as only documents from a chosen year. Add a question you know the documents cannot answer and check that the bot says so.

```resources
repo | RAG Techniques | https://github.com/NirDiamant/RAG_Techniques | Nir Diamant | Notebooks for each improvement to try.
docs | Supabase AI and vectors | https://supabase.com/docs/guides/ai | Supabase | Store and query embeddings with Postgres.
repo | Ragas | https://github.com/explodinggradients/ragas | Exploding Gradients | Metrics to score retrieval and answers.
```

```quiz
A wrong answer appears. What do you inspect first? | The retrieved chunks ; The font ; The temperature | 0 | Most failures are retrieval failures.
What should the bot do with an unanswerable question? | Guess ; Say the documents do not contain the answer ; Search the web | 1 | Test this on purpose.
```

```story
A learner builds a bot over their own course notes. The first version answers confidently and sometimes wrongly. When they print the retrieved chunks next to each answer, they see that the right paragraph was split in half. Changing the chunk size fixes it. That moment, seeing why it was wrong, is the point of the project.
```

# project-tool-agent | Project: an agent with tools | 1 | 240
Build an agent that uses two or three tools to answer questions it could not answer alone, such as checking the health of a GitHub repository or finding recent news on a topic.

## The brief
The user asks "Is this open-source project well maintained?" The agent calls tools for recent commits, open issues and the latest release, then writes a verdict with numbers.

## Steps
1. Define the tools with clear descriptions and schemas. 2. Write the loop by hand: call the model, run tool calls, append results, repeat until the model answers, with a step limit. 3. Validate every argument before running a tool. 4. When a tool fails, return an instructive error as the result. 5. Log every call and result. 6. Save the conversation so it can resume.

## Check yourself
Run ten different projects, including one that does not exist and one with no recent activity. Read the logs. Count how often the agent picks the wrong tool or loops. Fix descriptions and limits, then rerun the same ten.

## Stretch
Add a second tool for the project's documentation and let the agent decide which to use. Try a smaller model for the tool steps and compare cost and accuracy.

```resources
article | How to build an agent | https://ampcode.com/how-to-build-an-agent | Thorsten Ball | The hand-written loop, in code.
article | Writing effective tools for AI agents | https://www.anthropic.com/engineering/writing-tools-for-agents | Anthropic | Tool descriptions and error messages.
docs | GitHub REST API | https://docs.github.com/en/rest | GitHub | The data source for the health tools.
```

```quiz
What stops the loop from running forever? | A step limit ; The model deciding to stop only ; Nothing | 0 | Combine the model's final answer with step, cost and time limits.
A tool receives a repo name that does not exist. What does it return? | A crash ; An instructive error message as the result ; Nothing | 1 | The model can adjust when the error says what happened.
```

```story
A builder's repo-health agent works on ten projects, then loops forever on one that has no releases. The log shows the tool returned an empty list and the model kept asking again. They add a clear "no releases found" result and a step limit. A real agent project is mostly this: reading logs, adding limits, improving error messages.
```

# project-mcp-server | Project: an MCP server for your own data | 2 | 180
Wrap something you use every day, such as your notes or a task list, as an MCP server and use it from a coding agent or chat app.

## The brief
A server with two tools (search notes, add a note) and one resource (a note by id). It runs locally over stdio and any MCP-compatible app can use it.

## Steps
1. Create the server with an SDK and define the tools with careful descriptions and schemas. 2. Test with the MCP Inspector. 3. Connect it to a host app. 4. Ask the host to use it in a real task. 5. Limit file access to one folder. 6. Require approval for the write tool.

## Check yourself
Read the tool descriptions as if you were the model. Try a request the tools cannot answer. Try an input that is invalid. Put a line of instructions inside a note and see whether the model follows it, then decide how to defend against that.

## Stretch
Serve it remotely over HTTP with authentication. Add a prompt template for a weekly review.

```resources
docs | Build an MCP server | https://modelcontextprotocol.io/docs/develop/build-server | MCP project | The quickstart for step 1.
tool | MCP Inspector | https://github.com/modelcontextprotocol/inspector | MCP project | For step 2.
docs | MCP security best practices | https://modelcontextprotocol.io/specification/draft/basic/security_best_practices | MCP project | For the injection test.
```

```quiz
Which tool should need approval? | Search ; Add a note ; Read a resource | 1 | Anything that changes data should be gated.
Why read the descriptions as the model? | They are all the model sees of the tool ; They are long ; For style | 0 | The description is the interface.
```

```story
Someone writes a tiny server that searches their notes folder and connects it to their coding agent. A week later they ask the agent to "find what I wrote about caching last month" and it does. Then they notice a note that says "ignore your rules" and the agent nearly follows it. The project teaches trust as well as connection.
```

# project-ship-it | Project: ship it with evals and tracing | 2 | 240
Take one of the earlier projects and make it something you would let other people use. This is the step that separates a demo from a product.

## The brief
Add tests that tell you whether it works, traces that show what happened, protections against misuse and a deploy you can roll back.

## Steps
1. Build an eval set of 30 real cases with checks (code where possible, a calibrated judge where not). 2. Run it in CI and block regressions. 3. Add tracing with Langfuse or Phoenix. 4. Read fifty traces and group the failures. Fix the biggest group and rerun. 5. Add rate limits, a spend cap and input and output checks. 6. Deploy to staging, smoke test, then to production, with a health endpoint and alerts. 7. Write a one-page note: what it does, what it does badly and how you know.

## Check yourself
Can you say its pass rate today and what it was last week? Can you find the cost and latency of the worst request this week? Can you roll back a prompt change in a minute?

## Stretch
Run the same eval set on a cheaper model and decide with data.

```resources
article | Your AI product needs evals | https://hamel.dev/blog/posts/evals/ | Hamel Husain | The loop for steps 1 to 4.
repo | Langfuse | https://github.com/langfuse/langfuse | Langfuse | Tracing and evals for step 3.
repo | promptfoo | https://github.com/promptfoo/promptfoo | promptfoo | Regression tests in CI for step 2.
```

```quiz
What is the first sign of a product rather than a demo? | A pass rate you can state ; A nice interface ; A long prompt | 0 | You know how often it works.
Why read fifty traces? | To find the failures worth fixing first ; For fun ; To save tokens | 0 | Counting categories directs effort.
```

```story
Two developers finish the same chatbot. One shares the link. The other first writes thirty test cases, adds tracing and a spend cap, and deploys to staging. When a user finds a failing question on day two, the second developer sees it in the traces, adds it to the tests, fixes it and rolls out in an hour. That is the difference between a demo and a product.
```

