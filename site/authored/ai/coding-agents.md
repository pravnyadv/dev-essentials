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

## Asking for more
Felix Rieseberg, who works on Claude, describes four ways to ask models for more. Speed is the same work in less time. Altitude is asking for the outcome instead of the task, such as "keep our app crash-free" instead of "fix this crash". Depth is pushing the model to use the tools and rigor an expert would, for example real statistics instead of a summary table. Range is drawing on several fields instead of the one the task sits in.

A worked example of altitude. Level 1: "Write a summary of last month's sales." Level 2: "Tell me what changed last month, why, and what we should do about it." Level 3: "Design a better way for leadership to catch problems early than a monthly report, and show from our history that it would have caught last spring's dip sooner." Each level gives the model more of the goal and less of the steps.

The cost of ambition is verification. A bigger goal needs data to work from and checks that run, because a high-level goal without checks is how errors get big. "Make my business grow" fails. "Find the three biggest reasons customers cancel, using these exports" works.

```resources
article | Claude Code: Best practices for agentic coding | https://www.anthropic.com/engineering/claude-code-best-practices | Anthropic | The canonical workflow guide: explore, plan, code, commit.
article | Industrial Agentic Engineering | https://research.google/pubs/industrial-agentic-engineering/ | Google Research | Specification, harness, trajectory, verification and meta-debugging.
article | The New Software Lifecycle | https://addyosmani.com/blog/new-sdlc-vibe-coding/ | Addy Osmani | Why verification separates vibe coding from agentic engineering.
course | Claude Code: A Highly Agentic Coding Assistant | https://www.deeplearning.ai/short-courses/claude-code-a-highly-agentic-coding-assistant/ | DeepLearning.AI and Anthropic | Short free course on exploring, testing and refactoring with an agent.
docs | Claude Code overview | https://code.claude.com/docs/en/overview | Anthropic | Install, commands and how the tool is organized.
course | Claude Code in Action | https://anthropic.skilljar.com/claude-code-in-action | Anthropic | Free course on tools, context, plan mode, hooks and the SDK.
article | How to be more ambitious: A tutorial for humans with models | https://felixrieseberg.com/how-to-be-more-ambitious-a-tutorial-for-humans-with-models/ | Felix Rieseberg | The source: altitude, depth and range with worked examples.
video | Software Is Changing (Again) | https://www.youtube.com/watch?v=LCEmiRjPEtQ | Andrej Karpathy at Y Combinator | Talk on software 1.0, 2.0 and 3.0 and designing for agents.
```

```quiz
What lets a coding agent fix its own mistakes? | A bigger model with a longer prompt ; Checks it can run and read, such as tests ; A reminder to be careful in each message | 1 | Feedback it can observe, like a failing test, lets it iterate without you in the loop.
Which phase do people most often skip? | Plan ; Implement ; Verify | 2 | Skipping verification is how plausible but wrong code reaches review.
"Fix this crash" becomes "keep our app crash-free". Which kind of ambition is this? | Altitude: asking for the outcome, not the task ; Speed: doing the same work in less time ; Range: borrowing methods from another field | 0 | Altitude means asking for the goal beyond the individual task, and it needs data and checks to match.
```

```story
Two developers ask an agent to add a discount feature. One says "add discounts" and merges whatever comes back. The other asks the agent to read the checkout code first, proposes a plan, reviews it, then asks the agent to write a failing test and make it pass. The first spends the next week fixing surprises. The second ships on Friday.
```

# coding-tools | Chat apps and coding agents | 1 | 12
Coding agents run in your terminal, your editor or the cloud. They differ in where they run and how much control you keep.

## The families
Terminal agents such as Claude Code, OpenAI Codex CLI and Aider read your repo, edit files and run commands, usually with permission prompts. IDE agents such as Cursor, Windsurf and GitHub Copilot sit in the editor with inline edits and an agent mode. OpenCode is an open-source terminal agent, and Replit Agent builds apps in a hosted environment. Cloud agents run tasks on a remote machine and open a pull request when finished, which suits parallel background work. Chat apps are for questions, drafts and analysis.

