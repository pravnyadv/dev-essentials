# what-is-an-agent | Workflows vs agents | 1 | 12
Pick the least autonomy that solves the problem. Agents are for tasks whose steps you cannot write down in advance.

## What it is
A workflow runs a fixed path in your code and calls the model at set points, such as classify, then draft, then check. An agent lets the model decide which step comes next. The first is predictable, cheap and easy to test. The second handles open-ended work and costs more in tokens, latency and debugging.

## How to choose
Can you list the steps ahead of time? Use a workflow. Does the task branch in ways you cannot predict, like fixing an unknown bug in a codebase? Use an agent, and give it a way to check its work. Start with a single model call with good context. Add retrieval, then tools, then a loop, only when the simpler form falls short on your evals.

## A worked example: choosing
Task: tag each incoming support email as billing, bug or other. Steps are fixed: one model call per email. Use a workflow. Task: investigate why a customer's invoice is wrong. The steps depend on what is found. Use an agent with tools for invoices and account history, with limits and a person to approve changes.

## Common mistake
Building an agent because the word is exciting.

```resources
article | Building effective agents | https://www.anthropic.com/engineering/building-effective-agents | Anthropic | The reference for workflow versus agent and when to use each.
article | A practical guide to building agents | https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf | OpenAI | Use-case selection and orchestration patterns.
course | AI Agents for Beginners | https://github.com/microsoft/ai-agents-for-beginners | Microsoft | Twelve lessons from fundamentals to production.
```

```quiz
You can list the three steps of a task in advance. What fits best? | A fixed workflow ; An autonomous agent ; A swarm of agents | 0 | Known steps mean a workflow is simpler, cheaper and easier to test.
What should you do before adding an agent loop? | Add more tools to the single call to cover gaps ; Check that one good call is not already enough ; Pick a framework before testing anything | 1 | Each added layer costs tokens and debuggability, so add one only when your tests show a need.
A task branches in ways you cannot predict, such as fixing an unknown bug. What fits? | A single call with a much longer prompt ; A fixed chain of exactly three steps ; An agent with tools, limits and checks | 2 | Unpredictable steps are where an agent earns its extra cost.
```

```story
You want to know the cheapest flight to Lisbon next month. A fixed workflow can search one website and show the result: three steps you wrote. An agent can decide to check three sites, notice that weekday flights are cheaper, look at nearby airports and come back with options. The workflow follows your plan. The agent makes its own.
```

# agent-use-cases | Where agents work today | 1 | 12
Agents are strongest where steps vary, results can be checked and mistakes are cheap to undo.

## Working well
Coding: reading a repository, editing files and running tests gives a built-in checker. Research: gathering and cross-checking sources. Customer support: answering from a knowledge base and taking bounded actions like a refund within limits. Data work: writing and running queries, then charting results. Operations: triaging alerts and drafting runbook steps for a person to approve.

## Working poorly
Open-ended goals with no way to tell if the result is right. Long chains where each step is unreliable. Irreversible actions with no human check. Tasks a fixed script could do reliably and cheaply.

## A checklist before building
Can success be tested automatically? What is the worst thing a wrong action can do? Can it be undone? How many steps will it take, and what is the per-step failure rate? What does one run cost? If you cannot answer, start with a workflow and a human in the loop, then loosen it as evals show the agent is reliable.

## A worked example: the checklist applied
Idea: "An agent that books meetings by email." Can success be tested automatically? Partly. Worst failure? Booking the wrong person, or sharing private info. Reversible? Mostly. Steps? 4 to 8. Verdict: a draft-and-confirm workflow first, with a person approving each invite, loosened later if the pass rate is high.

## Questions that save months
What does one run cost? What is the pass rate on twenty realistic cases? Who reviews the output? What is the rollback?

## Common mistake
Starting with the most ambitious use case instead of the most checkable one.

