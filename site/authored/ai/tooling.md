# tooling-map | The map of the AI tooling stack | 1 | 12
AI tools stack in layers. Knowing the layers tells you what a new tool replaces and what it does not.

## The layers
Models: the trained networks you call, from labs like Anthropic, OpenAI and Google, or open-weight families you host. Inference: the software that runs a model fast, such as vLLM for servers and llama.cpp or Ollama for local use. Data and retrieval: embedding models, vector databases such as Chroma or pgvector, and search. Orchestration: libraries that manage prompts, tools and loops, such as LangGraph, Pydantic AI and the OpenAI and Claude agent SDKs. Protocols: MCP for tools, AGENTS.md for repo instructions, A2A for agent-to-agent calls. Evals and observability: promptfoo, Langfuse, Phoenix and Inspect. Applications: chat apps and coding agents like Claude Code, Codex and Cursor.

## How to use the map
When a tool shows up, find its layer. Many new releases are one layer repackaged. Learn the layer's job first, then pick the tool. For most projects you need a model, a way to call it, some retrieval or tools, and evals. Everything else is optional until a problem shows up.

## A worked example: a stack for a support bot
Model: a mid-size API model. Data: documents embedded and stored in pgvector. Orchestration: a short script with one tool-calling loop. Protocol: none yet. Evals and tracing: a test set in promptfoo and traces in Langfuse. Application: a web chat page. Six layers, each with a clear job. Nothing exotic.

The two stacks from this lesson side by side, for the layers the lesson describes. A small stack is a good sign.

| Layer | Support bot | Morning summary script |
| --- | --- | --- |
| Model | A mid-size API model | A model and one call |
| Data and retrieval | Documents embedded and stored in pgvector | None, it reads one text file |
| Orchestration | A short script with one tool-calling loop | None, no framework |
| Protocols | None yet | None |
| Evals and tracing | A test set in promptfoo and traces in Langfuse | Not part of the example |

## Reading a new tool
Which aisle is it in? Does it replace something I use, or add a layer I do not have? What problem of mine does it solve today? If you cannot answer the third question, bookmark it and move on.

## How the layers connect
Follow one question through the support bot.

```mermaid One question passes through the layers, and each hop has one job
sequenceDiagram
  participant V as Visitor
  participant P as Chat page
  participant S as Script
  participant D as Vector database
  participant M as Model API
  V->>P: Question
  P->>S: Question
  S->>D: Embedded question
  D-->>S: Similar chunks
  S->>M: Question and chunks
  M-->>S: Answer
  S-->>P: Answer
  Note over S: Logs the exchange
```

1. A visitor types into the chat page (application).
2. A short script (orchestration) receives it.
3. The script turns the question into an embedding, a list of numbers that captures meaning, and finds similar document chunks in the database (data and retrieval).
4. It sends the question and those chunks to a model API.
5. The model runs on someone's inference software and returns an answer.
6. The script logs the full exchange (observability), and a nightly test run checks quality (evals).

Each hop has one job. When something breaks, you ask which hop it was.

## A second example: a stack with fewer layers
A script reads one text file each morning and emails a three-line summary. It needs a model and a call. There is no vector database, no framework and no protocol. Adding them would add code to maintain and nothing else. A small stack is a good sign, not a gap.

## What goes wrong
One product covers two layers, so you cannot tell what it replaces. Symptom: a tool you cannot place on the map. Read its docs for the one job it does best.

You skip evals because everything seems to work. Later you change the prompt and cannot tell if answers improved. The symptom is arguments based on feelings. A small test set fixes it.

You pick a layer's tool before understanding the layer. Switching later costs more than learning first.

## Try it yourself
Take a project idea and draw the six layers as boxes on paper. Mark each as "needed today", "later" or "never". Write one tool name under every "needed today" box. Expect to mark at least two or three layers as "later". Those are the tools you should not install yet.

## Common mistake
Adopting tools for layers you do not need yet.

```resources
repo | Awesome LLM Apps | https://github.com/Shubhamsaboo/awesome-llm-apps | Shubham Saboo | Runnable examples across agents, RAG and multi-agent apps.
repo | Awesome Agentic Engineering Resources | https://github.com/EthicalML/awesome-agentic-engineering-resources | EthicalML | Curated list of articles, courses, papers and tools, updated monthly.
article | Start AI Engineering in 2026 | https://github.com/louisfb01/start-ai-engineering | Louis-François Bouchard | A broad guide organized by learning style.
tool | roadmap.sh AI Engineer | https://roadmap.sh/ai-engineer | roadmap.sh | A community roadmap with a clickable map of skills.
```

