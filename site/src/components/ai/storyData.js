// Content for the story demos. Keep each entry short: the demo box has a fixed height per lesson.

export const LOOP_STEPS = [
  { actor: 'You', text: 'You give the agent a goal. The harness starts the loop with that message and the list of tools the agent may use.', add: ['user', 'Fix the failing test in cart.test.js', 14] },
  { actor: 'Model', text: 'The model replies with a tool call instead of an answer. It wants to look at the code first.', add: ['assistant', 'tool_call: read_file("cart.js")', 12] },
  { actor: 'Tools', text: 'The harness runs the tool and appends the result. The model cannot run anything itself. It only asks.', add: ['tool', 'contents of cart.js (42 lines)', 380] },
  { actor: 'Model', text: 'Same context, plus the file. The whole history is sent again on every call, so the context grows each step.', add: ['assistant', 'tool_call: run_tests()', 8] },
  { actor: 'Tools', text: 'The test fails. The error message goes into the context. This is the feedback the model needs.', add: ['tool', 'FAIL expected 30, got 33', 40] },
  { actor: 'Model', text: 'The model reads the failure and proposes a fix. A good tool error tells the model what to try next.', add: ['assistant', 'tool_call: edit_file(discount before tax)', 30] },
  { actor: 'Tools', text: 'Edit applied. The model checks its own work by running the tests again.', add: ['tool', 'run_tests(): 12 passed', 20] },
  { actor: 'Model', text: 'The reply has no tool call, so the loop stops. The harness also stops if a step, cost or time limit is hit.', add: ['assistant', 'Fixed: the discount now applies before tax. All 12 tests pass.', 22] },
]

export const RAG_CHUNKS = [
  ['Refunds are accepted within 30 days of purchase.', 0.82],
  ['Shipping takes 3 to 5 business days.', 0.31],
  ['Gift cards cannot be refunded.', 0.64],
  ['Our office is in Berlin.', 0.12],
  ['Refund requests are processed within 5 business days.', 0.71],
]
export const RAG_STEPS = [
  { text: 'A user asks a question. The system will fetch relevant text first, then ask the model to answer from it.', q: 'What is our refund window?' },
  { text: 'Embed the question: an embedding model turns it into a vector, the same kind used to index the chunks earlier.', vec: '[0.12, -0.40, 0.88, 0.05, …]' },
  { text: 'Search: compare the question vector with every chunk vector. Each chunk gets a similarity score. This is the retrieval step.', scores: true },
  { text: 'Keep the best few. A reranker can re-order them by reading each one with the question. Here the top three stay.', top: [0, 4, 2] },
  { text: 'Build the prompt: instructions, the retrieved chunks and the question. The model sees only this, so whatever retrieval missed is invisible to it.', prompt: true },
  { text: 'The model answers from the chunks and cites them. If the chunks had lacked the answer, the prompt tells it to say so.', answer: 'Refunds are accepted within 30 days of purchase [1]. Gift cards are excluded [3].' },
]

export const HARNESS = [
  { id: 'instr', label: 'Instructions', title: 'Instructions and rule files', body: 'Text the agent reads every session: its role, the project conventions and the things it must never do. CLAUDE.md and AGENTS.md are the common files.', fix: 'Stops the agent repeating the same mistake and guessing your conventions.', ex: 'Run tests with `npm test`. Never edit generated files.' },
  { id: 'tools', label: 'Tools', title: 'Tools and their descriptions', body: 'The functions the agent can call, from reading files to querying a database, plus the prose that tells the model when to use each.', fix: 'Without the right tool the agent guesses. Without a clear description it picks the wrong one.', ex: 'read_file, run_tests, search_docs, an MCP server for GitHub.' },
  { id: 'sandbox', label: 'Sandbox', title: 'Sandbox and permissions', body: 'Where code runs and what it can touch: which folders, which network hosts, which commands need approval.', fix: 'Limits the damage from a wrong command or an injected instruction.', ex: 'A container with no secrets and no outbound network.' },
  { id: 'orch', label: 'Orchestration', title: 'Orchestration and routing', body: 'How work is split and handed off: subagents for focused jobs, a small model for scanning, a large one for planning, a separate evaluator for review.', fix: 'Keeps the main context small and separates the doer from the judge.', ex: 'Planner, generator and evaluator agents.' },
  { id: 'hooks', label: 'Hooks', title: 'Hooks and guardrails', body: 'Deterministic code that runs at fixed points: before a tool call, after an edit, before a commit. It enforces rules instead of asking the model to remember.', fix: 'Guarantees what a prompt can only request.', ex: 'Run the formatter after each edit. Block commits containing secrets.' },
  { id: 'memory', label: 'Memory and context', title: 'Memory and context management', body: 'What the agent carries between steps and sessions: progress notes, compaction of old turns, resets with a written handoff.', fix: 'Fights context rot and lets a fresh agent pick up long work.', ex: 'A progress.md the agent updates, compaction at 70 percent full.' },
  { id: 'obs', label: 'Observability', title: 'Observability and evals', body: 'Traces of every call, cost and latency metering and an eval set that runs on every change.', fix: 'Without it you cannot tell if a change helped or the agent is quietly drifting.', ex: 'Langfuse traces, a CI job running the eval suite.' },
]