## Why long chains fail
Suppose each step of an agent is 95 percent reliable. After 10 steps, the chance that every step is right is 0.95^10, which is 60 percent. After 30 steps it is 21 percent. That is why useful agents have short chains, checks after each step and a person at the risky points. It is also why a tool that lets the agent verify its own work, such as a test, is worth so much.

## Hype to discount
"Autonomous employees", agent swarms for tasks a script could do, and demos that worked once. The real limits are reliability over many steps and cost, because every step re-reads the context. The agents that work today have a narrow scope, good tools and a way to check themselves.

## How to read an agent claim
Ask four questions. What are the steps? What checks the result? What does one run cost? What is the pass rate on twenty realistic tasks?

```resources
article | A practical guide to building agents | https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf | OpenAI | Use-case selection with examples.
article | Building effective agents | https://www.anthropic.com/engineering/building-effective-agents | Anthropic | Customer support and coding as the two clearest cases.
repo | AI Agents for Beginners | https://github.com/microsoft/ai-agents-for-beginners | Microsoft | Lessons with example use cases.
article | LLM Powered Autonomous Agents | https://lilianweng.github.io/posts/2023-06-23-agent/ | Lilian Weng | Planning, memory and tool use as the three components.
article | Agents | https://huyenchip.com/2025/01/07/agents.html | Chip Huyen | Tools, planning and failure modes, in depth.
```

```quiz
Which task suits an agent best today? | Fixing a failing test in a repository ; Making money with no oversight ; Sending legal letters without review | 0 | Tests give a built-in way to check the result.
What should you do if you cannot define success for a task? | Build a full agent now and watch what happens ; Start with a workflow and a human reviewer ; Add several more agents to share the work | 1 | Reliability has to be shown before autonomy is granted.
An agent is 95 percent reliable per step and a task needs 30 steps. About how often does it finish without error? | About 95 percent of the time ; About 50 percent of the time ; About 21 percent of the time | 2 | 0.95 multiplied by itself 30 times is about 0.21. Small error rates compound.
```

```story
A software team gets a flaky test failure at night. An agent reads the logs, finds the test, checks recent commits, proposes a fix in a branch and posts a summary for review in the morning. A person approves in five minutes instead of investigating for an hour. Narrow job, clear check, reviewed output: that is where agents shine today.
```

# agent-loop | The agent loop | 2 | 15
A while loop with a model call inside. Understanding the loop is understanding agents.

## The steps
1. Send the model the goal, the history and the tool definitions.
2. If the reply is a tool call, run it.
3. Append the call and its result to the history.
4. Call the model again.
5. If the reply is a final answer, stop. Add limits: a maximum number of steps, a cost cap and a timeout.

## What goes wrong
The model picks the wrong tool, repeats the same call, or loses the goal as the history grows. Tool errors that are unclear cause retry spirals. Context fills with old results. Fixes are in the harness: clear tool errors, a step limit, trimming or summarizing old output and checks the agent can run itself.

## Try it
Step through the loop in the demo. Watch the context grow with each tool call, and see where the loop stops.

## A worked example in pseudocode
messages = [user goal]. Repeat up to 10 times: reply = model(messages, tools). If reply has no tool call, stop and return it. Otherwise run the tool, append the call and the result to messages. That is the whole thing, around 20 lines in any language. Everything else is safety and polish: limits, logging, error handling.

## What to add in practice
A step limit and a cost limit. Logging of every call. A clear final answer format. A way for a person to interrupt.

## Where this connects
Agents need tests of their own, and the loop needs limits for cost and steps. See [Trajectory evals for agents](/ai/docs/evals-and-safety/agent-evals) and [Human approval](/ai/docs/production/human-in-the-loop).

## The code
The loop from the steps above, in Python. It stops when the model answers, and also after 10 steps.

