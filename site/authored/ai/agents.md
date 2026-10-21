# what-is-an-agent | Workflows vs agents | 1 | 12
Pick the least autonomy that solves the problem. Agents are for tasks whose steps you cannot write down in advance.

## What it is
A workflow runs a fixed path in your code and calls the model at set points, such as classify, then draft, then check. An agent lets the model decide which step comes next. The first is predictable, cheap and easy to test. The second handles open-ended work and costs more in tokens, latency and debugging.

```mermaid A workflow follows a path your code fixed, while an agent loops and lets the model choose each next step
flowchart TD
  subgraph W[Workflow, code picks the step]
    W1[Classify] --> W2[Draft] --> W3[Check]
  end
  subgraph G[Agent, model picks the step]
    A1{Model decides} -->|Tool call| A2[Tool]
    A2 --> A1
    A1 -->|Done| A3[Final answer]
  end
  class A1 focus
```

## How to choose
Can you list the steps ahead of time? Use a workflow. Does the task branch in ways you cannot predict, like fixing an unknown bug in a codebase? Use an agent, and give it a way to check its work. Start with a single model call with good context. Add retrieval, then tools, then a loop, only when the simpler form falls short on your evals.

## A worked example: choosing
Task: tag each incoming support email as billing, bug or other. Steps are fixed: one model call per email. Use a workflow. Task: investigate why a customer's invoice is wrong. The steps depend on what is found. Use an agent with tools for invoices and account history, with limits and a person to approve changes.

## What the extra autonomy costs
Take the email tagger and give it an agent loop. Invented numbers for illustration. The email is 500 tokens. Each tool result adds 300 tokens, and every call resends everything so far.

The workflow makes one call and sends 500 tokens. The agent makes four calls and sends 500, 800, 1,100 and 1,400 tokens, which is 3,800 in total. That is 7.6 times the input for a task that needed one call.

The table counts the input tokens each call sends. The agent resends the growing history every time, so its total is 7.6 times the workflow's. Many providers charge less for the repeated start of a prompt, so the bill can grow more slowly than the token count. The time to read all of it still grows.

| Setup | Call | Tokens sent | Running total |
|---|---|---|---|
| Workflow | 1 | 500 | 500 |
| Agent | 1 | 500 | 500 |
| Agent | 2 | 800 | 1,300 |
| Agent | 3 | 1,100 | 2,400 |
| Agent | 4 | 1,400 | 3,800 |

Cost is only part of it. The agent might also take a different route on each run, so the same email can get two different tags.

## What goes wrong: an agent where a workflow would do
The symptom is a system that works in the demo and disagrees with itself in testing. Run the same 20 emails twice and count how many get a different tag. A fixed workflow, with randomness turned down where the model allows it, should disagree far less. If the agent disagrees often, the freedom it has is not buying anything.

## A middle path: one loop inside a workflow
You do not have to pick one side. Keep the fixed steps in code and allow a loop in only the step that needs it. For the invoice question, fetching the invoice and the account can be two fixed calls. Only the step "work out why the totals differ" needs a loop. The loop then has a small job, a short step limit and a narrow set of tools, so it is cheap to test and hard to derail.

```mermaid Only the middle step of the invoice question gets a loop, and the rest stays fixed code
flowchart TD
  F1[Fetch the invoice] --> F2[Fetch the account]
  F2 --> L[Loop: work out why totals differ]
  L --> L2[Short step limit, narrow tools]
  L2 --> A[Answer]
  class L focus
```

## Common mistake
Reaching for a loop before checking whether one well-written call passes your test set. If you cannot say what a person would check in the agent's output, you do not yet know if the agent is better.

```resources
article | Building effective agents | https://www.anthropic.com/engineering/building-effective-agents | Anthropic | The reference for workflow versus agent and when to use each.
article | A practical guide to building agents | https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf | OpenAI | Use-case selection and orchestration patterns.
course | AI Agents for Beginners | https://github.com/microsoft/ai-agents-for-beginners | Microsoft | Eighteen short lessons to get started building AI agents.
```

```quiz
You can list the three steps of a task in advance. What fits best? | A fixed three-step workflow ; One autonomous agent with tools ; A loop where the model picks each next step | 0 | Known steps mean a workflow is simpler, cheaper and easier to test.
What should you do before adding an agent loop? | Add more tools to the call to cover gaps ; Check whether one good call is enough ; Pick a framework before testing anything | 1 | Each added layer costs tokens and debuggability, so add one only when your tests show a need.
Task: find out why a customer's invoice total changed. You cannot say in advance which records you will need. What fits? | A workflow that always fetches the same three records ; One long prompt with every record pasted in ; A model loop that picks the next record to open, with a step limit | 2 | Unpredictable steps are where an agent earns its extra cost, and the step limit keeps it bounded.
```

```story
You want to know the cheapest flight to Lisbon next month. A fixed workflow can search one website and show the result: three steps you wrote. An agent can decide to check three sites, notice that weekday flights are cheaper, look at nearby airports and come back with options. The workflow follows your plan. The agent makes its own.
```

# agent-use-cases | Where agents work today | 1 | 12
Agents are strongest where steps vary, results can be checked and mistakes are cheap to undo.

## Working well
Coding: reading a repository, editing files and running tests gives a built-in checker. Research: gathering and cross-checking sources, where every claim can be traced to a page you can open. Open-ended analysis with no source to check against is a poor fit (see below). Customer support: answering from a knowledge base and taking bounded actions like a refund within limits. Data work: writing and running queries, then charting results. Operations: triaging alerts and drafting runbook steps for a person to approve.

## Working poorly
Open-ended goals with no way to tell if the result is right. Long chains where each step is unreliable. Irreversible actions with no human check. Tasks a fixed script could do reliably and cheaply.

## A checklist before building
Can success be tested automatically? What is the worst thing a wrong action can do? Can it be undone? How many steps will it take, and what is the per-step failure rate? What does one run cost? If you cannot answer, start with a workflow and a human in the loop, then loosen it as evals show the agent is reliable.

## A worked example: the checklist applied
Idea: "An agent that books meetings by email." Can success be tested automatically? Partly. Worst failure? Booking the wrong person, or sharing private info. Reversible? Mostly. Steps? 4 to 8. Per-step failure rate? Say 95 percent reliable per step, so 8 steps finish cleanly about 66 percent of the time (0.95 multiplied by itself 8 times). Cost? A few model calls per email, which is small, but a wrong invite is not. Verdict: a draft-and-confirm workflow first, with a person approving each invite, loosened later if the pass rate is high.

