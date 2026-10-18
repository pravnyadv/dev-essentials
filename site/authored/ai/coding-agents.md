# agentic-coding-workflow | The agentic coding workflow | 1 | 15
Explore, plan, implement, verify. The step people skip is verify, and it is the one that decides whether you can trust the result.

## What it is
A coding agent reads your code, edits files and runs commands in a loop. The reliable way to use one has four phases. Explore: let it read the relevant code and answer questions before changing anything. Plan: have it write the approach and review it yourself. Implement: let it work in small steps. Verify: run tests, linters and the app itself, and give the agent those same checks so it can fix its own failures.

## Why verification matters
Google's agentic engineering paper puts the difference between vibe coding and engineering in one place: how output is verified. Tests check the deterministic parts. Evals check the parts that are not. If the agent can run the check, it iterates to green on its own. If only you can run it, you are the bottleneck and the agent stops at "looks right".

## Habits that pay off
Start each task from a clean branch or worktree. Keep tasks small enough to review as one diff. Ask the agent to write a failing test first for bugs. Correct it early, because a wrong direction compounds. Clear context between unrelated tasks.

## A worked example: a bug fix
Explore: "Read the code around the checkout total and explain how the total is computed." Plan: "Propose a fix for rounding errors. Do not change code yet." Implement: "Write a failing test showing the rounding error, then fix it." Verify: run the full test suite and read the diff. Four short steps, each reviewable, beat one huge prompt.

## Keeping the agent honest
Ask for the diff, not a summary. Ask "what did you not verify?" Treat it like a very fast junior colleague: confident, tireless, sometimes wrong.

## Common mistakes
Starting with implementation. Letting the diff grow to hundreds of lines before looking. Skipping tests because the code "looks right".

```resources
article | Claude Code: Best practices for agentic coding | https://www.anthropic.com/engineering/claude-code-best-practices | Anthropic | The canonical workflow guide: explore, plan, code, commit.
article | Industrial Agentic Engineering | https://research.google/pubs/industrial-agentic-engineering/ | Google Research | Specification, harness, trajectory, verification and meta-debugging.
article | The New Software Lifecycle | https://addyosmani.com/blog/new-sdlc-vibe-coding/ | Addy Osmani | Why verification separates vibe coding from agentic engineering.
course | Claude Code: A Highly Agentic Coding Assistant | https://www.deeplearning.ai/short-courses/claude-code-a-highly-agentic-coding-assistant/ | DeepLearning.AI and Anthropic | Short free course on exploring, testing and refactoring with an agent.
docs | Claude Code overview | https://code.claude.com/docs/en/overview | Anthropic | Install, commands and how the tool is organized.
course | Claude Code in Action | https://anthropic.skilljar.com/claude-code-in-action | Anthropic | Free course on tools, context, plan mode, hooks and the SDK.
```

```quiz
What lets a coding agent fix its own mistakes? | A bigger model ; Running tests and checks it can see the output of ; A longer prompt | 1 | Feedback it can observe, like failing tests, lets it iterate without you in the loop.
Which phase do people most often skip? | Plan ; Verify ; Implement | 1 | Skipping verification is how plausible but wrong code reaches review.
```

```story
Two developers ask an agent to add a discount feature. One says "add discounts" and merges whatever comes back. The other asks the agent to read the checkout code first, proposes a plan, reviews it, then asks the agent to write a failing test and make it pass. The first spends the next week fixing surprises. The second ships on Friday.
```

# being-ambitious | Being more ambitious with models | 1 | 12
Most people use models for small tasks. Felix Rieseberg, who works on Claude, describes four ways to ask for more.

## What it is
His tutorial names four kinds of ambition. Speed is the same work in less time. Altitude is asking for the outcome instead of the task, for example "keep our app crash-free" instead of "fix this crash". Depth is pushing the model to use the tools and rigor a field expert would. Range is drawing on several fields instead of the one the task sits in.

## How to apply it
For altitude, ask what you want to happen next and give the model the data and access to do it, such as crash reports and a machine to reproduce on. For depth, insist on real instruments like databases and statistical tests instead of summary tables, and ask the model to challenge your assumptions against raw data. The cost is that you need verification in proportion to the ambition. A higher-level goal without checks is how errors get big.

