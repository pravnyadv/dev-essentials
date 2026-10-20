# tooling-map | The map of the AI tooling stack | 1 | 12
AI tools stack in layers. Knowing the layers tells you what a new tool replaces and what it does not.

## The layers
Models: the trained networks you call, from labs like Anthropic, OpenAI and Google, or open-weight families you host. Inference: the software that runs a model fast, such as vLLM for servers and llama.cpp or Ollama for local use. Data and retrieval: embedding models, vector databases such as Chroma or pgvector, and search. Orchestration: libraries that manage prompts, tools and loops, such as LangGraph, Pydantic AI and the OpenAI and Claude agent SDKs. Protocols: MCP for tools, AGENTS.md for repo instructions, A2A for agent-to-agent calls. Evals and observability: promptfoo, Langfuse, Phoenix and Inspect. Applications: chat apps and coding agents like Claude Code, Codex and Cursor.

## How to use the map
When a tool shows up, find its layer. Many new releases are one layer repackaged. Learn the layer's job first, then pick the tool. For most projects you need a model, a way to call it, some retrieval or tools, and evals. Everything else is optional until a problem shows up.

## A worked example: a stack for a support bot
Model: a mid-size API model. Data: documents embedded and stored in pgvector. Orchestration: a short script with one tool-calling loop. Protocol: none yet. Evals and tracing: a test set in promptfoo and traces in Langfuse. Application: a web chat page. Six layers, each with a clear job. Nothing exotic.

## Reading a new tool
Which aisle is it in? Does it replace something I use, or add a layer I do not have? What problem of mine does it solve today? If you cannot answer the third question, bookmark it and move on.

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

## Where to call from
Direct from the lab for the newest features. Through a cloud provider when your company already uses it and needs its controls. Through a router when you want to try many models quickly. Prices, limits and features change often, so check the vendor pages.

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