## Questions that save months
What does one run cost? What is the pass rate on twenty realistic cases? Who reviews the output? What is the rollback?

## Why coding works and market research does not
Picture a coding agent fixing a bug. It edits a function and runs the tests. Three tests fail. It reads the output, edits again, and one test fails. It edits once more and all pass. At every step something outside the model said whether it was right.

Now ask an agent to write a market analysis. No test exists. The agent stops when the text sounds finished, and that is a feeling, not a check. The agent is the same in both cases. What differs is whether the task has a verdict that does not come from the model.

## What goes wrong: a confident wrong finish
The symptom is a run that ends with "done" and a tidy report, where a figure in it does not exist in any source. Confirm it by taking ten finished runs and checking every claim against its source by hand. Count the runs with at least one unsupported claim. Do this before anyone trusts the agent, and again after every change to the prompt or model.

## How much to trust twenty runs
Suppose 17 of 20 test tasks pass. That is 85 percent, but with only twenty runs the true rate could plausibly sit anywhere from about 65 to 95 percent. A second batch might give 14 of 20. Treat a small test as a rough warning light, not a measurement. To tell two versions apart, you need many more runs or a very large gap between them.

## Common mistake
Starting with the most ambitious use case instead of the most checkable one.

## Why long chains fail
Suppose each step of an agent is 95 percent reliable. After 10 steps, the chance that every step is right is 0.95^10, which is 60 percent. After 30 steps it is 21 percent. This treats each step as an independent coin flip. Real agents can retry or catch a bad step, which is exactly why checks after each step help. That is why useful agents have short chains, checks after each step and a person at the risky points. It is also why a tool that lets the agent verify its own work, such as a test, is worth so much.

```mermaid The chance that every step is right falls fast as a chain gets longer, even at 95 percent per step
xychart-beta
  x-axis "steps in the chain" [1, 5, 10, 20, 30]
  y-axis "chance all steps are right, percent" 0 --> 100
  line "0.95 to the power of steps" [95, 77.4, 59.9, 35.8, 21.5]
```

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
Which task suits an agent best today? | Drafting a quarterly strategy memo for the board ; Fixing a failing unit test in a repo ; Choosing which customers to refund with no spending limit | 1 | The test run is a check that does not come from the model. The memo has no such check and the refunds are hard to undo.
What should you do if you cannot define success for a task? | Start with a workflow and a reviewer ; Build a full agent now and see what happens ; Write a longer prompt describing success | 0 | Reliability has to be shown before autonomy is granted.
An agent is 95 percent reliable per step and a task needs 30 steps. About how often does it finish without error? | About 95 percent of the time ; About 50 percent of the time ; About 21 percent of the time | 2 | 0.95 multiplied by itself 30 times is about 0.21. Small error rates compound.
```

```story
A software team gets a flaky test failure at night. An agent reads the logs, finds the test, checks recent commits, proposes a fix in a branch and posts a summary for review in the morning. A person approves in five minutes instead of investigating for an hour. Narrow job, clear check, reviewed output: that is where agents shine today.
```

# agent-loop | The agent loop | 2 | 15
A while loop with a model call inside. Understanding the loop is understanding agents.

## The steps
1. Send the model the goal, the history and the tool definitions.
2. Look at the reply. If it is a final answer, stop.
3. Otherwise it is a tool call: run it.
4. Append the call and its result to the history.
5. Go back to step 1 and send the longer history.

Around the loop, add limits: a maximum number of steps, a cost cap and a timeout. Also log every call, so you can see what the agent did, and give a person a way to interrupt.

```mermaid With tools you define, the model never runs the tool itself: your program sends each call on and returns the result
sequenceDiagram
  participant P as Your program
  participant M as Model
  participant T as Tool
  P->>M: Goal, history, tool definitions
  M-->>P: Tool call, get_order
  P->>T: Run get_order
  T-->>P: Result
  P->>M: Whole history plus result
  M-->>P: Final answer
  Note over P,M: Each turn resends the whole history
```

## What goes wrong
The model picks the wrong tool, repeats the same call, or loses the goal as the history grows. Unclear tool errors make the model retry the same call over and over. Context fills with old results. Fixes are in the harness: clear tool errors, a step limit, trimming or summarizing old output and checks the agent can run itself.

## Try it
Step through the loop in the demo. Watch the context grow with each tool call, and see where the loop stops.

## A trace of three turns
Goal: "What is the total for order 8123 including shipping?" Invented token counts. The goal plus the tool definitions take 450 tokens.

Turn 1 sends 450 tokens. The model replies with a call to get_order (30 tokens). Your program runs it, and the tool result adds 100 tokens.

Turn 2 sends 450 + 30 + 100 = 580 tokens. The model calls get_shipping (30 tokens) and the result adds 120.

Turn 3 sends 580 + 30 + 120 = 730 tokens. The model writes the final answer and the loop stops.

The new information was about 280 tokens, but the loop sent 450 + 580 + 730 = 1,760. Each turn resends the whole history, so a long run costs far more than the sum of its parts.

## Example: the repeat spiral
The symptom is a log showing the same tool with the same arguments five times in a row, each returning the same result. The model does not see progress, because the result is the same each time, and tries again. Confirm it by logging every call and checking for identical pairs of tool name and arguments. A simple fix is for the harness to notice a repeat and either stop the run or return the message "You already tried this and got this result. Try something different."

This is what the repeat spiral looks like in a log. The log is invented, and the five identical lines are the sign.

```text
step 1  get_order {"id": "8123"}  returned: No order found
step 2  get_order {"id": "8123"}  returned: No order found
step 3  get_order {"id": "8123"}  returned: No order found
step 4  get_order {"id": "8123"}  returned: No order found
step 5  get_order {"id": "8123"}  returned: No order found
harness  Repeat detected: "You already tried this and got this result. Try something different."
```

## When the loop is the wrong tool
Read the logs of twenty runs. If every run makes the same three calls in the same order, the model is not deciding anything. Write those three calls as plain code and skip the loop. It will be faster, cheaper and easy to test.

## Where this connects
Agents need tests of their own, and the loop needs limits for cost and steps. See [Trajectory evals for agents](/ai/docs/evals-and-safety/agent-evals) and [Human approval](/ai/docs/production/human-in-the-loop).

## The code
The loop from the steps above, in Python. It stops when the model answers, and also after 10 steps. Tool results go back in a message with the role "user", because from the model's side your program is the one answering its request. `tools` is the list of tool definitions and `run_tool` is your function that runs one, as in the tool-use lesson.

```python
from anthropic import Anthropic

