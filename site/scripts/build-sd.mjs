// Turns authored/sd/*.md into Fumadocs pages under content/sd plus src/generated/sd.json (see lib-authored.mjs).
import * as curation from './sd-curation.mjs'
import { loadTrack } from './lib-authored.mjs'

const track = loadTrack('sd', curation)

// The pattern catalog page lists the cards, so every catalog name needs exactly one card and every card a catalog name.
const plain = s => s.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/`/g, '')
const patterns = Object.values(track.topics).flatMap(t => (t.cards ?? []).filter(c => c.kind in curation.CATALOG)
  .map(c => ({ ...c, text: plain(c.text), lesson: t.title, url: t.url, chapter: t.chapter })))
for (const [kind, names] of Object.entries(curation.CATALOG)) for (const n of names) {
  const count = patterns.filter(p => p.kind === kind && p.name === n).length
  if (count !== 1) track.errors.push(`${kind} "${n}" has ${count} cards, needs exactly one`)
}
for (const p of patterns) if (!curation.CATALOG[p.kind].includes(p.name)) track.errors.push(`${p.url}: card "${p.name}" is not a catalog ${p.kind} name`)

const library = track.emit({ reference: ['[Pattern catalog](/sd/patterns)', '[Resource library](/sd/library)', '[Glossary](/sd/glossary)'], extra: { patterns } })
console.log(`sd: ${Object.keys(track.topics).length} topics, ${track.chapters.length} chapters, ${patterns.length} catalog cards, ${library.length} unique resources, ${track.glossary.length} terms`)