## A worked example: climbing altitude
Level 1: "Write a summary of last month's sales." Level 2: "Tell me what changed last month, why, and what we should do about it." Level 3: "Design a better way for leadership to catch problems early than a monthly report, and show from our history that it would have caught last spring's dip sooner." Each level gives the model more of the goal and less of the steps.

## What must come with ambition
Access (data the model can read), checks (a way to see if it worked), and limits (what it must not touch). Without checks, a bigger goal just makes bigger mistakes.

## Common mistake
Asking for huge outcomes with no data. "Make my business grow" fails. "Find the three biggest reasons customers cancel, using these exports" works.

```resources
article | How to be more ambitious: A tutorial for humans with models | https://felixrieseberg.com/how-to-be-more-ambitious-a-tutorial-for-humans-with-models/ | Felix Rieseberg | The source: altitude, depth and range with worked examples.
video | Software Is Changing (Again) | https://www.youtube.com/watch?v=LCEmiRjPEtQ | Andrej Karpathy at Y Combinator | Talk on software 1.0, 2.0 and 3.0 and designing for agents.
```

```quiz
"Keep our app crash-free" instead of "fix this crash" is an example of which kind? | Speed ; Altitude ; Range | 1 | Altitude means asking for the outcome rather than the individual task.
What must grow with your ambition? | Prompt length ; Verification ; Temperature | 1 | The bigger the goal, the more checks you need to trust the result.
```

```story
Most people use an AI like a search box: one question, one answer. Someone who works on Claude noticed that the people getting astonishing results ask differently. Not "fix this crash" but "keep the app crash-free", then they give the agent the tools to do it. Same model, bigger ask.
```

# project-memory-files | CLAUDE.md and AGENTS.md | 1 | 10
A short file at the repo root that the agent reads at the start of every session. It is how you stop repeating yourself.

## What it is
AGENTS.md is a community convention read by Claude Code, Codex, Cursor, Aider and others. Claude Code also reads CLAUDE.md. The file holds what an agent cannot infer from the code: how to run tests and the build, the project layout, naming and style rules that differ from defaults, and things to never do.

## What belongs in it
Commands (install, test, lint, run), architecture in a few lines, conventions that are not obvious, and sharp edges such as "do not edit generated files". Keep it short, since it is loaded into every session and each line competes for attention. When the agent makes the same mistake twice, add one line. Move long reference material into separate files and link to them so they load only on demand. Prune lines that stop mattering.

## A worked example: a good file
Run: pnpm install, pnpm test, pnpm dev. Layout: app code in src/, tests in spec/. Conventions: functional components, no default exports. Never: edit src/generated, commit .env. Gotcha: tests need Docker running. Eight lines. Every line prevents a repeated correction.

## Growing it
When the agent makes the same mistake twice, add one line. When a line stops mattering, delete it. If the file passes about 100 lines, move details into other files and link to them.

## Common mistake
Pasting the whole architecture document. The file loads every session, so only keep what changes behavior.

```resources
tool | AGENTS.md | https://agents.md/ | Community | The shared format that most coding agents read.
docs | Claude Code memory | https://code.claude.com/docs/en/memory | Anthropic | How CLAUDE.md files are discovered, imported and layered.
article | Claude Code: Best practices for agentic coding | https://www.anthropic.com/engineering/claude-code-best-practices | Anthropic | Includes guidance on writing an effective CLAUDE.md.
```

```quiz
What belongs in CLAUDE.md? | Everything about the project ; What the agent cannot infer from code: commands, conventions, sharp edges ; The full API reference | 1 | It loads every session, so keep it to high-value facts and link to the rest.
The agent repeats the same mistake. What do you do? | Retype the correction each time ; Add one line to the memory file ; Switch tools | 1 | A single line in the file fixes the mistake for every future session.
```

```story
Every morning you re-explain to your assistant: "we use pnpm, tests live in /spec, never edit the generated folder". By Friday you are tired of saying it. A short file at the root of the project says it once, and the agent reads it at the start of every session.
```