```quiz
A new tool claims to replace everything. What do you do first? | Rewrite your main project with it ; Find which stack layer it replaces ; Wait a year before looking at it | 1 | Placing it in a layer shows what job it does and what it leaves to others.
What is the minimum stack for most AI features? | A vector database, a framework, agents ; Fine-tuning, a GPU cluster, a registry ; A model, a call path, tools, evals | 2 | Add other layers only when a concrete problem requires them.
Your team wants a vector database for 20,000 chunks. What should you ask? | Could our current database hold it ; How to shard it across three regions ; Which vendor has the best dashboard | 0 | Match infrastructure to the size of the problem.
```

```story
A hardware store is organized by aisle: fasteners, paint, plumbing. A new gadget does not confuse you because you know which aisle it belongs in. The AI tooling market is overwhelming until you learn the aisles: models, serving, data, orchestration, protocols, testing and applications.
```

# provider-landscape | Model providers and API styles | 1 | 12
Several labs and clouds sell access to models. Learn the shapes so you can switch.

## Labs
Anthropic (Claude), OpenAI (GPT and o-series reasoning models), Google (Gemini, and the open Gemma), Meta (Llama, and now the Muse models), Mistral, Cohere (enterprise and retrieval focus), DeepSeek, Alibaba (Qwen), xAI (Grok) and others. Each releases families in sizes from small and cheap to large and strong. See the model atlas for current names.

## Where to call them
Direct from the lab's API, through a cloud such as AWS Bedrock, Google Vertex AI or Azure, or through a router such as OpenRouter that offers one API for many models. Clouds add enterprise controls and billing. Routers add flexibility and fallback.

## API shapes
Most offer chat-style message APIs, tool calling, structured output, streaming, vision input and batch discounts. Many accept the OpenAI-compatible format, so one client library works across them with a different base URL. Local runners such as Ollama and LM Studio also expose that format.

## Staying portable
Keep model names and prompts in config, wrap calls in one function, and run your eval set on any candidate. Provider-specific features such as caching and extended thinking differ, so isolate them in one place.

## A worked example: one function
callModel(prompt, options) is the only place in the code that talks to a provider. It reads the model name from config, logs usage and handles retries. Switching providers means changing config and running the test set, not hunting through the code.

```mermaid Only one function talks to providers, and the model name comes from config
flowchart TD
  X[Rest of your code] --> W[callModel function]
  G[Config: model name] --> W
  W --> L[Lab API]
  W --> CL[Cloud provider]
  W --> RT[Router]
  class W focus
```

## Where to call from
Direct from the lab for the newest features. Through a cloud provider when your company already uses it and needs its controls. Through a router when you want to try many models quickly. Prices, limits and features change often, so check the vendor pages.

## What actually differs between providers
Many things look the same: messages in, a message out. The differences are in the details. The way tool calls are written, how the system prompt is passed, the names of usage fields, the error codes, the rate limits and the rules for caching all vary. An OpenAI-compatible endpoint covers the common core. Features beyond it, such as caching or extended thinking, usually need provider-specific code.

## A second example: a switch that breaks
You change the base URL and model name, and your app runs. But your prompt asked for JSON and the new model sometimes adds a sentence before it, so your parser fails. Invented numbers for illustration: your test set passed 94 of 100 before and passes 81 of 100 now. Without that test, you would find out from angry users. With it, you adjust the prompt, rerun and decide whether the new model is worth it.

## Trade-offs of each route
The three ways to reach a model, compared on what each gives and what to watch.

| Route | Choose it when | What you gain | What to watch |
| --- | --- | --- | --- |
| Lab directly | You want the newest features | The fewest middlemen | Special features you use everywhere are hard to swap |
| A cloud such as Bedrock or Vertex AI | Your company already uses it | Company controls and billing | A model may arrive later and some features may differ |
| A router such as OpenRouter | You want to try many models quickly | One API for many models, with fallback | Another company in the path, one more point of failure |

Calling a lab directly gives the newest features and the fewest middlemen. A cloud adds company controls, but a model may arrive there later and some features may differ. A router makes trying models easy, but it puts another company between you and the model. That is one more point of failure and one more place your data passes through.

## What goes wrong
A model name in your code is retired, and calls start to fail with a not-found error. Keep names in config and read the provider's deprecation notices.

