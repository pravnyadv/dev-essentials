# Prompt: quality review of the AI learning track (content, UI and UX)

You are a senior reviewer with three hats: a curriculum designer who teaches AI to beginners, a UX designer who audits learning products, and a front-end engineer who cares about design systems. Review the **AI track** of the learning site described below. Be specific, evidence-based and critical. The goal is a prioritized list of improvements, not praise. Do **not** change any repository file, do not commit, and do not rebuild the site. The only files you create are the report and screenshots, in the output folder named at the end.

## 1. Context

**Product.** A static learning site with two tracks, picked on the landing page: DSA (`/dsa`) and AI Engineering (`/ai`). It is built with Next.js and Fumadocs (a docs framework). Progress is saved in the browser. The AI track is the one under review. The DSA track is in scope only as a design reference, because both tracks share components and the owner wants them to look and behave consistently.

**Audience.** Anyone aged 16 or older, new to AI, some with programming experience and some without. Wording should be plain. Technical words must be explained. Math appears only with small worked numbers.

**Owner's intent for the AI track.**
- Teach the history and theory first, then how to use AI, then how to build with it, then the math under the hood.
- Cover what a person needs to know about AI today: history, how models work, prompting and context, coding agents, APIs, tools and MCP, embeddings and retrieval (RAG), agents, evals and safety, tooling, projects, training and production.
- Explain evolution honestly: prompt engineering, then agents, then context engineering, then harness engineering. Say what is real mechanism and what is hype.
- Keep it easy to update. Models, news and resources are data files.
- Be visually pleasing and consistent. The owner has said the UX needs to be better and that components must be consistent everywhere. They want a change in one place to be reflected in both tracks.

**Current structure (18 chapters, 137 lessons).** The order is the recommended order, as built.
1 How We Got Here, 2 How LLMs Work, 3 Breakthroughs Beyond Chat, 4 Prompting & Context, 5 Working with Coding Agents, 6 Building with the API, 7 Embeddings & Retrieval, 8 Agents, 9 From Prompts to Harnesses, 10 Evals, Observability & Safety, 11 The Tooling Landscape, 12 Build Projects, 13 Building Blocks (math), 14 Models Under the Hood, 15 Production, 16 Creative & Applied, 17 Prompting Techniques Reference (imported from the MIT-licensed DAIR.AI guide, so judge selection and integration, not the original prose), 18 Keep Up. Chapters 1 to 13 are "Must Know"; 14 to 18 are "Advanced".

**Each lesson has:** a short summary, an optional interactive demo, a "Picture this" story, a collapsible "Words on this page" list plus inline hover definitions, the lesson text (usually with a worked example and a "Common mistake" section), "Check yourself" quiz questions, a "Go deeper" resource list, and a Mark done button.

**Other AI pages:** `/ai` dashboard (hero, chapter cards, radar of recent news), `/ai/map` learning map (Map, Roadmap and List tabs, goal filters, chapter detail panel), `/ai/models` model atlas, `/ai/library` resource library, `/ai/glossary`.

## 2. Where things are

- Repo worktree: `/Users/praveen/worktrees/dsa-algo/ai-track` (branch `feat/ai-track`). Read `CLAUDE.md` at the repo root first.
- Lesson source: `site/authored/ai/<chapter>.md`, one file per chapter, in learning order. Read the format in `CLAUDE.md`. Imported chapter: generated under `site/content/ai/prompting-reference/`.
- Data: `site/authored/ai/data/` (`models.json`, `radar.json`, `meta.json`, `stars.json`), glossary: `site/authored/ai/glossary.txt`.
- Chapter order and map metadata: `site/scripts/ai-curation.mjs`.
- UI code: `site/src/components/ai/`, `site/src/components/dsa/` (despite the name, much of it is shared with AI), `site/src/app/ai/`, `site/src/app/dsa/`, `site/src/app/page.tsx`, `site/src/lib/`, `site/src/app/global.css`.
- Running site (static build, already serving): **http://localhost:5412** (landing `/`, AI `/ai`, DSA `/dsa`). If it does not respond, run `./node_modules/.bin/serve out -l 5412` from `site/` in the background. Do not run a build.
- Tools you may run from `site/`: `node scripts/lint-ai.mjs` (readability and depth report), `node scripts/coverage-roadmap.mjs` (gaps against roadmap.sh topic titles), `node scripts/check-links.mjs` (URL check).

