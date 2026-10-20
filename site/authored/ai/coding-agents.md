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

## How the loop works
A coding agent repeats a cycle. It reads the situation, picks an action such as opening a file or running a command, sees the result, and decides the next step. This continues until it thinks it is done or you stop it. Each result is added to its context window, so the agent can react to real output instead of guessing.

Here is a short trace with invented details. You ask it to fix a failing test.
1. It runs the tests and sees one failure in a price function.
2. It opens that function and the test.
3. It edits one line, then runs the tests again.
4. A different test now fails, so it opens that one and adjusts.
5. All tests pass and it reports.

The checks in step 1 and step 3 are what steer it. Without them it would stop at step 2 with a guess.

## A second example: when the plan is not needed
Not every task needs four phases. Renaming a variable in one file, or fixing a typo in a message, takes a single instruction and a glance at the diff. Writing a plan for it costs more than doing it. Use the full routine when the change touches several files, when you do not understand the code, or when a mistake would be costly.

## What goes wrong
The typical failure is the agent saying "fixed" when it is not. You will see passing output from a test it rewrote to be easier, or a change that solves the example but breaks a nearby case. To confirm, read the diff and check whether any test file changed. Then run the tests yourself. A second failure is drift: after many steps the agent forgets an early rule. Starting a fresh session with a short summary usually helps.

## Try it yourself
Pick a small project with tests, or write a tiny function with two tests.
1. Introduce a bug on purpose.
2. Ask the agent to explain the code, not change it.
3. Ask for a plan, and approve it.
4. Let it fix the bug, then read the diff.

Expect the diff to be short. If it touched test files, ask why.

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
What lets a coding agent fix its own mistakes? | Tests it can run and read for itself ; A longer prompt that stresses accuracy ; A bigger model with more training data | 0 | Feedback it can observe, like a failing test, lets it iterate without you in the loop.
Which phase do people most often skip? | Plan the full task ; Write the new code ; Verify the work | 2 | Skipping verification is how plausible but wrong code reaches review.
"Fix this crash" becomes "keep our app crash-free". Which kind of ambition is this? | Speed: finishing the same task in less time ; Altitude: aiming at the goal, not the task ; Range: borrowing methods from another field | 1 | Altitude means asking for the goal beyond the individual task, and it needs data and checks to match.
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

## What actually differs between tools
The model underneath matters, but the wrapper around it matters just as much. The wrapper decides what the agent can see, which commands it can run, how it asks permission, and how it edits files. Two tools using the same model can feel very different. Compare on four things: where it runs (your machine or a remote one), how it handles your files, how much you must approve, and whether you can see and undo each change.

## A second example: choosing for a small task
You want to understand what a function does, with no changes. A chat app is enough: paste the function and ask. A coding agent would work too, but it brings permissions and file access you do not need. For a task that spans many files, such as renaming a concept everywhere, the chat app fails because it cannot see the whole project. The size of the job picks the tool.

## Trade-offs
Terminal agents give control and scripting but have a learning curve. Editor agents are comfortable and show changes inline, but can encourage quick accepting without reading. Cloud agents work while you are away, but you only see the result at the end, and the code runs on a machine that does not have your local setup. No option is best in every case.

## What goes wrong
A common failure is trusting a demo. Marketing shows an agent building an app in minutes on a clean project. Your project is older, bigger and has unusual rules. Symptoms of a bad fit are constant corrections, edits in the wrong files, and tests that the tool cannot run. Those usually mean the tool lacks context about your project, which a memory file can fix, or that the task is too large for one pass.

