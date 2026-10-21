// Turns the upstream topics (lib-upstream.mjs) into Fumadocs pages under content/dsa plus src/generated/dsa.json,
// and copies their images to public/content. Fails on content that would render broken.
// Visuals added on top of the upstream text live in authored/dsa/<chapter>.md: blocks headed `# <topic id> | <where>`, where
// <where> is `top`, `before <Section>` or `after <Section>`, holding markdown with ```mermaid <caption> diagrams and charts.
import { cpSync, existsSync, readFileSync, readdirSync } from 'node:fs'
import { join, posix } from 'node:path'
import { DEAD_IMAGES, DEMOS } from './curation.mjs'
import { figureMdx } from './lib-diagrams.mjs'
import { pageTree, writeGenerated, writeIfChanged } from './lib-files.mjs'
import { loadUpstream } from './lib-upstream.mjs'
import { LEVELS } from '../src/lib/vocab.mjs'

const here = new URL('.', import.meta.url).pathname
const out = join(here, '../content/dsa')
const authored = join(here, '../authored/dsa')
const index = loadUpstream(join(here, '../../vendor/javascript-algorithms/src'))
const placed = index.chapters.flatMap(c => c.topics)
const errors = []

const slugOf = id => id.split('/').slice(1).join('-')
const topicUrl = (c, t) => `/dsa/docs/${c.id}/${slugOf(t.id)}`

