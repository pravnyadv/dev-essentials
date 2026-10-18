# evolution-overview | From prompts to agents to harnesses | 1 | 15
The vocabulary changed every year, but each new name points at a real shift in where the leverage is. Some of it is also rebranding. Here is which is which.

## The sequence
Prompt engineering (2020 to 2023): GPT-3 showed that wording and examples change results, so people tuned prompts. Retrieval and tools (2023): models gained access to documents and functions. Agents (2024 to 2025): models run in a loop, choose tools and act over many steps. Context engineering (2025): the realization that what is in the window matters more than phrasing. Harness engineering (2025 to 2026): the recognition that the system around the model, not only the model, decides how well an agent does.

## What the pattern is
Each stage moved attention outward. First the sentence you type, then everything the model sees, then the loop that runs it, then the whole environment: tools, rules, checks, sandboxes and memory. The model did not get replaced at each step. The unit of engineering got bigger.

## What is real and what is hype
Real: the shift from judging one response to judging a whole run of many steps. Real: that most agent failures come from missing tools, vague rules or noisy context rather than a weak model. Rebranding: calling normal software engineering a new discipline. A harness has a retry loop, tests, permissions and logging, and those are old ideas applied to a new component. The honest framing is that they are the same ideas applied to a component that is non-deterministic, which makes them more important.

## How to use this
When you meet a new buzzword, ask three things. What mechanism does it name? What can I measure to know if it helps? What would I have called this last year? The next lessons apply that test to prompt engineering, harness engineering and the buzzwords around them. The Agents chapter covers agents in depth.

## A worked example: the same task, five eras
Task: answer customer questions. Prompt era: write a clever instruction. Retrieval era: add the right help articles to the prompt. Agent era: let the model look up orders and issue refunds with tools. Context era: carefully choose what is in the window at each step. Harness era: add tests, approvals, tracing and a separate checker so the whole system is dependable. Each era added a layer. None removed the model.

## A habit worth keeping
When you meet a new term, find the mechanism, find the measurement, and find the old name. If you cannot find all three, wait.

## Common mistake
Thinking you must learn the newest name to be current. The mechanisms underneath last longer than the labels.

```resources
article | Effective context engineering for AI agents | https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents | Anthropic | Frames context engineering as the successor to prompt engineering.
article | Harness design for long-running application development | https://www.anthropic.com/engineering/harness-design-long-running-apps | Anthropic | Planner, generator and evaluator agents, with the failures that motivated them.
article | The New Software Lifecycle | https://addyosmani.com/blog/new-sdlc-vibe-coding/ | Addy Osmani | Vibe coding to agentic engineering, with Agent = Model + Harness.
article | Industrial Agentic Engineering | https://research.google/pubs/industrial-agentic-engineering/ | Google Research | Specification, harness, trajectory, verification and meta-debugging.
```

```quiz
What is the clearest sign a term is rebranding rather than new? | It is popular on social media right now ; It names no mechanism you could not name before ; It comes with a catchy hashtag attached | 1 | Useful terms name a mechanism you can implement and measure.
What stayed constant across the eras? | The exact format of the prompt text ; The design of the provider's API ; The model stayed the core component | 2 | The scope of what engineers design grew, while the model stayed at the center.
A vendor announces "agentic harness orchestration". What is your first question? | What did they change, and what did the eval show ; Which hashtag are they promoting this week ; How many models do they list as supported | 0 | Look for the mechanism and a measurement.
```

```story
A shop owner hears "prompt engineering" in 2023, "agents" in 2024, "context engineering" in 2025 and "harness engineering" in 2026. Each time the headlines say everything changed. A better question each time: what can I now do that I could not do before, and what would I have called this last year?
```

# prompt-engineering-era | The prompt engineering era | 1 | 12
What survived from prompt engineering is a handful of techniques with a mechanism behind them. The magic-words era mostly did not.

## What was real
Few-shot examples work because the model infers the task from patterns in context, which is in-context learning. Chain-of-thought works because written reasoning gives later tokens something to condition on. Clear structure and delimiters help because the model has to tell instructions from data. ReAct interleaved reasoning with tool calls and is the direct ancestor of agent loops.

## What was hype
Secret phrases that supposedly unlock hidden performance, "act as a world-class expert", and prompt marketplaces. Much of this faded as models got better at following plain instructions. "Prompt engineer" as a standalone job title mostly dissolved into general software and product work, because a prompt is a small part of a system that also needs data, tools and tests.

## What it became
Prompts are now treated as code: versioned, tested against examples and reviewed. Writing one is still a skill. It is just no longer the whole job.