## How to tell it is working
During your trial, count two things per task: minutes until you had a result you would accept, and number of corrections you made. Compare with how long you would have taken alone. If the numbers do not improve after a week of learning the tool, change your approach before changing the tool.

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
What transfers between coding agents? | The exact keyboard shortcuts of one tool ; The pricing plan of the vendor you chose ; The habits: plan, small steps, verify | 2 | The workflow is tool-independent. The details are not.
Which kind of agent suits many parallel background tasks? | Cloud agents that return a pull request ; Inline autocomplete shown inside an editor ; A chat window used only for quick questions | 0 | They run remotely and finish while you do other work.
You try five tools for one day each. Why might that mislead you? | Trial accounts always give worse answers than paid ones ; You never learn its memory file or permissions ; Tools released recently are always worse than older ones | 1 | Depth in one tool teaches skills that carry across. Shallow tries only show first impressions.
```

```story
A designer, a data analyst and a backend developer each try a different AI tool. The designer likes a visual app builder. The analyst likes a notebook assistant. The developer likes a terminal agent that edits files and runs tests. All three are good. They match how each person works.
```

# permissions-and-sandboxes | Permissions, sandboxes and first-session setup | 1 | 12
A coding agent can read files, run commands and change code. Before the first real task, decide what it may do alone, what needs your approval and what it must never touch.

## What it is
Every coding agent has a permission system. Reading files is usually allowed. Running a command or editing a file asks you first. You can allow some actions for good, such as running your tests, and block others, such as deleting files or pushing to the main branch. A list of actions that are always allowed is an allowlist. The idea behind all of it is least privilege: give the agent only the access the job needs.

A sandbox goes one step further. It is a restricted space, such as a container or a separate checkout of the repo, where the agent can act freely because a mistake there cannot reach your real files, other projects or secrets.

## Your first session
Work through this list once, before any real task.
1. Open the agent in one project folder, not your whole home directory.
2. Start on a new git branch or worktree, so every change can be thrown away.
3. Keep approvals on for commands. Allow only safe, repeatable ones (tests, linting, reading git history).
4. Keep secrets out of reach: no `.env` files, keys or production credentials in the folder the agent can read.
5. Write down in the memory file what must never be done, such as "never run migrations on production".

## A worked example: sorting commands
You ask the agent to fix a failing test. It wants to run seven commands. Allow `npm test` and `git diff` for the rest of the session, because they only read or check. Approve `npm install lodash` once after looking at the package. Refuse `rm -rf build` unless you read the path, and refuse `git push --force` outright. Four commands never interrupt you again, one needed a decision, two were blocked. That is a few seconds of attention instead of a prompt on every step.

## How the approval check works
Before the agent runs a command or edits a file, the harness, the program that wraps the model, compares the request with your rules. A rule can allow it, block it, or ask you. The model does not decide this. That is the point: the check is ordinary code, so a clever prompt cannot talk its way past it. A sandbox adds a second layer, enforced by the operating system or a container, so even an approved command is limited to a small area.

## A second example: where approvals are not enough
The agent reads a web page to learn about a library. Hidden in the page is a line telling it to send your files to an address. This is prompt injection: text from outside that tries to give the agent orders. Your approval prompt may catch an obvious command. A harmless-looking command could still pass. A sandbox with no secrets inside and no network access to unknown sites limits the harm even if you click yes. Permissions reduce mistakes. Isolation limits the damage from the ones that slip through.

## Trade-offs
More prompts mean more safety and more interruptions. After the fifth identical question, people start clicking yes without reading, which defeats the system. Allow narrow, repeatable commands so the prompts that remain are rare enough to read. Broad rules, such as allowing any command that starts with a common word, can include dangerous cases, so keep them specific.

## What goes wrong
Look for these symptoms. The agent stalls on a prompt you did not see because it is in another window. A command is blocked, and the agent tries a workaround that you did not intend. A change lands on the wrong branch because you forgot to switch. To confirm, read the log of commands the tool ran and check your branch name before starting.

## Try it yourself
Create a throwaway folder with a git repository and one small file.
1. Ask the agent to read the file and add a comment.
2. Approve the edit and view the diff.
3. Ask it to delete the file, and decline.
4. Restore with git if anything changed.

Expect to see exactly what it asked and be able to undo it.

## Common mistake
Turning off all approvals to go faster, in a folder that contains secrets or production access. The speed is real, and so is the damage when the agent follows a bad instruction hidden in a web page or a file.

```resources
docs | Claude Code permissions | https://code.claude.com/docs/en/permissions | Anthropic | How to allow, ask for or deny each kind of action.
docs | Claude Code sandboxing | https://code.claude.com/docs/en/sandboxing | Anthropic | Running commands in a restricted environment.
docs | Claude Code security | https://code.claude.com/docs/en/security | Anthropic | The safeguards built in and what is still your job.
article | The lethal trifecta for AI agents | https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/ | Simon Willison | Why private data, untrusted content and outside access are risky together.
```

```quiz
What does least privilege mean for a coding agent? | Letting it use every tool to avoid slowdowns ; Running it under your own main user account ; Giving it only the access the job needs | 2 | Limiting access limits the damage when it makes a mistake or follows a bad instruction.
Which command is safest to allow permanently? | Deleting the build folder to start each run fresh ; Running your tests, which changes nothing ; Pushing the current branch to the main remote | 1 | Read-only and check commands carry little risk, unlike deleting or publishing.
Why start an agent on a new branch or worktree? | Any bad change can be thrown away safely ; It gives the agent a larger context window ; It stops the agent from reading other files | 0 | A separate branch turns a bad run into something you can delete.
```

```story
A developer turns off every approval prompt so an agent can finish a refactor overnight. The agent reads a README that says "to build, first run the cleanup script", and the script wipes the local database. A single allowlist for tests and a separate branch would have cost thirty seconds of setup and kept the database.
```

# project-memory-files | CLAUDE.md and AGENTS.md | 1 | 10
A short file at the repo root that the agent reads at the start of every session. It is how you stop repeating yourself.

## What it is
AGENTS.md is a community convention read by Claude Code, Codex, Cursor, Aider and others. Claude Code also reads CLAUDE.md. The file holds what an agent cannot infer from the code: how to run tests and the build, the project layout, naming and style rules that differ from defaults, and things to never do.

## What belongs in it
Commands (install, test, lint, run), architecture in a few lines, conventions that are not obvious, and sharp edges such as "do not edit generated files". Keep it short, since it is loaded into every session and each line competes for attention. When the agent makes the same mistake twice, add one line. Move long reference material into separate files and link to them so they load only on demand. Prune lines that stop mattering.

## A worked example: a good file
Run: pnpm install, pnpm test, pnpm dev. Layout: app code in src/, tests in spec/. Conventions: functional components, no default exports. Never: edit src/generated, commit .env. Gotcha: tests need Docker running. Eight lines. Every line prevents a repeated correction.

## How the file is used
When a session starts, the harness reads the file and puts its text at the top of the model's context. The model does not remember earlier sessions by itself. Each one begins empty, so this file is the only memory it has of your project. Because the text sits in the context window, every line uses space and competes with your actual task.

## A second example: a file that makes things worse
Imagine a file of 300 lines with the full history of the project, old decisions, and a tutorial for the framework. The agent now has to weigh all of it on every task. Important rules, like "never edit generated files", are buried. A shorter version keeps only what the agent cannot discover by reading the code: commands, traps and rules. The history can live in a docs folder that the file links to. Instructions in the file are also advice, not a lock. For a rule that must never break, use a permission setting or a hook.

## What goes wrong
Files go stale. A command in the file changes, nobody updates it, and the agent keeps running the old one. You will see errors about a missing script or a wrong folder. Contradictions cause trouble too: one line says use tabs, another says spaces, and the agent picks one at random. Over-long files lead to ignored rules.

## How to tell it is working
Run a simple test. Start a fresh session and ask: "What commands would you run to test this project, and what must you never do?" The answer should match your file. If it guesses, the file is not being loaded or the wording is unclear. Then give the agent a real task and count how many corrections you make. Add a line for each repeated correction and remove one that never matters.

## Try it yourself
Write a file of ten lines or fewer for a project you own.
1. List the install, test and run commands.
2. Add one convention and one thing to avoid.
3. Start a new session and ask the test question above.

Expect the first answer to be mostly right and to reveal one missing line.

## Common mistake
Pasting the whole architecture document. The file loads every session, so only keep what changes behavior.

```resources
tool | AGENTS.md | https://agents.md/ | Community | The shared format that most coding agents read.
docs | Claude Code memory | https://code.claude.com/docs/en/memory | Anthropic | How CLAUDE.md files are discovered, imported and layered.
article | Claude Code: Best practices for agentic coding | https://www.anthropic.com/engineering/claude-code-best-practices | Anthropic | Includes guidance on writing an effective CLAUDE.md.
```

```quiz
What belongs in CLAUDE.md? | The full text of every design document ; Facts it cannot infer, like test commands ; Every function name across the whole project | 1 | It loads every session, so keep it to high-value facts and link to the rest.
The agent repeats the same mistake. What do you do? | Retype the correction every session ; Switch to another tool and try again ; Add one line to the memory file | 2 | One line fixes it for every future session.
Your memory file has grown past 300 lines. What is a sensible response? | Move detail to linked files and keep it short ; Add a table of contents and keep on growing it ; Delete the commands section to save some space | 0 | A short file keeps attention on what matters, and detail loads only when needed.
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