```python
def run_agent(goal, tools, run_tool, max_steps=10):
    messages = [{"role": "user", "content": goal}]
    for _ in range(max_steps):
        reply = client.messages.create(model="claude-sonnet-5-5", max_tokens=1000, tools=tools, messages=messages)
        messages.append({"role": "assistant", "content": reply.content})
        if reply.stop_reason != "tool_use":
            return reply.content[0].text  # no tool call: this is the final answer
        results = []
        for block in reply.content:
            if block.type == "tool_use":
                try:
                    output = run_tool(block.name, block.input)
                except Exception as e:  # return the error as a result so the model can recover
                    output = f"Error: {e}"
                results.append({"type": "tool_result", "tool_use_id": block.id, "content": str(output)})
        messages.append({"role": "user", "content": results})
    return "Stopped: step limit reached."
```

```resources
article | How to build an agent | https://ampcode.com/how-to-build-an-agent | Thorsten Ball | A complete agent in a few hundred lines. Read the code.
article | LLM Powered Autonomous Agents | https://lilianweng.github.io/posts/2023-06-23-agent/ | Lilian Weng | The planning, memory and tool components around the loop.
repo | smolagents | https://github.com/huggingface/smolagents | Hugging Face | A small library where the loop is easy to read.
course | Hugging Face Agents Course | https://huggingface.co/learn/agents-course | Hugging Face | Free course that builds agents step by step.
```

```quiz
What ends an agent loop? | The model gives a final answer, or a limit stops it ; It stops after exactly ten steps in every case ; It stops as soon as the first tool call returns | 0 | The loop runs until the model answers or a step, cost or time limit stops it.
The agent calls the same failing tool again and again. What is the best fix? | A higher temperature so the model tries other ideas ; A clear error message plus a retry limit ; A longer system prompt with extra warnings | 1 | The model needs to learn what went wrong, and the harness must cap retries.
Your loop has no step limit and the model keeps calling tools. What could happen? | The model stops on its own after three calls ; The API rejects the first tool call ; A runaway loop with a large bill | 2 | Without limits, a confused agent can keep going. Cap steps, cost and time.
```

```story
A new employee is told "find out why the checkout page is slow". They look at one thing, then decide what to look at next based on what they found, repeating until they have the answer. An agent loop is exactly that: look, decide, act, look at the result, decide again.
```

# tool-design | Designing tools for agents | 2 | 12
Tools are a contract between a deterministic system and a non-deterministic one. Design them for the model, not for a human API consumer.

## Principles
Fewer, higher-level tools beat many thin ones. A single "search customers by name" tool is easier to use well than five endpoints the model must chain. Write descriptions as if for a new colleague, with when to use it and examples. Return what the model needs, in readable form, not raw database rows. Offer pagination or filters so a call cannot return 40,000 tokens. Make errors instructive: say what failed and what to try.

## Test them with the model
Run realistic tasks, read the transcripts, and look for confusion. Common signs are wrong tool picks, wrong arguments and over-calling. Revise descriptions and responses, then rerun the same tasks and compare.

## A worked example: a tool description
Weak: "search - searches stuff". Better: "search_orders - find orders for a customer. Use when the user asks about past purchases. Input: customer_email (required), status (optional: open, shipped, cancelled). Returns up to 5 orders as id, date, total, status." The better one tells the model when to use it, what to pass and what comes back.

## Common mistake
Returning raw database dumps. Shape the result for a reader with limited attention.

```resources
article | Writing effective tools for AI agents | https://www.anthropic.com/engineering/writing-tools-for-agents | Anthropic | Prototype, evaluate with agents, then iterate.
docs | Tool use best practices | https://docs.anthropic.com/en/docs/build-with-claude/tool-use/overview | Anthropic | Official guidance on schemas and descriptions.
```

```quiz
What is wrong with a tool that returns 40,000 tokens of raw rows? | It floods the context and hides what matters ; It arrives too fast for the model to read it properly ; It breaks the tool's declared JSON schema | 0 | Return concise, relevant results and offer filters or pagination.
How do you know a tool is well designed? | Its description is very long and detailed ; Agents use it correctly on realistic tasks ; It offers many options and parameters | 1 | Evaluate by running tasks and reading transcripts.
Two tools, search_orders and find_orders, confuse the model. What is the best fix? | Rename them so the names are shorter and neater ; Add a third, similar tool to cover the overlap ; Merge them or sharpen both descriptions | 2 | Overlapping tools make the model guess. Clear, distinct descriptions help.
```