// Every image a topic folder serves, as the /content/... path its README links to.
const served = new Set(placed.flatMap(({ id }) => {
  const dir = index.topics[id].images
  return dir ? readdirSync(dir, { recursive: true }).map(f => `/content/${id}/images/${f}`) : []
}))
const ids = placed.map(t => t.id)
for (const id of ids) if (ids.indexOf(id) !== ids.lastIndexOf(id)) errors.push(`topic in two chapters: ${id}`)
for (const { id } of placed) {
  const topic = index.topics[id]
  if (!topic.sections.length) errors.push(`no sections: ${id}`)
  if (!topic.code.length) console.warn('no code files:', id)
  for (const [m] of JSON.stringify(topic.sections).matchAll(/(?<=\]\()\/content\/[^)"\s]+\.(?:png|jpg|jpeg|gif|svg)/g))
    if (!served.has(posix.normalize(m))) errors.push(`broken image ${m} in ${id}`)
}
for (const p of index.patterns) for (const [n, st] of p.steps.entries()) if (st.quiz && !(st.quiz.answer in st.quiz.options)) errors.push(`pattern ${p.id} step ${n + 1}: quiz answer out of range`)

const overlays = {}
for (const f of existsSync(authored) ? readdirSync(authored).filter(f => f.endsWith('.md')) : []) {
  for (const raw of readFileSync(join(authored, f), 'utf8').split(/^(?=# [a-z0-9/-]+ \| )/m).filter(s => s.startsWith('# '))) {
    const [head, ...lines] = raw.split('\n')
    const [id, where] = head.slice(2).split(' | ').map(s => s.trim())
    ;(overlays[id] ??= []).push({ where, md: lines.join('\n').trim(), file: f })
  }
}

// Upstream text as MDX: braces and stray `<` are escaped outside code, only the inline tags the READMEs use stay JSX,
// autolinks become links, and ```mermaid blocks become diagrams. Remote images stay plain <img>, since the Fumadocs image
// plugin would fetch each one at build time and fail on dead links.
function toMdx(md) {
  let fenced = false, diagram = null
  return md.split('\n').map(line => {
    if (diagram) {
      if (line !== '```') { diagram.lines.push(line); return null }
      const d = diagram
      diagram = null
      try { return figureMdx(d.caption, d.lines.join('\n')) } catch (e) { errors.push(`diagram "${d.caption}": ${e.message}`); return '' }
    }
    const open = !fenced && line.match(/^```mermaid (.+)$/)
    if (open) { diagram = { caption: open[1].trim(), lines: [] }; return null }
    if (line.startsWith('```')) { fenced = !fenced; return line }
    if (fenced) return line
    return line.split(/(`[^`]*`)/).map((part, i) => (i % 2 ? part : part
      .replace(/!\[([^\]]*)\]\((https?:[^)\s]+)\)/g, (_, alt, url) => (DEAD_IMAGES.includes(url) ? '' : `<img src=${JSON.stringify(url)} alt=${JSON.stringify(alt.replace(/"/g, "'"))} loading="lazy" />`))
      .replace(/<(https?:[^>\s]+)>/g, '[$1]($1)')
      .replace(/<(?!\/?(?:img|sub|sup|i|b|br)\b)/g, '&lt;')
      .replace(/[{}]/g, c => `\\${c}`))).join('')
  }).filter(l => l !== null).join('\n')
}

// A topic's page: its sections in order, with the authored overlays spliced in where they ask to go.
function body(t) {
  const topic = index.topics[t.id]
  const parts = [
    topic.complexity && { title: 'Complexity', md: `## Complexity\n\n${topic.complexity}` },
    ...topic.sections.map(s => ({ title: s.title, md: `${s.title === 'Overview' ? '' : `## ${s.title}\n\n`}${s.body}` })),
    topic.code.length && { title: 'Code', md: `## Code\n\n${topic.code.map(f => `\`\`\`js title="${f.name}"\n${f.code.trimEnd()}\n\`\`\``).join('\n\n')}` },
    topic.references && { title: 'References', md: `## References\n\n${topic.references}` },
  ].filter(Boolean)
  for (const o of overlays[t.id] ?? []) {
    const [, side, section] = o.where.match(/^(top|before|after)\s*(.*)$/) ?? []
    const at = side === 'top' ? 0 : parts.findIndex(p => p.title === section)
    if (!side || at < 0) { errors.push(`${o.file} ${t.id}: no place "${o.where}" (sections: ${parts.map(p => p.title).join(', ')})`); continue }
    parts.splice(side === 'after' ? at + 1 : at, 0, { title: null, md: o.md })
  }
  delete overlays[t.id]
  return toMdx(parts.map(p => p.md).join('\n\n'))
}

const pages = pageTree({
  tiers: index.tiers,
  chapters: index.chapters,
  nav: { before: ['[Dashboard](/dsa)', '[Problem patterns](/dsa/patterns)'], after: [] },
  page: t => ({ slug: slugOf(t.id), ext: '.mdx', title: index.topics[t.id].title, description: `${t.kind} · ${LEVELS[t.level]}`, body: body(t) }),
})
for (const [id, list] of Object.entries(overlays)) errors.push(`${list[0].file}: unknown topic ${id}`)
for (const id of Object.keys(DEMOS)) if (!ids.includes(id)) errors.push(`DEMOS: unknown topic ${id}`)
if (errors.length) { console.error(errors.join('\n')); process.exit(1) }

writeGenerated(out, pages)
for (const { id } of placed) if (index.topics[id].images) cpSync(index.topics[id].images, join(here, '../public/content', id, 'images'), { recursive: true })

// Data the dashboard, pattern pages and topic extras read: topic urls, learning order, patterns.
const chapters = index.chapters.map(c => ({ ...c, topics: c.topics.map(t => ({ ...t, sections: undefined, url: topicUrl(c, t), chapter: c.title, ...(DEMOS[t.id] && { demo: DEMOS[t.id] }) })) }))
const topics = Object.fromEntries(chapters.flatMap(c => c.topics.map(t => [t.id, t])))
const order = chapters.flatMap(c => c.topics.map(t => t.url))
writeIfChanged(join(here, '../src/generated/dsa.json'), JSON.stringify({ tiers: index.tiers, chapters, patterns: index.patterns, groups: index.groups, topics, order }))
console.log(`dsa: ${placed.length} topics, ${index.chapters.length} chapters, ${index.patterns.length} patterns, ${served.size} images`)