# skills-hooks-commands | Skills, hooks and slash commands | 2 | 15
Three ways to extend an agent. Skills teach it a procedure, hooks force a rule, commands are saved prompts.

## What it is
A skill is a folder with a SKILL.md and optional scripts. The agent sees only its name and description until the task matches, then loads the rest. This keeps context small while making specialized procedures available. A hook is a script the harness runs at a fixed point, such as before a tool call or after a file edit. It is deterministic, so it enforces what a prompt can only request. A slash command is a reusable prompt you trigger by name.

## Choosing between them
If the agent should know how to do something when relevant, write a skill. If something must happen every time without exception, such as formatting on save or blocking a commit with secrets in it, write a hook. If you keep typing the same request, make a command. Prompts ask, hooks guarantee.

## A worked example: choosing
Goal: always format files after the agent edits them. Not a skill (the agent might forget) and not a command. A hook runs the formatter after every edit, guaranteed. Goal: teach the agent your release checklist, only when someone says "prepare a release". A skill, because it loads only when relevant. Goal: you often type "review the last commit for security issues". Make it a command and run it with one word.

## Common mistake
Using the prompt for rules that must never break. Prompts ask. Hooks enforce.

```resources
repo | anthropics/skills | https://github.com/anthropics/skills | Anthropic | Official example skills and the format specification.
article | Equipping agents for the real world with Agent Skills | https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills | Anthropic | Why skills load progressively and how to design them.
docs | Claude Code hooks | https://code.claude.com/docs/en/hooks | Anthropic | Events, matchers and examples for deterministic control.
docs | Claude Code skills | https://code.claude.com/docs/en/skills | Anthropic | Authoring and organizing skills.
repo | awesome-claude-code | https://github.com/hesreallyhim/awesome-claude-code | hesreallyhim | Curated skills, hooks, commands and workflows from the community.
repo | superpowers | https://github.com/obra/superpowers | Jesse Vincent | A popular skill collection for planning, TDD and review workflows.
```

```quiz
A rule must apply every single time, with no exceptions. What do you use? | A line in the prompt ; A hook ; A skill | 1 | Hooks are code run by the harness, so they do not depend on the model remembering.
Why do skills keep context small? | They are compressed ; Only name and description load until the task needs the rest ; They run on a smaller model | 1 | Progressive disclosure: the full instructions load only when relevant.
```

```story
A restaurant has three kinds of instructions. A recipe book the chef opens when needed (a skill). A rule enforced by the kitchen's equipment, like an oven that refuses to go above 250 degrees (a hook). A button on the till that fires a standard order (a command). Different tools for different needs.
```

# subagents-and-worktrees | Subagents and parallel worktrees | 2 | 15
Subagents give a task its own context. Worktrees give each agent its own copy of the repo. Together they let you run work in parallel without collisions.

## What it is
A subagent is a worker the main agent starts for a focused job, such as searching a codebase or reviewing a diff. It has its own context window and returns only a summary, so the main conversation stays clean. A git worktree is a second checkout of the same repository on its own branch in its own folder.

## Why it matters
Two agents editing the same checkout overwrite each other and test against each other's half-finished changes. Give each its own worktree and branch, then merge. Use read-only subagents freely for research since they cannot conflict. Use them to isolate noisy work: a subagent that reads fifty files and returns three lines saves your main context. Do not spawn agents for small steps, since each one carries startup cost.

## A worked example: three jobs in parallel
Job 1 (worktree A): add a search feature. Job 2 (worktree B): fix a login bug. Job 3 (read-only subagent): survey how errors are logged across the codebase. Jobs 1 and 2 cannot overwrite each other, job 3 returns ten lines. You review each result and merge one at a time.

## When not to
For a five-minute change, one session is simpler. Each agent adds startup cost and one more thing to review.

## Common mistake
Running two agents in the same folder. Their half-finished edits collide and tests fail for confusing reasons.

```resources
docs | Claude Code subagents | https://code.claude.com/docs/en/sub-agents | Anthropic | Defining custom subagents with their own tools and prompts.
article | How we built our multi-agent research system | https://www.anthropic.com/engineering/multi-agent-research-system | Anthropic | Orchestrator and subagent design, with real cost and failure data.
docs | git worktree | https://git-scm.com/docs/git-worktree | Git | The reference for creating and removing linked working trees.
```

