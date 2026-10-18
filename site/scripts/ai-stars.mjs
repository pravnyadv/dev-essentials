// Refreshes authored/ai/data/stars.json: GitHub star counts for every repo the AI track cites. Needs `gh` logged in.
// Run `npm run content` first so src/generated/ai.json lists the current resources.
import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'

const { library } = JSON.parse(readFileSync(new URL('../src/generated/ai.json', import.meta.url), 'utf8'))
const repos = [...new Set(library.map(r => r.url.match(/^https:\/\/github\.com\/([^/]+\/[^/#?]+)\/?$/)?.[1]).filter(Boolean))]
const stars = {}
for (const repo of repos) {
  try { stars[repo] = +execFileSync('gh', ['api', `repos/${repo}`, '--jq', '.stargazers_count'], { encoding: 'utf8' }) }
  catch { console.warn('skipped', repo) }
}
const asOf = new Date().toISOString().slice(0, 10)
writeFileSync(new URL('../authored/ai/data/stars.json', import.meta.url), JSON.stringify({ asOf, stars }, null, 2) + '\n')
console.log(`${Object.keys(stars).length}/${repos.length} repos, as of ${asOf}`)