client = Anthropic()  # reads ANTHROPIC_API_KEY from the environment

def run_agent(goal, tools, run_tool, max_steps=10):
    messages = [{"role": "user", "content": goal}]
    for _ in range(max_steps):
        reply = client.messages.create(model="claude-sonnet-5-5", max_tokens=1000, tools=tools, messages=messages)
        messages.append({"role": "assistant", "content": reply.content})
        if reply.stop_reason == "end_turn":
            return reply.content[0].text  # the model finished: this is the final answer
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

A reply cut off by max_tokens is not a finished answer, so this loop does not treat it as one.

```resources
article | How to build an agent | https://ampcode.com/how-to-build-an-agent | Thorsten Ball | A complete agent in a few hundred lines. Read the code.
article | LLM Powered Autonomous Agents | https://lilianweng.github.io/posts/2023-06-23-agent/ | Lilian Weng | The planning, memory and tool components around the loop.
repo | smolagents | https://github.com/huggingface/smolagents | Hugging Face | A small library where the loop is easy to read.
course | Hugging Face Agents Course | https://huggingface.co/learn/agents-course | Hugging Face | Free course that builds agents step by step.
```

```quiz
What ends an agent loop? | The model answers, or a limit stops it ; The harness stops it after the first tool result ; The model stops once it has used every tool once | 0 | The loop runs until the model answers or a step, cost or time limit stops it.
The agent calls the same failing tool again and again. What is the best fix? | Add more tools so it has more choices ; A clear error message plus a retry limit ; A longer system prompt with more warnings | 1 | The model needs to learn what went wrong, and the harness must cap retries.
A run takes 12 turns and each turn adds about 300 tokens to the history. Roughly how many tokens does the last turn send, ignoring the starting prompt? | About 300, only the newest turn ; About 12, one per turn taken ; About 3,300, all earlier turns resent | 2 | Each turn resends the whole history, so the last turn carries the 11 earlier turns, about 11 x 300 = 3,300.
```

```story
A new employee is told "find out why the checkout page is slow". They look at one thing, then decide what to look at next based on what they found, repeating until they have the answer. An agent loop is exactly that: look, decide, act, look at the result, decide again.
```

# tool-design | Designing tools for agents | 2 | 12
Your code does the same thing every time for the same input. The model does not. A tool is the agreement between them, so design it for the model, not for a human developer.

## Principles
Fewer, higher-level tools beat many thin ones. A single "search customers by name" tool is easier to use well than five separate API calls the model must string together. Write descriptions as if for a new colleague, with when to use it and examples. Return what the model needs, in readable form, not raw database rows ("Order 8123, shipped Tuesday, $42" rather than every column). Offer filters, or return only a few results at a time, so a call cannot return 40,000 tokens. Make errors instructive: say what failed and what to try.

## Test them with the model
Run realistic tasks, read the transcripts, and look for confusion. Common signs are wrong tool picks, wrong arguments and over-calling (using a tool when it is not needed). Revise descriptions and responses, then rerun the same tasks and compare.

## A worked example: a tool description
Weak: "search - searches stuff". Better: "search_orders - find orders for a customer. Use when the user asks about past purchases. Input: customer_email (required), status (optional: open, shipped, cancelled). Returns up to 5 orders as id, date, total, status." The better one tells the model when to use it, what to pass and what comes back.

## How the model sees your tools
The model never sees your code. It sees each tool's name, description and argument schema as text, and your program sends all of them on every call. Invented numbers: 30 tools at 150 tokens each is 4,500 tokens of definitions per call. A task with 10 calls resends 45,000 tokens of tool text before any real work. Providers can cache repeated tool text to lower the price, but it still takes up room in the context window, so the model has more to sort through either way.

```mermaid Tool definitions are resent on every call, so a 10-call task carries thousands of tokens of tool text, at an invented 150 tokens per tool
xychart-beta
  x-axis "tools offered" [5, 10, 20, 30]
  y-axis "tool text sent over 10 calls, tokens" 0 --> 50000
  bar [7500, 15000, 30000, 45000]
```

Size is only one side. With 30 similar options, the model has more chances to pick the wrong one. This is part of why fewer, clearer tools work better.

```mermaid The model sees only the tool text your program sends, and your code runs on its side of the line
flowchart TD
  D[Name, description, schema] -->|Sent as text every call| M[Model]
  M -->|Tool call with arguments| P[Your program]
  P --> C[Tool code]
  C -->|Result| P
  P -->|Result as text| M
  class D focus
```

## What goes wrong: overlapping tools
You have search_customers and find_user, and both can look up a person by email. The symptom is that the model picks one on Monday and the other on Tuesday, or picks whichever name sounds nicer. Confirm it by running each of ten realistic questions five times and tallying which tool is called. If one question splits close to evenly between the two tools, they overlap. Merge them, or write in each description when it should not be used.

## When fewer tools goes too far
Taken to the extreme, you could offer one tool, do_anything(action, params). Its schema says nothing about what is valid, so you cannot validate arguments. You also cannot allow reading while blocking deleting, because every action looks the same. Merge tools that do the same job. Keep separate the ones with different risks, such as read_order and cancel_order.

## Common mistake
Wrapping every endpoint of your API as its own tool, one per URL. The model then has to chain five calls and pass IDs between them. You can spot it when a transcript shows the same three calls in a row for every task. Replace the chain with one tool that does the whole job.

```resources
article | Writing effective tools for AI agents | https://www.anthropic.com/engineering/writing-tools-for-agents | Anthropic | Prototype, evaluate with agents, then iterate.
docs | Tool use with Claude | https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview | Anthropic | Overview of how tool calls work, with a link to the page on defining tools.
```

```quiz
What is wrong with a tool that returns 40,000 tokens of raw rows? | It floods the context and buries key facts ; It arrives too fast for the model to read ; It breaks the tool's declared JSON schema | 0 | Return concise, relevant results and offer filters or pagination.
How do you know a tool is well designed? | Its description is long, so no detail is missed ; Agents use it correctly on real tasks ; It exposes many options and parameters | 1 | A good description helps, but only a run on real tasks shows whether the model picks the tool and passes the right arguments.
Two tools, search_orders and find_orders, confuse the model. What is the best fix? | Rename them search_orders_v1 and search_orders_v2 ; Tell the prompt to always use search_orders ; Merge them or sharpen both descriptions | 2 | Overlapping tools make the model guess. Clear, distinct descriptions help.
```