Costs differ for the same text, because each provider splits text into tokens its own way. Compare the logged token counts, not your guess.

A feature you relied on does not exist on the second provider. Isolate such features in one place.

## Try it yourself
Take the 20-line script from the calling lesson. Change only the base URL, the key and the model name, and point it at a second provider that accepts the same format. Send five prompts to both. Expect the answers to differ in wording and the token counts to differ for identical input.

## Common mistake
Using one provider's special features everywhere. Isolate them so they are easy to swap.

```resources
tool | OpenRouter | https://openrouter.ai/ | OpenRouter | One API and model comparison across providers.
docs | Amazon Bedrock | https://aws.amazon.com/bedrock/ | AWS | Managed access to several providers' models.
docs | Vertex AI | https://cloud.google.com/vertex-ai | Google Cloud | Google's platform for Gemini and others.
repo | LiteLLM | https://github.com/BerriAI/litellm | BerriAI | A library that calls many providers through one interface.
docs | Gemini API | https://ai.google.dev/gemini-api/docs | Google | Models, quickstarts and pricing for Gemini.
docs | Claude Messages API | https://platform.claude.com/docs/en/api/messages | Anthropic | The reference for Anthropic's chat API.
tool | Mistral AI | https://mistral.ai | Mistral | Open and hosted models from a European lab.
```

```quiz
Why wrap model calls in one function? | It makes each single call run faster ; It makes switching providers and models easy ; It removes the need for an API key | 1 | Portability is a single point of change.
What does an OpenAI-compatible endpoint let you do? | Get free tokens from every lab ; Skip authentication on every request ; Reuse one client across providers | 2 | The request format is shared.
Your only provider has an outage. What would have made recovery easy? | A tested backup behind one wrapper ; A longer timeout on every request ; A bigger model from the same provider | 0 | Keeping a tested fallback behind one function turns an outage into a config change.
```

```story
A small startup builds on one model provider. When that provider has a bad day, so does the startup. Another startup wrapped model calls in one function and keeps a second provider ready. A test run with the other provider takes ten minutes. Portability is cheap insurance.
```

# frameworks | Agent frameworks: do you need one? | 2 | 12
A framework packages the agent loop, tool plumbing and state. It helps with speed and costs you visibility.

## The options
LangGraph models an agent as a graph of steps with persistent state. Pydantic AI builds typed agents around validated outputs. The OpenAI Agents SDK and Claude Agent SDK provide the loop, tools, handoffs and guardrails from each lab. smolagents from Hugging Face is a small library where agents write and run code. CrewAI and AutoGen focus on multiple cooperating agents. LlamaIndex and Haystack lean toward retrieval and document pipelines. The OpenAI Agents SDK (with AgentKit for visual building), Google's Agent Development Kit (ADK) and Vertex AI Agent Builder are the labs' own offerings.

## Do you need one?
You can write the core loop in under 100 lines. A framework is worth it when you need durable state, human approval steps, tracing or many integrations. It is a cost when it hides prompts or makes behavior hard to inspect. A sound path is to write the loop yourself once to learn it, then choose a framework with that understanding.

## A worked example: when a framework earns its place
You need an agent that can pause for human approval, survive a server restart and resume from the same step. Building that yourself takes weeks. A framework with checkpoints gives it to you. For a script that calls a model twice, a framework is more weight than help.

## How to evaluate one
Can you see the exact prompts it sends? Can you swap models? How does it handle errors and retries? Who maintains it and how often does it break? Try it on a small real task before committing.

## What a framework does for you
Every agent has the same loop: call the model, check for a tool call, run it, add the result and repeat until done. A framework wraps that loop and adds three things: saved state, retries and tracing.

```mermaid The framework wraps the agent loop and saves a checkpoint after each step
flowchart TD
  A[Call the model] --> B{Tool call?}
  B -->|yes| C[App runs the tool]
  C --> D[Add result to context]
  D --> A
  D -.-> K[(Checkpoint saved)]
  B -->|no| E[Final answer]
  class K focus
```

Saved state is the part beginners miss. Imagine a six-step task that pauses for approval at step 4. The framework writes a checkpoint after each step. If the server restarts, it resumes at step 4 instead of step 1. Doing this by hand means handling storage, repeated steps and half-finished tool calls.

The six-step task from above, paused for approval at step 4 while the server restarts.