## How each one runs
A skill works by loading on demand. At the start, the agent sees a one-line description of each skill. When your request matches, it reads the full file and follows it. The match is a judgment by the model, so a vague description may never trigger, or may trigger at the wrong time.

A hook is different. The harness, not the model, runs it when an event happens, such as "after a file is edited". The model cannot skip it. If the hook script exits with an error, the harness can block the action and show the message to the agent.

A command is a saved prompt that you start yourself, so it runs when you type its name and not otherwise.

## A second example: choosing wrongly
You want to stop the agent from ever committing a file called secrets.env. You write a skill saying "never commit secrets". This relies on the model remembering and matching. One day it does not load. A hook that checks the staged files before each commit and fails if that file appears is the right tool, because it runs every time. Now the opposite: you want the agent to know your team's review style. A hook cannot teach style. That is a skill.

## Trade-offs
Hooks are strict, so a faulty one blocks work, such as a formatter that crashes and stops every edit. Keep hooks fast and test them by hand. Skills cost little context but need precise descriptions. Too many skills with similar descriptions confuse the choice.

## What goes wrong
Skill never triggers: the description does not match how you phrase requests, so rewrite it using your own words. Hook does nothing: the event or the file pattern is wrong, so run the script by hand and check its exit code. Hook slows everything: it does heavy work on every edit, so move that work to a commit-time check.