```story
A shop gives its assistant two tools: get_order and cancel_order. A third tool, run_sql, is tempting because it can do everything, but it makes the assistant likely to write risky queries. Fewer, safer tools that match real tasks work better than one super tool.
```

# tool-errors-and-validation | When tools fail, and tool inputs are still inputs | 2 | 12
Tool calls fail, and tool arguments are written by a model. Treat the arguments as untrusted input, and treat failures as something the model needs to be told about clearly.

## Validate arguments
The model produces the arguments. They can be missing, the wrong type or dangerous. Validate against the schema before running anything. A "search" tool that builds a SQL string (a database command) from the argument is an injection hole. If the argument is pasted into the command text, a value like `x'; DROP TABLE orders; --` becomes part of the command and runs. A parameterized query sends the command and the value separately, so the value is only ever treated as data. Use parameterized queries, allowlists and limits. Treat the model like a user who may be tricked.

## Return failures as results
If a tool fails, do not crash the loop. Return an error message as the tool result, written for the model: what failed and what to try. "No results for 'gift cards 2019'. Try a broader query or remove the year." The model can then retry with changes. Cap retries so a persistent failure ends the run with a clear message.

## Keep the results honest
Return real data, not guesses, and say when a result is empty or truncated. Log each call, its arguments and the result for later review.

When you send a tool result back, include the model's own tool request in the conversation too, as your provider's docs describe. If you leave it out, some providers return an error.

## Check the data path
Before wiring a tool into an agent, call it by hand with typical and bad inputs and read what it returns. A tool that works alone but returns a 40,000-token blob will wreck the agent's context.

## A worked example: validating
Tool delete_file(path). The model passes "../../etc/passwd". Validation resolves the path to its absolute form first, then checks that the result starts with the project folder, and refuses with "Path must be inside the project." The model learns the rule and retries with a valid path. Checking the raw text is not enough, because "project/../../etc/passwd" starts with "project". The check lives in code, not in the prompt.

## Limits on retries
Three attempts is a typical cap. After that, stop and report what was tried. An agent that retries forever burns money.

## Three kinds of failure, three messages
Not every problem should be handled the same way.

A bad argument is the model's fault. Return "order_id must be digits only, got '#8123'". The model fixes it and retries.

A broken tool is the world's fault, such as a timeout. Return "The order service timed out. Retrying once may work." The harness can retry once itself.

An empty result is not a failure at all. Return "No order with id 8123 exists." Retrying will not help. The model should tell the user, not try again.

An empty search is different from a missing id. If the model searched, a broader query may find something, so say so. If it looked up one exact id and nothing exists, retrying will not help.

If all three return the same vague "Error", the model guesses, and often retries the one case that cannot work.

```mermaid Each kind of failure gets its own message, so the model knows whether to fix, wait or stop
flowchart TD
  T[Tool call] --> R{What happened?}
  R -->|Bad argument| A[Message: fix the argument]
  R -->|Service broken| B[Message: retry may work]
  R -->|Nothing found| C[Message: no such order]
  A --> M[Model retries]
  B --> H[Harness retries once]
  C --> U[Model tells the user]
```

## What goes wrong: the silent empty result
A tool catches every exception and returns an empty string. The model reads "nothing came back" as "no order exists" and tells the user their order is missing. The symptom is a confident wrong answer, while the logs show the tool returning empty at the same moment the database was down. Confirm it by switching off the service the tool depends on and reading what the tool returns. It should say it failed.

## Check the value, not just the type
A schema can say quantity is an integer, and 1,000,000 is an integer. Types are only the first filter. Add checks on meaning: a refund must not exceed the order total, a booking date must not be in the past, a path must stay in the project folder. Put these checks in code beside the tool, where the model cannot talk its way around them.

```mermaid Arguments pass a schema check and then a meaning check in code before the tool runs
flowchart TD
  M[Model writes arguments] --> S{Fits the schema?}
  S -->|No| E[Error result to the model]
  S -->|Yes| V{Value makes sense?}
  V -->|No| E
  V -->|Yes| R[Run the tool]
  class E warn
  class R good
```

The table sends four sets of arguments through both checks. The limit of 100 per order and the amounts are invented.

| Arguments the model sent | Schema check | Meaning check | Outcome |
|---|---|---|---|
| quantity = "three" | Fails, not an integer | Not reached | Error: quantity must be a whole number |
| quantity = 1,000,000 | Passes | Fails, above the limit of 100 | Error: quantity must be 100 or less |
| refund = 90 on an order of 42 | Passes | Fails, above the order total | Error: refund cannot exceed 42 |
| path = "docs/guide.md" | Passes | Passes, inside the project folder | The tool runs |

## Common mistake
Trusting that arguments will be shaped as described. Models make typos and can be manipulated.

```resources
article | Writing effective tools for AI agents | https://www.anthropic.com/engineering/writing-tools-for-agents | Anthropic | Error messages and responses designed for models.
docs | Handle tool calls | https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls | Anthropic | Returning results and errors to the model, including the is_error flag.
article | OWASP Top 10 for LLM Applications | https://genai.owasp.org/llm-top-10/ | OWASP | Improper output handling (LLM05) and excessive agency (LLM06): what can go wrong when model output is trusted.
```

```quiz
A tool call fails. What should the loop do? | Return an instructive error, cap retries ; Crash the loop and show an error page ; Ignore the failure silently and carry on | 0 | The model can recover when the error says what to try.
A refund tool gets refund = 90 for an order totalling 42, and the schema says refund is a number. What stops it? | The schema check, since 90 is a number ; A check in code comparing refund to the order total ; A prompt line asking the model to be careful | 1 | The value fits the schema but makes no sense. Meaning checks in code catch what types cannot.
A search tool builds a SQL string from the model's argument. What is the safe change? | Trust the argument because a model wrote it ; Ask the model to avoid special characters ; Use parameterized queries and an allowlist | 2 | Treat model output like user input: never build raw queries from it.
A tool returns an empty list because the database was down. What went wrong? | The tool should have returned an error saying it failed ; The model should have searched a second time ; Nothing, an empty list is a valid result | 0 | Empty means nothing matched, so a failure must be reported as a failure.
```

```story
A tool is asked to look up order "ABC" and crashes because order ids are numbers. If the loop crashes too, the user sees nothing. If the tool returns "No order with id ABC. Order ids are numbers like 8123. Ask the customer for the number.", the agent recovers and asks the right question. Good errors turn failures into next steps.
```

# workflow-patterns | Workflow patterns | 2 | 15
Anthropic's guide describes five patterns that most workflow-style systems are built from.