| Moment | With checkpoints | Loop with no saved state |
| --- | --- | --- |
| Steps 1 to 3 finish | A checkpoint is written after each | Results sit in memory |
| Step 4 waits for approval | State is saved at step 4 | Still in memory |
| The server restarts | Nothing is lost | Memory is gone |
| Work resumes | Starts at step 4 | Starts at step 1 and repeats steps 1 to 3 |

## A second example: the framework gets in the way
You want to change one sentence of the system prompt. Some frameworks add their own instructions around yours and builds the final prompt several layers down. Your edit does nothing visible. To confirm, log the raw request sent to the provider, or use the framework's tracing, and read what the model actually received. If you cannot do either, treat that as a warning sign.

## Trade-offs
Benefits: less code for state, approvals and tracing, and a shared structure for a team. Costs: a new set of ideas to learn, upgrades that can break your code, and abstractions that leak when something goes wrong. Moving off a framework later is work, because its concepts spread through your code.

Real mechanism versus marketing: nothing in a framework makes the model smarter. It organizes the same API calls.

## Try it yourself
1. Write the loop yourself in about 30 lines, with one tool and a step cap.
2. Rebuild the same agent in a framework you are curious about.
3. Compare line counts.
4. Check whether you can print the exact prompt each version sends.
5. Break a tool on purpose and see which version gives the clearer error.

Expect the framework version to be shorter and the hand-written one to be easier to inspect.

## Common mistake
Choosing by popularity alone.

```resources
repo | LangGraph | https://github.com/langchain-ai/langgraph | LangChain | Graph-based orchestration with state and human-in-the-loop.
repo | Pydantic AI | https://github.com/pydantic/pydantic-ai | Pydantic | Typed agent framework.
repo | OpenAI Agents SDK | https://github.com/openai/openai-agents-python | OpenAI | Lightweight agents, handoffs and guardrails.
repo | Claude Agent SDK for Python | https://github.com/anthropics/claude-agent-sdk-python | Anthropic | The agent loop behind Claude Code as a library.
repo | smolagents | https://github.com/huggingface/smolagents | Hugging Face | Minimal agent library.
docs | Claude Agent SDK overview | https://platform.claude.com/docs/en/agent-sdk/overview | Anthropic | The agent loop, tools and permissions as a library.
docs | Agent Development Kit | https://google.github.io/adk-docs | Google | Google's open-source framework for building and deploying agents.
docs | Haystack | https://docs.haystack.deepset.ai/docs/intro | deepset | Pipelines for retrieval and agent workflows.
docs | LlamaIndex | https://docs.llamaindex.ai/en/stable | LlamaIndex | Data connectors, indexes and agent workflows over your documents.
article | Introducing AgentKit | https://openai.com/index/introducing-agentkit | OpenAI | OpenAI's visual builder and agent platform.
```

```quiz
When is a framework most worth using? | For a quick script of about 20 lines ; When you need approvals and tracing ; When you want to avoid reading the docs | 1 | Those are costly to build and are what frameworks provide.
What is the main risk of a framework? | Its license is nearly always restrictive ; It cannot call tools you define yourself ; Hidden prompts make debugging harder | 2 | You must be able to see what the model saw.
You can write your agent loop in 80 lines. Why might that be a good first step? | You learn what a framework would hide ; Frameworks never work with tools ; It is always faster than any framework | 0 | Writing the loop once teaches you what to look for when you later pick a framework.
```

```story
A beginner follows a tutorial that uses a framework and builds a working agent in ten minutes. A month later they need to change one prompt and cannot find where it lives, buried in four layers of classes. A different beginner wrote the loop by hand first. They now choose a framework deliberately and know what it hides.
```

# hugging-face | Hugging Face: the hub for open AI | 2 | 12
Hugging Face is where open models, datasets and demos live, plus the libraries to use them.

## What is there
Hugging Face is the place where open AI is shared. It has four main parts.

The Hub hosts well over a million models and many datasets. Each one is a git repository with a model card that describes how it was trained, what it is bad at and what license it has.

Spaces host small demo apps, so you can try a model in your browser before downloading it.

Libraries do the work. Transformers loads and runs thousands of models in a few lines of code. PEFT fine-tunes cheaply with LoRA. TRL trains with rewards. Transformers.js runs models inside a web browser.

Inference Providers and Endpoints run models for you if you do not want to host them.

## How to use it
Filter the Hub by task (text generation, embeddings, speech recognition), by size and by license. Read the model card. Try the model in its Space. Then either download it and run it locally, or call it through a provider.

