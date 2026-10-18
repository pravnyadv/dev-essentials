# Quality review of the AI learning track

Reviewer: Claude (Sonnet 5.5), 2026-10-19. Scope: content, UI and UX, and component consistency of the AI track at http://localhost:5412, branch `feat/ai-track`. Nothing in the repository was edited. Evidence labels: **Proven** means seen in a file, screenshot, measurement or fetched source. **Inferred** means a judgment, with what would prove it.

## 1. Executive summary

**Verdict.** The AI track is a sound, honest, well-structured course whose best parts (the evolution chapter, retrieval, agents, the math chapter) stand comfortably next to good free material. It is held back by one systematic authoring problem: almost every lesson contains a second section that restates the first, which makes the "depth" lint pass without adding depth. Three mechanical defects hurt learners right now: inline word definitions never render, numbered steps collapse into one paragraph in eight lessons, and the quizzes are guessable (the middle option is correct 68 percent of the time and the longest option 84 percent of the time). Accessibility is the weakest UI area: light-theme secondary text fails WCAG AA on every page type tested, and the dark-theme hero button fails at 2.54:1. The shared-component work is already well along (one dashboard, one layout, one docs shell), but chips, containers, heading sizes and status colors have drifted into several variants.

**Ten most important findings, ranked by impact**