## The patterns
Prompt chaining: break a task into steps where each output feeds the next, with checks between. Routing: classify the input and send it to a specialized prompt or model. Parallelization: run independent subtasks at once, or run the same task several times and vote. Orchestrator-workers: a lead model splits an unpredictable task and delegates pieces to workers. Evaluator-optimizer: one model drafts, another critiques, and the loop repeats until the criteria are met.

## Choosing
Chain when the task splits cleanly. Route when inputs differ in kind. Parallelize for speed or confidence. Use orchestrator-workers when subtasks are not known beforehand. Use evaluator-optimizer when you have clear criteria and revision helps. Each pattern adds calls, so add one only when it improves a measured result.

The table puts the five patterns side by side.

| Pattern | Use it when | Calls it adds |
|---|---|---|
| Prompt chaining | The task splits cleanly into steps | One per step |
| Routing | Inputs differ in kind | A classifier call, then one handler |
| Parallelization | You want speed or confidence | One per subtask or vote |
| Orchestrator-workers | Subtasks are not known beforehand | A lead call to split, one per worker, and a lead call to combine |
| Evaluator-optimizer | You have clear criteria and revision helps | A draft, then a check and a revision per round |

## A worked example: prompt chaining
Task: write a product page. Step 1: extract key facts from the spec as bullets. Step 2: draft copy from the bullets. Step 3: check the copy against the bullets and list any claim not supported. Step 4: fix those. Each step is small and checkable, so errors are caught early.

```mermaid Prompt chaining feeds each small checked step into the next
flowchart TD
  S[Spec] --> F[Extract key facts]
  F --> D[Draft copy from facts]
  D --> C[Check claims against facts]
  C --> X[Fix unsupported claims]
```

## A worked example: routing
An incoming message is classified as billing, technical or sales. Each category goes to a prompt (or model) tuned for it. A cheap model does the classification, a stronger one handles the technical cases.

```mermaid Routing sends each message to the prompt or model tuned for its kind
flowchart TD
  M[Incoming message] --> C[Cheap model classifies]
  C -->|Billing| B[Billing prompt]
  C -->|Technical| T[Stronger model]
  C -->|Sales| S[Sales prompt]
```

## Parallelization with a vote
Ask the model three times to label a message. The labels come back bug, bug, billing. The three answers can differ because the model picks its words with some randomness (sampling), so the temperature must be above 0. At temperature 0 you would mostly get the same label three times. The majority is bug. That costs three calls instead of one.

Invented math: if one call is right 80 percent of the time and the three runs make independent mistakes, the majority is right when at least two are right. That is 3 × 0.8 × 0.8 × 0.2 + 0.8³ = 0.384 + 0.512 = 0.896, about 90 percent. The catch is the word independent. If the model misreads a kind of message the same way every time, three votes give the same wrong answer.

The table repeats that math for more votes, with the same 80 percent per call and independent mistakes. Each extra pair of votes buys less than the one before.

| Calls voting | Majority is right |
|---|---|
| 1 | 80.0 percent |
| 3 | 89.6 percent |
| 5 | 94.2 percent |
| 7 | 96.7 percent |

## How evaluator-optimizer stops
The loop needs an exit. A common version is: draft, then a critic checks the draft against written criteria, then the writer revises. It stops when every criterion passes or after three rounds, whichever comes first.

Two failures to watch for. A critic with vague criteria always finds something to improve, so the loop runs to the cap. Or the revisions flip back and forth between two versions. Confirm which one you have by saving every round. If the critic raises a new complaint each round and the draft keeps changing, your criteria are too vague. If round 3 looks almost the same as round 1, the revisions are flipping back and forth. Either way, cut the loop and rewrite the criteria so each one can be answered pass or fail.

```mermaid The evaluator-optimizer loop has an exit, either every criterion passes or three rounds are used up
flowchart TD
  D[Writer drafts] --> C[Critic checks criteria]
  C --> Q{Pass or round 3?}
  Q -->|No| R[Writer revises]
  R --> C
  Q -->|Yes| O[Stop]
  class Q focus
```

## When one prompt beats all of them
Before adding a pattern, run the single plain call on your test set. If it gets 90 of 100 right, the four-step chain above has to beat 90 to justify four times the calls. Often the better fix is a clearer prompt, not more structure.

## Common mistake
Adding patterns without measuring. Each extra call adds cost, time and failure points.

```resources
article | Building effective agents | https://www.anthropic.com/engineering/building-effective-agents | Anthropic | Defines and illustrates all five patterns.
repo | Claude Cookbooks: agent patterns | https://github.com/anthropics/claude-cookbooks/tree/main/patterns/agents | Anthropic | Runnable notebooks for each pattern.
course | Agentic AI | https://www.deeplearning.ai/courses/agentic-ai/ | Andrew Ng, DeepLearning.AI | Reflection, tool use, planning and multi-agent, with evals.
```

```quiz
Which pattern fits "different inputs need different handling"? | Routing to specialized handlers ; Prompt chaining in a fixed order ; Evaluator-optimizer feedback loops | 0 | Routing classifies the input and sends it to a specialized handler.
You vote over 5 calls, but the model misreads one kind of message the same way every time. What happens on that kind? | The majority fixes the mistake ; The majority is wrong too, as mistakes repeat ; Extra calls teach the model to improve | 1 | Voting only cancels out mistakes that differ between calls. A mistake the model repeats gets repeated in the majority.
A product page needs facts extracted, copy drafted, then checked against the facts. Which pattern is this? | A router between handlers ; An orchestrator and workers ; A prompt chain of steps | 2 | A fixed sequence where each step feeds the next is a chain.
```

```story
A newsroom has an assembly line: a reporter drafts, an editor checks facts, a copy editor polishes. Nobody decides the order each time. That newsroom is one of the five patterns, a chain. The others change the shape: a desk that sends each story to the right editor, three reporters checking the same fact, or an editor who hands out pieces as the story grows.
```

# agent-memory | Memory and state | 2 | 12
The model remembers nothing between calls. Memory is whatever your system stores and puts back in the window.

## Kinds of memory
Working memory is the current context window, the one place the model can actually see. The other kinds are stored outside it and only matter once they are put back in. Session memory is a log or summary of what happened so far. Long-term memory is facts and preferences stored outside the window, usually as files, a database or a vector index, and retrieved when relevant. Procedural memory is instructions and skills that tell the agent how to do things.

