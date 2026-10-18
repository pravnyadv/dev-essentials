# DSA in JavaScript

Interactive reader and progress tracker for data structures and algorithms. Content comes from
`trekhleb/javascript-algorithms` (MIT) plus original fundamentals, re-arranged into a learning path.
Fumadocs (Next.js, static export) renders it. No backend.

## Layout

- `site/`: the Next.js + Fumadocs app. Run all commands from here.
- `site/scripts/curation.mjs`: tiers, chapters (learning order), difficulty. **Edit this to re-arrange content.**
- `site/scripts/patterns.mjs`, `explain.mjs`, `walkthroughs.mjs`: problem patterns (signals, problems, template code, step data).
- `site/scripts/build-content.mjs`: upstream repo + `site/authored/` into `site/.cache/content/` (generated).
- `site/scripts/build-docs.mjs`: `.cache` into Fumadocs pages (`content/docs/`), `public/content/` images and `src/generated/*.json` (all generated, gitignored).
- `site/authored/foundations/`: original topics (Big O, arrays, strings, ...). Edit these directly.
- `site/src/components/dsa/`: our components (dashboard, pattern pages, walkthroughs, sorting player, progress).
- `vendor/`: upstream clone (gitignored). `npm run content` clones it if missing.

## Commands

- `npm run dev`: regenerates content, then dev server.
- `npm run verify`: regenerate content, check integrity (topics, images, pattern links), production static build. Run before calling work done.
- `npm run build`: static export to `site/out/`; `npm start` serves it.
- Progress lives in `localStorage` key `dsa-progress-v1` (`learning` | `done` per topic id; `lc:<slug>` for problems).

## Rules

- New topic or pattern: add it to `curation.mjs` / `patterns.mjs`; the build throws on unknown ids and warns on unplaced topics.
- Topic pages are plain `.md` generated from the content build; custom UI goes in `src/app/(site)/docs/[[...slug]]/page.tsx` or components, not in the generated pages.
- Components in `src/components/dsa` are client components (`'use client'`). Progress access goes through `progress.jsx`, not `localStorage` directly.
- Run Next through `./node_modules/.bin/next` with `PORT=<n>` (the `rtk` wrapper rewrites `-p/--port` on `npx next`).
- UI changes: check the real page with `agent-browser` (see global instructions), not just the build.