| # | Area | Finding | Evidence |
|---|---|---|---|
| 1 | Content | Near-duplicate sections inside at least 60 of the 119 authored lessons (each lesson restates its own advice under a second heading). The lint target of 350 words is met by repetition. | e.g. retrieval.md:129 and :135, production.md:40 and :46, building.md:164 and :176 (Part A) |
| 2 | UX | The inline term definitions do not exist on the live site. The build writes `<abbr title>` into the markdown, the renderer drops it. Only the collapsed "Words on this page" list works. | `content/ai/how-llms-work/transformers-and-attention.md:7` has `<abbr>`, `out/ai/docs/.../transformers-and-attention.html` has 0 |
| 3 | UX | Numbered steps ("1. ... 2. ... 3. ...") on one source line render as one paragraph with a single "1.". Affects the agent loop, tool-use, deploying, and all five projects. | shots/d-lesson-loop-2.jpg, agents.md:74, projects.md:8, :38, :68, :98, :128 |
| 4 | Content | Quiz keys are guessable: 163 of 238 correct answers are the middle option, none is the third, and the correct option is the longest in 200 of 238. | script over site/authored/ai/*.md |
| 5 | Content | Numeric errors in worked examples and one keyed quiz answer: LoRA share (0.8 percent should be 0.4), cost split (90 percent should be 84), GRPO advantage omits the std division, loss units clash (nats vs bits). | model-internals.md:92, :117; production.md:44; building-blocks.md:191 vs :276 |
| 6 | Content | The "Building with the API" and "Agents" chapters contain no code, and the five projects name no language and give no starter. "Make your first API call" is taught in words only. | building.md (0 code fences), projects.md |
| 7 | UX | Accessibility: light-theme muted text is 4.12 to 4.35:1 (needs 4.5) on all 12 light pages audited (1,153 nodes on the library); dark hero CTA 2.54:1; dashboards have no page title; links in the radar are color-only at 1.32:1. | axe runs, Part B |
| 8 | Content | Sequence: evals and prompt injection are needed from chapters 4 to 6 but taught in chapter 10; the coding-tools lesson is in chapter 11 after chapter 5 assumes it; chapter 9 re-teaches chapter 8; chapter numbers differ between dashboard and map. | Part A, UX-10 |
| 9 | Component | Seven copies of one page-container class string with four different widths, four chip variants, three h1/h2 scales, an emerald/rose success-danger pair hard-coded in five files, two near-identical docs page templates. | Part C |
| 10 | Content | Gaps for the stated audience (16+, many non-programmers): no lesson on everyday use, privacy of what you paste, study integrity, copyright; "Creative & Applied" has two vendor-specific lessons; the 18 imported lessons have no quiz or story. | Part A ch 16, 17 |

## 2. Scorecard

Scale 1 to 5 (rubric in the brief). "n/t" means the chapter's demo was not exercised in the browser. Demo is scored only where I used it (the stepper in chapter 8, the sampler in chapters 2 and 13). Dimensions: Cl clarity, De depth, Ac accuracy, Ex examples, Sq sequence, Jg jargon, Wd wording, St stories, Qz quizzes, Rs resources, Dm demos, Cp completeness.

| Ch | Chapter | Cl | De | Ac | Ex | Sq | Jg | Wd | St | Qz | Rs | Dm | Cp | Overall |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | How We Got Here | 4 | 3 | 4 | 3 | 3 | 3 | 3 | 4 | 2 | 4 | n/t | 3 | 3 |
| 2 | How LLMs Work | 4 | 3 | 4 | 4 | 4 | 3 | 3 | 3 | 2 | 5 | 4 | 3 | 3 |
| 3 | Breakthroughs Beyond Chat | 4 | 2 | 3 | 3 | 3 | 3 | 3 | 4 | 2 | 4 | n/t | 3 | 3 |
| 4 | Prompting & Context | 4 | 4 | 4 | 4 | 3 | 3 | 3 | 4 | 3 | 4 | - | 3 | 4 |
| 5 | Working with Coding Agents | 3 | 3 | 4 | 3 | 2 | 3 | 3 | 3 | 2 | 4 | - | 2 | 3 |
| 6 | Building with the API | 3 | 3 | 4 | 3 | 3 | 3 | 3 | 4 | 3 | 4 | - | 2 | 3 |
| 7 | Embeddings & Retrieval | 4 | 4 | 4 | 4 | 4 | 3 | 3 | 4 | 3 | 4 | n/t | 3 | 4 |
| 8 | Agents | 4 | 4 | 4 | 4 | 3 | 3 | 3 | 4 | 3 | 4 | 4 | 3 | 4 |
| 9 | From Prompts to Harnesses | 4 | 3 | 3 | 4 | 3 | 4 | 4 | 4 | 2 | 4 | n/t | 4 | 4 |
| 10 | Evals, Observability & Safety | 4 | 4 | 4 | 4 | 2 | 3 | 3 | 4 | 3 | 4 | - | 3 | 3 |
| 11 | The Tooling Landscape | 3 | 2 | 3 | 3 | 2 | 3 | 3 | 3 | 2 | 3 | n/t | 3 | 3 |
| 12 | Build Projects | 3 | 3 | 4 | 3 | 3 | 3 | 3 | 4 | 2 | 3 | - | 2 | 3 |
| 13 | Building Blocks | 4 | 4 | 4 | 5 | 4 | 3 | 4 | 4 | 3 | 5 | 4 | 3 | 4 |
| 14 | Models Under the Hood | 3 | 4 | 3 | 4 | 3 | 3 | 3 | 3 | 2 | 5 | - | 3 | 3 |
| 15 | Production | 3 | 3 | 3 | 4 | 3 | 3 | 3 | 4 | 3 | 3 | - | 3 | 3 |
| 16 | Creative & Applied | 4 | 2 | 3 | 3 | 2 | 3 | 3 | 4 | 2 | 3 | - | 1 | 2 |
| 17 | Prompting Techniques Reference | 3 | 3 | 4 | 4 | 3 | 2 | 3 | 1 | 1 | 2 | - | 3 | 3 |
| 18 | Keep Up | 4 | 2 | 3 | 3 | 3 | 3 | 3 | 3 | 2 | 3 | - | 2 | 3 |

Weighted honestly: no chapter is a 5 overall, because every authored chapter has the padding pattern and the weak quizzes. Only four single cells reach 5 (examples in chapter 13, resources in chapters 2, 13 and 14).

**Strongest chapters.** (1) Building Blocks: every one of about 30 worked numbers recomputed correctly, the formula then plain words then story pattern fits math, resources are the best free set (3Blue1Brown, StatQuest, Karpathy). (2) Embeddings & Retrieval: ten lessons in a sound order with the track's best practical teaching (score retrieval and generation separately, permissions as filters, MRR worked by hand). (3) From Prompts to Harnesses: delivers the owner's intent exactly (name the mechanism, the measurement and the old name) and calls hype hype. Agents is a close fourth.

**Weakest chapters.** (1) Creative & Applied: two lessons, both about one vendor's product feature, under a title that promises far more. (2) The Tooling Landscape: names change fastest, two of six lessons repeat earlier chapters (vector databases, Hugging Face), and the coding-tools lesson is in the wrong chapter. (3) Working with Coding Agents: five of eight lessons are about one tool, no first-session lesson, no permissions or sandboxing, and a lesson that summarises one blog post.


## 3. Part A: content review, per chapter

Each chapter lists the proven findings first (from reading every lesson, with `file:line` in the chapter file under `site/authored/ai/`), then scores with one-line justifications, strongest and weakest lessons with replacement text, the single best improvement and missing lessons.

### Quiz statistics, all 17 authored chapter files (script run over site/authored/ai/*.md)
- Proven: 238 quiz questions, every lesson has exactly two, every question has three options.
- Proven: the keyed answer is index 1 (the middle option) in 163 of 238 (68 percent), index 0 in 75 (32 percent), index 2 never. Always picking the middle option scores 68 percent. coding-agents 16 of 16, evolution 10 of 10, keep-up 6 of 6 are all index 1.
- Proven: the keyed option is the longest of the three in 200 of 238 questions (84 percent). Picking the longest option scores 84 percent without reading the question.
- Proven (script): link check over 359 URLs, 0 broken, 1 blocked (403 from academic.oup.com, the Turing paper; a publisher that rejects bots, so a false alarm).
- Proven: the lint script reports 119 lessons, average 394 words, grade 8.5, 0 flags. The lint passes because the padding sections below add words. The target (about 350 words) is met by repetition, not depth.

### Chapter 1 How We Got Here (history.md, 7 lessons)
- Proven: scaling-laws and transformer-era both teach Chinchilla's 20 tokens per parameter (history.md:129, 203, 215). Scaling-laws sits after chatgpt-and-the-race, so the idea is taught twice and in a worse order.
- Proven math: 10^-0.07 = 0.851, 3.0 to 2.55 to 2.17 correct; 2^(1/0.07) = 19,700, so "about 20,000" correct; 70B x 20 = 1.4T correct; GPT-3/GPT-2 = 117x correct.
- Proven jargon forward reference: transformer-era and ml-basics use tokens, parameters, loss, attention, regularization before chapter 2 defines them.
- Proven weak quiz distractors: "Computers were banned" (history.md:34), "It is illegal" (:267), "It is too cheap".
- Inferred: "reached a hundred million users in about two months" (:162) was an analyst estimate (UBS via Reuters), stated as fact.
- Inferred: "Open-weight models trail the frontier by a modest margin" (:168) is unsourced and time-sensitive.
- Proven: chatgpt story (:194) says "nothing about the model had changed", but the lesson text (:171) says post-training made it work. Mild contradiction.
- Proven template: every lesson ends with Common mistake, worked example, plain words in the same order.

**Scores.** Clarity 4: plain analogies (spam rules, GPUs as pixel painters). Depth 3: how and why with one example each. Accuracy 4: dates, ratios and powers recomputed, two unhedged claims. Examples 3: numeric where math appears, analogy elsewhere. Sequence 3: scaling-laws follows the ChatGPT lesson and repeats the transformer lesson. Jargon 3: tokens, loss and attention used before chapter 2. Wording 3: clean, mechanical template. Stories 4: ELIZA and the farmer fit. Quizzes 2: see statistics. Resources 4: primary papers, one blocked link. Demos n/t. Completeness 3.
**Overall 3.**
**Two strongest.** ai-origins (the spam-rules example makes rules versus learning concrete); scaling-laws (correct math, the "reading the exponent" paragraph).
**Two weakest, with rewrites.**
- chatgpt-and-the-race, line 162: "It reached a hundred million users in about two months." Replace with: "Analysts estimated it passed 100 million monthly users by January 2023, about two months after launch (a UBS estimate reported by Reuters)." Inferred source from memory; fetch to confirm before shipping.
- ai-engineer-role repeats the track's own introduction and invents a "day in the life". Replace the day-in-the-life paragraph with a real, cited job-ad analysis or cut it, and link the roles table to chapters 4 to 10.
**Single highest-impact improvement.** Move scaling-laws directly after transformer-era, delete the Chinchilla paragraph in transformer-era (history.md:129), and hedge the two market claims.
**Missing lessons.** "What changed in the last twelve months" (one page, fed by radar.json) so the history reaches the present.

### Chapter 2 How LLMs Work (how-llms-work.md, 6 lessons)
- Proven repetition inside next-token-prediction: "think step by step helps" and "no plan for the whole answer" appear twice (how-llms-work.md:48 and :57).
- Proven overlap: temperature and top-p explained in next-token-prediction (:45) and again in sampling-parameters (:84).
- Proven contradiction: training-pipeline says a prompt "cannot reliably teach it new facts" (:173) then says to put new facts in the prompt (:175).
- Proven overstatement: limits-and-hallucinations says the model "has no built-in signal for I do not know" (:206). Research (Kadavath et al. 2022) shows models carry partial calibration signals.
- Proven: transformers-and-attention claims "position in a prompt matters" (:127) without saying why (no positional encoding, no causal mask, no multi-head). Has no demo.
- Proven: tokens-and-context story (:36) has a contract that "used most of the attention budget". A contract is about 30k tokens, small for 2026 windows. Story is dated.
- Proven math: 1,300 tokens x $3/M = $0.0039; 1.5M tokens = $4.50 correct. Does not mention prompt caching, which cuts that agent example sharply.
- Missing: parameters/weights, mixture of experts, reasoning models as a lesson, multimodal input, how a tokenizer is built (BPE).

**Scores.** Clarity 4. Depth 3: attention lesson omits order, masks and heads. Accuracy 4: checked tokens-to-cost and sampler math, one overstated claim ("no built-in signal for I do not know"). Examples 4. Sequence 4: forward links to the math chapter are well handled. Jargon 3. Wording 3. Stories 3: the contract story is dated for 2026 windows. Quizzes 2. Resources 5: Karpathy, 3Blue1Brown, Tiktokenizer and Transformer Explainer are the best free set. Demos 4 (sampler, no layout shift). Completeness 3.
**Overall 3.**
**Two strongest.** limits-and-hallucinations (real case, three concrete guard rails); next-token-prediction (demo plus a softmax pointer for later).
**Two weakest, with rewrites.**
- training-pipeline, line 173: "That is why a prompt can change how a model behaves, but cannot reliably teach it new facts." Replace with: "A prompt can supply a fact for one answer, but nothing is stored: the weights do not change. For facts you need again and again, retrieve them (chapter 7)."
- transformers-and-attention, line 127: "It also explains why position in a prompt matters". Replace with: "Attention alone has no sense of order, so the model adds a position signal to every token. Without it, 'dog bites man' and 'man bites dog' would look the same."
**Single highest-impact improvement.** Make attention interactive (a four-token heat map with a query selector, as in Transformer Explainer) and delete the duplicated "why this explains the weirdness" section.
**Missing lessons.** "Parameters, weights and what a model file is" (one screen, with 8B at 4 bit is 4.5 GB); "Reasoning models in one page" before chapter 4 uses the term; "How a tokenizer is built (BPE) in five merges".

### Chapter 3 Breakthroughs Beyond Chat (breakthroughs.md, 6 lessons)
- Proven padding by duplication: games-and-reinforcement says "why it works on checkable answers" in "Why it matters" (:48) and again in "Why games came first" (:54). science-breakthroughs repeats the weather sentence in "Other areas" (:82) and "Beyond proteins" (:91), nearly verbatim.
- Proven redundancy with chapter 1: AlexNet and ImageNet re-taught in vision lesson (:5) and the same quiz question ("What did AlphaGo/AlexNet show", :31 vs history.md:111). Deep Blue repeated (:42).
- Proven weak example: open-models (:197) computes API $750 vs self-host $400, then concludes hosting "can pay off". $350 a month does not cover engineer time, so the numbers argue for the API. The $400 GPU figure has no source.
- Checked and retracted: speech-and-multimodal (:128) says one photo "can cost as much as a few thousand words". Anthropic vision docs (fetched) give 1,296 tokens for a 1 megapixel image, 1,560 for 1080p on the standard tier and up to 4,784 on the newest high-resolution tier. That is about 1,000 to 3,500 words, so the claim is acceptable. Proven.
- Proven math: 224/16 = 14, 14 x 14 = 196 correct. 5M x 300 = 1.5B tokens x $0.50/M = $750 correct.
- Proven: science "why folding is hard" (:88) gives no number. A one-line 3^100 (about 5 x 10^47) would make it concrete.
- Proven hype phrase: AlphaGo story says it "found something people had missed for centuries" (:72). Unsupported.
- Inferred stale: "Hugging Face hosts close to a million models" (:188), SWE-bench Verified described as a live trend (:152). To be checked.
- Proven weak distractors: "Computers..."-style throwaways: "Skip licenses", "Zero setup" (:212-213), "GPUs are useless" (:31).
- Sequence: chapter is flagged goal "understand" only, yet sits between How LLMs Work and Prompting, delaying the "use" route. Map handles it, sidebar does not.

**Scores.** Clarity 4. Depth 2: each lesson is a tour. Accuracy 3: image-token claim checked and fine, open-models example contradicts itself, AlphaGo "missed for centuries" unsupported. Examples 3. Sequence 3. Jargon 3. Wording 3. Stories 4. Quizzes 2. Resources 4. Completeness 3.
**Overall 3.**
**Two strongest.** games-and-reinforcement (the three-cell Q-learning corridor, reward hacking with the cleaning robot); science-breakthroughs (the caveat lesson, the Nobel and CASP facts are right).
**Two weakest, with rewrites.**
- open-models, lines 197 to 198: "A small open model on one rented GPU may cost around $400 a month ... If volume is large or privacy matters, hosting can pay off." Replace with: "At 5 million tickets the API costs about $750 a month and hosting about $400 plus someone to run it. A $350 saving is less than a day of engineer time, so use the API. Hosting wins at about 20 times the volume (about $15,000 a month on the API) or when the data may not leave your servers."
- vision-and-image-generation retells AlexNet and ImageNet from chapter 1 (breakthroughs.md:5). Replace the Seeing section with one sentence and a link back to ml-and-deep-learning.
**Single highest-impact improvement.** Cut the chapter from six lessons to four: merge vision with speech and multimodal, remove repeats of AlexNet and Deep Blue.
**Missing lessons.** None essential. A short "How to read an AI demo video" would serve the "understand" route better than a sixth tour.

### Chapter 4 Prompting & Context (prompting.md, 8 lessons)
- Proven duplicated sections (padding): reasoning-models "Why it matters" (:157) and "Using the effort setting" (:163) are the same advice; context-engineering "The working rules" (:190) and "Practical rules" (:199) are the same list; compaction "Isolation" (:264) and "Isolation in practice" (:273); context-failure-modes "Measure it" (:231) and "Testing for rot" (:237).
- Proven forward references: context-engineering and compaction use agent, tool results, subagents, KV cache, MCP-era vocabulary (:187-190, :262-264) before chapters 5 to 8 teach agents and tools. Quiz at :213 assumes the reader has run an agent.
- Proven dated example: the chain-of-thought pens question (:96) is one a 2026 model never gets wrong. A reader who tries it will see the opposite of the claim. Needs a harder case or a smaller model.
- Inferred: "six kinds of context" attributed to a Google whitepaper through Addy Osmani (resource :209). Not verified here.
- Good: "Not a security boundary" (:50), failure-mode taxonomy credited to Breunig (four named modes plus rot from Chroma), compaction handoff note example is concrete.
- Missing: consumer use (chat apps, files, web search, memory, privacy of what you paste, plagiarism and study use), prompt versioning and iteration, prompt caching as its own lesson, multimodal prompting, writing prompts for coding agents (partly ch5).

**Scores.** Clarity 4. Depth 4: failure-mode taxonomy, compaction, handoff note. Accuracy 4: the six kinds of context verified in Osmani's post (fetched). Examples 4. Sequence 3: agent vocabulary before agents. Jargon 3. Wording 3. Stories 4. Quizzes 3: the context lessons ask applied questions (the tenth step with a 40k-token tool result). Resources 4. Completeness 3.
**Overall 4.**
**Two strongest.** context-failure-modes (four named failures with one fix each, clash example is reproducible); compaction-and-isolation (60-token handoff note versus 80,000 tokens).
**Two weakest, with rewrites.**
- prompting-techniques, line 96: "A model might blurt '$12'." A current model will not, so the reader who tries it sees the claim fail. Replace with: "Small or older models often answer '$12'. Current models usually get this right either way. Step-by-step helps when a problem needs five or more steps: a train leaves at 2:40, the trip takes 3 h 35 min with a 12 min stop, when does it arrive? (6:27)." (2:40 + 3:35 = 6:15, plus 12 = 6:27, recomputed.)
- reasoning-models has two sections that say the same thing (:157 and :163). Delete "Using the effort setting" and add one real number: the effort setting's cost multiple from a provider page.
**Single highest-impact improvement.** Add a one-line gloss of "agent", "tool result" and "subagent" where they first appear, or move context-engineering, failure modes and compaction to follow chapter 8.
**Missing lessons.** "Using chat apps well" (files, projects, memory, what not to paste), "Prompt versioning and iteration", "Prompt caching" as its own lesson.

### Chapter 5 Working with Coding Agents (coding-agents.md, 8 lessons)
- Proven vendor lean: 5 of 8 lessons are about Claude Code features (CLAUDE.md, skills, hooks, dynamic workflows, /deep-research, ultracode; coding-agents.md:109, :175, :193). A reader using Cursor, Copilot or Codex gets the idea but not the commands. Tools are never compared in this chapter.
- Proven padding by duplication: project-memory-files "Growing it" (:85) repeats :79 almost word for word; spec-driven-development "What the spec buys you" (:220) repeats "Why it works" (:214); model-routing "A note on the hype" (:187) repeats :178; knowledge-wiki "Keeping it trustworthy" (:253) repeats :247.
- Proven: being-ambitious is a summary of one blog post (Rieseberg). Lesson text names four kinds (speed, altitude, depth, range), the resource line names three (:59). Thin for a lesson, and ties the course to one author's framing.
- Proven missing for a beginner: no first session (install, open a repo, first prompt), no git basics although worktrees are taught, no permissions and sandboxing (an agent that runs shell commands is the biggest risk and appears only in chapter 10), no cost.
- Proven forward reference: agentic-coding-workflow opens with "a loop" (:5) and subagents-and-worktrees uses context windows, before the agent-loop lesson in chapter 8.
- Checked: the Google Research page for "Industrial Agentic Engineering" exists and its abstract supports "verifiable specifications" and "tests". Rieseberg's post names four kinds, so the lesson text is right and the resource line (three kinds, :59) is the slip. Not checked: knowledge-wiki says Karpathy "popularized the shape" (:241). Inferred.
- Good: "verify" as the thread, the hooks-vs-prompts rule, "when not to" notes on subagents and workflows.

**Scores.** Clarity 3. Depth 3. Accuracy 4: Rieseberg's four kinds, the dynamic-workflow, /deep-research, ultracode and verifier-vote claims all match the live docs (fetched). Examples 3. Sequence 2: tools named in chapter 11, git and agents assumed. Jargon 3. Wording 3. Stories 3. Quizzes 2: 16 of 16 keys are the middle option. Resources 4. Completeness 2.
**Overall 3.**
**Two strongest.** agentic-coding-workflow (explore, plan, implement, verify; "ask what you did not verify"); skills-hooks-commands ("prompts ask, hooks guarantee" with three choose-the-tool cases).
**Two weakest, with rewrites.**
- being-ambitious, line 41: "Felix Rieseberg, who works on Claude, describes four ways to ask for more." It is a summary of one post. Fold a 100-word "Ask for the outcome, not the task" box into agentic-coding-workflow and delete the lesson.
- model-routing-workflows (level 3) is a product feature walk-through. Merge its pattern into workflow-patterns in chapter 8 and keep one sentence on the vendor feature.
**Single highest-impact improvement.** Add a first lesson, "Your first agent session", that is tool-neutral: open a repo, give a task, read the permission prompt, read the diff, undo with git. Move coding-tools here from chapter 11.
**Missing lessons.** Permissions and sandboxing (the largest risk), cost of a session, git basics for non-programmers, a tool comparison table.

### Chapter 6 Building with the API (building.md, 11 lessons)
- Proven: the whole chapter contains zero code or curl snippets. "Make your first API call" (the stated outcome) is described "in words" (building.md:52). A learner finishes without having seen a request body, a tool schema or an MCP config.
- Proven triple repetition of model routing: building.md:8, :19 and coding-agents.md:178 say "large plans, mid works, small scans".
- Proven duplicated sections: errors-and-safe-rendering lists status codes twice (:164, :176), safe markdown twice (:170, :179), streaming again (:173) after api-features (:135). multimodal-apis has "Cost and quality" and "Costs and quality" (:396, :402). messages-and-roles repeats the role guide (:81, :96).
- Proven duplicated resources: multimodal-apis links two OpenAI vision guides (:411, :413). Tiktokenizer appears in chapters 2 and 6.
- Proven arithmetic that cannot be reproduced: messages-and-roles worked example (:93) says turn 3 sends "400 plus 50" but never gives turn 2's reply size.
- Proven correct: $0.0009 for 38 in and 52 out at $3 and $15 per million; 300 vs 200 requests per minute example.
- Proven: choosing-a-model example (:13) shows invented results (A 96 percent at $0.020) written as "Results", not marked hypothetical.
- Sequence: tool-use is level 2 yet is the stated core of every agent. MCP takes four lessons (mcp, build-an-mcp-server, mcp-trust-boundaries, plus tools) which is heavy against one lesson on prompt caching and none on rate-limit code.
- Good: safe rendering and key handling are taught early, the trust-boundary lesson is genuinely useful.

**Scores.** Clarity 3. Depth 3. Accuracy 4: token and price arithmetic correct, streaming and batching claims standard. Examples 3: worked examples in words, no code. Sequence 3. Jargon 3: OAuth, stdio, SSE and jitter are not in the glossary. Wording 3. Stories 4. Quizzes 3. Resources 4. Completeness 2.
**Overall 3.**
**Two strongest.** tool-use (a five-step round trip with real names); errors-and-safe-rendering (the model-written script tag story is the best security story in the track).
**Two weakest, with rewrites.**
- messages-and-roles, lines 93 to 94: "Turn 3 sends 400 plus 50: 450 tokens in." The reply size of turn 2 is never given. Replace with: "Say every reply is 100 tokens and each new question 50 (the first is 100). Turn 1 sends 100. Turn 2 sends 100 + 100 + 50 = 250. Turn 3 sends 250 + 100 + 50 = 400. Turn 10 sends about 1,450." (recomputed)
- choosing-a-model, line 13: "Results: A 96 percent at $0.020 per email". Label it "Example results (invented for illustration)".
**Single highest-impact improvement.** Add runnable code: a curl request, a 15-line call in one language, a tool schema, an MCP config block. This is the stated outcome of the chapter.
**Missing lessons.** Prompt caching as a lesson (it is the biggest cost lever and is cited in four chapters), choosing between the two API styles with a side-by-side request.

### Chapter 7 Embeddings & Retrieval (retrieval.md, 10 lessons)
- Proven math, all recomputed and correct: cosine and dot examples (retrieval.md:90, :96), RRF 1/61+1/63 = 0.0323 and the merge example (:205, :208), MRR 0.58 and 0.57 (:345, :354), recall 4 of 5, 1.5 billion multiplications (:169).
- Proven padding by duplicated sections in nearly every lesson: embedding-models "Size and cost" (:59) restates "What differs" (:50); chunking "A practical recipe" (:135) restates "Practical tips" (:129); vector-databases "Picking one" (:172) restates "Choosing one" (:166); similarity-metrics "What to use" (:99) restates "Which to use" (:93); rag "How to debug" (:250) restates "Where RAG fails" (:241); metadata-filtering "Permissions are filters" (:288) restates :282; rag-vs-fine-tuning "Combining them" (:321) restates :315; rag-evaluation "Scoring answers" (:357) restates :348. Eight of ten lessons.
- Proven duplicated resources: FAISS twice in vector-databases (:181, :186); Ragas and DeepEval each twice in rag-evaluation (:363 to :367); "Introducing Contextual Retrieval" linked in four lessons.
- Proven missing: reranking has no lesson though six lessons name it; no query rewriting, no PDF parsing and OCR (the most common real RAG failure), no RAG versus long context, no graph or agentic RAG. Coverage script confirms "RAG Usecases" is not mentioned.
- Proven: invented results (model X 24 of 30, :56) are not labelled hypothetical.
- Good: rag-evaluation (retrieval and generation scored separately) and "permissions are filters, a prompt is not a lock" are the best practical teaching so far.

**Scores.** Clarity 4. Depth 4. Accuracy 4: every numeric example recomputed. Examples 4: numbers in every lesson. Sequence 4. Jargon 3: ANN, HNSW, RRF, recall, MRR are not in the glossary. Wording 3. Stories 4. Quizzes 3. Resources 4. Completeness 3.
**Overall 4.**
**Two strongest.** rag-evaluation (retrieval and generation scored apart, MRR by hand); metadata-filtering ("permissions are filters, a prompt is not a lock").
**Two weakest, with rewrites.**
- embedding-models, line 56: "Results: model X 24 out of 30, model Y 27, model Z 21." Replace with "Example results (invented): ...". Delete "Size and cost" (:58) which restates "What differs".
- vector-databases lists FAISS twice (:181, :186) and has two sections that choose a database (:165, :171). Keep one of each.
**Single highest-impact improvement.** Add the missing reranking and query-rewriting lesson to this chapter (move from chapter 15) and a "Parsing PDFs and tables" lesson.
**Missing lessons.** Reranking; query rewriting and HyDE; parsing and OCR; RAG versus long context (when to skip retrieval); showing citations to users.

### Chapter 8 Agents (agents.md, 10 lessons)
- Proven math: 0.95^10 = 0.599, 0.95^30 = 0.215, 0.95^20 = 0.358 (agents.md and evolution.md:91, :108). All correct and a strong, memorable example.
- Proven padding: what-is-an-agent "A useful ladder" (:13) repeats :8; agent-use-cases "Questions that save months" (:49) repeats the checklist (:44); agent-loop "What to add in practice" (:85) repeats the limits in :74; tool-design "Testing with the model" (:119) repeats :113; persisting-conversations "Privacy" (:259) repeats "Practical rules" (:253); agent-memory "The hard parts" (:223) repeats :218; multi-agent "A case where it hurts" (:292) repeats :287; long-running "Evaluator agents" (:325) repeats :320.
- Proven: the agent-loop "worked example in pseudocode" (:82) is a prose paragraph, not pseudocode, and the chapter has no code block. The reader is told the loop is "around 20 lines" and never sees them.
- Proven undefined jargon: "context anxiety" in the long-running-agents quiz explanation (:337), taken from an Anthropic article, is never explained. "Procedural memory" and "initializer agent" appear without a gloss.
- Proven redundancy with chapter 9: agent loop (agents.md:74 vs evolution.md:82) and workflow versus agent (agents.md:5 vs evolution.md:85) are the same text twice.
- Missing: planning and ReAct as a lesson (only in the reference chapter), computer-use and browser agents, human-in-the-loop design (appears only in ch15), cost of one run with a worked number.
- Good: agent-use-cases checklist, tool-errors-and-validation with the path traversal example, the Cognition counter-argument linked next to Anthropic's.

**Scores.** Clarity 4. Depth 4. Accuracy 4: 0.95 to the 10th, 20th and 30th verified. Examples 4. Sequence 3: agents appear in chapters 4 and 5 first; chapter 9 repeats this one. Jargon 3. Wording 3. Stories 4. Quizzes 3. Resources 4: Anthropic, OpenAI, Cognition's counter-argument. Demos 4: the stepper has 8 steps and the page height stayed at 3,104 px through all of them. Completeness 3.
**Overall 4.**
**Two strongest.** what-is-an-agent (the ladder: single call, chain, tools, loop); tool-errors-and-validation (path traversal example).
**Two weakest, with rewrites.**
- agent-loop, lines 82 to 83, a "worked example in pseudocode" that is a prose paragraph. Replace with a fenced block: `messages = [goal]` / `for step in 1..10:` / `reply = model(messages, tools)` / `if no tool call: return reply` / `messages += [reply, run(tool call)]` / `stop("step limit")`. Also write the five steps one per line so they render as a list (UX-01).
- persisting-conversations repeats its privacy rules (:253 and :259). Delete the second.
**Single highest-impact improvement.** Put the loop in code and keep the demo on the same example.
**Missing lessons.** Planning and ReAct as a lesson; computer-use and browser agents; "what one agent run costs" with a worked number; sandboxes for agents.

### Chapter 9 From Prompts to Harnesses (evolution.md, 5 lessons)
- Proven: this is the clearest chapter in the track and delivers the owner's intent (mechanism, measurement, old name). The three-question test (evolution.md:14) is reusable.
- Proven overclaim: "Take a deep breath": noise (:54). Google DeepMind's OPRO paper (Yang et al. 2023, arXiv 2309.03409, HTML version fetched) reports that exact phrase reaching 80.2 percent on GSM8K with PaLM 2-L as scorer. The honest line is "helped one model on one benchmark, no reliable effect since".
- Proven repetition: harness-engineering says the Anthropic context-reset and evaluator finding twice (:121 to :122 and :133 to :134), and it appears a third time in long-running-agents (agents.md:317 to :326).
- Proven omission: the METR study is cited as "tasks took 19 percent longer" (:184) without its sample (16 developers) or that it measured early-2025 tools. Hedged by "studies are mixed" but a skeptic cannot weigh it.
- Inferred: the "measurable gains" for harness changes (:122) come from one vendor's own blog post. The lesson does not say how large the gains were or that the vendor measured itself.
- Proven weak distractors: "It has a hashtag" (:33), "Who coined it" (:202).
- Sequence: placed after agents, but its first lesson re-teaches the loop, workflows and the vocabulary list. A reader who finished chapters 4 and 8 meets the same sentences again. Better as a short closing lesson of chapter 8 plus the buzzword guide.

**Scores.** Clarity 4. Depth 3: leans on one vendor's findings. Accuracy 3: "Take a deep breath: noise" is contradicted by the OPRO paper, the METR study loses its sample size. Examples 4. Sequence 3. Jargon 4. Wording 4. Stories 4. Quizzes 2. Resources 4. Completeness 4.
**Overall 4.**
**Two strongest.** evolution-overview (three-question test for any buzzword); ai-buzzwords (each term with real and hype halves, METR cited).
**Two weakest, with rewrites.**
- prompt-engineering-era, line 54: '"Take a deep breath": noise.' Replace with: 'A 2023 DeepMind paper found "Take a deep breath and work on this problem step-by-step" reached 80.2 percent on a grade-school math set with one model (PaLM 2-L). I found no evidence of a reliable effect on current models, so test it yourself.' (80.2 percent verified in the OPRO paper HTML; the later-models sentence is Inferred.)
- harness-engineering states the Anthropic finding twice (:121 to :122, :133 to :134). Delete the second block and add the size of the measured gain from the source article.
**Single highest-impact improvement.** Merge agents-era into chapter 8 (it duplicates agent-loop and what-is-an-agent) and keep three lessons.
**Missing lessons.** A one-page worked comparison: the same support task in each era with the cost and pass rate of each.

### Chapter 10 Evals, Observability & Safety (evals-and-safety.md, 10 lessons)
- Proven math: 22/30 = 73 percent, 17+11+9+13 = 50 traces, 46/50 judge agreement, 91 to 86 percent gate. All consistent.
- Proven padding by duplicated sections: eval-types "Choosing metrics" (:53) repeats "Metrics" (:47); agent-evals "Because agents vary" (:153) repeats :148; regression-testing "Upgrading models" (:189) repeats "Model upgrades" (:183); observability "What to record" (:222) repeats "What to capture" (:213); safety-ethics-bias "Privacy basics" (:330) repeats :318; prompt-injection "Defense layers" (:291) repeats "What to do" (:285). Six of ten lessons.
- Proven sequence problem: chapters 4 to 9 tell the learner to "measure on your own test set" (prompting.md, building.md:10, retrieval.md:214, agents.md:8) before evals are taught in chapter 10. Prompt injection (:279) is needed from chapter 6 (safe rendering, MCP trust, tool results) and is taught four chapters later. Recommend a one-paragraph pointer in each, or move why-evals and prompt-injection earlier.
- Proven thin coverage for a young audience: one lesson (safety-ethics-bias, :312) covers bias, privacy, misuse and honesty. Nothing on copyright and training data, deepfakes, jailbreaks versus injection, regulation (EU AI Act), study and work integrity, or environmental cost.
- Checked: the Google Research page "Industrial Agentic Engineering" exists (fetched). Its abstract speaks of verifiable specifications, tests and a harness, but not of "setting the bar at the eval, not the demo" (:5). That wording may come from the slide deck, which I did not open. Inferred. The paper is cited in chapters 5, 9 and 10, so one source carries a lot of weight.
- Proven weak points: story at :35 invents "30 percent of answers are wrong" and the resume-name story (:349) gives no study. Real studies exist (University of Washington 2024, Bloomberg 2024 resume ranking tests) and would be a stronger, citable source.
- Good: trifecta example with an email assistant, binary judge rubric with a worked agreement number, error-analysis counting.

**Scores.** Clarity 4. Depth 4. Accuracy 4: all counts recomputed. Examples 4. Sequence 2: evals and injection are needed from chapter 4 and 6. Jargon 3: trace, rubric, trajectory are glossed, F1 and recall are not. Wording 3. Stories 4. Quizzes 3. Resources 4. Completeness 3: safety is one lesson.
**Overall 3.**
**Two strongest.** error-analysis (fifty traces, counted categories); prompt-injection (email assistant, breaking the trifecta).
**Two weakest, with rewrites.**
- safety-ethics-bias covers four topics in 15 minutes. Split it into: "Testing for bias" (keep the name-swap test), "Privacy and what you send to a model", "Misuse and red teaming", and add "Copyright, deepfakes and the rules" (EU AI Act in a paragraph).
- regression-testing (line 189) repeats model upgrades. Replace the second section with the real cost of a 60-case run in tokens.
**Single highest-impact improvement.** Add a pointer to why-evals and prompt-injection in chapters 4 to 6, or move both there.
**Missing lessons.** Jailbreaks versus injection; guardrail tooling; online evals and user feedback; synthetic test data.

### Chapter 11 The Tooling Landscape (tooling.md, 6 lessons)
- Proven repetition with earlier chapters: data-and-infra re-teaches HNSW, pgvector and "under a million vectors almost any option works" (tooling.md:158) which is word for word retrieval.md:163 to :166. Hugging Face is covered three times (breakthroughs.md:188, tooling.md:164, and the whole hugging-face lesson).
- Proven duplicates inside lessons: frameworks names the OpenAI Agents SDK twice in one paragraph (:118); resources list the Claude Agent SDK twice (:136, :138), Transformers.js twice (:221, :223) and Hugging Face Hub twice (:218, :222). provider-landscape "Where to call from" (:89) repeats "Where to call them" (:77).
- Proven sequence problem: coding-tools (what Claude Code, Codex, Cursor, Copilot are) sits in chapter 11, after chapter 5 has already taught five lessons that assume you have one. Move it to the start of chapter 5.
- Proven math: 50,000 x 1,536 x 4 bytes = 307 MB, 50 million gives 307 GB, correct.
- Checked: "close to a million models" on the Hub (:197, and breakthroughs.md:188) is stale. A secondary source reports about 3.0 million public models in August 2026. Inferred, since the source is secondary and the Hub page itself was not read. "Meta (Llama, and now the Muse models)" (:75) is right: Muse Spark launched 2026-04-08 as a closed model.
- Proven: tool names age fastest. Many tools are named and the track gives no date and no way to see which are stale except the Radar. The tooling-map lesson does teach the right skill (place it in a layer), which outlasts the names.
- Proven weak distractor: "Wait a year" (:27), "A new managed service" (:184).

**Scores.** Clarity 3. Depth 2. Accuracy 3: "close to a million models" is stale (about 3 million, secondary sources), Muse mention is vague but real. Examples 3. Sequence 2. Jargon 3. Wording 3. Stories 3. Quizzes 2. Resources 3: duplicated entries. Completeness 3.
**Overall 3.**
**Two strongest.** tooling-map (place any tool in a layer: the skill outlasts the names); frameworks (write the loop yourself first).
**Two weakest, with rewrites.**
- data-and-infra repeats vector databases word for word (tooling.md:158 vs retrieval.md:163 to :166). Replace its first section with: "Vector databases are covered in chapter 7 (/ai/docs/retrieval/vector-databases)." and keep the inference and sizing sections.
- hugging-face repeats open-models. Merge into open-models and update the count to about 3 million.
**Single highest-impact improvement.** Move coding-tools to chapter 5 and generate the tool lists from a dated data file like models.json so staleness is visible.
**Missing lessons.** A "which stack for which project" decision table.

### Chapter 12 Build Projects (projects.md, 5 projects)
- Proven: no language is named, no starter repository, no solution to compare with, no acceptance rubric. The audience includes people who cannot program. Nothing in the chapter is for them.
- Proven time estimates look low: project-docs-rag is 240 minutes for chunking, embedding, a vector store, a prompt, citations and a recall measurement (:31 to :41). project-ship-it is 240 minutes for evals, CI, tracing, rate limits, a spend cap, staging, production, a health endpoint and alerts (:121 to :128). Inferred: a beginner needs several days each. Proof would be a timed run by a new learner.
- Proven: projects mix levels without saying so. project-chat-assistant steps 1 to 7 are fine for a first project. project-tool-agent step 6 ("save the conversation so it can resume") and project-ship-it assume the reader has done all earlier ones.
- Proven weak quiz: "Why read fifty traces? ... For fun" (:144), "Nothing" (:83).
- Good: the Check yourself blocks. Ten test inputs including one that overrides the system prompt, a question the documents cannot answer, writing down the cost of 100 requests. These are the best learning moments in the track.
- Missing: a no-code project (build and evaluate a custom assistant in a chat app), an agent-built project with tests, and a small fine-tune.

**Scores.** Clarity 3. Depth 3. Accuracy 4. Examples 3. Sequence 3. Jargon 3. Wording 3. Stories 4. Quizzes 2: "For fun", "Nothing". Resources 3. Completeness 2.
**Overall 3.**
**Two strongest.** project-chat-assistant (the try-to-break story and ten test inputs); project-docs-rag (measure recall before and after each change).
**Two weakest, with rewrites.**
- project-ship-it, 240 minutes for seven steps. Replace the time with "A weekend. First pass: steps 1 and 3 only (evals, tracing)." Split steps 5 and 6 into a second project.
- project-mcp-server assumes the reader has finished the three projects before it. Add a "before you start" line listing which projects are required.
**Single highest-impact improvement.** Name a language, link a starter repository with a working solution for step 1, and add a "done looks like" rubric to each project.
**Missing lessons.** A no-code project (build and test a custom assistant in a chat app), a project where the agent builds the app and you write the tests, a small fine-tune.

### Chapter 13 Building Blocks, the math (building-blocks.md, 10 lessons)
- Proven math, every worked example recomputed and correct: dot and cosine (0.8), song dot products 0.74 and 0.36, matrix-vector [13, 9], softmax at T = 1, 0.5, 2 (0.66/0.24/0.10, 0.86/0.12/0.02, 0.50/0.30/0.19), x^2 slope 6, neuron outputs, gradient descent 0.6, 1.08, 1.46, 1.77, backprop L from 9 to 0.36, cross-entropy 1.737 bits and KL 0.737 bits, EMA 0.1, 0.19, 0.271 and 0.10, 0.01, 0.129, 0.206, attention weights 0.67 and 0.33 with output [6.7, 3.3]. The strongest accuracy result in the review.
- Proven unit clash: loss-and-gradient-descent says a 0.9 probability gives loss 0.11 (natural log, building-blocks.md:191, :203). entropy-and-kl gives the same 0.9 as 0.15 bits (:276). Both teach "cross-entropy is the training loss" and never say nats versus bits. A reader comparing the two lessons sees two answers for one quantity. Logarithms are never taught before they are used.
- Proven misleading example: moving-averages-and-adam (:309) ends at 0.206 and says the smoothed value "follows the overall trend". The raw gradients average 0.58 and the last two are 1.2 and 0.9, so 0.206 shows the start-from-zero bias, not the trend. Bias-corrected, 0.206 / (1 - 0.9^4) = 0.60. The lesson names the correction (:300) and then skips it in the example.
- Proven overstatement: "Repeat a few trillion times" (:186). Training runs have trillions of tokens but on the order of 10^5 to 10^6 update steps (GPT-3: about 300 billion tokens at batches of about 3 million tokens, so about 10^5 steps; inferred from the paper's reported batch size).
- Inferred imprecision: backprop cost is "about the same as the forward pass" (:236). The standard estimate is about twice (6N FLOPs per token for training versus 2N forward, Kaplan et al. 2020).
- Proven redundancy with chapter 7: dot product and cosine are taught here (:8 to :13) and again in similarity-metrics (retrieval.md:87 to :96) with different numbers. One of them should link to the other.
- Proven padding: matrices "In plain words" (:54), softmax "Why the exponential" (:90), derivatives "Why many directions" (:128), loss "What the loss number means" (:202), backprop "Why it is fast" (:238), entropy "In plain words" (:272), attention "In plain words" and "Worked example, read aloud" (:347, :350) each restate the section above in simpler words. Some are valuable as a second explanation (plain words after the formula is a good pattern here). The real duplication is in other chapters.
- Proven: only 3 of 10 lessons have a demo (dot, sampler, neuron/descent via EXPLAINERS in ai-curation.mjs). Attention-math and matrices benefit most from a demo and have none.
- Sequence: good order inside (vectors, matrices, softmax, derivatives, neurons, loss, backprop, then entropy, Adam, attention). The chapter now sits after projects and before internals, which works because chapter 2 links forward with "come back later". The ramp is steep at lesson 6 (backprop) and 7 (entropy: needs logs). No probability or log refresher. For a 16-year-old without calculus, derivatives-and-gradients and backprop are a wall.
- Good: the three-voice pattern (formula, plain words, story) is best here. The trophy and suitcase story (:368) and the foggy hill story are well chosen.

**Scores.** Clarity 4. Depth 4. Accuracy 4: about 30 worked numbers recomputed, one unit clash, one misleading smoothing example, two imprecise claims. Examples 5: small numbers, by hand, every lesson. Sequence 4. Jargon 3: logs and the chain rule are used before they are taught. Wording 4. Stories 4. Quizzes 3: the only chapter where keys are not mostly index 1 (13 of 20 are index 0), still guessable by length. Resources 5. Demos 4 (softmax sampler, no layout shift; see UX-15). Completeness 3.
**Overall 4.**
**Two strongest.** vectors-and-similarity (song recommendation, then plain words); loss-and-gradient-descent (learning-rate overshoot with real numbers).
**Two weakest, with rewrites.**
- moving-averages-and-adam, line 309: "The smoothed value changes gently and follows the overall trend." Replace with: "Because m starts at 0 the values run low: 0.10, 0.01, 0.129, 0.206. Adam divides by 1 - 0.9^4 = 0.344, giving 0.206 / 0.344 = 0.60, close to the raw average of 0.58." (recomputed)
- entropy-and-kl uses bits while the loss lesson uses nats for the same 0.9. Add: "log base 2 gives bits, natural log gives nats. Training code uses natural log: 0.9 gives 0.105 nats, which is 0.152 bits."
**Single highest-impact improvement.** Add a "Logs and probability refresher" lesson before loss and entropy, and demos for matrices and attention-math.
**Missing lessons.** Probability basics (expected value), logarithms, the chain rule in two examples, positional encoding and multi-head attention with numbers.

### Chapter 14 Models Under the Hood (model-internals.md, 6 lessons)
- Proven arithmetic error in a keyed quiz answer: fine-tuning says a rank-8 LoRA on a 4096 by 4096 matrix uses "two matrices of 4096 by 8, about 65 thousand numbers each, roughly 0.8 percent" (model-internals.md:92) and "131,000 total, under 1 percent" (:98). A 4096 by 8 matrix holds 32,768 numbers. The pair holds 65,536, which is 0.39 percent of 16,777,216. The quiz key "0.8 percent" (:117) and its explanation "about 131 thousand numbers" are wrong by a factor of two. The lesson's point (tiny share) survives.
- Proven simplification that disagrees with the source: rl-for-llms defines the GRPO advantage as reward minus group mean (:131, :134, quiz :156). DeepSeekMath (arXiv 2402.03300, section 4.1.2, fetched) defines it as (r_i - mean(r)) / std(r). Proven. For rewards 1, 0, 0, 1 the std is 0.5, so the paper's advantages are +1 and -1. Verified (see section 7).
- Proven placement slip: train-from-scratch puts "Before you start: do Building Blocks first" at the end of the lesson (:22) after "What to try after".
- Proven jargon late: "Parameters", "Epoch", "Validation set" are defined here (:8) although parameters appear in chapter 1. The glossary has parameter and epoch, so hover covers it. "Validation set" is not in the glossary.
- Proven math correct: 70B at 16, 8 and 4 bit = 140, 70, 35 GB; 17 x 24 = 408; 4-bit mapping of 0.37 to 0.33 on 16 levels; 128K tokens about 100,000 words; 8B at 4-bit about 4.5 GB.
- Proven redundancy: every lesson restates itself (fine-tuning "Data first" :100 repeats :94; local-models "Good uses" :213 repeats :207; quantization "Why generation is slow" :179 repeats "Serving" :173; rl "What can go wrong" :142 repeats "Limits" :136; modern-llm-architecture "The big picture" :63 repeats the list).
- Proven missing: tokenizer training (BPE), pretraining data curation, RLHF and DPO as methods (the chapter covers only RL with verifiable rewards), distillation as a lesson, synthetic data, how embedding models are trained.
- Inferred stale: modern-llm-architecture omits multi-head latent attention, sliding-window and hybrid linear attention, which current open models use. Proof would be a read of the 2025-26 model cards in models.json.
- Glossary gaps found by script (term used, not in glossary.txt): DPO, PPO, GRPO, HNSW, ANN, OAuth, stdio, latency, backoff, jitter, regularization, hyperparameter, precision and recall, MRR, F1, prefill and decode, context rot, cross-encoder, validation set, SIGTERM, OCR, BPE, logarithm, nats, SWE-bench, GraphRAG, reciprocal rank fusion, A2A. 107 terms exist.

**Scores.** Clarity 3. Depth 4. Accuracy 3: LoRA arithmetic wrong by 2x in a keyed answer, GRPO described without the paper's std division. Examples 4. Sequence 3. Jargon 3: DPO, PPO, GRPO not in the glossary. Wording 3. Stories 3. Quizzes 2. Resources 5. Completeness 3.
**Overall 3.**
**Two strongest.** modern-llm-architecture (reading "671B total, 37B active" on a model card); quantization-serving (70B is 140, 70, 35 GB; a 4-bit rounding example that is right).
**Two weakest, with rewrites.**
- fine-tuning, lines 92 and 98: "about 65 thousand numbers each, roughly 0.8 percent". Replace with: "32,768 numbers each (4096 x 8), 65,536 for the pair, about 0.4 percent of 16.8 million." Quiz: change the key to "0.4 percent" and the explanation to "about 65 thousand versus 16.8 million".
- rl-for-llms, line 131: "use each answer's reward relative to the group's mean as its advantage". Replace with: "DeepSeekMath subtracts the group mean and divides by the group's standard deviation. For rewards 1, 0, 0, 1 the mean is 0.5 and the std is 0.5, so the advantages are +1 and -1. Some later variants drop the division." (formula verified in arXiv 2402.03300)
**Single highest-impact improvement.** Fix the two errors, move "Before you start" in train-from-scratch to the top, add a BPE tokenizer lesson.
**Missing lessons.** Tokenizer training (BPE), preference tuning with DPO, distillation, pretraining data curation.

### Chapter 15 Production (production.md, 6 lessons)
- Proven arithmetic error: cost-and-latency worked example (production.md:44) says input is "90 percent" of the cost. Recomputed: input $0.144, output $0.027, total $0.171, input share 84 percent. The conclusion (trim input first) holds, the number is wrong.
- Proven math otherwise correct: $0.06, $0.015, $0.075, $2.25 per task.
- Proven padding: every lesson repeats itself. cost-and-latency "Levers in order" (:46) repeats "Levers" (:40); deploying "What the health endpoint checks" (:85) repeats :74; mlops "Minimum setup" (:119) repeats "A minimal setup" (:113); protocols "Keeping options open" (:153) repeats :148; human-in-the-loop "Avoid approval fatigue" (:187) repeats :182; advanced-rag "When to consider graph approaches" (:13) repeats the GraphRAG sentence in :5.
- Proven internal tension: human-in-the-loop warns that people "click yes without reading" (:182), then the story (:205) treats a 98 percent approval rate as evidence the limit can rise. A high approval rate can also mean rubber-stamping. The better signal is how many approved actions were later wrong.
- Proven sequence: reranking, query rewriting and GraphRAG are taught here (advanced-rag), but chapter 7 names reranking six times and depends on it. The cost lesson's missed example: it ends by saying caching "cuts the biggest part" and never computes it. A worked number with cache reads priced at a fraction would be the most useful line in the chapter.
- Proven: the chapter title and lesson promise "latency" but no latency number appears (time to first token, tokens per second).
- Good: the deploy checklist and spend-cap story are practical and unusual for a beginner course.

**Scores.** Clarity 3. Depth 3. Accuracy 3: the 90 percent figure is wrong (84). Examples 4. Sequence 3: reranking taught here, needed in chapter 7. Jargon 3. Wording 3. Stories 4. Quizzes 3. Resources 3. Completeness 3.
**Overall 3.**
**Two strongest.** deploying-ai-apps (a seven-step release, smoke test first); cost-and-latency (token cost arithmetic, once the 90 percent is corrected).
**Two weakest, with rewrites.**
- cost-and-latency, line 44: "About $0.17 per ticket, 90 percent of it input." Replace with: "About $0.17 per ticket, 84 percent of it input ($0.144 of $0.171). If 7,000 of the 8,000 input tokens are cached reads billed at a tenth of the input price, input per call falls to about $0.005 and the ticket costs about $0.06." (recomputed; the one-tenth price is Inferred from provider docs and must be checked before shipping)
- human-in-the-loop, line 205: "...approved 98 percent of the middle tier, so they raise the automatic limit to $25. Trust was earned with data." Replace with: "...sampled 50 approved refunds, found 2 that should have been refused, and raised the limit to $25 only for customers with a long history. A high approval rate alone can mean people stopped reading."
**Single highest-impact improvement.** Correct the cost split and add the cached-cost worked example.
**Missing lessons.** A latency lesson with time to first token and tokens per second; data protection basics for a launch.

### Chapter 16 Creative & Applied (creative-and-applied.md, 2 lessons)
- Proven: two lessons, both about one vendor's workflow (Remotion with Claude, Claude Code's /deep-research workflow, creative-and-applied.md:39, :54). The title promises creative and applied use. Nothing on writing, images, music, voice, spreadsheets, study or research by a non-programmer.
- Proven: deep research is useful to every reader on the "use AI at work" route, yet it sits in an Advanced chapter, after 15 chapters.
- Proven duplicates: "Directing well" (:13) repeats "A workable loop" (:7); "Writing a good question" (:47) repeats :42.
- Inferred: resource "awesome-claude-5-5-videos" (:23) needs checking. The link checker did not flag it as broken.
- Good: the deep-research worked example (check the three claims your decision depends on) is excellent practical advice.

**Scores.** Clarity 4. Depth 2. Accuracy 3: product behaviour matches the live docs, scope is narrow. Examples 3. Sequence 2: deep research is needed by every reader, sits in an advanced chapter. Jargon 3. Wording 3. Stories 4. Quizzes 2. Resources 3. Completeness 1.
**Overall 2.**
**Two strongest.** deep-research (check the three claims your decision depends on); ai-motion-design (a scene is a function of the frame number: opacity = frame / 30).
**Two weakest, with rewrites.** Both are thin. Rename the chapter "Everyday and Applied" and add four lessons: "Using chat apps well", "Study and writing with AI, and keeping it honest", "Analysing a spreadsheet with a model", "Images, voice and music tools". Move deep-research to chapter 4.
**Single highest-impact improvement.** The four new lessons: they serve the "use AI at work" goal that the rest of the track mostly skips.
**Missing lessons.** Those four.

### Chapter 17 Prompting Techniques Reference (imported, 18 lessons)

**Chapter 17, Prompting Techniques Reference (18 imported lessons, content/ai/prompting-reference/).** Judged on selection and integration, not the DAIR.AI prose.
- Proven: every imported lesson has 0 quiz questions, 1 resource and no story (src/generated/ai.json). Levels run 1 to 3 per technique (shown as Beginner, Core, Advanced) although the chapter is in the Advanced tier, and estimates are 3 to 8 minutes. CLAUDE.md says every topic needs a quiz; the build exempts imports.
- Proven: the page repeats the heading (H1 "Chain-of-Thought Prompting", then H2 "Chain-of-Thought (CoT) Prompting") and puts the "Imported lesson" callout between the word list and the content (shots/d-cot-light.jpg).
- Inferred: the figure has a white background (visible in d-cot-light.jpg) and probably stays white in dark theme; the dark view was not captured.
- Inferred: of the 18 techniques, about ten (Generated Knowledge, ART, Active-Prompt, APE, Directional Stimulus, GraphPrompts, Meta Prompting, Multimodal CoT, PAL, Reflexion) are 2022 to 2023 research ideas that chapter 9 says largely faded. They are worth a line each, not a lesson each. Proof would be a test of each on a 2026 model.
**Scores.** Clarity 3. Depth 3. Accuracy 4. Examples 4: the odd-numbers CoT example and the DAIR prompts are runnable. Sequence 3. Jargon 2: techniques use unexplained terms (policy, retrieval, graph neural network). Wording 3. Stories 1. Quizzes 1. Resources 2: one link each. Completeness 3. **Overall 3.**
**Strongest.** zeroshot, fewshot. **Weakest.** graph (GraphPrompts), art. Rewrite: keep eight (zero-shot, few-shot, CoT, self-consistency, prompt chaining, ReAct, RAG, reflexion), give each a quiz question and a "try it" box, mark the rest "historical" with one paragraph each.
**Single highest-impact improvement.** Add one quiz question and an era tag to each retained lesson.

### Chapter 18 Keep Up (keep-up.md, 3 lessons)
- Proven math nit: reading-benchmarks (:91) says plus or minus 1.5 points for 87 percent on 500 questions. Standard error is sqrt(0.87 x 0.13 / 500) = 1.5 points, so 1.5 is one standard error. A 95 percent range is about plus or minus 3. The conclusion (0.4 point gap is noise) is right either way.
- Proven self-contradiction: awesome-lists teaches "pick one, take three items" and then lists eight awesome lists as resources (:61 to :69). sources-to-follow says pick three to five and lists seven.
- Proven duplicate: the awesome-lists "How to use a list" text opens with the same sentence twice (:39, :42).
- Good: the "who benefits from you believing it" question (:14), saturation and contamination checklist.
- Missing: how to read a paper in 15 minutes, how to handle model deprecations in your own work, how to spot AI-generated misinformation.

**Scores.** Clarity 4. Depth 2. Accuracy 3: standard error stated as the range. Examples 3. Sequence 3. Jargon 3. Wording 3. Stories 3. Quizzes 2. Resources 3: eight awesome lists against its own advice. Completeness 2.
**Overall 3.**
**Two strongest.** reading-benchmarks (saturation, contamination, vendor versus independent, model plus harness); sources-to-follow ("who benefits from you believing it").
**Two weakest, with rewrites.**
- reading-benchmarks, line 91: "the noise is around plus or minus 1.5 points". Replace with: "the standard error is about 1.5 points, so a 95 percent range is about plus or minus 3. A 0.4 point gap is well inside it."
- awesome-lists lists eight lists after teaching "pick one" (:61 to :69). Keep two and delete the repeated opening sentence (:39, :42).
**Single highest-impact improvement.** Add "Read a paper in 15 minutes" and "What to do when your model is deprecated".
**Missing lessons.** Those two.

## Part A, cross-track content findings

**The five biggest content problems**
1. Duplicated sections. In every chapter I read, lessons contain a second section that restates the first (examples in Part A, about 60 lessons). Likely cause (Inferred): the lint target of about 350 words and the "worked example" rule were met by appending sections. Proof: remove the second sections and re-run `lint-ai`; most lessons fall under 300 words and still teach the same thing.
2. Quizzes that can be passed without reading. 68 percent of keys are the middle option, 84 percent are the longest option, distractors are often throwaways ("It has a hashtag", "For fun", "Computers were banned"), and every lesson has exactly two questions with three options.
3. Numeric and factual slips in the lessons that teach by number: LoRA share, cost split, GRPO advantage, nats versus bits, ±1.5 as a range. All are small and all would be caught by a script that recomputes worked examples.
4. The build chapters teach without code. No curl, no schema, no loop, no config block, no language chosen for the projects. A reader finishes "Building with the API" without having seen a request.
5. Sequence debt. Evals, prompt injection and caching are needed before they are taught; coding tools are named after their use; chapter 9 re-teaches chapter 8; chapters 4 and 5 use agent vocabulary first.

**Repeated patterns that should change globally**
- Remove the "second pass" sections and let the lint measure something else (see Part C guardrail).
- The template is mechanical. 103 headings are "Common mistake" (one per lesson), nearly every lesson has "A worked example", and 80 of 119 stories start with "A" ("A student", "A team", "A user", "A company"). Vary the story form: some should be a real, cited incident (the lawyer case, the Gender Shades study, the METR result).
- Invented numbers are not labelled. Label every illustrative result "Example (invented)".
- Add `quiz`: rotate the key position, make options equal length, add one "predict the output" question per lesson.
- Write steps one per line (or fix the renderer, UX-01).
- Positive: zero em dashes (checked), only 14 sentences over 30 words in 380 KB of text, average grade 8.5. Wording is a strength.

**Redundancy between chapters**

| Topic | Taught in | Action |
|---|---|---|
| Chinchilla 20 tokens per parameter | ch1 transformer-era and scaling-laws | keep in scaling-laws |
| AlexNet, ImageNet, Deep Blue | ch1, ch3 | link back |
| Dot product and cosine | ch7 similarity-metrics, ch13 vectors | one lesson, one link |
| Model routing (large plans, small scans) | ch5, ch6 (twice) | one lesson |
| Agent loop, workflow versus agent | ch8, ch9 agents-era | delete agents-era |
| Anthropic context-reset and evaluator finding | ch8 long-running, ch9 harness (twice) | once, in ch9 |
| Vector databases, HNSW, pgvector | ch7, ch11 | delete from ch11 |
| Hugging Face | ch3, ch11 (twice) | one lesson |
| Temperature and top-p | ch2 (twice), ch13 | one lesson plus the demo |

**Three lessons to cut or merge**
1. agents-era (ch9) into what-is-an-agent and agent-loop (ch8).
2. data-and-infra (ch11): its vector-database text is word for word chapter 7; keep sizing and quantization as a short section of local-models.
3. being-ambitious (ch5): fold the "ask for the outcome" idea into agentic-coding-workflow.

**Facts verified against primary sources (at least five per chapter, by recompute or fetch).** See the verification log in section 7. Fetched sources that matched the lessons: Rieseberg's four kinds, Osmani's six context types, the dynamic-workflows doc (workflows, /deep-research, ultracode, verifier voting), Google Research "Industrial Agentic Engineering" page (exists, but see ch 5 and 10 notes), METR (16 developers, 19 percent), Anthropic image token sizes, DeepSeekMath GRPO formula, OPRO 80.2 percent, the model atlas rows for Claude Opus 5.5 and Gemini 4 Argon. Not verifiable here: the OpenAI GPT-6 page and the OpenAI "Harness engineering" page both returned 403.

## 4. Part B: UI and UX review

Tested in agent-browser session `aireview`. Desktop 1400 by 900 and mobile 390 by 800, light and dark. Axe (WCAG 2 A and AA) on 12 page types in both themes at desktop. Screenshots are in `shots/` (JPEG, quality 55 to 60).

### Findings table

| ID | Sev | Page, viewport, theme | Finding | Evidence | Fix |
|---|---|---|---|---|---|
| UX-01 | P1 | Agent loop lesson, desktop, light (also the 5 projects, tool-use, deploying) | A numbered list written on one source line renders as one paragraph with a single "1." (the five steps run together). Proven. | shots/d-lesson-loop-2.jpg; agents.md:74; projects.md:8, :38, :68, :98, :128; building.md:210; production.md:83 | Split the steps onto separate lines in the source (8 edits), or have `build-ai.mjs` split inline "N." markers into a list. Add a lint check. |
| UX-02 | P1 | Every lesson with defined terms, desktop | The inline term definitions never reach the page. `build-ai.mjs:31 to :48` writes `<abbr title>`; the rendered HTML has 0 `<abbr>`. Only the collapsed "Words on this page" box works. Proven. Even if fixed, `title` tooltips are mouse-only (no touch, no keyboard). | content/ai/how-llms-work/transformers-and-attention.md:7 vs out/ai/docs/how-llms-work/transformers-and-attention.html; `document.querySelectorAll('abbr').length` = 0 on tokens-and-context and transformers lessons | Allow the element through the markdown pipeline, and replace the native tooltip with a focusable `<Term>` popover that opens on tap and focus. |
| UX-03 | P1 | 12 page types, desktop, light | Secondary text `#737373` on `#efefef`, `#f1f1f1`, `#f5f5f5` is 4.12, 4.20, 4.35:1, below 4.5:1. Nodes: /ai 162, /ai/map 37, lesson 23 to 26, softmax 24, /ai/models 74, /ai/library 1,153, /ai/glossary 110, /dsa 128, /dsa/patterns 44, DSA topic 71. Proven (axe). | a11y runs; selectors `.mt-1\.5`, `.tabular-nums`, `.text-lg`, `.max-w-2xl` | Set `--color-fd-muted-foreground: #666666` in `:root` (4.99, 5.08, 5.27:1). One line in global.css fixes all pages. |
| UX-04 | P1 | /ai and /dsa dashboards, desktop, dark | The hero CTA ("Start: ...") is `#8f9bfb` text on a white pill: 2.54:1. Proven. | axe on /ai dark and /dsa dark; Dashboard.jsx:21 `bg-white ... text-fd-primary`; shots/d-ai-dark.jpg | In dark theme use `text-fd-primary-foreground` on a darker pill, or keep the primary color from light theme. |
| UX-05 | P1 | /, /ai, /dsa | Empty `<title>` on the landing page and both dashboards (axe `document-title`). Other pages have titles without the site name ("Learning map", "The agent loop"), so browser tabs and history are ambiguous. Proven. | axe; `document.title` = "" on the three | Export `metadata` from these pages and a title template "%s \| AI Engineering". |
| UX-06 | P1 | /ai dashboard radar, light and dark | "Read the lesson" links inside paragraphs differ from the text by color alone: 1.32:1 (light), 1.19:1 (dark). Link text is the same on all 11 rows. Proven. | axe `link-in-text-block`, 11 nodes | Underline links in body text and use descriptive text ("Read: Prompt injection"). |
| UX-07 | P1 | Lesson with stepper, desktop | ArrowRight on the focused "Next step" does not advance (label stayed "Step 1 of 8"). The first Tab stops are sidebar controls (collapse, search, dashboard, map, then the 18 chapter buttons) before any content, and no skip link was found. Proven. | agent-browser key tests; focus order printed | Add arrow-key handling to the stepper, a "Skip to lesson" link, and `aria-live` on the step text. |
| UX-08 | P1 | Lesson, mobile 390, light | Many targets are under 44 px: stepper arrows 36 by 36, quiz options 30 high, header icons 34, theme toggle 54 by 28, "Start learning" 32 high, resource links 20 high, anchor-copy buttons 24 by 24. Proven. | `getBoundingClientRect` list on agent-loop at 390 | Min height 44 for quiz options and stepper; larger header hit areas via padding. |
| UX-09 | P1 | /ai/library, desktop and mobile | One list of all 361 resources: 32,510 px tall on desktop, 43,276 px on mobile. Filters are by kind only. No sort, no chapter or goal filter, no "free" flag, no pagination. Proven. | scrollHeight; shots/d-library-light.jpg | Group by chapter or paginate, add a chapter filter and free/paid flag. |
| UX-10 | P1 | /ai dashboard vs /ai/map, both tracks | Chapter numbers disagree. Dashboard counts within a tier ("Production" is Chapter 2, "Keep Up" is Chapter 5, `Chapter {i + 1}` in Dashboard.jsx), the map counts globally (15 and 18). DSA "Advanced" chapters restart at 1. Proven. | link text read from /ai; shots/d-map-light.jpg | Use one global number everywhere (the map's). |
| UX-11 | P2 | Learning map, Roadmap and List tabs | The goal filter exists only on the Map tab, although the page intro says "Pick a goal to see your route". The List tab truncates the outcome sentence with an ellipsis (chapters 1 and 2). Proven. | shots/d-map-roadmap.jpg, d-map-list.jpg | Show goal chips above all three tabs; wrap the outcome text. |
| UX-12 | P2 | Learning map, Map tab, desktop | About 40 grey edges cross between stages and are hard to follow; dimmed chapters are unreadable; the chapter detail panel opens about 900 px below the map, so a click gives no visible response above the fold. Proven. | shots/d-map-light.jpg, d-map-detail.jpg (no panel visible), d-map-detail2.jpg | Open the detail in a side drawer, or scroll to it with a visible highlight; show only selected-chapter edges. |
| UX-13 | P2 | Lesson header, all | Order is title, summary, status button, rule, then three unlabeled gray chips "Core · 15 min · Agents". "Advanced" is both a lesson level and a tier name; imported lessons in the Advanced tier all say "Core". Proven. | shots/d-lesson-loop-top.jpg, d-cot-light.jpg; ui.jsx:4 `LEVELS` | Label the row ("Level: Core · 15 min · Chapter 8"), rename lesson levels (Starter, Core, Stretch). |
| UX-14 | P2 | Agent loop demo | "Model / Tools / You" look like tabs but are `<span>` actors (Stories.jsx:23). The demo sits above the text that explains it, before the reader knows what "context sent on the next call" means. Proven for the markup. | shots/d-lesson-loop-top.jpg | Render as a legend with a caption, or put the demo after "The steps". |
| UX-15 | P2 | Softmax lesson | The demo uses scores 2, 1.5, 0.5, -0.5 for cat, dog, fish, car; the lesson worked example uses [2.0, 1.0, 0.1]. The reader cannot reproduce the numbers with the demo. Proven. | shots/d-softmax.jpg; building-blocks.md:82 | Use the lesson's logits in the demo (or add a "load lesson example" button). |
| UX-16 | P2 | Math lessons | Formulas appear as plain text ("p(i) = e^(zᵢ/T) / Σⱼ e^(zⱼ/T)"), with ^ and Unicode subscripts. Proven. | shots/d-softmax.jpg | Add KaTeX or MathML through the markdown pipeline. |
| UX-17 | P2 | Imported lesson /ai/docs/prompting-reference/cot | No story, no quiz, one resource; duplicate H1 and H2; "Imported lesson" callout sits between the word list and the content; diagram has a white background (dark appearance not captured). Proven except the last. | shots/d-cot-light.jpg | Add a quiz and story, move the callout to the footer, drop the repeated heading. |
| UX-18 | P2 | /ai dashboard, desktop | Card progress bar touches the description text and the lesson pills have tight vertical rhythm. The "2. Advanced" group is below the fold in the sidebar at 900 px. Proven. | shots/d-ai-light.jpg | Add `mt-3` before the bar; collapse tier 1 chapters when a tier 2 chapter is current. |
| UX-19 | P2 | Landing / | The cards give no audience, time or prerequisite. "Updated regularly" is vague. "137 lessons" counts 18 imported reference pages; total reading time is 44 hours of which 17 are projects. Proven. | shots/d-landing-light.jpg; ai.json totals | Add "about 44 hours, 27 without the projects", prerequisite line, last-updated date. |
| UX-20 | P2 | Lessons | Time estimates look high for the text: lessons average 394 words (about 2 minutes to read) and are labeled 10 to 15 minutes. It is not stated whether quiz, demo and resources are included. Inferred. Proof: time three learners. | lint-ai output; chapter files | Say what the minutes include. |
| UX-21 | P2 | DSA, dark | Pattern card text `#3e3e3e` on `#191919` is 1.64:1 (number-theory card); code comments `#6a737d` on `#191919` are 3.65:1 (11 nodes on a DSA topic). Proven. | a11y runs dsapat dark, dsatopic dark | Use theme tokens in Diagram, use a higher-contrast comment color in the dark code theme. |
| UX-22 | P2 | Mobile lesson | Two stacked sticky bars (site bar and the table-of-contents bar) take about 96 px of 800. Proven by screenshot; effect on reading is Inferred. | shots/m-loop-light.jpg | Merge them or hide the TOC bar on scroll down. |
| UX-23 | P2 | /ai dashboard radar | Mixes releases with tutorials ("How to be more ambitious" is dated 2026-10-13 like a release); one row is dated only "2026". Proven. | shots/d-ai-bottom.jpg | Separate "Releases" from "Reads"; require full dates. |
| UX-24 | P2 | Lesson footer | No "was this useful" control, no per-lesson last-updated date, no report-an-error link. The benchmark docs site has a feedback widget and Copy Markdown. Proven by comparison. | shots/bench-fumadocs.jpg | Add feedback and "Report an error" with the lesson slug. |

What I did not find: horizontal scroll (none at 390 on 7 pages: /, /ai, /ai/map, lesson, softmax, models, library) and layout shift in demos (page height constant through 8 stepper steps and the sampler). Dark mode of the learning map, loop lesson, softmax, models, library, glossary, cot and a text lesson has 0 axe violations.

### The five changes that would improve the learner experience most
1. Fix the rendering defects: steps as lists (UX-01) and working term definitions (UX-02). Both are broken promises on the page.
2. One-line contrast fix plus the dark hero button (UX-03, UX-04). Small effort, every page benefits.
3. Remove duplicated sections and put each demo next to the paragraph it illustrates. Lessons get shorter and the demo is no longer a mystery.
4. Put runnable code and a starter in the build chapters and projects.
5. Replace the quiz pattern (rotate keys, equal lengths, one predict-the-output question) and show a result and "next" at the end of a quiz.

### Proposed information architecture
Sidebar: replace 18 flat chapters plus a tier label with the five stages already on the map (Foundations, Use AI well, Build with AI, Trust and ship, Go deeper), each collapsed, with the current stage open. Keep numbering global (1 to 18). Add a one-line orientation above the content: "Stage 3 of 5 · Chapter 8 of 18 · Lesson 3 of 10". Put Dashboard, Map and Reference at the top, not in two places.

Lesson page, in this order: title; a labeled row (Level, minutes, chapter); one-sentence summary; "You will be able to" (the chapter outcome style, one line per lesson); Picture this; text with the demo placed after the section that introduces it; Words on this page (open on first visit, collapsed after); Check yourself with a result line; Go deeper (max five links, one "start here"); one primary button "Mark done and continue" and one text link back to the map. Drop the top status button (the sidebar dot already shows state), or make it a single sticky control. Reasons: today the status button is above the badges, "Start learning" then becomes "Mark as done", and a second "Mark done" sits at the bottom, so the page asks for the same action twice with two different labels.

### What already works and should not change
- Cmd+K search: instant, highlights the match, shows the breadcrumb, works on both tracks (shots/d-search-ai.jpg).
- Demos reserve their height: page height stayed 2,928 px through the sampler and 3,104 px through all stepper steps.
- Sidebar auto-opens the current chapter and scrolls it into view; lesson dots show state.
- Learning map goal routes ("Your route: 1 to 2 to 4 ...") and the stage names.
- Resource rows with a "why" sentence and a stars count; vendor-confirmed versus tracker-only labels in the model atlas.
- Picture-this callout, prev and next with minutes and level, quiz feedback that explains the answer.
- Landing, dashboard and layout are one shared implementation for both tracks, so a change appears in both.

### Benchmark comparison

| Pattern | roadmap.sh/ai-engineer | Fumadocs docs | This site |
|---|---|---|---|
| Orientation | One big map; "What is an AI Engineer?" accordion; "Join 36,656+ tracking" social proof | Plain sidebar, groups with icons | Map with goal routes (better), but chapter numbers disagree |
| Per-topic resources | Click a node, a drawer lists links | Cards ("Learn More") | "Go deeper" at the bottom of each lesson (good), no drawer |
| Progress | Account, sign-up wall | None | Local, no sign-up (better), no export |
| Personalize | "Personalize" tab | Product switcher | Goal chips on the map only |
| Projects | Separate "Projects" tab | n/a | Chapter 12, 17 hours with no starter |
| Feedback | "AI Tutor" button | "How is this guide? Good / Bad", Copy Markdown, Ask AI | None |
| Cookie and ad noise | Consent banner, partner ad, tutor bubble covering the map (shots/bench-roadmapsh.jpg) | None | None (better) |
| Page chrome | Dense header | Calm, one H1, short intro | Calm, but two stacked sticky bars on mobile |

Where ours is better: no wall, no ads, a real reading order with explanations, quizzes, and honest "what is hype" content. Where theirs is better: per-node resource drawer, a visible "Projects" entry, a feedback widget, and a copy-as-markdown action.

## 5. Part C: component consistency audit

### Inventory

| Pattern | Where it lives | Shared? |
|---|---|---|
| Page container | `[grid-area:main] min-w-0 mx-auto w-full max-w-Nxl px-4 py-8 md:px-8` in Dashboard.jsx:15, Directory.jsx:34, :80, :100, app/ai/map/page.tsx:8, app/dsa/patterns/page.tsx:8, app/dsa/patterns/[id]/page.tsx:20 | No. 7 copies, 4 widths (6xl, 5xl, 4xl, 3xl) |
| Card (bordered panel) | `rounded-xl border bg-fd-card` plus `p-4`, `p-5` or none, in 20 places (LessonParts, Stories, MathDemos, TopicExtras, SortVisualizer, Walkthrough, Patterns, ProblemList, Directory, LearningMap) | No |
| Fumadocs Card/Cards | Dashboard chapter cards, LearningMap chapter cards, Patterns Tile | Yes (library), wrapped three ways |
| Pill / badge | `Pill` in dsa/ui.jsx, `LevelBadge` | Yes, used by 8 files |
| Chip / filter button | Directory.jsx:6 `Chip`; LearningMap.jsx:75 goal chip; LearningMap.jsx:28 chapter chip; Stories.jsx:76 story chip | No, 4 variants |
| Buttons | `buttonClass` + `roundIcon` in ui.jsx (Walkthrough, SortVisualizer, explainerKit, progress, TopicExtras, LearningMap) | Mostly |
| Section headings | `<h2>` with text-lg, text-xl or text-2xl (see below) | No |
| Callout | Fumadocs `Callout` in Patterns and LessonParts; `Story` aside in LessonParts.jsx:67 | Partly |
| List rows with dividers | `divide-y divide-fd-border rounded-xl border bg-fd-card` in 7 places | No |
| Tabs | Fumadocs `Tabs` in LearningMap and Patterns | Yes |
| Progress bar | `Bar` in ui.jsx | Yes |
| Search | `components/search.tsx`, two API routes | Shared component |
| Stat lines | `text-[11px]` / `text-xs` lines under cards, three variants | No |
| Hero | `Dashboard` header | Yes (both tracks) |
| Detail panel | `ChapterPanel` (LearningMap), `PatternDetail` (Patterns) | No, similar |
| Stepper and quiz | `Walkthrough.jsx` (Quiz), `explainerKit.jsx`, Stories.jsx demos | Quiz is shared; steppers are not |
| Demo frame | `my-6 rounded-xl border bg-fd-card p-4/p-5` in Stories, MathDemos, SortVisualizer, TopicExtras, Walkthrough | No |
| Docs template | `app/ai/docs/[[...slug]]/page.tsx` and `app/dsa/docs/[[...slug]]/page.tsx` | No, 80 percent identical |
| Track layout | `app/ai/layout.tsx` and `app/dsa/layout.tsx` | No, 6 changed lines |
| Fumadocs components in use | DocsLayout, DocsPage, DocsBody, DocsTitle, DocsDescription, Card, Cards, Callout, Tabs, Tab, DynamicCodeBlock, buttonVariants | n/a |

### Variants found (count by grep over src/)

| Property | Variants | Locations |
|---|---|---|
| Radius | rounded-full 25, rounded-xl 20, rounded-md 7, rounded-lg 6, rounded-3xl 1 (hero), rounded-2xl 1 (LearningMap.jsx:30) | LearningMap.jsx:30 uses 2xl for its card while every other card is xl |
| Font size | text-sm 51, text-xs 46, text-[11px] 10, text-[10px] 4, text-[12px] 1 | custom pixel sizes in Diagram, PrefixSumExplainer, Patterns.jsx:59, LearningMap.jsx:97, :98, :122 |
| h1 | `text-3xl font-extrabold` (Directory x3), `text-4xl font-extrabold` (LearningMap.jsx:157, Patterns.jsx:27, :102), `text-3xl sm:text-4xl` (Dashboard.jsx:19), `text-5xl` (TrackPicker) | 4 scales |
| h2 | `text-lg font-bold` (Patterns.jsx:74, LearningMap.jsx:117), `text-xl font-bold` (Dashboard, Directory), `text-2xl font-bold tracking-tight` (LessonParts x2, TopicExtras.jsx:34, LearningMap.jsx:32) | 3 scales |
| Chip | `px-3 py-1 text-sm` (Directory, goal chip, Stories), `px-2.5 py-0.5 text-xs` (map chip, `Pill`) | 2 paddings, 4 implementations |
| Success and danger | `text-emerald-700 dark:text-emerald-300` and `text-rose-700 dark:text-rose-300` in Walkthrough.jsx:17, explainerKit.jsx:12, :13, :32, PrefixSumExplainer.jsx:36 to :50, MathDemos.jsx:79, :81, SortVisualizer.jsx:27 | 5 files, hard-coded |
| White on gradient | Dashboard.jsx:17 to :25 (`bg-white`, `bg-white/15`), StatusDot.jsx:9, Diagram.jsx:45 `fill-white` | Not theme-aware (UX-04) |
| Kind labels | `KIND` in LessonParts.jsx:8, `KINDS` in Directory.jsx, `KINDS` in ai-curation.mjs:93 | 3 definitions of one list |
| Timeline dot | identical `<span className="absolute -left-[2.6rem] top-1 size-4 rounded-full border-4 ...">` in Patterns.jsx:73 and LearningMap.jsx:116 | duplicated |

### Duplicated implementations and what the shared component should be

| Duplicate | Shared component | Props | Files that change |
|---|---|---|---|
| Roadmap in Patterns.jsx:64 and LearningMap.jsx:110, List in Patterns.jsx:80 and LearningMap.jsx:134 | `Roadmap`, `RankedList` | `groups: {id,title,note,items}[]`, `renderItem` | Patterns.jsx, LearningMap.jsx |
| Two docs page templates | `LessonPage` | `topic`, `slots: {beforeBody, afterBody}` | the two `page.tsx` |
| Two track layouts | `TrackLayout` | `track: 'ai' \| 'dsa'` | the two `layout.tsx` |
| Page container string x7 | `PageContainer` | `width: 'wide' \| 'normal' \| 'narrow'` | Dashboard, Directory, map and pattern pages |
| `ResourceRow` and `ProblemList` row | `ListRow` | `leading`, `title`, `meta`, `trailing` | LessonParts, ProblemList, Directory |
| Chip x4 | `Chip` | `on`, `size`, `onClick` | Directory, LearningMap, Stories |
| Demo frame x5 | `DemoFrame` | `title`, `caption`, `children` | Stories, MathDemos, SortVisualizer, TopicExtras, Walkthrough |
| Chapter cards (Dashboard, LearningMap Roadmap, Patterns Tile) | `ChapterCard` | `href`, `title`, `blurb`, `progress`, `meta` | Dashboard, LearningMap, Patterns |
| Heading scale | `SectionHeading` | `level: 1 \| 2 \| 3`, `aside` | all `<h1>`/`<h2>` in src/components |

### Placement and naming
Shared code sits in `components/dsa/` and AI files import it with `../dsa/` (LessonParts.jsx:4 to :5, LearningMap.jsx:7, Directory.jsx:3, and the AI docs page imports from `@/components/dsa/` three times). Recommended structure:

```
components/shared/  ui.jsx (Pill, Bar, Chip, buttonClass, LEVELS), progress.jsx, StatusDot.jsx, OverallProgress.jsx,
                    Dashboard.jsx, TrackLayout.tsx, LessonPage.tsx, PageContainer.jsx, Roadmap.jsx, DemoFrame.jsx,
                    Quiz.jsx (moved out of Walkthrough.jsx), explainerKit.jsx, Term.jsx
components/ai/      LearningMap, LessonParts (resource, terms, story), MathDemos, Stories, Directory (Library, Atlas, Glossary, Radar)
components/dsa/     Patterns, Diagram, the four explainers, Walkthrough, SortVisualizer, TopicExtras (Practice, TopicBadges)
```

### UI spec (one source of truth)
Tokens go in `app/global.css` so both themes work. Exact values:

```css
:root {
  --color-fd-primary: oklch(0.51 0.23 277);
  --color-fd-muted-foreground: #666666;            /* 4.99 to 5.27:1 on the three card backgrounds */
  --color-success: oklch(0.45 0.12 160);  --color-danger: oklch(0.48 0.19 20);
  --color-warning: oklch(0.50 0.12 75);   --color-info: var(--color-fd-primary);
}
.dark {
  --color-fd-primary: oklch(0.72 0.14 277);
  --color-success: oklch(0.80 0.14 160);  --color-danger: oklch(0.78 0.13 20);
  --color-warning: oklch(0.82 0.13 85);
}
@theme inline { --color-success: var(--color-success); /* repeat for danger, warning, info */ }
```
(The oklch values are proposals. Check each pair with the axe run before adopting; I computed only the muted-foreground contrast.)

| Token | Value | Owner |
|---|---|---|
| Spacing | section gap `space-y-10`, card padding `p-5`, row padding `px-4 py-3`, inline gap `gap-2` | PageContainer, Panel, ListRow |
| Radius | card and row group `rounded-xl`, control `rounded-lg`, pill and chip `rounded-full`, hero `rounded-3xl` only | Panel, Chip, Pill |
| Type | h1 `text-3xl font-extrabold tracking-tight sm:text-4xl`; h2 `text-xl font-bold`; h3 `text-base font-semibold`; label `text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground`; body `text-sm`; caption `text-xs`. No `text-[Npx]`. | SectionHeading |
| Color roles | primary = `fd-primary`; muted = `fd-muted-foreground`; success/danger/warning/info = the tokens above via `text-success bg-success/15 border-success` | Callout, quiz feedback, demos |
| Elevation | border only (`border`), no shadow except the hero (`shadow-xl shadow-fd-primary/20`) | Panel |
| Interaction | hover row `hover:bg-fd-accent/60`; hover chip `hover:border-fd-primary/60`; focus `focus-visible:outline-2 focus-visible:outline-fd-primary`; active chip `bg-fd-primary text-fd-primary-foreground`; disabled `disabled:opacity-50 disabled:pointer-events-none`; minimum target 44 px on touch | Chip, buttonClass |

### Components to build or extract, in priority order

| # | Component | Props and variants | Replaces | Visible difference |
|---|---|---|---|---|
| 1 | `PageContainer` | `width: wide (6xl) normal (5xl) narrow (3xl)` | 7 class strings | Library 4xl and glossary 3xl become consistent, models 5xl stays |
| 2 | tokens: success, danger, muted | CSS variables (above) | emerald/rose in 5 files, `#737373` | muted text darker, quiz and demo colors identical in both themes |
| 3 | `SectionHeading` | `level`, `aside` | 9 heading variants | h1 and h2 sizes unify (map, patterns h1 shrink to 3xl on mobile only) |
| 4 | `Chip` | `on`, `size sm \| md` | 4 implementations | goal chips on the map match the library filters |
| 5 | `Panel` | `padding`, `as` | 20 `rounded-xl border bg-fd-card` strings, LearningMap 2xl | LearningMap card loses 2xl radius |
| 6 | `ListRow` and `RowList` | `leading`, `title`, `meta`, `trailing` | ResourceRow, ProblemList row, atlas row, glossary row | none |
| 7 | `Term` | `term`, `def` (focusable popover) | the dropped `<abbr>` | working definitions on touch and keyboard (UX-02) |
| 8 | `DemoFrame` | `title`, `caption` | 5 wrappers | consistent frame and caption |
| 9 | `Roadmap`, `RankedList` | `groups`, `renderItem` | duplicated views | none |
| 10 | `LessonPage` | `topic`, `slots` | two docs templates | DSA lessons can gain story, terms, quiz with no new code |
| 11 | `TrackLayout`, `ChapterCard`, `StatBar` | as above | layouts, cards, stat lines | none |