## How to choose
Try one tool seriously for two weeks before comparing. Learn its memory file, permission model, and how it handles context. The skills transfer between tools: explore, plan, implement, verify, keep context clean, and give the agent checks it can run. Models change quickly, so prefer tools that let you switch models.

## A worked example: a two-week trial
Pick one tool. Use it for real tasks for two weeks. Keep a short log: where it saved time, where it wasted time, what you had to correct. After two weeks you know more than any comparison chart can tell you. The habits you build (plan, small steps, tests, review) transfer to any other tool.

## Things to check
Does it let you pick the model? How does it ask permission before running commands? Where does your code go? Can it be run on a branch or worktree so it cannot damage your main work?

## Common mistake
Changing tools every week. Depth in one beats shallow tries of five.

```resources
docs | Claude Code | https://code.claude.com/docs/en/overview | Anthropic | Terminal and IDE coding agent.
repo | OpenAI Codex CLI | https://github.com/openai/codex | OpenAI | Open-source terminal coding agent.
tool | Aider | https://aider.chat/ | Aider | Open-source terminal pair programmer that works with many models.
repo | awesome-claude-code | https://github.com/hesreallyhim/awesome-claude-code | hesreallyhim | Community skills, hooks and workflows.
docs | Cursor docs | https://cursor.com/docs | Cursor | The IDE agent: rules, agent mode and context.
tool | Codex | https://chatgpt.com/codex | OpenAI | OpenAI's coding agent in the cloud and terminal.
```

```quiz
What transfers between coding agents? | The exact keyboard shortcuts of one specific tool ; The habits: plan, small steps, verify, clean context ; The pricing plan of the vendor you chose | 1 | The workflow is tool-independent. The details are not.
Which kind of agent suits many parallel background tasks? | Inline autocomplete in an editor ; A chat window used for questions only ; Cloud agents that return a pull request | 2 | They run remotely and finish while you do other work.
You try five tools for one day each. Why might that mislead you? | You never learn any tool's memory, permissions or habits ; Free trials always hide the real quality of tools ; Five different tools always give the same answers | 0 | Depth in one tool teaches skills that carry across. Shallow tries only show first impressions.
```

```story
A designer, a data analyst and a backend developer each try a different AI tool. The designer likes a visual app builder. The analyst likes a notebook assistant. The developer likes a terminal agent that edits files and runs tests. All three are good. They match how each person works.
```

# project-memory-files | CLAUDE.md and AGENTS.md | 1 | 10
A short file at the repo root that the agent reads at the start of every session. It is how you stop repeating yourself.

## What it is
AGENTS.md is a community convention read by Claude Code, Codex, Cursor, Aider and others. Claude Code also reads CLAUDE.md. The file holds what an agent cannot infer from the code: how to run tests and the build, the project layout, naming and style rules that differ from defaults, and things to never do.

## What belongs in it
Commands (install, test, lint, run), architecture in a few lines, conventions that are not obvious, and sharp edges such as "do not edit generated files". Keep it short, since it is loaded into every session and each line competes for attention. When the agent makes the same mistake twice, add one line. Move long reference material into separate files and link to them so they load only on demand. Prune lines that stop mattering.

## A worked example: a good file
Run: pnpm install, pnpm test, pnpm dev. Layout: app code in src/, tests in spec/. Conventions: functional components, no default exports. Never: edit src/generated, commit .env. Gotcha: tests need Docker running. Eight lines. Every line prevents a repeated correction.

## Common mistake
Pasting the whole architecture document. The file loads every session, so only keep what changes behavior.

```resources
tool | AGENTS.md | https://agents.md/ | Community | The shared format that most coding agents read.
docs | Claude Code memory | https://code.claude.com/docs/en/memory | Anthropic | How CLAUDE.md files are discovered, imported and layered.
article | Claude Code: Best practices for agentic coding | https://www.anthropic.com/engineering/claude-code-best-practices | Anthropic | Includes guidance on writing an effective CLAUDE.md.
```

