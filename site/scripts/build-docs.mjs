// Turns the app's generated content (app/public/content) into Fumadocs pages under content/docs.
// Run `node app/scripts/build-content.mjs vendor/javascript-algorithms/src` first.
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const here = new URL('.', import.meta.url).pathname
const src = join(here, '../../app/public/content')
const out = join(here, '../content/docs')
const index = JSON.parse(readFileSync(join(src, 'index.json'), 'utf8'))
const LEVEL = { 1: 'Beginner', 2: 'Core', 3: 'Advanced' }

rmSync(out, { recursive: true, force: true })
mkdirSync(out, { recursive: true })
cpSync(join(here, '../handwritten'), out, { recursive: true }) // hand-written MDX pages that use custom components
const slugOf = id => id.split('/').slice(1).join('-')
// Remote images stay plain <img>: the Fumadocs image plugin would fetch each one at build time and fail on dead links.
const remoteImages = md => md.replace(/!\[([^\]]*)\]\((https?:[^)\s]+)\)/g, '<img src="$2" alt="$1" />')
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
write(join(out, 'meta.json'), JSON.stringify({ pages: ['index', '---Patterns---', 'patterns', ...rootPages] }, null, 2))
write(join(out, 'patterns/meta.json'), JSON.stringify({ title: 'Problem patterns', pages: ['prefix-sum'] }, null, 2))
write(join(out, 'index.mdx'), `---\ntitle: DSA in JavaScript\ndescription: A learning path through data structures and algorithms.\n---\n\nPick a chapter from the sidebar. **Must Know** covers what every developer uses and what interviews ask most. **Advanced** is the extra.\n`)
console.log('pages:', readdirSync(out).length, 'entries in root')
