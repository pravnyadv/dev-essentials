// Prints one authored lesson for review: where it sits, its body, resources, quiz (key marked) and story.
// Usage: node .claude/skills/lesson-review/scripts/lesson.mjs <slug> [--dir <authored dir>]
//        node .claude/skills/lesson-review/scripts/lesson.mjs --list <track> [chapter]
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = new URL('../../../../', import.meta.url).pathname
const args = process.argv.slice(2)
const flag = name => (args.includes(name) ? args[args.indexOf(name) + 1] : null)
const dir = flag('--dir') ?? join(root, 'site/authored')

const topicsIn = text => text.split(/^(?=# [a-z0-9-]+ \| )/m).filter(s => s.startsWith('# ')).map(raw => {
  const [head, ...lines] = raw.split('\n')
  const [slug, title, level, minutes] = head.slice(2).split(' | ').map(s => s.trim())
  return { slug, title, level, minutes, body: lines.join('\n') }
})
const chapters = track => (existsSync(join(dir, track)) ? readdirSync(join(dir, track)).filter(f => f.endsWith('.md')) : [])
  .map(f => ({ track, chapter: f.replace('.md', ''), file: join(dir, track, f), topics: topicsIn(readFileSync(join(dir, track, f), 'utf8')) }))

if (args[0] === '--list') {
  for (const c of chapters(args[1]).filter(c => !args[2] || c.chapter === args[2])) for (const t of c.topics) console.log(`${c.track} ${c.chapter} ${t.slug}`)
  process.exit(0)
}

const slug = args[0]
const hit = ['ai', 'sd'].flatMap(chapters).find(c => c.topics.some(t => t.slug === slug))
if (!hit) { console.error(`no lesson "${slug}" under ${dir}/{ai,sd}`); process.exit(1) }
const at = hit.topics.findIndex(t => t.slug === slug), t = hit.topics[at]
const fence = name => t.body.match(new RegExp('```' + name + '\\n([\\s\\S]*?)```'))?.[1].trim().split('\n').filter(Boolean) ?? []
const curation = join(root, `site/scripts/${hit.track}-curation.mjs`)
const demo = existsSync(curation) ? (await import(curation)).EXPLAINERS?.[slug] : undefined

console.log(`# ${t.title}
track: ${hit.track}  chapter: ${hit.chapter} (lesson ${at + 1} of ${hit.topics.length})  level: ${t.level}  minutes: ${t.minutes}
file: ${hit.file}
glossary: ${join(dir, hit.track, 'glossary.txt')}
demo: ${demo ? `${demo} (components/${hit.track}/Explainers.jsx)` : 'none'}
earlier lessons in this chapter: ${hit.topics.slice(0, at).map(x => x.title).join('; ') || 'none (first lesson)'}

## Body
${t.body.replace(/```(resources|quiz|story|adapted)\n[\s\S]*?```\n?/g, '').trim()}

## Story
${fence('story').join(' ') || '(none)'}

## Resources
${fence('resources').map((l, i) => { const [kind, title, url, by, why] = l.split(' | '); return `${i + 1}. [${kind}] ${title} (${by}) ${url}\n   claimed: ${why}` }).join('\n')}

## Adapted from
${fence('adapted').join('\n') || '(none)'}

## Quiz (key marked with *)
${fence('quiz').map((l, i) => { const [q, opts, ans, why] = l.split(' | '); return `${i + 1}. ${q}\n${opts.split(' ; ').map((o, k) => `   ${k === +ans ? '*' : ' '} ${String.fromCharCode(97 + k)}) ${o.trim()}`).join('\n')}\n   why: ${why}` }).join('\n')}`)