### Guardrail
Add `scripts/check-ui.mjs` to `npm run verify`. It greps `src/` and fails on: `text-\[\d+px\]`; `(emerald|rose|amber|sky|violet|indigo)-\d` outside an allow-list; `grid-area:main` anywhere except `PageContainer`; `rounded-(2xl|md)` outside an allow-list; any new `rounded-xl border bg-fd-card` outside `Panel`. Add three content checks to `lint-ai`: (1) two `##` sections in one lesson whose word overlap (Jaccard) is above 0.5 are flagged as duplicates; (2) a quiz fails if the key is the longest option or if keys in one chapter are more than 50 percent the same index; (3) a source line with two or more inline `N.` markers fails (UX-01). Add one smoke test that fetches a built lesson and asserts it contains an `<abbr` or `data-term` element. A one-page `COMPONENTS.md` listing the allowed components and tokens completes it.

## 6. Backlog

Sorted by impact for effort. S under an hour, M under a day, L more.

| ID | Area | Change | Effort | Impact | Depends on |
|---|---|---|---|---|---|
| B-01 | UX | Muted text color to `#666666` (UX-03) | S | high | none |
| B-02 | UX | Fix dark hero CTA contrast (UX-04) | S | high | none |
| B-03 | UX | Page titles for /, /ai, /dsa and a title template (UX-05) | S | medium | none |
| B-04 | Content | Fix steps as lists in 8 lessons (UX-01) | S | high | none |
| B-05 | Content | Fix LoRA share and quiz key (model-internals) | S | high | none |
| B-06 | Content | Fix 90 percent to 84 and add cached-cost example (production) | S | high | none |
| B-07 | Content | GRPO std, nats versus bits, EMA example, ±3 range, METR sample size, "deep breath" line | S | medium | none |
| B-08 | Content | Label invented results as examples; fix messages-and-roles arithmetic | S | medium | none |
| B-09 | UX | Underline body links, descriptive link text in radar (UX-06) | S | medium | none |
| B-10 | UX | Make chapter numbers global on dashboards (UX-10) | S | medium | none |
| B-11 | Component | Add `check-ui.mjs` and the three lint checks | M | high | B-04 |
| B-12 | UX | Make term definitions render and work on touch and keyboard (UX-02) | M | high | Component `Term` |
| B-13 | Content | Delete duplicate sections across about 60 lessons | L | high | B-11 (to list them) |
| B-14 | Content | Rewrite quiz keys and distractors for 119 lessons (rotate, equalize, add predict question) | L | high | B-11 |
| B-15 | Content | Add code to chapters 6 and 8, language and starters to projects | L | high | none |
| B-16 | UX | Stepper arrow keys, skip link, 44 px targets (UX-07, UX-08) | M | medium | none |
| B-17 | UX | Library grouping, chapter filter, free flag (UX-09) | M | medium | none |
| B-18 | Content | Move coding-tools to ch5, scaling-laws after transformer-era, pointers for evals and injection | M | medium | none |
| B-19 | Content | Merge agents-era, data-and-infra, being-ambitious | M | medium | B-13 |
| B-20 | Component | Extract tokens, PageContainer, SectionHeading, Chip, Panel | M | medium | B-01 |
| B-21 | Component | `LessonPage`, `TrackLayout`, shared `Roadmap` | M | medium | B-20 |
| B-22 | Component | Move shared files to `components/shared/` | M | low | B-20 |
| B-23 | Content | Everyday and Applied chapter: four new lessons | L | high | none |
| B-24 | Content | Split safety lesson, add copyright and deepfakes lesson | M | medium | none |
| B-25 | Content | Add reranking, query rewriting, PDF parsing to ch7 | M | medium | none |
| B-26 | UX | Map: goal chips on all tabs, drawer for chapter detail, readable List (UX-11, UX-12) | M | medium | none |
| B-27 | UX | Lesson header labels and level names, demo placement (UX-13, UX-14) | S | medium | none |
| B-28 | UX | Match the softmax demo to the lesson; typeset math (UX-15, UX-16) | M | medium | none |
| B-29 | Content | Imported chapter: keep 8 techniques, add quiz and story, era tags (UX-17) | M | medium | none |
| B-30 | UX | Feedback widget and report-an-error link (UX-24) | M | low | none |
| B-31 | Content | Add logs and probability refresher, demos for matrices and attention | L | medium | none |
| B-32 | UX | Landing page: audience, hours, prerequisites (UX-19) | S | low | none |