## A worked example: separating habit from superstition
"You are a world-class expert": no measurable effect on many tasks. "Think step by step": real effect on multi-step problems for older models. "Here are three examples": real, reliable effect on format. "Take a deep breath and work on this problem step-by-step": a 2023 DeepMind paper found it reached 80.2 percent on a grade-school math set with one model (PaLM 2-L), and I found no evidence of a reliable effect on current models. The test is simple: run both versions on twenty inputs and count.

## What became of the job title
Writing prompts turned into one of many skills. Today it is usually bundled with building the whole system: data, tools, tests and monitoring.

## Common mistake
Copying prompts from a social media thread without testing them on your own task.

```resources
paper | Language Models are Few-Shot Learners | https://arxiv.org/abs/2005.14165 | Brown et al. | The origin of few-shot prompting.
paper | Chain-of-Thought Prompting Elicits Reasoning in LLMs | https://arxiv.org/abs/2201.11903 | Wei et al. | Step-by-step reasoning improves accuracy.
paper | ReAct: Synergizing Reasoning and Acting | https://arxiv.org/abs/2210.03629 | Yao et al. | Reasoning and tool use in one loop.
article | Prompt Engineering | https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/ | Lilian Weng | A clear survey of techniques from the peak of the era.
```

```quiz
Why does few-shot prompting work? | The model memorizes the examples permanently ; The model infers the task from patterns in context ; It retrains itself on each prompt | 1 | In-context learning lets the model pick up the task from examples in the prompt.
What happened to the "prompt engineer" job title? | It became the core role at most companies ; It was made illegal in many countries ; It mostly merged into wider engineering work | 2 | A prompt is one part of a system that also needs data, tools and tests.
You find a viral "magic prompt" online. How do you decide whether to use it? | Test it against your prompt on your own inputs ; Trust it because many people have shared it ; Use it only if the prompt is very long | 0 | Count results on twenty inputs before adopting any prompt.
```

```story
In 2023 people shared "magic prompts" like secret codes. Some were just good habits (be specific, give examples). Others only looked clever. As models got better at plain instructions, the secret-code ones faded and the habits stayed. What survived was the part that had a reason behind it.
```

# harness-engineering | Harness engineering: real or hype? | 2 | 15
Agent = Model + Harness. The harness is everything around the model that turns text prediction into finished work. The name is new. The parts are concrete.

## What a harness contains
Instructions and rule files such as AGENTS.md. Tools, including MCP servers and the descriptions that tell the model when to use them. Sandboxes where code runs, with limits on what it can reach. Orchestration: subagents, model routing and handoffs. Hooks, which are deterministic code at fixed points such as before a tool call or a commit. Observability: logs, traces and cost metering. Memory and context management, including compaction and resets.

## Why it is more than a buzzword
Anthropic's long-running work found two failure modes that the model alone does not fix. As context fills, models lose coherence and sometimes wrap up early, so the harness adds context resets with a written handoff. And a model grading its own work tends to praise it, so the harness separates the generator from a skeptical evaluator. Both are engineering decisions you can test, and they produced measurable gains.

## The honest caveat
Most of this is ordinary systems engineering: retries, permissions, tests, logging and separation of duties. The new part is that the central component is probabilistic, so verification and observability matter more, and changes need evals to prove they help. Google's practice adds meta-debugging: when an agent fails, fix the workflow, not the model. If someone uses the word without naming which of these parts they changed, treat it as marketing.

## Try it
Click through the parts in the diagram. Then take your own agent and list which parts exist, which are missing and which failure each missing part allows.

## A worked example: one failure, one harness change
Failure: the agent says "done" but half the feature is missing. Cause: no way to check. Harness change: give it the test suite and require passing tests before it can finish. Failure: it edited a config file it should not touch. Harness change: a permission rule blocking that folder. Each change is small and measurable.

## Common mistake
Adding harness parts without a way to measure whether they help.

```resources
article | Harness design for long-running application development | https://www.anthropic.com/engineering/harness-design-long-running-apps | Anthropic | Context resets, evaluator agents and what they bought.
article | Effective harnesses for long-running agents | https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents | Anthropic | Initializer and coding agents, progress files and handoffs.
article | Harness engineering | https://openai.com/index/harness-engineering/ | OpenAI | OpenAI's account of building software with agents inside a harness.
article | The New Software Lifecycle | https://addyosmani.com/blog/new-sdlc-vibe-coding/ | Addy Osmani | The harness anatomy diagram and its role in each phase.
repo | 12-Factor Agents | https://github.com/humanlayer/12-factor-agents | HumanLayer | Principles for building reliable LLM software, with code.
```