## 3. Rules of engagement

- **Browser:** use the `agent-browser` CLI only. Run `agent-browser skills get core` first. Use your own named session on every command, for example `--session aireview`. Never use the user's everyday Chrome. Take screenshots only when you need them, as JPEG at quality 60 to 70, and crop to the area in question where possible. For accessibility use `agent-browser a11y --tags wcag2a,wcag2aa --json` instead of eyeballing contrast.
- **Evidence:** label every claim **Proven** (you saw it in a file, screenshot, measurement or fetched source) or **Inferred** (a judgment, with what would prove it). Cite lesson slugs and `file:line` for content, URL plus viewport plus screenshot path for UX, and `file:line` for code. No finding without evidence.
- **Calibration:** do not inflate scores. Use the rubric in section 4. A 3 means acceptable and unremarkable. A 5 means you could not name a realistic improvement and it would stand next to the best free learning material you know (3Blue1Brown, fast.ai, Karpathy's lessons, the Anthropic docs, Fumadocs' own docs). Expect most scores between 2 and 4. If every chapter scores 4 or higher you have not been critical enough.
- **Facts:** the lessons contain dates, numbers and claims about products. Verify them against primary sources with web search or fetch rather than memory. Model names and prices in `models.json` are time-sensitive. Treat anything you could not verify as Inferred.
- **Writing style for the report:** plain, direct, no em dashes, no filler, no marketing words. Short sentences. Tables for comparisons.
- **Subagents:** work alone. Do not spawn other agents.
- **Scope control:** work chapter by chapter, and save notes to the report as you go so a long run does not lose work.

## 4. Part A: content review, per chapter

Read **every lesson** in all 18 chapter files (not just samples), and view at least one lesson per chapter in the browser to confirm how it renders. Then score each chapter 1 to 5 on each dimension, with a one-sentence justification and evidence.

**Dimensions and anchors**
1. **Clarity.** Could a motivated 16-year-old follow it on first read? 1: confusing or jargon-dense. 3: understandable with effort. 5: effortless, with the right analogy at the right moment.
2. **Depth.** Does it go far enough to be useful, not just a gloss? 1: a definition only. 3: explains how and why with one example. 5: explains mechanism, trade-offs, failure modes and when not to use it.
3. **Accuracy.** Are claims correct and current? Verify at least five checkable claims per chapter with sources. 1: errors. 3: no errors found but some unverifiable. 5: verified and appropriately hedged.
4. **Examples.** Are there concrete worked examples (numbers, scenarios, code-free demonstrations) that the reader can follow and reuse? Also check that the math is correct when you recompute it.
5. **Sequence and prerequisites.** Does each lesson depend only on what came before? List any forward references or undefined prerequisites. Judge the difficulty ramp inside the chapter and across chapters, including whether the math chapter now sits well after the build chapters.
6. **Jargon handling.** Is each technical term explained at first use, in the inline hover or the lesson text? List terms that are used without explanation or are missing from `glossary.txt`.
7. **Wording and tone.** Plain, active, consistent. Flag sentences over about 30 words, vague phrasing, unexplained abbreviations, em dashes, repeated sentence patterns across lessons (the lessons were written to a template, so judge whether the template feels mechanical).
8. **Stories and relevance.** Does the "Picture this" story actually illustrate the lesson and show impact, or is it decoration? Is it believable and non-generic? Flag any that imply real-world claims you cannot support.
9. **Quizzes.** Do they test understanding rather than recall? Are distractors plausible? Is the keyed answer correct? Is the explanation useful? Is there a mix of difficulty?
10. **Resources.** Are the linked resources the best available, free where possible, current, and well matched to the lesson? Is the "why" line accurate? Is there a sensible mix of kinds? Name better alternatives where you know them. Run `node scripts/check-links.mjs` and report breakage.
11. **Demos and interactivity** (only for chapters that have them). Do they teach the idea, not just decorate? Are controls labelled? Is feedback immediate?
12. **Completeness.** What does a beginner need that is missing? Use `node scripts/coverage-roadmap.mjs` plus your own judgment about the field today. Suggest missing lessons with a one-line scope each.