```story
A shop gives its assistant two tools: get_order and cancel_order. A third tool, run_sql, is tempting because it can do everything, but it makes the assistant likely to write risky queries. Fewer, safer tools that match real tasks work better than one super tool.
```

# tool-errors-and-validation | When tools fail, and tool inputs are still inputs | 2 | 12
Tool calls fail and tool arguments are written by a model. Handle both as you would handle any untrusted input.

## Validate arguments
The model produces the arguments. They can be missing, the wrong type or dangerous. Validate against the schema before running anything. A "search" tool that builds a SQL string from the argument is an injection hole. Use parameterized queries, allowlists and limits. Treat the model like a user who may be tricked.

## Return failures as results
If a tool fails, do not crash the loop. Return an error message as the tool result, written for the model: what failed and what to try. "No results for 'gift cards 2019'. Try a broader query or remove the year." The model can then retry with changes. Cap retries so a persistent failure ends the run with a clear message.

## Keep the results honest
Return real data, not guesses, and say when a result is empty or truncated. Pass back any reasoning or tool-call items the provider requires in the next call, since dropping them can degrade behavior or cause an error. Log each call, its arguments and the result for later review.

## Check the data path
Before wiring a tool into an agent, call it by hand with typical and bad inputs and read what it returns. A tool that works alone but returns a 40,000-token blob will wreck the agent's context.

## A worked example: validating
Tool delete_file(path). The model passes "../../etc/passwd". Validation checks that the path stays inside the project folder and refuses with "Path must be inside the project." The model learns the rule and retries with a valid path. The check lives in code, not in the prompt.

## Limits on retries
Three attempts is a typical cap. After that, stop and report what was tried. An agent that retries forever burns money.

## Common mistake
Trusting that arguments will be shaped as described. Models make typos and can be manipulated.

```resources
article | Writing effective tools for AI agents | https://www.anthropic.com/engineering/writing-tools-for-agents | Anthropic | Error messages and responses designed for models.
docs | Handle tool calls | https://docs.anthropic.com/en/docs/build-with-claude/tool-use/implement-tool-use | Anthropic | Returning results and errors to the model.
article | OWASP Top 10 for LLM Applications | https://genai.owasp.org/llm-top-10/ | OWASP | Insecure output and excessive agency risks.
```

```quiz
A tool call fails. What should the loop do? | Return an instructive error and cap retries ; Crash the loop and show the user an error page ; Ignore the failure silently and carry on | 0 | The model can recover when the error says what to try.
Why validate tool arguments? | Arguments are always correct but slow to read ; The model can produce wrong or dangerous values ; The schema is optional for most tools | 1 | Arguments come from a model that may be mistaken or manipulated.
A search tool builds a SQL string from the model's argument. What is the safe change? | Trust the argument because a model wrote it ; Ask the model to avoid special characters ; Use parameterized queries and an allowlist | 2 | Treat model output like user input: never build raw queries from it.
```

```story
A tool is asked to look up order "ABC" and crashes because order ids are numbers. If the loop crashes too, the user sees nothing. If the tool returns "No order with id ABC. Order ids are numbers like 8123. Ask the customer for the number.", the agent recovers and asks the right question. Good errors turn failures into next steps.
```

# workflow-patterns | Workflow patterns | 2 | 15
Five patterns cover most useful systems that are not full agents.

## The patterns
Prompt chaining: break a task into steps where each output feeds the next, with checks between. Routing: classify the input and send it to a specialized prompt or model. Parallelization: run independent subtasks at once, or run the same task several times and vote. Orchestrator-workers: a lead model splits an unpredictable task and delegates pieces to workers. Evaluator-optimizer: one model drafts, another critiques, and the loop repeats until the criteria are met.