## A worked example: reading a model card
You find a speech-to-text model. The card says: task, speech recognition. Size, 1.5 GB. Languages, 12. License, check whether commercial use is allowed. Known limits, weaker with heavy accents. Example code, ten lines. Five minutes with the card tells you whether it fits your project and saves you from expensive surprises.

## Free learning
Hugging Face runs free hands-on courses on LLMs, agents, MCP, deep reinforcement learning and diffusion models. They all use the libraries above.

## How a model gets from the Hub to your laptop
A model repository holds weight files, a config file describing the architecture and the tokenizer files. When you load it, the library downloads these into a local cache folder (a saved copy on disk), builds the model from the config and fills it with the weights. The first run is slow. Later runs reuse the cache.

```mermaid The first load downloads into a local cache, and later loads reuse it
flowchart TD
  L[Load model by name] --> Q{In cache?}
  Q -->|no, first run| H[Download from the Hub]
  H --> C[(Local cache folder)]
  Q -->|yes| C
  C --> B[Build model from config]
  B --> W[Fill with weights]
  W --> R[Model ready]
  class C focus
```

## Will it fit? A memory check
Weights take memory equal to parameters times bytes per parameter. Invented 7 billion parameter model at 16 bits (2 bytes each): 7 billion x 2 = 14 billion bytes, about 14 GB. Quantized to 4 bits (half a byte each), it is about 3.5 GB. Real use needs extra memory beyond the weights, so leave headroom.

```mermaid Memory for the weights alone in gigabytes: only the two 7 billion parameter bars fit under 16 GB, and the 14 GB one leaves almost no headroom
xychart-beta
  x-axis [7B at 16 bit, 7B at 4 bit, 70B at 16 bit, 70B at 4 bit]
  y-axis "gigabytes for weights" 0 --> 150
  bar [14, 3.5, 140, 35]
```

## A second example: a model that does not fit
A 70 billion parameter model needs about 140 GB at 16 bits and about 35 GB at 4 bits. A typical 16 GB laptop cannot hold either. Your options are a smaller model, an inference provider that hosts it, or a machine with more memory.

## What goes wrong
An out-of-memory error: the model is larger than your memory. Compare file size on the Hub with your free memory.

A repository asks you to allow custom code when loading. That code runs on your machine, so read it first and trust only authors you can check. Prefer weights in the safetensors format, which stores numbers only and cannot run code on load. Older formats can.

The model works but answers poorly in your language or task. The model card lists its training languages and limits. Test on your own examples.

The license forbids your use. Read it before you build on the model.

## Try it yourself
Search the Hub for a small sentiment model. Read its card and write down task, size, license and one stated limit. Try it in its Space with three sentences, one sarcastic. Expect the plain ones to work and the sarcastic one to be the likeliest mistake.

## Common mistake
Downloading a model without reading its license.

```resources
tool | Hugging Face Hub | https://huggingface.co/models | Hugging Face | Models, datasets and Spaces.
course | LLM Course | https://huggingface.co/learn/llm-course | Hugging Face | Tokenizers, fine-tuning and the Transformers library.
repo | Transformers | https://github.com/huggingface/transformers | Hugging Face | The core library for open models.
repo | Transformers.js | https://github.com/huggingface/transformers.js | Hugging Face | Run models in the browser.
docs | Hugging Face Hub docs | https://huggingface.co/docs/hub/en/index | Hugging Face | Repositories, model cards and the Hub API.
docs | Transformers.js | https://huggingface.co/docs/transformers.js/en/index | Hugging Face | Run models in a browser or Node.
docs | Inference client | https://huggingface.co/docs/huggingface_hub/en/package_reference/inference_client | Hugging Face | Calling hosted models from Python.
```

```quiz
What does a model card tell you? | Its current price per million tokens ; Its training, limits and license ; How many people downloaded it today | 1 | Always read it before using a model.
What does Transformers.js do? | Trains models on a GPU cluster ; Hosts demo apps for other people ; Runs models in the browser | 2 | It brings inference to JavaScript environments.
You find a promising model but its license is unclear. What should you do? | Check the license before commercial use ; Use it anyway, since the weights are public ; Delete the model card to avoid confusion | 0 | Licenses vary and some forbid commercial use.
```

```story
A student wants to try a speech-to-text model. They search the Hub, filter by task and size, read the model card (languages, license, limits), click the demo, upload a recording and see a transcript in a minute. Then they download the model and run it on their laptop. No signup with a lab needed.
```