## Try it yourself
Create a command or skill that does one small job, such as summarising the last commit in three lines.
1. Run it.
2. Change the wording of the description and see whether it still gets picked.

Expect small wording changes to change when a skill triggers.

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
A rule must apply every single time, with no exceptions. What do you use? | A strongly worded prompt line ; A hook set up in the harness ; A skill with detailed steps | 1 | Hooks are code run by the harness, so they do not depend on the model remembering.
Why do skills keep context small? | Their text is compressed into far fewer tokens ; They always run on a smaller and cheaper model ; Only a short description loads until needed | 2 | Progressive loading means the full instructions appear only when relevant.
You keep typing "review the last commit for security issues". What is the best fit? | A saved command you run by name ; A hook that runs on every file edit ; A new section in the system prompt | 0 | A command is a reusable prompt you trigger on demand.
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

## How the pieces fit
When the main agent starts a subagent, it hands over a written task. The subagent works in its own fresh context, reads whatever it needs, and sends back a final message. Everything it read along the way is discarded from the main chat. If it read fifty files and replied with five lines, the main agent only carries the five lines.

A worktree is made with git, the version control tool. Both folders share one history but have separate files and branches. Changes in one do not appear in the other until you merge.

## A second example: where it does not help
You ask three agents to refactor the same module, each in its own worktree. All three change the same functions. When you merge, you hit conflicts, and you must decide among three versions of the same code. Worktrees prevent overwriting, not overlapping work. Divide tasks so they touch different files. If two jobs need the same file, run them one after the other. Similarly, a subagent that must understand the whole conversation gains nothing, because its summary will lose context.

## Trade-offs
Parallel work saves your waiting time but adds review time, since you read several diffs. It also multiplies the cost, because each agent has its own usage. The summary a subagent returns can leave things out. If a decision depends on a detail, ask for it explicitly, or check the source yourself.

## What goes wrong
Merge conflicts, as above. A subagent that reports success without evidence. Forgotten worktrees that pile up on disk and old branches that confuse you later. To check a subagent's claim, ask which files it read and which command proved the result, then run that command. Clean up with the list command for worktrees and remove finished ones.

## Try it yourself
In a repo you own, make a second worktree on a new branch, edit a file there, and look at the original folder.
1. Confirm the original file is unchanged.
2. Merge the branch.
3. Remove the extra worktree.

Expect the change to appear in your main folder only after the merge.

## Common mistake
Running two agents in the same folder. Their half-finished edits collide and tests fail for confusing reasons.

```resources
docs | Claude Code subagents | https://code.claude.com/docs/en/sub-agents | Anthropic | Defining custom subagents with their own tools and prompts.
article | How we built our multi-agent research system | https://www.anthropic.com/engineering/multi-agent-research-system | Anthropic | Orchestrator and subagent design, with real cost and failure data.
docs | git worktree | https://git-scm.com/docs/git-worktree | Git | The reference for creating and removing linked working trees.
```