## Practical design
Start with plain files: a progress notes file, a decisions log and a project file of standing instructions that is loaded at the start of every session (for example CLAUDE.md or AGENTS.md). They are plain text, so you can read them, edit them and compare versions in git. Add retrieval only when the notes outgrow the window. The hard problems are choosing what to write down, avoiding stale or wrong facts, and forgetting on purpose. Anything the agent writes to memory can be wrong, so treat it as a hypothesis to verify.

## A worked example: a notes file
After each session the agent appends to notes.md: "3 May: User prefers metric units. 3 May: Project uses PostgreSQL 15. 3 May: Decision, use a queue for emails." At the next session it reads the file first. Plain text, readable by you, editable by you. Later, if the file grows, add search over it.

## How a note gets back into the window
The model does not read your notes file by itself. At the start of each session your harness reads the file and pastes it into the prompt, so the text is in the window again.

That has a price. Invented numbers: the file is 2,000 tokens and grows by 200 tokens a session. Every call carries it. After 40 sessions it is 10,000 tokens on every call, even when most lines are irrelevant. That is the point where search over the notes starts to pay for itself.

```mermaid A notes file that grows by 200 tokens a session adds 10,000 tokens to every call after 40 sessions, with invented numbers
xychart-beta
  x-axis "sessions so far" [0, 10, 20, 30, 40]
  y-axis "notes tokens on every call" 0 --> 10000
  bar [2000, 4000, 6000, 8000, 10000]
```

```mermaid Memory is just a file the harness pastes back into the prompt at the start of each session
flowchart TD
  S1[Session ends] -->|Agent appends| N[(notes.md)]
  N -->|Harness reads at start| H[Harness]
  H -->|Pasted into prompt| W[Context window]
  W --> M[Model call]
  class N focus
```

## What goes wrong: stale memory
A note says "The project uses PostgreSQL 15." The team has since moved to 16. The agent reads the note, trusts it, and writes code for the old version. The symptom is an agent acting confidently on a fact that was once true. Confirm it by looking at what the harness actually put in the prompt for that call, and find the line that holds the old fact. Check the date on that note. Fix it by dating every entry and having the agent check anything it can look up, such as a version, before acting on it.

## When memory is the wrong tool
Do not copy into notes what the agent can read from the source. A list of files in the repo goes out of date on the next commit, while the repo itself is the current source of truth for what exists. Use memory for what cannot be recovered: what the user prefers, which approach was chosen and why, and which attempts already failed.

## Common mistake
Setting up a vector database and an extraction pipeline on day one, then finding the agent only needed a 30-line notes file.

```resources
repo | mem0 | https://github.com/mem0ai/mem0 | Mem0 | A memory layer for agents with extraction and retrieval.
repo | Letta | https://github.com/letta-ai/letta | Letta | Stateful agents with self-managed memory, from the MemGPT line of work.
article | Effective context engineering for AI agents | https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents | Anthropic | Structured note-taking and just-in-time retrieval.
```

```quiz
Where should an agent's notes start out? | In plain files it can read and you edit ; In a vector database the agent maintains ; In the model's weights through fine-tuning | 0 | Files are simple and inspectable. Add retrieval only when you need it.
Why treat remembered facts as hypotheses? | They always cost too much to store ; They can be wrong or out of date ; Models tend to ignore saved notes | 1 | Memory written by a model can contain errors or go out of date, so check what you can look up.
An agent's notes say the API limit is 100 requests a minute, but the provider changed it last week. What should the agent do before relying on the note? | Trust it, since it was saved on purpose ; Check the provider's current docs, since the limit can be looked up ; Delete the whole notes file and start over | 1 | A fact that can be looked up should be checked, because saved notes go out of date.
```

```story
Picture a barista with no memory at all, who keeps a card per regular behind the counter. When you walk in, they pull your card and read "flat white, oat milk". Agent memory is the same two steps: decide what is worth writing on the card, and pull the card back when you arrive.
```

# persisting-conversations | Saving and resuming agent conversations | 2 | 10
An agent's state is its message list. Save it and you can resume, audit and re-read exactly what happened.

## What to store
The full ordered list of messages, including tool calls and tool results, plus metadata: user id, model and prompt version, timestamps and token counts. Store one row per message or one document per conversation. Include a version of your message format so old conversations still load after you change it.

## Practical rules
Keep each conversation private to its owner. Redact secrets and personal data you do not need. Add a retention limit. Be able to delete one user's conversations on request, which is why every record carries a user id. Copies such as backups and summaries may hold the same data. Treat stored history as untrusted: it may contain injected text from earlier tool results.

## A worked example: what a saved record looks like
conversation_id, user_id, created_at, model "sonnet-5-5", prompt_version "v14", messages: [ {role: user, text: ...}, {role: assistant, tool_call: search(...)}, {role: tool, result: ...}, ... ]. When the user returns, load the list, add the new message and send. If it is too long, summarize the oldest part and keep the last few turns.

Here is the same record laid out as JSON, with invented values. Each tool call and its result share an id, which is what lets a trim or a crash check keep them paired.

```json
{
  "conversation_id": "c_1042",
  "user_id": "u_77",
  "created_at": "2026-03-02T09:14:00Z",
  "model": "sonnet-5-5",
  "prompt_version": "v14",
  "format_version": 2,
  "messages": [
    {"role": "user", "text": "Where is my last order?"},
    {"role": "assistant", "tool_call": {"id": "t1", "name": "search_orders", "args": {"customer_email": "ana@example.com"}}},
    {"role": "tool", "tool_call_id": "t1", "result": "Order 8123, shipped Tuesday, $42"},
    {"role": "assistant", "text": "Order 8123 shipped on Tuesday."}
  ]
}
```

## Resuming, step by step
1. Load the saved messages by conversation id.
2. Check the owner is the current user.
3. Check the format version and convert old records if needed.
4. Append the new user message and save it right away.
5. Count tokens. If over budget, trim or summarize.
6. Send, then save each reply and tool result as it arrives, not once at the end.

Saving as you go matters. If the process dies midway, you lose one step, not the whole conversation.

## What goes wrong: a crash between call and result
The assistant's tool call was saved, then the server crashed before the tool result was written. On resume, the history has a call with no result. Anthropic's and OpenAI's APIs both reject a tool call that has no matching result, and a result that points at a call that is not in the history, so the symptom is an error that only affects conversations that were interrupted. Confirm it by scanning saved conversations for tool calls without a matching result. The tool may have run even though its result was lost. For a harmless read, such as a search, retry or drop the call. For a tool that changes something, such as a refund or an email, add a result like "unknown: this call may or may not have completed, check before retrying", or give the call an idempotency key (a unique id the tool uses to ignore a repeat) so a retry is safe.

