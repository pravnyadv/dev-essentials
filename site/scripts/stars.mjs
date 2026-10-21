// Refreshes authored/<track>/data/stars.json: GitHub star counts for every repo an authored track cites. Needs `gh` logged in.
// Run `npm run content` first so src/generated/<track>.json lists the current resources.
import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const asOf = new Date().toISOString().slice(0, 10)
for (const track of ['ai', 'sd']) {
  const { library } = JSON.parse(readFileSync(new URL(`../src/generated/${track}.json`, import.meta.url), 'utf8'))
  const repos = [...new Set(library.map(r => r.url.match(/^https:\/\/github\.com\/([^/]+\/[^/#?]+)\/?$/)?.[1]).filter(Boolean))]
  const stars = {}
  for (const repo of repos) {
    try { stars[repo] = +execFileSync('gh', ['api', `repos/${repo}`, '--jq', '.stargazers_count'], { encoding: 'utf8' }) }
    catch { console.warn('skipped', repo) }
  }
  mkdirSync(new URL(`../authored/${track}/data/`, import.meta.url), { recursive: true })
  writeFileSync(new URL(`../authored/${track}/data/stars.json`, import.meta.url), JSON.stringify({ asOf, stars }, null, 2) + '\n')
  console.log(`${track}: ${Object.keys(stars).length}/${repos.length} repos, as of ${asOf}`)
}