```quiz
Why run two agents in separate worktrees? | Git blocks two agents from using one repository at once ; Two agents would have to share a single context window ; They would overwrite each other's files and tests | 2 | A shared checkout means shared half-finished edits. Separate worktrees isolate them.
What does a subagent return to the main agent? | Its full context window and history ; A focused summary of its result ; Nothing, because it works in silence | 1 | The point is to keep the main context clean by returning only the result.
You need a five-minute fix in one file. What should you do? | Start three parallel agents to be on the safe side ; Create a separate worktree for every changed line ; Stay in one session to avoid the overhead | 2 | For a small change, parallel agents cost more than they save.
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

## How a routed run is built
Think of it as a small factory with stations. A script, written once by a strong model, lists the stations and passes each station's output to the next. Each station is a call to a model chosen for that job. Because the script is ordinary code, loops and conditions happen exactly as written, not as the model remembers them.

Here is a cost sketch with invented numbers for illustration. Say there are 100 files. A small model reads each at a cost of 1 unit, so scanning costs 100 units. It flags 10. A mid-size model fixes each flagged file at 5 units, so 50 units. A large model reviews the 10 results at 20 units each, so 200 units. Total: 350. If the large model had read all 100 files at 20 units each, it would cost 2000. The saving comes from the large model seeing only 10 percent of the work.

## A second example: when routing loses
Take 4 files, all closely linked, where a change in one affects the others. Splitting work among agents means each sees only part of the picture, and you pay to combine the parts. One strong session with all four files in view is cheaper and more accurate. Routing fits work that splits into independent pieces.

## Trade-offs
A cheap model scans fast but may miss problems that a stronger one would catch. The pipeline is only as good as the weakest station. Debugging also gets harder, because an error could arise at any step. Add logs, and keep the intermediate outputs so you can see where things went wrong.

## What goes wrong
Common symptoms: the final answer ignores a real issue the first station missed, costs end up higher than a single session, or results differ between runs. To confirm a missed issue, plant a known bug in a test repo and see whether the pipeline finds it. To confirm cost, compare the usage of a single-session run with the pipeline on the same task.

## Common mistake
Using the pattern for a focused change. One session is cheaper.

```resources
docs | Orchestrate subagents at scale with dynamic workflows | https://code.claude.com/docs/en/workflows | Anthropic | The reference for workflows, /deep-research and ultracode.
article | How we built our multi-agent research system | https://www.anthropic.com/engineering/multi-agent-research-system | Anthropic | Why parallel subagents help and what they cost in tokens.
article | Building effective agents | https://www.anthropic.com/engineering/building-effective-agents | Anthropic | Orchestrator-workers and parallelization patterns this builds on.
```

```quiz
Where do intermediate results live in a dynamic workflow? | In variables inside the script ; In the main agent's context window ; In a database the model queries | 0 | That is the point: the main context only receives the final answer.
When is a workflow overkill? | A 500-file migration ; A one-file bug fix ; A codebase-wide audit | 1 | One session is cheaper and simpler for a small change.
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

## How a spec guides the agent
The agent works from the text it is given. A vague request leaves gaps, and the model fills each gap with the most likely choice, which may not be yours. A spec closes the gaps in advance. The usual flow is a short chain.
1. Write the behavior and the checks.
2. Ask the agent for a plan from the spec and read it.
3. Let it implement in steps, running the checks.
4. When something is wrong, edit the spec, not the code.

Step 4 keeps the spec as the source of truth. If you patch the code by hand, the next agent run will undo your change or contradict it.

## A second example: when a spec is too much
You want a button to change colour. Writing a spec with edge cases would take longer than the change itself. Skip it. A spec pays off when the feature has rules that are easy to get wrong, such as money, permissions or time limits, or when several people or agents will touch it. Equally, a spec cannot capture everything: for a visual design, you may only know it is right when you see it. In that case iterate with the agent and look at the result.

## What goes wrong
Vague words are the main failure. "Fast", "secure" and "user-friendly" cannot be tested. Replace them with something measurable, such as "the page responds in under one second on the test data". Another failure is a spec that contradicts itself, which shows up as the agent asking questions or making an arbitrary choice. A third is checks that pass without testing anything, such as a test that always succeeds. To confirm a test has value, break the code on purpose and see whether it fails.

## Try it yourself
Choose a small feature, such as a function that checks whether a password is strong enough.
1. Write five lines of rules, each testable.
2. Ask the agent to write tests from the rules before any code.
3. Break one rule in the code and watch a test fail.

