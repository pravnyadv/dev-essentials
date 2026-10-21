# Dev Essentials

Interactive reader and progress tracker with three tracks, picked on the landing page (`/`):

- **DSA** (`/dsa`): data structures and algorithms. Content from `trekhleb/javascript-algorithms` (MIT) plus original fundamentals.
- **AI** (`/ai`): AI engineering from history and math to agents and evals. Original lessons, curated resources, one imported MIT reference chapter.
- **System Design** (`/sd`): scaling, storage, caching, queues, reliability, worked designs, the cloud design patterns and performance antipatterns, and distributed systems. Lessons adapt the System Design Primer and Microsoft's Azure Architecture Center (both CC BY 4.0) and go deeper.

Fumadocs (Next.js, static export) renders all three. No backend. Each track is its own page tree, sidebar and search index.

## Layout

- `site/`: the Next.js + Fumadocs app. Run all commands from here.
- `site/src/app/page.tsx`: track picker. `src/app/dsa/`, `src/app/ai/` and `src/app/sd/`: one layout, dashboard and `docs/[[...slug]]` page per track.
- `site/src/lib/source.tsx`: one Fumadocs loader per track (`dsaSource`, `aiSource`, `sdSource`), with the sidebar status dots.
- `site/src/components/shared/`: everything tracks share. Layout and pages: `TrackLayout`, `LessonPage`, `AuthoredLesson` (the lesson route of an authored track), `PageContainer`, `Dashboard`, `TrackPicker`, `LearningMap`, `Reference` (library and glossary), `LessonParts` (story, quiz, resources, terms, credits). Building blocks: `Panel`, `RowList`/`ListRow`, `Chip`, `SectionHeading`, `DemoFrame`, `Roadmap`, `Stepper`, `Quiz`, `Term`, `MarkDone`, plus `ui.jsx` (pills, bars, button styles) and `progress.jsx`.
- `site/src/components/dsa/`: DSA-only pieces (patterns, diagrams, explainers, sorting player). `site/src/components/ai/`: math demos, story demos, model atlas, radar, articles. `site/src/components/sd/`: the system design demos.
- `vendor/`: upstream clones (gitignored). `npm run content` clones them if missing.

### DSA track
- `scripts/curation.mjs`: tiers, chapters (learning order), difficulty. **Edit this to re-arrange content.**
- `scripts/patterns.mjs`, `explain.mjs`, `walkthroughs.mjs`: problem patterns.
- `scripts/build-content.mjs` then `build-docs.mjs`: upstream + `authored/foundations/` into `content/dsa/` and `src/generated/dsa.json`.

### Authored tracks (AI and System Design)
Both are built by `scripts/lib-authored.mjs` from `authored/<track>/`: same lesson format, glossary, learning map, library and lesson page. `build-ai.mjs` and `build-sd.mjs` are thin wrappers; the AI one adds its models, radar and articles.