```quiz
A model grades its own output as excellent but it is mediocre. Which harness change helps? | Raise the temperature of the model ; Separate the generator from a skeptical evaluator ; Shorten the prompt that asks for grading | 1 | Tuning a standalone evaluator to be skeptical is easier than making a generator self-critical.
Which statement about harness engineering is most accurate? | It replaces software engineering with something new ; It only matters for coding agents and nothing else ; It applies familiar engineering to an uncertain part | 2 | The parts are old ideas. The new context is that the central component is probabilistic.
An agent keeps editing a folder it should not touch. Which harness part addresses this? | A permission rule or hook ; A longer system prompt ; A larger model | 0 | Rules enforced in code cannot be argued around.
```

```story
Two teams use the same model for a coding agent. Team A types prompts into a chat window. Team B built a setup: a rules file, a sandbox, tests the agent can run, a hook that blocks commits with secrets, and a separate reviewer agent. Team B gets far more done with fewer surprises, and the difference is not the model. It is the harness.
```

# ai-buzzwords | A field guide to AI buzzwords | 1 | 12
For each popular term: what it actually names, and how much of it is marketing.

## Vibe coding
Real: building by prompting and accepting output with little review, fine for prototypes. Limit: without verification you cannot trust it for anything that matters. Agentic engineering is the same tools with specs, tests and review.

## Agentic
Real if it means the model chooses its steps. Hype if it is stuck on a fixed chatbot flow. Ask what decisions the model makes at runtime.

## AGI
A loose label with no agreed definition or test. Useful as a direction, useless as a product requirement. Treat claims about its date as opinions.

## Context engineering
Real: deciding what enters the window and when. It is the most concrete of the newer terms because you can measure tokens and results.

## Multi-agent swarm
Real in narrow cases: parallel research, large audits and independent verification. Often overkill. One agent with good tools is simpler and cheaper, and every extra agent adds coordination cost.

## Skills
Real: folders of instructions and scripts loaded when relevant. A packaging convention, not a new capability.

## Memory
Real: storing facts outside the window and retrieving them. Mostly files plus search. The hard part is deciding what to keep and when it is stale.

## Reasoning
Real: models trained to spend tokens on thinking before answering. It improves multi-step problems. It does not mean the model understands in a human sense.

## "10x" and "replaces developers"
Studies are mixed. One 2025 randomized study by METR followed 16 experienced open-source developers on 246 real issues and found tasks took 19 percent longer with the AI tools of early 2025, partly from the time spent verifying. It is a small sample and the tools have since changed, so treat it as one data point. Gains are real on well-specified, verifiable work and smaller elsewhere.

## A worked example: translating a pitch
Pitch: "Our multi-agent swarm autonomously builds your product." Translation: several model calls coordinated by code. Questions: what does each agent do, what checks the output, what is the pass rate, what does a run cost, what happens when it is wrong? If the answers are vague, it is a demo.

## A quick glossary of caution
Real mechanism with a hype halo: agents, reasoning models, context engineering, skills, memory. Mostly packaging: "swarm", "autonomous employee". Undefined: AGI.

## Common mistake
Rejecting a whole idea because the marketing is silly. Look for the mechanism underneath.

```resources
article | Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity | https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/ | METR | A randomized trial that found slower completion, with caveats.
article | Not all AI-assisted programming is vibe coding | https://simonwillison.net/2025/Mar/19/vibe-coding/ | Simon Willison | Draws the line between vibe coding and reviewed AI-assisted code.
article | AI Snake Oil | https://www.aisnakeoil.com/ | Narayanan and Kapoor | A newsletter that separates real capability from claims.
```

```quiz
What question best tests a new buzzword? | Who coined the phrase, and how popular is it ; What mechanism does it name, and how can I measure it ; Does it have a slick logo and website | 1 | A useful term names something you can implement and measure.
When is a multi-agent system justified? | Always, because more agents are always smarter ; Never, since a single agent is cheaper ; For parallel, independent work such as research | 2 | Coordination cost makes it overkill for most tasks, but it fits parallel independent subtasks.
A study finds developers were 19 percent slower with AI tools. How should you treat this? | As one data point from a small early study ; As proof that AI never helps developers ; As irrelevant because it is only one study | 0 | The study had 16 developers and early-2025 tools, so weigh it as evidence, not a verdict.
```

```story
A founder reads that "agentic AGI will replace developers". They could panic or ignore it. A better move: translate it. "Agentic" means a model that chooses its own steps. "AGI" has no agreed definition. "Replace developers" is a prediction, not a measurement. Translated, the sentence says almost nothing testable.
```