Expect to find at least one rule that was ambiguous when you tried to write its test.

## Common mistake
Specs nobody can check. If you cannot say how you would test a line, rewrite the line.

```resources
repo | GitHub Spec Kit | https://github.com/github/spec-kit | GitHub | Toolkit for spec, plan and task workflows with coding agents.
course | Spec-Driven Development with Coding Agents | https://www.deeplearning.ai/short-courses/spec-driven-development-with-coding-agents/ | DeepLearning.AI and JetBrains | Short course on constitutions, specs and plan, implement, verify.
article | Industrial Agentic Engineering | https://research.google/pubs/industrial-agentic-engineering/ | Google Research | Verifiable specifications as the first stage.
```

```quiz
The agent built the wrong thing. What do you fix first? | The spec and its checks ; The generated code, by hand ; The model you are paying for | 0 | If the spec was ambiguous, a better spec fixes the cause instead of the symptom.
What makes a spec useful? | Plenty of background detail on each part ; Checks that anyone can run to confirm ; A formal template with many headings | 1 | A spec you cannot verify cannot tell you when the agent is done.
A spec says "make the reset flow secure". What is wrong with it? | It is too short for an agent to work from ; It does not name the framework and language ; It cannot be checked, so make it testable | 2 | Say what to test, such as "a reset link works once and expires after 30 minutes".
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

## How the compile step works
Think of it like building notes from a pile of readings. When you ingest a source, the agent reads it, finds the topics it covers, and then edits the matching wiki pages or creates new ones. It adds links between related pages and records where each claim came from. Later, a question is answered from the wiki pages, which are short, instead of from the full sources. That saves effort and gives a consistent view across documents.

## A second example: when a wiki is the wrong tool
You have three short articles and want an answer about one detail. Building a wiki is overkill. Paste the articles into a chat and ask. The wiki is worth it when the material is large, grows over time, or you will return to it for months. A wiki is also a poor fit for exact lookups, such as the precise wording of a contract clause, because a summary can change the wording. For those, search the raw file.

## Trade-offs
Compiling saves reading time but puts a layer between you and the source. Each summary is a chance for error. Updating also costs usage each time you ingest. A looser setup, a folder of raw files that the agent searches when asked, has less upkeep and less drift, but each question is slower and may miss links between documents.

## What goes wrong
Look for pages that cite no source, two pages that disagree, and old pages that new material should have changed but did not. A wrong claim can spread, since new pages build on old ones. To check, pick a random page, open the source it names, and compare the claim. Also run a question you know the answer to and see whether the wiki gets it right.

## Try it yourself
Make a raw folder with three short articles on one topic, and a rules file.
1. Ask the agent to ingest them.
2. Open each page and check one claim against its source.
3. Ask a question that needs two articles.

Expect good answers, plus at least one small error or missing link to fix.

## Common mistake
Trusting the wiki without ever checking it against the raw sources.

```resources
tool | Obsidian | https://obsidian.md/ | Obsidian | Local-first markdown notes with a graph view, a common front end for this pattern.
article | Context engineering | https://simonwillison.net/2025/Jun/27/context-engineering/ | Simon Willison | The general principle the wiki pattern applies to personal notes.
repo | mem0 | https://github.com/mem0ai/mem0 | Mem0 | A memory layer for agents if you want a library instead of plain files.
```

```quiz
Why keep the raw sources next to the wiki? | Because Obsidian refuses to open without them ; To save disk space on the notes folder ; So the wiki loads faster in the viewer ; So claims can be traced and errors caught | 3 | Summaries can drift. Raw sources let you verify what a page claims.
What does the control file do? | It tells the agent how to file and answer ; It holds the notes themselves inside one file ; It encrypts the vault so others cannot read it | 0 | It is the harness for the system: the rules the agent follows each session.
After a month, a wiki page states a fact that no source supports. What likely happened? | The model quietly deleted the original file ; The summary drifted from its source ; The wiki grew too big for the viewer | 1 | Compiled summaries can introduce errors, which is why sources and spot-checks matter.
```

```story
You read fifty articles about a topic and forget most of them. Someone set up a folder where each new article is dropped in and an assistant updates a small wiki: a page per concept, linked to the others, with sources noted. A month later they can ask "what do we know about X and where did it come from?" and get a real answer.
```