For each chapter also give: an overall score (not an average, your judgment), the **two strongest** and **two weakest** lessons with a concrete rewrite suggestion for each weak one (quote the weak passage and propose the replacement text), and the **single highest-impact improvement** for the chapter.

Then, across the whole track: the five biggest content problems, repeated patterns that should change globally, redundancy between chapters, and the three lessons you would cut or merge.

## 5. Part B: UI and UX review, in the browser

Test **desktop (1400 by 900)** and **mobile (390 by 800)**, in **light and dark** mode (toggle with the theme switch in the sidebar footer). Cover these pages: `/`, `/ai`, `/ai/map` (all three tabs, each goal filter, selecting several chapters), a lesson with a stepper demo (`/ai/docs/agents/agent-loop`), a lesson with a slider demo (`/ai/docs/building-blocks/probability-and-softmax`), a text-only lesson, a lesson with an inline-defined term (hover it), the imported reference lesson (`/ai/docs/prompting-reference/cot`), `/ai/models`, `/ai/library` (use search and filters), `/ai/glossary`, and for comparison `/dsa`, `/dsa/patterns` and one DSA topic page. Use the search box (Cmd+K) on both tracks.

**Evaluate against**
- **Orientation:** Can a first-time visitor tell where they are, what comes next and how much is left? Is the first-time path obvious from the landing page to the first lesson? Is the learning map's purpose clear without reading? Does it help someone choose a route?
- **Navigation:** The sidebar has two tiers, 18 chapters and 137 lessons, plus Dashboard, Learning map and a Reference section. Is it easy to scan and to find a lesson? Is the grouping sensible? Is the current location always visible? Are there dead ends at the end of a lesson or chapter? Is previous and next navigation adequate?
- **Page anatomy of a lesson:** order of elements (title, summary, status button, badges, story, demo, terms, text, quiz, resources, mark done). Is this the right order? Is anything redundant, buried or competing for attention? Is the status button and the bottom Mark done button duplication helpful?
- **Reading experience:** line length, heading hierarchy, density, whitespace, code and example formatting, the inline definitions (hover only works with a mouse, so judge touch devices), table of contents usefulness.
- **Cognitive load and motivation:** progress feedback, sense of accomplishment, quiz feedback tone, whether the page encourages continuing.
- **Interaction quality:** controls labelled, immediate feedback, no layout shift when stepping or changing sliders (measure heights if you can), keyboard support (Tab order, focus visibility, arrow keys on steppers), disabled states.
- **Mobile:** tap targets of at least 44 by 44 px, no horizontal scroll, readable demos, map usability on a phone, sidebar drawer behavior, sticky elements covering content.
- **Dark mode:** contrast, hard-coded colors that do not adapt, images or diagrams that break.
- **Accessibility:** run the axe audit on at least six page types, in both themes. Report violations with the measured contrast ratios and selectors. Check heading order, landmarks, link text, and whether information is conveyed by color alone (for example in the map and the demos).
- **Performance as perceived:** first load, search responsiveness, anything that flashes or jumps.
- **Information design:** the map's arrows and numbering, the dashboard's card content, the model atlas's labels (vendor-confirmed and tracker-only), the library's filters. Are these self-explanatory?
- **Benchmark:** open https://roadmap.sh/ai-engineer and one strong docs product of your choice. List specific UX patterns that site does better than ours, and any that ours does better.

For each finding record: ID, severity (**P0** blocks or misleads learners, **P1** clearly hurts the experience, **P2** polish), page and viewport and theme, what you saw (**Proven** with a screenshot path), why it matters to a learner, and a specific fix.