```mermaid A crash between saving the call and saving the result leaves a call with no result
sequenceDiagram
  participant S as Server
  participant H as Saved history
  participant T as Tool
  S->>H: Save the assistant tool call
  S->>T: Run the tool
  Note over S,T: Server crashes here
  Note over H: Call is saved, result is not
  S->>H: Later, resume and load history
  Note over S,H: Provider rejects a call with no result
```

## Trimming without losing the goal
Suppose a conversation has 40 messages and is too long. Keep the first message, since it holds the original goal. Replace messages 2 to 33 with one summary message. Keep the last 7 messages as they are (count messages, not exchanges). That is 1 + 1 + 7 = 9 messages instead of 40. Check that a tool call and its result are kept or dropped together, never split. If message 34 is a tool result whose call is message 33, move the cut back one so both are kept, giving 1 + 1 + 8 = 10 messages.

Do the trimming on a copy. Send the 9-message version to the model, but keep all 40 messages in storage and store the summary as an extra record. Then you can still audit what happened, and you can re-summarize differently later.

```mermaid Trimming keeps the first message, one summary and the last messages, which is 9 messages instead of 40
flowchart TD
  A[40 messages] --> B[Message 1, the goal]
  A --> C[Messages 2 to 33, one summary]
  A --> D[Last 7 messages, unchanged]
  B & C & D --> E[9 messages sent]
  class E good
```

## Common mistake
Trimming messages by cutting in the middle of a tool call, leaving a result with no matching call.

```resources
article | Effective context engineering for AI agents | https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents | Anthropic | Trimming and summarizing long histories.
docs | LangGraph persistence | https://docs.langchain.com/oss/python/langgraph/persistence | LangChain | Checkpointing agent state as a built-in feature.
repo | 12-Factor Agents | https://github.com/humanlayer/12-factor-agents | HumanLayer | Own your state and make agents resumable.
```

```quiz
What is the state of a simple agent? | Its list of messages so far ; Its model weights, saved to disk ; Its API key and account login | 0 | The messages are the whole state, so storing them is enough to resume.
After a crash you load a history whose last message is a tool call with no result. What do you do before sending? | Send it as it is, since the model will notice ; Drop the call or add a result saying it did not finish ; Delete the whole conversation and start over | 1 | The API rejects a call without a result, so repair it first. Dropping it or adding a placeholder keeps the rest of the history.
A user asks you to delete their data. What does this imply for saved conversations? | Nothing, because chats are anonymous once the model has read them ; Delete only the user's account row, since chats are separate ; Find their chats by user id and erase them | 2 | Stored history is personal data, so keep it private, deletable and short-lived.
```

```story
A user starts a research task on Monday, closes the tab, and returns Wednesday. If the app saved the conversation, the agent picks up from the saved messages, with older ones summarized if the history was long. If not, the user starts over. Saving the message list is the simplest way to give an agent continuity.
```

# multi-agent | Multi-agent systems | 3 | 15
Several agents help when work is parallel and independent. They hurt when work is tightly coupled.

## When it helps
Research across many sources, audits of many files and independent verification all split cleanly. Each subagent gets its own context window, so the lead agent's context stays small. In Anthropic's multi-agent research system, a lead agent plans and spawns subagents that search in parallel, and the setup beat a single agent by 90.2% on Anthropic's own research test, but used about 15 times the tokens of a normal chat (a single agent used about 4 times).

## When it hurts
Coding tasks where pieces depend on each other, because agents make conflicting assumptions. Anything where coordination cost exceeds the work. Remember that token use multiplies with each agent. Rules of thumb: give each subagent a clear objective, output format and boundaries, scale the number of agents to the difficulty, and have the lead synthesize rather than relay.

## A worked example: when it pays off
Question: "Compare five competitors' pricing." Five subagents each research one competitor and return a short structured summary. The lead agent merges them into a table. Time drops from one long run to five short ones in parallel. Token use goes up because each agent reads its own sources.

```mermaid The lead agent sends one slice to each subagent and merges five short summaries into a table
flowchart TD
  Q[Compare five competitors] --> L[Lead agent plans]
  L --> A1[Subagent 1] & A2[Subagent 2] & A3[Subagent 3] & A4[Subagent 4] & A5[Subagent 5]
  A1 & A2 & A3 & A4 & A5 -->|Short summaries| M[Lead merges]
  M --> T[Pricing table]
  class L focus
```

## A case where it hurts
Two agents editing different parts of the same program must agree on the interface between them. If they decide separately, the pieces do not fit. Keep tightly coupled work in one context.

## The token arithmetic
Invented numbers. One agent researches five competitors alone and uses 100,000 tokens in one long run.

With five subagents, each reads about 60,000 tokens of its own sources, so 300,000 in total. That is more than the 20,000 a lone agent spends per competitor because each subagent starts with no memory of the others, so it repeats setup, searches more widely and reads pages the lone agent would have skipped. The lead adds 20,000 for planning and merging, which makes 320,000. That is 3.2 times the tokens. In return the five readings happen at once, so waiting time drops to roughly one subagent's run.

The table sets the two setups side by side, using the same invented numbers.

| Setup | Total tokens | Waiting time | What the lead reads |
|---|---|---|---|
| One agent, five competitors in turn | 100,000 | One long run | Everything, 100,000 |
| Lead plus five subagents | 320,000 (5 x 60,000 plus 20,000) | About one subagent's run | Five summaries, 1,500 |

The lead does not see the 300,000. It sees five summaries of about 300 tokens each, 1,500 tokens in total.

## What goes wrong: summaries lose detail
The lead can only use what a subagent chose to report. If the lead later needs a number that the subagent read but left out, it is gone. A second symptom is vague task wording. If you tell two subagents "research pricing", both may cover the same competitor while a third is skipped. Confirm it by reading the task text each subagent received, then checking the merged table for duplicates and gaps. Give each one a distinct slice, a fixed output format, and a list of the fields you need.

## Common mistake
Choosing multi-agent because it looks impressive. Use it when the work splits cleanly.

```resources
article | How we built our multi-agent research system | https://www.anthropic.com/engineering/multi-agent-research-system | Anthropic | Architecture, prompt lessons, evaluation and token cost.
article | Don't build multi-agents | https://cognition.ai/blog/dont-build-multi-agents | Cognition | The counterargument: shared context and conflicting decisions.
course | AI Agents in LangGraph | https://www.deeplearning.ai/short-courses/ai-agents-in-langgraph/ | DeepLearning.AI and LangChain | Builds one agent in LangGraph with persistence and human review, the base you need before wiring several agents together.
```