```quiz
Why run two agents in separate worktrees? | Git requires it ; They would otherwise overwrite each other's files and tests ; It is faster to type | 1 | A shared checkout means shared half-finished edits. Separate worktrees isolate them.
What does a subagent return to the main agent? | Its whole context ; A focused summary ; Nothing | 1 | The point is to keep the main context clean by returning only the result.
```

```story
You ask two assistants to renovate two rooms. If they share one workbench they trip over each other's tools. Give each a separate workbench and room, and they finish at the same time. Git worktrees are separate workbenches for code, and subagents are assistants with their own notebooks.
```

# model-routing-workflows | Model routing and dynamic workflows | 3 | 15
Let a strong model write the plan as a script, and let cheaper models run it. The plan lives in code, not in a context window.

## What it is
Claude Code supports dynamic workflows: Claude writes a JavaScript script that orchestrates many subagents, a runtime runs it in the background, and your session sees only the final answer. Intermediate results live in script variables, so the main context does not fill with transcripts. The script can also apply quality patterns, such as having independent agents try to refute each finding before it is reported.

## The routing idea
Match model size to the job. A strong model plans and signs off. A small fast model scans every file in parallel. A mid-size model makes edits, each in an isolated copy. A verifier checks each result before it counts. Social media posts describe this as "Opus plans, Haiku scans, Sonnet ships". The posts are marketing, but the underlying pattern is real and documented. Treat any exact recipe as a starting point and measure cost and quality on your own task.

## When to use it
Codebase-wide audits, large mechanical migrations, and research that needs cross-checking. Not for a single focused change, where one session is cheaper and simpler.

## A worked example: a security audit
Stage 1: a small, cheap model reads every file and flags suspicious ones (fast, read-only). Stage 2: a mid-size model proposes a fix for each flag in its own copy. Stage 3: a different agent tries to refute each finding. Stage 4: the large model reads only the confirmed ones and decides what ships. Cost drops because the expensive model sees little.

## A note on the hype
Posts describing this as a trick that "saves huge amounts" are exaggerated. The saving is real when the work is large and parallel. For small tasks it is overhead. Measure cost and quality on your own task.

## Common mistake
Using the pattern for a focused change. One session is cheaper.

```resources
docs | Orchestrate subagents at scale with dynamic workflows | https://code.claude.com/docs/en/workflows | Anthropic | The reference for workflows, /deep-research and ultracode.
article | How we built our multi-agent research system | https://www.anthropic.com/engineering/multi-agent-research-system | Anthropic | Why parallel subagents help and what they cost in tokens.
article | Building effective agents | https://www.anthropic.com/engineering/building-effective-agents | Anthropic | Orchestrator-workers and parallelization patterns this builds on.
```

```quiz
Where do intermediate results live in a dynamic workflow? | In the main context ; In script variables ; In a database | 1 | That is the point: the main context only receives the final answer.
When is a workflow overkill? | A 500-file migration ; A single focused bug fix ; A codebase audit | 1 | One session is cheaper and simpler for a small, focused change.
```

```story
A big migration touches 500 files. One assistant doing everything would run out of memory and take days. Instead a lead assistant writes a plan as a small program: scan all files in parallel with cheap helpers, fix them in separate copies, check each fix, and report only what survived. The lead sees the summary, not 500 transcripts.
```

# spec-driven-development | Spec-driven development | 2 | 12
Write down what done looks like before the agent starts. The spec is what you review, and the tests are how you check it.

## What it is
You describe the behavior, constraints and acceptance checks in a short document. The agent turns it into a plan, then code. When it goes wrong, you fix the spec or the checks, not the generated code by hand. Google's framing is the same: define success with tests and automated checks first, then let the agent work, then verify.

## Why it works
Most agent failures are underspecified tasks. A spec forces the missing decisions to surface while they are cheap. It also gives a stable document to hand to a fresh agent after a context reset. Keep specs small and testable. A spec nobody can verify is a wish.