export const STACK = [
  { id: 'apps', label: 'Applications', title: 'Applications', body: 'What people use: chat apps and coding agents.', fix: 'You need one when you want the result, not the plumbing.', ex: 'Claude Code, Codex, Cursor, ChatGPT, your own product' },
  { id: 'orch', label: 'Orchestration', title: 'Orchestration and agent frameworks', body: 'Code that manages prompts, tool calls, loops and state.', fix: 'You need it when a single call is not enough: multi-step tasks, human approval, durable state.', ex: 'LangGraph, Pydantic AI, OpenAI Agents SDK, Claude Agent SDK, smolagents' },
  { id: 'proto', label: 'Protocols', title: 'Protocols and conventions', body: 'Shared formats so tools and agents from different makers connect.', fix: 'You need them when you want one integration to work in many apps.', ex: 'MCP (tools), AGENTS.md (repo rules), A2A (agent to agent)' },
  { id: 'evals', label: 'Evals and tracing', title: 'Evals and observability', body: 'Tests and traces that tell you whether it works and what happened.', fix: 'You need them from the first prototype that matters.', ex: 'promptfoo, Langfuse, Phoenix, Inspect, RAGAS' },
  { id: 'data', label: 'Data and retrieval', title: 'Data and retrieval', body: 'Embeddings, vector databases and search over your own documents.', fix: 'You need it when the model must answer from private or fresh knowledge.', ex: 'Chroma, pgvector, Qdrant, Pinecone, FAISS' },
  { id: 'infer', label: 'Inference', title: 'Inference and serving', body: 'Software that runs a model fast and cheaply.', fix: 'You need it when you host a model yourself.', ex: 'vLLM, llama.cpp, Ollama, LM Studio' },
  { id: 'models', label: 'Models', title: 'Models', body: 'The trained networks. Closed ones through an API, open-weight ones you can host.', fix: 'Always. Choose by task, then test on your own examples.', ex: 'Claude, GPT, Gemini, Llama, Qwen, DeepSeek, Mistral' },
]

export const ERAS = [
  { id: 'prompt', label: 'Prompts', title: 'Prompt engineering (2020 to 2023)', body: 'GPT-3 showed that wording and examples change results, so people tuned prompts.', fix: 'Real: few-shot examples, chain-of-thought, clear structure. Hype: secret phrases and "act as a world-class expert".', ex: 'Stayed: prompts as versioned, tested code.' },
  { id: 'tools', label: 'Retrieval and tools', title: 'Retrieval and tool use (2023)', body: 'Models got access to documents through RAG and to functions through tool calling.', fix: 'Real: the model can now look things up and act. Hype: "chat with your data" demos that skip evaluation.', ex: 'Stayed: embeddings, tool schemas, structured output.' },
  { id: 'agents', label: 'Agents', title: 'Agents (2024 to 2025)', body: 'A model in a loop that chooses its own tools and steps until the task is done.', fix: 'Real: coding agents with tests to check against. Hype: autonomous employees and swarms for tasks a script could do.', ex: 'Stayed: the loop, tool design, step and cost limits.' },
  { id: 'context', label: 'Context', title: 'Context engineering (2025)', body: 'The realization that what is in the window matters more than how the prompt is phrased.', fix: 'Real: measurable, since you can count tokens and test results. Mostly a better name for prompt plus retrieval plus memory.', ex: 'Stayed: compaction, subagents, cache-friendly prompts.' },
  { id: 'harness', label: 'Harness', title: 'Harness engineering (2025 to 2026)', body: 'Agent = Model + Harness. The system around the model decides how well an agent does.', fix: 'Real: context resets, separate evaluators, hooks and evals gave measured gains. Rebranding: much of it is ordinary software engineering applied to a probabilistic part.', ex: 'The test: which part did you change, and what did the eval show?' },
]

