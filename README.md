# Dev Essentials

Interactive lessons with progress tracking. Pick a track on the landing page.

**Live:** https://dev-essentials.pages.dev

- **Data Structures & Algorithms** (`/dsa`): 117 topics and 26 problem patterns, with step-through visual walkthroughs.
- **AI Engineering** (`/ai`): 143 lessons from the history of AI and the math underneath to agents, retrieval, evals and applied AI. Each lesson has a short story, a worked example, a quiz and free resources. There is also a learning map, a model atlas, a resource library and a glossary.

Everything runs in the browser. Progress is saved in `localStorage`. There is no backend.

## Run it

```sh
cd site
npm install
npm run dev        # http://localhost:3000, regenerates content first
npm run verify     # content, integrity checks, UI checks, lesson lint, production build
npm start          # serve the static build from site/out
```

Built with Next.js (static export), Fumadocs, Tailwind v4 and KaTeX.

## Deploy

The site is a static export deployed to Cloudflare Pages.

```sh
export CLOUDFLARE_ACCOUNT_ID=<your account id>
npm run deploy     # from site/: verify, then wrangler pages deploy out
```

Pushes to `main` run the checks in GitHub Actions (`.github/workflows/ci.yml`) and deploy when two repository secrets exist: `CLOUDFLARE_API_TOKEN` (an API token with the "Cloudflare Pages: Edit" permission) and `CLOUDFLARE_ACCOUNT_ID`. Without them the workflow still verifies and skips the deploy. A weekly workflow checks every linked resource and article (`links.yml`).

## Layout

- `site/authored/ai/`: the AI lessons (one Markdown file per chapter), glossary and the data that changes over time (`data/models.json`, `radar.json`, `meta.json`).
- `site/scripts/`: content generation, curation (chapter order), checks and linters.
- `site/src/components/shared/`: UI used by both tracks. `components/ai/` and `components/dsa/` hold track-specific parts.
- `CLAUDE.md`: how the project is organised and how to update the AI track.

## Credits

DSA content builds on [trekhleb/javascript-algorithms](https://github.com/trekhleb/javascript-algorithms) and one AI chapter on the [Prompt Engineering Guide](https://github.com/dair-ai/Prompt-Engineering-Guide), both MIT. See [NOTICE.md](docs/NOTICE.md). Code is MIT, see [LICENSE](LICENSE).