Finish this part with: the five changes that would improve the learner experience most, a proposed better information architecture for the sidebar and lesson page if you think the current one is wrong (describe it concretely), and a list of what already works well and should not change.

## 6. Part C: component consistency audit

The owner wants every repeated UI pattern to be one shared component, so a change in one place reflects everywhere, in both tracks.

1. **Inventory.** List every UI component and recurring pattern under `site/src/components/` and `site/src/app/`, and the Fumadocs components in use. Group by pattern: cards and tiles, pills and badges, buttons and chips, section headings, callouts and note boxes, list rows with dividers, tabs, progress bars, search inputs, stat lines, page containers, hero banners, detail panels, steppers and quizzes, demo frames.
2. **Variants.** For each pattern, find every place it is implemented. Use `grep` on class strings to find differences: border radius (`rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-full`), padding and spacing scale, border and background tokens (`fd-*` tokens versus hard-coded colors such as emerald, rose, violet, amber, sky), font sizes (`text-xs`, `text-sm`, custom pixel sizes), heading scales, hover and focus states, icon use, button styling (shared `buttonClass` versus ad hoc chip styles), and spacing between sections. Report each inconsistency with `file:line` and the two or three variants side by side.
3. **Duplicated implementations.** Identify code that exists twice or nearly twice (for example the roadmap and list views in the DSA patterns page and the AI map, the two docs page templates, the two track layouts, row components for resources versus problems, the page container class string, the quiz or stepper wrappers). For each, say what the single shared component should be, its props, and which files would change.
4. **Placement and naming.** Shared components currently live in `components/dsa/`. Recommend a structure (for example `components/shared/`, `components/ai/`, `components/dsa/`) with the move list.
5. **Design tokens and a spec.** Propose a small, concrete UI spec the whole site follows: a spacing scale, radius scale, type scale, heading levels, color roles (primary, muted, success, danger, info) mapped to theme tokens that work in both themes, elevation or border rules, and the interaction states (hover, focus, active, disabled). Show the exact class strings or CSS variables for each token and the component that owns it.
6. **Component list to build.** Give a prioritized list of shared components to extract or create (for example `Panel`, `Chip`, `Pill`, `SectionHeading`, `PageContainer`, `ListRow`, `ChapterCard`, `StatBar`, `DemoFrame`, `TabbedViews`, `TrackLayout`, `LessonPage`), each with props, variants, which current code it replaces and the visible difference, if any, after replacement.
7. **Guardrail.** Suggest a lightweight way to keep the site consistent over time (a lint rule, a script that greps for banned patterns, or a short component rules file).

## 7. Output

Write a single Markdown report to **`/Users/praveen/worktrees/dsa-algo/ai-track/docs/reviews/2026-10-19/report.md`** and put screenshots in **`.../2026-10-19/shots/`** (create the folders). Use this structure:

1. **Executive summary:** overall verdict in five sentences, the ten most important findings across content, UX and components, ranked by impact.
2. **Scorecard:** a table with one row per chapter and one column per dimension, plus overall. Below it, the three strongest and three weakest chapters and why.
3. **Part A:** one section per chapter, in learning order, with the fields from section 4, then the cross-track content section.
4. **Part B:** findings table (ID, severity, page, viewport and theme, finding, evidence, fix), then the five top changes, the proposed information architecture, what to keep, and the benchmark comparison.
5. **Part C:** inventory table, variant and duplication tables, the proposed structure, the UI spec, the component list, and the guardrail.
6. **Backlog:** every recommended change in one table with ID, area (content, UX or component), effort (S under an hour, M under a day, L more), impact (high, medium or low), and dependencies, sorted so the best impact for the effort is first.
7. **Verification log:** what you actually checked (pages visited per viewport and theme, lessons read, sources fetched, claims verified, commands run with results) and what you only inferred.

When you finish, reply with a short message that gives the report path, the overall verdict, the top ten findings in one line each, and anything you could not do and why. Do not paste the whole report.