export const TIMELINE_ERAS = {
  early: ['Early AI and winters', 'bg-amber-500'],
  ml: ['Machine learning', 'bg-sky-500'],
  deep: ['Deep learning', 'bg-emerald-500'],
  transformer: ['Transformers', 'bg-violet-500'],
  chat: ['Chat and scale', 'bg-rose-500'],
  agents: ['Reasoning and agents', 'bg-fd-primary'],
}
export const TIMELINE = [
  ['1950', 'early', 'Turing proposes the imitation game', 'Alan Turing asks whether machines can think and proposes a test.'],
  ['1956', 'early', 'Dartmouth workshop', 'The term "artificial intelligence" is coined at a summer workshop.'],
  ['1958', 'early', 'The perceptron', 'Frank Rosenblatt builds a single neuron that learns its weights from examples.'],
  ['1969', 'early', 'Limits of perceptrons', 'Minsky and Papert show a single layer cannot learn XOR. Neural network funding dries up.'],
  ['1974', 'early', 'First AI winter', 'Promises outrun results and governments cut funding. It lasts into the 1980s.'],
  ['1987', 'early', 'Expert systems collapse', 'Hand-written rule bases were costly and brittle. The second winter follows.'],
  ['1986', 'ml', 'Backpropagation popularized', 'Rumelhart, Hinton and Williams show how to train multi-layer networks.'],
  ['1997', 'ml', 'Deep Blue beats Kasparov', 'Chess falls to brute-force search with hand-tuned evaluation. It did not learn.'],
  ['1998', 'ml', 'LeNet reads digits', 'Yann LeCun\'s convolutional network reads handwritten digits on bank checks.'],
  ['2009', 'ml', 'ImageNet', 'Fei-Fei Li\'s team releases over a million labeled images.'],
  ['2012', 'deep', 'AlexNet', 'A deep network on two GPUs cuts ImageNet error from about 26 to 15 percent. Deep learning takes off.'],
  ['2013', 'deep', 'word2vec', 'Words become vectors where directions carry meaning.'],
  ['2014', 'deep', 'Attention and GANs', 'Attention improves translation. Generative adversarial networks generate images.'],
  ['2016', 'deep', 'AlphaGo beats Lee Sedol', 'Neural networks plus self-play beat a Go champion a decade early.'],
  ['2017', 'transformer', 'The transformer', '"Attention Is All You Need" drops recurrence and trains on all tokens in parallel.'],
  ['2018', 'transformer', 'BERT and GPT-1', 'Pretrain on text, then adapt. Two branches: bidirectional and next-token.'],
  ['2020', 'transformer', 'GPT-3 and scaling laws', '175B parameters shows in-context learning. Loss follows a power law in size and data. AlphaFold 2 solves protein folding.'],
  ['2022', 'chat', 'ChatGPT', 'Instruction tuning plus a chat interface reaches 100 million users in about two months. Stable Diffusion and Whisper arrive.'],
  ['2023', 'chat', 'GPT-4, Claude, Llama 2', 'Image input, strong reasoning, serious competition and open weights.'],
  ['2024', 'agents', 'Reasoning models and MCP', 'o1 thinks before answering. MCP standardizes tools. AlphaFold wins a Nobel Prize.'],
  ['2025', 'agents', 'RL reasoning and coding agents', 'DeepSeek-R1 opens the recipe. Terminal coding agents go mainstream. Olympiad-level math.'],
  ['2026', 'agents', 'Harness engineering', 'Context resets, evaluator agents and verification become the focus. New flagship families ship from every lab.'],
].sort((a, b) => a[0] - b[0])
