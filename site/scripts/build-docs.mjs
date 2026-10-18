// Turns the generated content (.cache/content) into Fumadocs pages under content/dsa, plus src/generated data.
// Run scripts/build-content.mjs first (`npm run content` does both).
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const here = new URL('.', import.meta.url).pathname
const src = join(here, '../.cache/content')
const out = join(here, '../content/dsa')
const index = JSON.parse(readFileSync(join(src, 'index.json'), 'utf8'))
const LEVEL = { 1: 'Beginner', 2: 'Core', 3: 'Advanced' }

rmSync(out, { recursive: true, force: true })
mkdirSync(out, { recursive: true })
const slugOf = id => id.split('/').slice(1).join('-')
// Remote images stay plain <img>: the Fumadocs image plugin would fetch each one at build time and fail on dead links.
const remoteImages = md => md.replace(/!\[([^\]]*)\]\((https?:[^)\s]+)\)/g, '<img src="$2" alt="$1" />')
const topicUrl = (c, t) => `/dsa/docs/${c.id}/${slugOf(t.id)}`
const write = (path, text) => { mkdirSync(join(path, '..'), { recursive: true }); writeFileSync(path, text) }

const rootPages = []
for (const tier of index.tiers) {
  rootPages.push(`---${tier.id}. ${tier.title}---`)
  for (const c of index.chapters.filter(c => c.tier === tier.id)) {
    rootPages.push(c.id)
    write(join(out, c.id, 'meta.json'), JSON.stringify({ title: c.title, pages: c.topics.map(t => slugOf(t.id)) }, null, 2))
    for (const t of c.topics) {
      const topic = JSON.parse(readFileSync(join(src, 'topics', t.id.replaceAll('/', '__') + '.json'), 'utf8'))
      const body = [
        topic.complexity && `## Complexity\n\n${topic.complexity}`,
        ...topic.sections.map(s => `${s.title === 'Overview' ? '' : `## ${s.title}\n\n`}${s.body}`),
        topic.code.length && `## Code\n\n${topic.code.map(f => `\`\`\`js title="${f.name}"\n${f.code.trimEnd()}\n\`\`\``).join('\n\n')}`,
        topic.references && `## References\n\n${topic.references}`,
      ].filter(Boolean).map(remoteImages).join('\n\n')
      write(join(out, c.id, `${slugOf(t.id)}.md`), `---\ntitle: ${JSON.stringify(topic.title)}\ndescription: ${JSON.stringify(`${topic.kind} · ${LEVEL[t.level]}`)}\n---\n\n${body}\n`)
      if (existsSync(join(src, t.id))) cpSync(join(src, t.id), join(here, '../public/content', t.id), { recursive: true })
    }
  }
}
write(join(out, 'meta.json'), JSON.stringify({ pages: ['[Dashboard](/dsa)', '[Problem patterns](/dsa/patterns)', ...rootPages] }, null, 2))

// Data the dashboard, pattern pages and topic extras read: topic urls, learning order, patterns.
const chapters = index.chapters.map(c => ({ ...c, topics: c.topics.map(t => ({ ...t, sections: undefined, url: topicUrl(c, t), chapter: c.title })) }))
const topics = Object.fromEntries(chapters.flatMap(c => c.topics.map(t => [t.id, t])))
const order = chapters.flatMap(c => c.topics.map(t => t.url))
write(join(here, '../src/generated/dsa.json'), JSON.stringify({ tiers: index.tiers, chapters, patterns: index.patterns, groups: index.groups, topics, order }))
console.log('pages:', readdirSync(out).length, 'entries in root')
