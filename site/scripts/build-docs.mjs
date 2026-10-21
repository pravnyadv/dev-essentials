// Turns the generated content (.cache/content) into Fumadocs pages under content/dsa, plus src/generated data.
// Run scripts/build-content.mjs first (`npm run content` does both).
// Visuals added on top of the upstream text live in authored/dsa/<chapter>.md: blocks headed `# <topic id> | <where>`, where
// <where> is `top`, `before <Section>` or `after <Section>`, holding markdown with ```mermaid <caption> diagrams and charts.
import { cpSync, existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { DEAD_IMAGES, DEMOS } from './curation.mjs'
import { figureMdx } from './lib-diagrams.mjs'
import { generatedDir, writeIfChanged } from './lib-files.mjs'

const here = new URL('.', import.meta.url).pathname
const src = join(here, '../.cache/content')
const out = join(here, '../content/dsa')
const authored = join(here, '../authored/dsa')
const index = JSON.parse(readFileSync(join(src, 'index.json'), 'utf8'))
const LEVEL = { 1: 'Starter', 2: 'Core', 3: 'Stretch' }

const pages = generatedDir(out)
const slugOf = id => id.split('/').slice(1).join('-')
const topicUrl = (c, t) => `/dsa/docs/${c.id}/${slugOf(t.id)}`
const errors = []

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

const rootPages = []
for (const tier of index.tiers) {
  rootPages.push(`---${tier.id}. ${tier.title}---`)
  for (const c of index.chapters.filter(c => c.tier === tier.id)) {
    rootPages.push(c.id)
    pages.write(join(out, c.id, 'meta.json'), JSON.stringify({ title: c.title, pages: c.topics.map(t => slugOf(t.id)) }, null, 2))
    for (const t of c.topics) {
      const topic = JSON.parse(readFileSync(join(src, 'topics', t.id.replaceAll('/', '__') + '.json'), 'utf8'))
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
      pages.write(join(out, c.id, `${slugOf(t.id)}.mdx`), `---\ntitle: ${JSON.stringify(topic.title)}\ndescription: ${JSON.stringify(`${topic.kind} · ${LEVEL[t.level]}`)}\n---\n\n${toMdx(parts.map(p => p.md).join('\n\n'))}\n`)
      if (existsSync(join(src, t.id))) cpSync(join(src, t.id), join(here, '../public/content', t.id), { recursive: true })
    }
  }
}
for (const [id, list] of Object.entries(overlays)) errors.push(`${list[0].file}: unknown topic ${id}`)
for (const id of Object.keys(DEMOS)) if (!index.chapters.some(c => c.topics.some(t => t.id === id))) errors.push(`DEMOS: unknown topic ${id}`)
if (errors.length) { console.error(errors.join('\n')); process.exit(1) }
pages.write(join(out, 'meta.json'), JSON.stringify({ pages: ['[Dashboard](/dsa)', '[Problem patterns](/dsa/patterns)', ...rootPages] }, null, 2))
pages.finish()

// Data the dashboard, pattern pages and topic extras read: topic urls, learning order, patterns.
const chapters = index.chapters.map(c => ({ ...c, topics: c.topics.map(t => ({ ...t, sections: undefined, url: topicUrl(c, t), chapter: c.title, ...(DEMOS[t.id] && { demo: DEMOS[t.id] }) })) }))
const topics = Object.fromEntries(chapters.flatMap(c => c.topics.map(t => [t.id, t])))
const order = chapters.flatMap(c => c.topics.map(t => t.url))
writeIfChanged(join(here, '../src/generated/dsa.json'), JSON.stringify({ tiers: index.tiers, chapters, patterns: index.patterns, groups: index.groups, topics, order }))
console.log('pages:', readdirSync(out).length, 'entries in root')