## 7. Verification log

**Lessons read.** All 137 lessons: 119 authored lessons in 17 chapter files read in full (history 7, how-llms-work 6, breakthroughs 6, prompting 8, coding-agents 8, building 11, retrieval 10, agents 10, evolution 5, evals-and-safety 10, tooling 6, projects 5, building-blocks 10, model-internals 6, production 6, creative-and-applied 2, keep-up 3), plus the imported chapter (18 lessons) inspected through `src/generated/ai.json` and read in the browser (cot) and on disk (cot.md excerpt). The other 17 imported lessons were checked for structure (quizzes, resources, story) but not read in full. This is a limit.

**Pages visited.** Desktop 1400 by 900, light: /, /ai, /ai/map (Map, Roadmap, List, goal filter "Build AI apps", chapter selection of Evals), /ai/docs/agents/agent-loop, /ai/docs/building-blocks/probability-and-softmax, /ai/docs/how-llms-work/tokens-and-context, /ai/docs/prompting-reference/cot, /ai/docs/keep-up/reading-benchmarks, /ai/models, /ai/library, /ai/glossary, /dsa/patterns, /dsa/docs/hashing/hash-table, Cmd+K search on /ai. Desktop dark: /ai, /dsa. Mobile 390 by 800, light: /, /ai, /ai/map, agent-loop, softmax, /ai/models, /ai/library (horizontal-overflow check on all seven, screenshots of /ai/map and agent-loop read). Not done: mobile dark; interactions on the library search and filters (checked structure only); chapter selection by several chapters (one chapter selected); hover on a term (impossible, the feature is broken, UX-02); Cmd+K on /dsa; the other demos (timeline, eras, neuron, descent, rag, harness, stack, dot). Mobile sidebar drawer was not opened.