## Choosing
Chain when the task splits cleanly. Route when inputs differ in kind. Parallelize for speed or confidence. Use orchestrator-workers when subtasks are not known beforehand. Use evaluator-optimizer when you have clear criteria and revision helps. Each pattern adds calls, so add one only when it improves a measured result.

## A worked example: prompt chaining
Task: write a product page. Step 1: extract key facts from the spec as bullets. Step 2: draft copy from the bullets. Step 3: check the copy against the bullets and list any claim not supported. Step 4: fix those. Each step is small and checkable, so errors are caught early.

## A worked example: routing
An incoming message is classified as billing, technical or sales. Each category goes to a prompt (or model) tuned for it. A cheap model does the classification, a stronger one handles the technical cases.

## Common mistake
Adding patterns without measuring. Each extra call adds cost, time and failure points.

```resources
article | Building effective agents | https://www.anthropic.com/engineering/building-effective-agents | Anthropic | Defines and illustrates all five patterns.
repo | Claude Cookbooks: agent patterns | https://github.com/anthropics/claude-cookbooks/tree/main/patterns/agents | Anthropic | Runnable notebooks for each pattern.
course | Agentic AI | https://www.deeplearning.ai/courses/agentic-ai/ | Andrew Ng, DeepLearning.AI | Reflection, tool use, planning and multi-agent, with evals.
```

```quiz
Which pattern fits "different inputs need different handling"? | Routing ; Prompt chaining ; Evaluator-optimizer | 0 | Routing classifies the input and sends it to a specialized handler.
Which pattern needs clear criteria to work well? | Routing ; Evaluator-optimizer ; Parallelization | 1 | The evaluator needs something concrete to judge against.
A product page needs facts extracted, copy drafted, then checked against the facts. Which pattern is this? | Routing ; Orchestrator-workers ; Prompt chaining | 2 | A fixed sequence where each step feeds the next is a chain.
```

```story
A newsroom has an assembly line: a reporter drafts, an editor checks facts, a copy editor polishes. Nobody decides the order each time. Workflow patterns are assembly lines made of model calls, for tasks where the steps are known.
```

# agent-memory | Memory and state | 2 | 12
The model remembers nothing between calls. Memory is whatever your system stores and puts back in the window.

## Kinds of memory
Working memory is the current context. Session memory is a log or summary of what happened so far. Long-term memory is facts and preferences stored outside the window, usually as files, a database or a vector index, and retrieved when relevant. Procedural memory is instructions and skills that tell the agent how to do things.

## Practical design
Start with plain files: a progress notes file, a decisions log and the project memory file. They are readable, diffable and easy to edit. Add retrieval only when the notes outgrow the window. The hard problems are choosing what to write down, avoiding stale or wrong facts, and forgetting on purpose. Anything the agent writes to memory can be wrong, so treat it as a hypothesis to verify.

## A worked example: a notes file
After each session the agent appends to notes.md: "User prefers metric units. Project uses PostgreSQL 15. Decision 3 May: use queue for emails." At the next session it reads the file first. Plain text, readable by you, editable by you. Later, if the file grows, add search over it.

## Common mistake
Building a complicated memory system before trying a notes file.

```resources
repo | mem0 | https://github.com/mem0ai/mem0 | Mem0 | A memory layer for agents with extraction and retrieval.
repo | Letta | https://github.com/letta-ai/letta | Letta | Stateful agents with self-managed memory, from the MemGPT line of work.
article | Effective context engineering for AI agents | https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents | Anthropic | Structured note-taking and just-in-time retrieval.
```