## A worked example: a tiny spec
Feature: password reset by email. Behavior: user enters email, receives a link valid for 30 minutes, link works once. Edge cases: unknown email shows the same message as a known one, so attackers cannot discover accounts. Checks: a test for expired links, a test for reuse, a test for unknown email. The agent now knows what done means.

## What the spec buys you
Most failures come from decisions nobody made out loud. A spec forces them early. It also survives context resets: a fresh agent can pick up from the spec.

## Common mistake
Specs nobody can check. If you cannot say how you would test a line, rewrite the line.

```resources
repo | GitHub Spec Kit | https://github.com/github/spec-kit | GitHub | Toolkit for spec, plan and task workflows with coding agents.
course | Spec-Driven Development with Coding Agents | https://www.deeplearning.ai/short-courses/spec-driven-development-with-coding-agents/ | DeepLearning.AI and JetBrains | Short course on constitutions, specs and plan, implement, verify.
article | Industrial Agentic Engineering | https://research.google/pubs/industrial-agentic-engineering/ | Google Research | Verifiable specifications as the first stage.
```

```quiz
The agent built the wrong thing. What do you fix first? | The generated code by hand ; The spec and acceptance checks ; The model choice | 1 | If the spec was ambiguous, regenerating from a better spec fixes the cause instead of the symptom.
What makes a spec useful? | Length ; Checks that someone or something can run ; A formal template | 1 | A spec you cannot verify cannot tell you when the agent is done.
```

```story
A builder starts a house with a sketch on a napkin and discovers on day 30 that the staircase has nowhere to go. Another starts with a floor plan that shows where every wall, door and stair lives. Writing the spec first is the floor plan. The agent builds faster and you spot the staircase problem in minutes, not weeks.
```

# knowledge-wiki | A personal knowledge base with an agent | 2 | 15
Point an agent at a folder of notes and let it maintain a linked wiki that you can query. Andrej Karpathy popularized the shape of it.

## What it is
The setup has three parts. A raw folder holds source material such as articles, transcripts and PDFs. A wiki folder holds pages the agent writes from them, linked to each other. A control file such as CLAUDE.md tells the agent the rules: how to ingest a source, how to name and link pages, how to answer questions from the wiki. You drop a document into raw, say "ingest this", and the agent updates the relevant pages. Later you ask questions against the wiki instead of starting from an empty context.

## Why it works and where it breaks
It is context engineering applied to your own notes. The agent compiles knowledge once, so later queries read a small structured wiki instead of the raw pile. The weak spot is drift: a summarizer can introduce errors that then get cited as fact. Keep raw sources, link claims back to them, and spot-check pages. Obsidian is a convenient viewer because it renders the links as a graph, but any folder of markdown works.

## A worked example: the folder layout
raw/ holds the originals: pdfs, transcripts, saved pages. wiki/ holds pages the agent writes: one per topic, with links like [[transformers]]. A rules file says: when ingesting, create or update pages, add the source name and date, never delete raw files. Query: "Summarize what we know about attention, and cite sources."

## Keeping it trustworthy
Summaries can drift from their sources. Keep the raw files, require sources on every claim, and open a few pages a week to compare against the originals.

## Common mistake
Trusting the wiki without ever checking it against the raw sources.

```resources
tool | Obsidian | https://obsidian.md/ | Obsidian | Local-first markdown notes with a graph view, a common front end for this pattern.
article | Context engineering | https://simonwillison.net/2025/Jun/27/context-engineering/ | Simon Willison | The general principle the wiki pattern applies to personal notes.
repo | mem0 | https://github.com/mem0ai/mem0 | Mem0 | A memory layer for agents if you want a library instead of plain files.
```

```quiz
Why keep the raw sources next to the wiki? | To save disk space ; So claims can be traced and errors caught ; Obsidian requires it | 1 | Summaries can drift. Raw sources let you verify what a page claims.
What does the control file do? | Stores the notes ; Tells the agent how to ingest, link and answer ; Encrypts the vault | 1 | It is the harness for the system: the rules the agent follows each session.
```

```story
You read fifty articles about a topic and forget most of them. Someone set up a folder where each new article is dropped in and an assistant updates a small wiki: a page per concept, linked to the others, with sources noted. A month later they can ask "what do we know about X and where did it come from?" and get a real answer.
```

