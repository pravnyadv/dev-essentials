# DSA in JavaScript

Interactive reader and progress tracker for data structures and algorithms. Content comes from
`trekhleb/javascript-algorithms` (MIT), re-arranged into a learning path. Client-side only, no backend.

## Layout

- `app/`: Vite + React + Tailwind v4 app. Run all commands from here.
- `app/scripts/curation.mjs`: chapters (learning order), difficulty, and problem patterns. **Edit this to re-arrange content.**
- `app/scripts/build-content.mjs`: turns the upstream repo into `app/public/content/` (generated, gitignored).
- `vendor/`: upstream clone (gitignored). `npm run content` clones it if missing.

## Commands

- `npm run dev`: dev server (run `npm run content` once first).
- `npm run verify`: regenerate content, check integrity (topics, images, pattern links), production build. Run before calling work done.
- Progress lives in `localStorage` key `dsa-progress-v1` (`learning` | `done` per topic id).

## Rules

- New topic or pattern: add it to `curation.mjs`; the build throws on unknown ids and warns on unplaced topics.
- UI changes: check the real page with `agent-browser` (see global instructions), not just the build.
- Use `app/src/lib.js` for data loading and progress; components don't call `fetch` or `localStorage` directly.
