# Dev Essentials

Interactive lessons with progress tracking. Pick a track on the landing page.

**Live:** https://dev-essentials.pages.dev

- **Data Structures & Algorithms** (`/dsa`): 117 topics and 26 problem patterns, with step-through visual walkthroughs.
- **AI Engineering** (`/ai`): 143 lessons from the history of AI and the math underneath to agents, retrieval, evals and applied AI. Each lesson has a short story, a worked example, a quiz and free resources. There is also a learning map, a model atlas, a resource library and a glossary.
- **System Design** (`/sd`): 67 lessons on how requests travel, scaling, storage, caching, queues, reliability and distributed systems, nine worked designs, the cloud design patterns catalog and the ten classic performance antipatterns. Built on the System Design Primer and Microsoft's Azure Architecture Center, with interactive demos for percentiles, consistent hashing, cache hit ratios and rate limiting.

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
- `site/authored/sd/`: the System Design lessons and glossary, same format.
- `site/scripts/`: content generation, curation (chapter order), checks and linters.
- `site/src/components/shared/`: UI the tracks share. `components/ai/`, `components/dsa/` and `components/sd/` hold track-specific parts.
- `CLAUDE.md`: how the project is organised and how to update the AI track.

## Credits

DSA content builds on [trekhleb/javascript-algorithms](https://github.com/trekhleb/javascript-algorithms) and one AI chapter on the [Prompt Engineering Guide](https://github.com/dair-ai/Prompt-Engineering-Guide), both MIT. System Design lessons adapt the [System Design Primer](https://github.com/donnemartin/system-design-primer) by Donne Martin and Microsoft's [Azure Architecture Center](https://github.com/MicrosoftDocs/architecture-center), both CC BY 4.0. See [NOTICE.md](docs/NOTICE.md). Code is MIT, see [LICENSE](LICENSE).
