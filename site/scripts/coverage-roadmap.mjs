// Coverage check against the roadmap.sh AI Engineer map: downloads the topic tree and prints only the node titles
// that do not appear in our lessons. Titles are used as a checklist. roadmap.sh's license forbids reusing its text, so write gaps in your own words.
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const dir = new URL('../content/ai/', import.meta.url).pathname
const ours = readdirSync(dir, { recursive: true }).filter(f => f.endsWith('.md')).map(f => readFileSync(join(dir, f), 'utf8')).join('\n').toLowerCase()
// Resource titles live in ai.json, not the page markdown.
const resources = readFileSync(new URL('../src/generated/ai.json', import.meta.url), 'utf8').toLowerCase()
const { nodes } = await (await fetch('https://roadmap.sh/ai-engineer.json')).json()
const norm = s => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim()
const text = norm(ours + resources)
const labels = [...new Set(nodes.filter(n => ['topic', 'subtopic'].includes(n.type) && n.data.label).map(n => n.data.label.trim()))]
// A title counts as covered when every longer word in it (minus a plural s) appears somewhere in our lessons.
const covered = l => norm(l).split(' ').filter(w => w.length > 3).every(w => text.includes(w.replace(/s$/, '')))
const missing = labels.filter(l => !covered(l))
console.log(`${labels.length - missing.length}/${labels.length} roadmap.sh topics mentioned. Not found:\n${missing.join('; ')}`)