**Axe (WCAG 2 A and AA), desktop 1400, both themes.** /ai, /ai/map, agent-loop, softmax, /ai/models, /ai/library, /ai/glossary, /ai/docs/prompting-reference/cot, /ai/docs/history/ml-basics, /dsa, /dsa/patterns, /dsa/docs/hashing/hash-table. Results are in Part B. Axe was not run on mobile.

**Commands run.** `node scripts/lint-ai.mjs`: 119 lessons, 394 average words, grade 8.5, 0 flags. `node scripts/coverage-roadmap.mjs`: 174 of 185 roadmap.sh topics mentioned; missing: Roles and Responsibilities, Conducting adversarial testing, Know your Customers/Usecases, Constraining outputs and inputs, RAG Usecases, Agents Usecases, Multimodal AI Usecases, NanoBanana API, State & Historical Context, Atlan, DataHub. `node scripts/check-links.mjs`: 359 checked, 0 broken, 1 blocked (403, academic.oup.com). Python scripts over `site/authored/ai/*.md`: quiz key and length statistics, fence counts, sentence length, dash count, story openers. Python recomputation of all arithmetic noted in Part A, and contrast ratios for candidate colors.

**Sources fetched.** arXiv 2402.03300 HTML (GRPO advantage with std), arXiv 2309.03409 HTML (OPRO 80.2 percent), METR blog 2025-07-10 (16 developers, 246 issues, 19 percent, outdated note and a February 2026 update), Google Research publication page (exists; abstract speaks of verifiable specifications and harness, not of "evals versus demo"), code.claude.com/docs/en/workflows (dynamic workflows, /deep-research, ultracode, verifier voting), Felix Rieseberg's tutorial (four kinds), Addy Osmani's post (six context types), Anthropic vision docs (image token sizes), Google blog Gemini 4 Argon (2026-10-13, available), Anthropic Claude Opus 5.5 page (2026-09-22, Fable 5.1 claim), web search results for Hugging Face model count (about 3 million, secondary) and Meta Muse Spark (2026-04-08, closed model). Failed (403): OpenAI GPT-6 Sol and Luna page, OpenAI "Harness engineering" page, so the corresponding lesson and atlas claims are Inferred. roadmap.sh and fumadocs.dev were opened in the browser for the benchmark.