```quiz
What belongs in CLAUDE.md? | The complete text of every design document ; What it cannot infer: commands and sharp edges ; Every function name in the whole project | 1 | It loads every session, so keep it to high-value facts and link to the rest.
The agent repeats the same mistake. What do you do? | Retype the correction each session ; Switch to a different tool ; Add one line to the memory file | 2 | One line fixes it for every future session.
Your memory file has grown past 300 lines. What is a sensible response? | Move detail to linked files, keep the main short ; Add a table of contents and keep on growing it ; Delete the commands section to save some space | 0 | A short file keeps attention on what matters, and detail loads only when needed.
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
Why do skills keep context small? | They are compressed into far fewer tokens ; They always run on a smaller, cheaper model ; Only a name and description load until needed | 2 | Progressive loading means the full instructions appear only when relevant.
You keep typing "review the last commit for security issues". What is the best fit? | A saved command you run by name ; A hook on every file edit ; A new section in the system prompt | 0 | A command is a reusable prompt you trigger on demand.
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
Why run two agents in separate worktrees? | Git refuses to run two agents at the same time ; Worktrees are the only way to make a branch ; They would overwrite each other's files and tests | 2 | A shared checkout means shared half-finished edits. Separate worktrees isolate them.
What does a subagent return to the main agent? | Its entire context window ; A focused summary of its result ; Nothing, it works silently | 1 | The point is to keep the main context clean by returning only the result.
You need a five-minute fix in one file. What should you do? | Start three agents to be safe ; Create a worktree for each line of the change ; Use one session, since extra agents add overhead | 2 | For a small change, parallel agents cost more than they save.
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
Where do intermediate results live in a dynamic workflow? | In script variables ; In the main context window ; In a database the model queries | 0 | That is the point: the main context only receives the final answer.
When is a workflow overkill? | A 500-file migration ; A single focused bug fix ; A codebase-wide audit | 1 | One session is cheaper and simpler for a small change.
A post says a three-model setup will "cut your bill by 90 percent". What should you do? | Adopt it on faith, since the idea is documented ; Reject the pattern because the number is high ; Measure cost and quality on your own task | 2 | The pattern is real, but savings depend on how large and parallel your work is.
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

## Common mistake
Specs nobody can check. If you cannot say how you would test a line, rewrite the line.

```resources
repo | GitHub Spec Kit | https://github.com/github/spec-kit | GitHub | Toolkit for spec, plan and task workflows with coding agents.
course | Spec-Driven Development with Coding Agents | https://www.deeplearning.ai/short-courses/spec-driven-development-with-coding-agents/ | DeepLearning.AI and JetBrains | Short course on constitutions, specs and plan, implement, verify.
article | Industrial Agentic Engineering | https://research.google/pubs/industrial-agentic-engineering/ | Google Research | Verifiable specifications as the first stage.
```

```quiz
The agent built the wrong thing. What do you fix first? | The spec and acceptance checks ; The generated code, by hand ; The model you are using | 0 | If the spec was ambiguous, a better spec fixes the cause instead of the symptom.
What makes a spec useful? | Its length and level of detail ; Checks that someone or something can run ; A formal template with many headings | 1 | A spec you cannot verify cannot tell you when the agent is done.
A spec says "make the reset flow secure". What is wrong with it? | It is too short for an agent to work from ; It names the wrong feature for the task ; It cannot be checked, so make it testable behavior | 2 | Say what to test, such as "a reset link works once and expires after 30 minutes".
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
Why keep the raw sources next to the wiki? | Because Obsidian needs them to work ; To save disk space ; So the wiki loads faster ; So claims can be traced and errors caught | 3 | Summaries can drift. Raw sources let you verify what a page claims.
What does the control file do? | It tells the agent how to ingest, link and answer ; It stores the notes themselves inside the file ; It encrypts the vault for safe keeping | 0 | It is the harness for the system: the rules the agent follows each session.
After a month, a wiki page states a fact that no source supports. What likely happened? | The raw file was deleted by the model ; The summarizer drifted from its source ; The wiki was too small | 1 | Compiled summaries can introduce errors, which is why sources and spot-checks matter.
```

```story
You read fifty articles about a topic and forget most of them. Someone set up a folder where each new article is dropped in and an assistant updates a small wiki: a page per concept, linked to the others, with sources noted. A month later they can ask "what do we know about X and where did it come from?" and get a real answer.
```

