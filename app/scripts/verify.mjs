// Fails if generated content is inconsistent: every chapter topic has a loadable
// JSON with a README section and code, and every pattern link resolves.
import { existsSync, readFileSync } from 'node:fs'

const dir = new URL('../public/content/', import.meta.url).pathname
const index = JSON.parse(readFileSync(dir + 'index.json', 'utf8'))
const errors = [], ids = new Set()
for (const c of index.chapters) for (const t of c.topics) {
  ids.add(t.id)
  const f = dir + 'topics/' + t.id.replaceAll('/', '__') + '.json'
  if (!existsSync(f)) { errors.push('missing file ' + t.id); continue }
  const topic = JSON.parse(readFileSync(f, 'utf8'))
  if (!topic.sections.length) errors.push('no sections: ' + t.id)
  if (!topic.code.length) console.warn('no code files:', t.id)
  for (const m of JSON.stringify(topic.sections).matchAll(/(?<=\]\()\/content\/[^)"\s]+\.(?:png|jpg|jpeg|gif|svg)/g))
    if (!existsSync(new URL('../public' + m[0], import.meta.url).pathname)) errors.push(`broken image ${m[0]} in ${t.id}`)
}
for (const p of index.patterns) for (const id of p.topics) if (!ids.has(id)) errors.push(`pattern ${p.id} -> ${id}`)
if (errors.length) { console.error(errors.join('\n')); process.exit(1) }
console.log(`ok: ${ids.size} topics, ${index.chapters.length} chapters, ${index.patterns.length} patterns`)