```quiz
Where should an agent's notes start out? | In plain files it can read and you can edit ; In a vector database that the agent maintains ; Inside the model's weights through fine-tuning | 0 | Files are simple and inspectable. Add retrieval only when you need it.
Why treat remembered facts as hypotheses? | They always cost money to store ; They can be wrong or stale ; Models ignore saved notes | 1 | Memory written by a model can contain errors that then compound.
A user moves to a new database and the notes still say PostgreSQL. What is this problem? | A tokenization error hidden in the saved notes ; A normal feature of long-term memory in agents ; A stale memory that needs updating or forgetting | 2 | Deciding when something is out of date, and forgetting it, is one of the hard parts.
```

```story
A good barista remembers that you order a flat white with oat milk. They do not remember it from a book. They remember because they noticed it once and kept it. Agent memory is the same two steps: decide what is worth keeping, and bring it back when it is useful.
```

# persisting-conversations | Saving and resuming agent conversations | 2 | 10
An agent's state is its message list. Save it and you can resume, audit and replay.

## What to store
The full ordered list of messages, including tool calls and tool results, plus metadata: user id, model and prompt version, timestamps and token counts. Store one row per message or one document per conversation. Include a version of your message format so old conversations still load after you change it.

## Practical rules
Keep each conversation private to its owner. Redact secrets and personal data you do not need. Add a retention limit. Treat stored history as untrusted: it may contain injected text from earlier tool results.

## A worked example: what a saved record looks like
conversation_id, user_id, created_at, model "sonnet-5-5", prompt_version "v14", messages: [ {role: user, text: ...}, {role: assistant, tool_call: search(...)}, {role: tool, result: ...}, ... ]. When the user returns, load the list, add the new message and send. If it is too long, summarize the oldest part and keep the last few turns.

## Common mistake
Trimming messages by cutting in the middle of a tool call, leaving a result with no matching call.

```resources
article | Effective context engineering for AI agents | https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents | Anthropic | Trimming and summarizing long histories.
repo | LangGraph persistence | https://langchain-ai.github.io/langgraph/concepts/persistence/ | LangChain | Checkpointing agent state as a built-in feature.
repo | 12-Factor Agents | https://github.com/humanlayer/12-factor-agents | HumanLayer | Own your state and make agents resumable.
```

```quiz
What is the state of a simple agent? | Its message list ; Its model weights ; Its API key | 0 | Save the list and the agent can resume.
Why keep a tool call with its matching result when trimming history? | It makes the stored history much shorter ; APIs reject a tool result with no matching call ; It looks neater when the logs are printed | 1 | The pair must stay together.
A user asks you to delete their data. What does this imply for saved conversations? | Nothing, since conversations are only temporary ; Only the most recent message must be deleted ; You need a way to find and delete their stored histories | 2 | Stored history is personal data, so keep it private, deletable and short-lived.
```

```story
A user starts a research task on Monday, closes the tab, and returns Wednesday. If the app saved the conversation, the agent picks up exactly where it left off. If not, the user starts over. Saving the message list is the simplest way to give an agent continuity.
```

# multi-agent | Multi-agent systems | 3 | 15
Several agents help when work is parallel and independent. They hurt when work is tightly coupled.

## When it helps
Research across many sources, audits of many files and independent verification all split cleanly. Each subagent gets its own context window, so the lead agent's context stays small. In Anthropic's multi-agent research system, a lead agent plans and spawns subagents that search in parallel, and the setup outperformed a single agent on broad research questions, using far more tokens.

## When it hurts
Coding tasks where pieces depend on each other, because agents make conflicting assumptions. Anything where coordination cost exceeds the work. Remember that token use multiplies with each agent. Rules of thumb: give each subagent a clear objective, output format and boundaries, scale the number of agents to the difficulty, and have the lead synthesize rather than relay.

## A worked example: when it pays off
Question: "Compare five competitors' pricing." Five subagents each research one competitor and return a short structured summary. The lead agent merges them into a table. Time drops from one long run to five short ones in parallel. Token use goes up because each agent reads its own sources.

## A case where it hurts
Two agents editing different parts of the same program must agree on the interface between them. If they decide separately, the pieces do not fit. Keep tightly coupled work in one context.