### AI track
- `authored/ai/<chapter>.md`: one file per chapter. A topic is a section headed `# slug | Title | level 1-3 | minutes`: first paragraph is the summary, `##` sections are the lesson, a ```resources fence lists `kind | title | url | by | why` lines, a ```quiz fence lists `question | a ; b ; c | answerIndex | why` lines, and a ```story fence holds a 2 to 4 sentence "Picture this" scenario. Every topic needs at least one resource and three quiz questions with options of similar length (write the right answer anywhere, `npm run lint:ai` flags clustering), and every authored lesson should have a story, a worked example and a "Common mistake" note (`npm run lint:ai` reports thin or hard-to-read lessons).
- `scripts/ai-curation.mjs`: tiers, stages, goals, chapter order, and which demo (`EXPLAINERS`) a topic shows. Each chapter also carries `stage`, `after` (chapters it builds on), `goals`, `outcome` and `story`, which drive the learning map at `/ai/map`. Chapter order in the file is the numbered recommended order on the map.
- `authored/ai/glossary.txt`: `term [aliases] | definition`. Each lesson lists the terms it uses, so define every new technical word here.
- `authored/ai/data/`: the parts that change over time: `models.json` (model atlas), `radar.json` (dated news on the dashboard), `stars.json` (GitHub stars snapshot), `meta.json` (`lastUpdated` and the sources to re-check). `articles.json` is the hand-picked free reading list shown at `/ai/articles`: each entry has `title`, `author`, `year`, `url`, `why`, `level` (1 to 3), `topic` (one of `ARTICLE_TOPICS` in `build-ai.mjs`), `lesson` (an existing topic slug) and `verified`. The build fails on a bad topic, level or lesson. `npm run links` checks these URLs too.
- `scripts/build-ai.mjs`: all of the above into `content/ai/` and `src/generated/ai.json`. It fails on a bad resource kind, quiz answer, duplicate slug or unknown topic reference.
- `scripts/import-guide.mjs`: imports the DAIR.AI Prompt Engineering Guide technique pages (MIT) as the `prompting-reference` chapter. Do not import roadmap.sh content: its license forbids reuse. Use it only as a checklist (`npm run coverage`).

### System Design track
- `authored/sd/<chapter>.md` and `authored/sd/glossary.txt`: same format as the AI track. `scripts/sd-curation.mjs` holds tiers, stages, goals, chapters and `EXPLAINERS` (demos in `components/sd/Demos.jsx`, `FailureDemos.jsx` and `DataDemos.jsx`).
- Diagrams: a ```mermaid fence with a caption on the fence line (```` ```mermaid What to notice ````). The build renders it to SVG with beautiful-mermaid (flowchart, sequenceDiagram, stateDiagram-v2) and fails on a diagram that does not render. Colours follow the theme; mark a node with `class X bad` (or `good`, `warn`, `focus`), never raw colours. Use `flowchart TD` for chains longer than about 4 boxes so it stays readable on a phone.
- Cards: a ```card fence named after the thing it summarises, with four `Label | text` lines in one of the shapes in `CARDS` (`lib-authored.mjs`): pattern (Problem, Solution, Use when, Avoid when), antipattern (Symptoms, Why it hurts, Detect, Fix) or design (Requirements, Scale, Key decision, Main risk). `build-sd.mjs` fails unless each name in `CATALOG` (`sd-curation.mjs`, the 44 cloud patterns and 10 antipatterns) has exactly one card; the cards become the `/sd/patterns` catalog page.
- Each chapter has a `style` (concept, pattern, antipattern, design) and `STYLES` lists the sections, card and visuals its lessons need; the build fails on a missing one. `LESSON_STYLES` overrides it for one lesson. Antipattern lessons show bad and fixed code as tabs (```` ```python tab="Before" ```` then `tab="After"`).
- Lessons that adapt openly licensed text carry an ```adapted fence, one `name | url | license` line per source, shown as a credit line under the lesson. Two sources are adapted, both CC BY 4.0: the [System Design Primer](https://github.com/donnemartin/system-design-primer) and Microsoft's [Azure Architecture Center](https://github.com/MicrosoftDocs/architecture-center) (cloud design patterns, performance antipatterns, monitoring and background-job guidance). Keep the line on any lesson that reuses their text, and keep lessons vendor-neutral.
- Other high-starred repos (ByteByteGo system-design-101, karanpratapsingh/system-design) are CC BY-NC-ND: read and link only, never copy or closely paraphrase. ashishps1/awesome-system-design-resources is GPL-3.0: links only.
- `npm run lint:sd` is the readability and depth report for these lessons. `npm run coverage:sd` checks lesson text against the roadmap.sh System Design map (titles as a checklist only); it should stay at full coverage.

### Adding a track
Landing-page cards come from `site/src/lib/tracks.ts`. A new track needs its page tree under `src/app/<track>/` (copy `src/app/ai/layout.tsx` and `docs/[[...slug]]`), a generator script like `build-docs.mjs`, a Fumadocs source in `src/lib/source.tsx`, a search route under `src/app/api/search/`, and one entry in `tracks.ts`.

### CI and deploy
`.github/workflows/ci.yml` runs `npm run verify` on every push and pull request and deploys `out/` to Cloudflare Pages on pushes to `main` when the `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` repository secrets exist. `links.yml` runs `npm run links` weekly. The local manual deploy is `npm run deploy` with `CLOUDFLARE_ACCOUNT_ID` exported.

## Commands

- `npm run dev`: regenerates content, then dev server.
- `npm run verify`: regenerate content, check integrity, production static build. Run before calling work done.
- `npm run build`: static export to `site/out/`; `npm start` serves it.
- `npm run lint:ai`: readability and depth report for the AI lessons (target: about 350 words, grade under 10, no flags).
- `npm run check:ui`: fails on UI drift (raw palette colors, custom pixel sizes, copied card, heading, chip or page-container classes). It runs inside `verify`.
- `npm run links`: network check of every AI resource URL (not part of `verify`).
- `npm run lint:sd`: the same report for the System Design lessons.
- `npm run stars`: refresh GitHub star counts for both authored tracks (needs `gh`).
- `npm run coverage` and `npm run coverage:sd`: list roadmap.sh topics (AI Engineer, System Design) our lessons never mention.
- Progress lives in `localStorage` key `dsa-progress-v1` (`learning` | `done` per topic id; `lc:<slug>` for problems; AI topic ids start with `ai/`).

## Updating the AI track

When asked to update it:
1. Read `authored/ai/data/meta.json`. Everything newer than `lastUpdated` is in scope.
2. Models: check the trackers and lab pages in `meta.json` `watch`, then edit `data/models.json` (set `asOf`). Prices are left out on purpose.
3. News: add dated entries to `data/radar.json`, newest first, each with a lesson to link. Add or edit lessons the news changes.
4. Sources the user pasted (X posts, articles): read them, keep only what holds up, and add resources or lessons. X posts: `https://api.fxtwitter.com/<user>/status/<id>` returns the text and article links as JSON.
5. Run `npm run coverage` and `npm run links`, fix broken URLs, run `npm run stars`.
6. Set `lastUpdated` to today, run `npm run verify`, and look at the changed pages with `agent-browser`.

## Rules

- Writing for newcomers: define any technical word on first use or add it to the glossary. Show a worked number example for any math. No em dashes.
- Do not claim a resource says something you have not read. Hype posts (X) are pointers: link the primary source, and say what is marketing.
- Topic pages are plain `.md` generated by the build; custom UI goes in the `docs/[[...slug]]/page.tsx` of each track or in components, not in generated pages.
- Client components use `'use client'`. Progress access goes through `components/shared/progress.jsx`, not `localStorage` directly.
- Build screens from the shared components. Use `PageContainer` for a custom page, `Panel` and `RowList` for boxes and lists, `Chip` for filters, `SectionHeading` for titles, `DemoFrame` for demos, and the `success`, `danger` and `warning` color tokens in `global.css` (never raw palette colors). `npm run check:ui` enforces this. Touch targets are at least 44px on phones (`buttonClass` and `Chip` handle it).
- Lessons render as `.mdx` so glossary terms become `<Term>` popovers. A line written as `$$ tex $$` becomes a display formula and `$tex$` inside a sentence an inline one (`<Formula>`, KaTeX). Inline maths needs no space just inside either dollar and no digit right after the closing one, so prices like "$3 and $15" stay text; write `\$` for a literal dollar that would otherwise match. Numbered steps go one per line, and the build fails otherwise. `npm run lint:ai` fails on restated sections and on quiz keys concentrated at one position.
- Demos reserve their height (all states stacked in one grid cell) so stepping never shifts the page. Keep that when adding one.
- Run Next through `./node_modules/.bin/next` with `PORT=<n>` (the `rtk` wrapper rewrites `-p/--port` on `npx next`).
- UI changes: check the real page with `agent-browser` (see global instructions), not just the build.