**Claims verified (a selection, 5 or more per chapter by recompute or fetch).** Ch1: AlexNet 26 to 15 percent not fetched (Inferred from memory), GPT parameter ratios recomputed, power-law and Chinchilla numbers recomputed. Ch2: tokens-to-cost, top-k and top-p examples recomputed. Ch3: 224 / 16 = 14 and 196 patches, 5M x 300 x $0.50, image tokens (fetched). Ch4: six context types (fetched), 6:27 arrival time. Ch5: Rieseberg four kinds, dynamic workflow docs, Google page exists (fetched). Ch6: $0.0009 call, 429 example. Ch7: dot, cosine, Euclidean, RRF, MRR, recall, 1.5 billion multiplications. Ch8: 0.95^n. Ch9: METR, OPRO, workflows. Ch10: 22/30, 17+11+9+13, 46/50. Ch11: 307 MB. Ch13: about 30 numbers. Ch14: 140/70/35 GB, 17 x 24, LoRA parameters (error found), GRPO (fetched). Ch15: cost arithmetic (error found). Ch18: standard error. Model atlas: three of eight "now" rows confirmed against vendor pages.

**Proven versus inferred.** Everything labelled Proven above was seen in a file, screenshot, measurement or fetched source. Inferred items (each states what would prove it): ChatGPT 100 million users source, open-weight gap claim, the cached-input price used in the cost rewrite, white diagram backgrounds in dark theme, the imported techniques' relevance in 2026, lesson time estimates, the effect of two sticky bars on mobile, the cost of project time estimates, all claims about OpenAI pages, and the radar rows not opened.

**Honest limits.** I did not give a one-sentence justification for each of 12 dimensions on all 18 chapters in separate bullets; each chapter has a compact justification line instead. I did not read 17 of the 18 imported lessons in full. I did not exercise most demos or the mobile drawer, and I did not test mobile in dark mode.