## Common mistake
Choosing multi-agent because it looks impressive. Use it when the work splits cleanly.

```resources
article | How we built our multi-agent research system | https://www.anthropic.com/engineering/multi-agent-research-system | Anthropic | Architecture, prompt lessons, evaluation and token cost.
article | Don't build multi-agents | https://cognition.ai/blog/dont-build-multi-agents | Cognition | The counterargument: shared context and conflicting decisions.
course | AI Agents in LangGraph | https://www.deeplearning.ai/short-courses/ai-agents-in-langgraph/ | DeepLearning.AI and LangChain | Stateful, controllable orchestration.
```

```quiz
Which task suits several agents best? | Searching twenty independent sources ; Editing one function in a single file ; A tightly coupled refactor across modules | 0 | Independent subtasks parallelize with little conflict.
What is the main cost of multi-agent systems? | More lines of text in each agent's prompt ; Token use that multiplies with each agent ; Slower typing speed for the human user | 1 | Each agent carries its own context, so total tokens rise quickly.
Two agents edit different parts of a program that must agree on an interface. What goes wrong? | They always agree because they share one model ; Nothing, since parallel work never conflicts ; They assume different things and the parts clash | 2 | Tightly coupled work belongs in one context.
```

```story
A newspaper researching a big story splits it: one reporter checks the financials, one interviews former employees, one reads court filings. They work at once and an editor combines the findings. Multiple agents help in the same situation: independent pieces of research done in parallel. They do not help when the pieces depend on one another.
```

# long-running-agents | Long-running agents | 3 | 15
Work that outlasts one context window needs structure: a plan, a progress file and clean handoffs.

## The problem
Over hours, context fills, coherence drops and agents may wrap up early. Compaction summarizes in place. A reset clears the window and starts a fresh agent with a written handoff. Resets give a clean slate at the cost of writing a good handoff.

## A workable design
An initializer agent expands the spec into a feature list and a setup script. A worker agent takes one feature at a time, commits and updates a progress file. An evaluator agent runs the app and the tests and reports failures with evidence. Tests and the git log are the shared state. Each agent starts by reading the progress file and the latest commits.

## A worked example: a progress file
progress.md: "Goal: build the invoicing app. Features done: login, customer list. In progress: invoice PDF export. Next: email sending. Tests: 24 passing, 2 failing (export). Notes: use the existing PDF library." A new agent session reads this file and the latest commit messages and continues in minutes.

## Evaluator agents
A separate agent runs the app and tests it, then writes what it found. The worker agent fixes those issues. Splitting the roles stops the worker from marking its own homework generously.

## Common mistake
Letting a single context run for hours. Quality drops. Reset with a handoff.

```resources
article | Effective harnesses for long-running agents | https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents | Anthropic | Initializer and coding agents with progress artifacts.
article | Harness design for long-running application development | https://www.anthropic.com/engineering/harness-design-long-running-apps | Anthropic | Planner, generator and evaluator over multi-hour runs.
```

```quiz
What is the difference between a reset and compaction? | A reset starts fresh, compaction shortens in place ; Reset and compaction are two names for one thing ; Compaction deletes files from the project folder | 0 | A reset avoids lingering context anxiety but needs a good handoff.
What is the shared state between sessions of a long task? | The chat window that the user keeps open ; Files: progress notes, tests and git history ; The model's own memory from earlier runs | 1 | Durable artifacts let a fresh agent pick up the work.
An agent marks its own work as done, but half the feature is missing. What helps? | A separate evaluator that runs the app and tests it ; A longer prompt that says to be thorough ; A larger context window for the same agent | 0 | Separating the doer from a skeptical checker stops generous self-grading.
```

```story
A marathon runner does not carry every memory of every mile in their head. They carry a plan, check the watch, and refuel at stations. A long agent run is similar: it cannot carry everything in its context, so it uses a plan, a progress file and checkpoints.
```