```quiz
Which task suits several agents best? | Searching twenty independent sources ; Editing one function in a single file ; A tightly coupled multi-module refactor | 0 | Independent subtasks parallelize with little conflict.
What is a main cost of multi-agent systems? | Each agent needs its own copy of the model weights ; Token use that grows with every agent added ; Subagents cannot use any tools at all | 1 | Each agent carries its own context, so total tokens rise quickly.
Two agents edit different parts of a program that must agree on an interface. What goes wrong? | They always agree because they share one prompt ; The lead agent silently overwrites one of the results ; They assume different things and the pieces clash | 2 | Tightly coupled work belongs in one context.
```

```story
A newspaper researching a big story splits it: one reporter checks the financials, one interviews former employees, one reads court filings. They work at once and an editor combines the findings. Multiple agents help in the same situation: independent pieces of research done in parallel. They do not help when the pieces depend on one another.
```

# long-running-agents | Long-running agents | 3 | 15
Work that outlasts one context window needs structure: a plan, a progress file and clean handoffs.

## The problem
Over hours, context fills, coherence drops and agents may wrap up early. Some models show context anxiety: as the window fills they start wrapping up, even though work remains. Compaction summarizes in place. A reset clears the window and starts a fresh agent with a written handoff. Resets give a clean slate at the cost of writing a good handoff.

## A workable design
An initializer agent expands the spec into a feature list and a setup script. A worker agent takes one feature at a time, commits and updates a progress file. An evaluator agent runs the app and the tests and reports failures with evidence. Tests and the git log are the shared state. Each agent starts by reading the progress file and the latest commits.

This is a blend of two Anthropic write-ups (linked below). The first has the initializer and a coding agent, which is our worker. The second adds the evaluator and uses a planner in place of our initializer.

```mermaid Three agents share the progress file, the git log and the tests, so each one can start cold
flowchart TD
  I[Initializer agent] -->|Expands the spec| F[Feature list and setup script]
  F --> W[Worker agent, one feature]
  W -->|Commit and update| P[(Progress file and git log)]
  P --> E[Evaluator agent]
  E -->|Runs app and tests| R[Failures with evidence]
  R --> W
  class E focus
```

## A worked example: a progress file
progress.md: "Goal: build the invoicing app. Features done: login, customer list. In progress: invoice PDF export. Next: email sending. Tests: 24 passing, 2 failing (export). Notes: use the existing PDF library." A new agent session reads this file and the latest commit messages and can pick up where the last one stopped.

The same progress file as a feature list. Only a passing test moves a feature to done, so the agent's own opinion never counts as finished.

| Feature | Status | Test result |
|---|---|---|
| Login | Done | Passing |
| Customer list | Done | Passing |
| Invoice PDF export | In progress | 2 failing |
| Email sending | Next | Not written yet |

## Evaluator agents
A separate agent runs the app and tests it, then writes what it found. The worker agent fixes those issues. Splitting the roles helps, because a checker can be tuned to be skeptical far more easily than a worker can be made critical of itself. The checker is still a model and tends to be generous at first, so read its reports and tighten its prompt until it fails work you would fail.

## Compaction versus reset in numbers
Invented numbers. The window holds 100,000 tokens and after hours of work 90,000 are used.

Compaction replaces the history with a 5,000-token summary and the same agent carries on. It is quick, but each summary is made from the last one, so small errors and lost details can stack up.

A reset starts a new agent with a 1,000-token handoff plus the files it reads itself. It costs more effort to write the handoff, but the new agent sees the real files, not a retelling.

After compaction the agent starts at 5,000 of 100,000 tokens, so 95,000 are free. After a reset it starts at 1,000 plus whatever files it opens, say 20,000 more, so about 21,000 are used and 79,000 are free. The reset gives up some room to get a clean start from real files.

```mermaid Compaction keeps the same agent working from a summary, while a reset starts a fresh agent that reads the real files
flowchart TD
  subgraph C[Compaction]
    C1[90,000 tokens of history] --> C2[5,000 token summary]
    C2 --> C3[Same agent carries on]
  end
  subgraph R[Reset]
    R1[90,000 tokens of history] --> R2[1,000 token handoff]
    R2 --> R3[New agent reads the real files]
  end
```

## What goes wrong: declaring victory early
The symptom is an agent that announces "done" with five of twenty features working. The cause is that it judges completion by feel. Confirm it by comparing its claim with the feature list and the test results. The fix is to make the list the definition of done. Each feature has a status, and only a passing test may change it to done. The run is finished when the list is complete, not when the agent says so (a budget or time limit can still stop it earlier).

## What a handoff must contain
The example progress file lists goals and state. Good handoffs also hold three more items:

1. The exact next step.
2. What was tried and failed, so the next agent does not repeat it.
3. How to run the tests.

Without the second item, a fresh agent can rebuild the same dead end.

## Common mistake
Letting one context run for hours with no plan and no progress file. Quality drops. Whether you fix it with compaction or a reset depends on the model: some start wrapping up early as the window fills, and for those a reset with a handoff works better. Newer models may cope with compaction alone, so test yours.

```resources
article | Effective harnesses for long-running agents | https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents | Anthropic | Initializer and coding agents with progress artifacts.
article | Harness design for long-running application development | https://www.anthropic.com/engineering/harness-design-long-running-apps | Anthropic | Planner, generator and evaluator over multi-hour runs.
```

```quiz
What is the difference between a reset and compaction? | A reset starts fresh, compaction trims in place ; Reset and compaction are two names for one thing ; Compaction deletes files from the project folder | 0 | A reset avoids lingering context anxiety but needs a good handoff.
What is the shared state between sessions of a long task? | The chat window that the user keeps open ; Files such as notes, tests and git history ; The model's own memory from earlier runs | 1 | Durable artifacts let a fresh agent pick up the work.
An agent marks its own work as done, but half the feature is missing. What helps? | A separate evaluator that tests the app ; A longer prompt that says to be thorough ; A larger context window for the same agent | 0 | A separate checker can be tuned to be skeptical and gives the worker concrete failures to fix. The same agent, a longer prompt or more context does not change who is grading.
```

```story
Picture engineers working in shifts. Each new engineer arrives knowing nothing about the last shift. They read the handover notes, check the log and carry on. A long agent run works the same way: every new session starts cold, so progress has to live in a progress file, commits and tests.
```

