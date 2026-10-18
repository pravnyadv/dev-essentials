// Usage: node scripts/build-content.mjs <path-to-javascript-algorithms/src>
// Writes public/content/index.json and public/content/topics/<id>.json plus images.
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { CHAPTERS, DIFFICULTY, PATTERNS } from './curation.mjs'

const src = process.argv[2]
const out = new URL('../public/content/', import.meta.url).pathname
const GH = 'https://github.com/trekhleb/javascript-algorithms/blob/master/src/'
rmSync(out, { recursive: true, force: true })
mkdirSync(join(out, 'topics'), { recursive: true })

const isDir = p => statSync(p).isDirectory()
const files = d => readdirSync(d).filter(f => !isDir(join(d, f)))

// A topic is any folder under algorithms/ or data-structures/ with an English README.
function* walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f)
    if (!isDir(p) || f === '__test__' || f === 'images') continue
    if (existsSync(join(p, 'README.md'))) yield p
    yield* walk(p)
  }
}

function clean(md, id) {
  return md
    .replace(/_Read this in other languages:_[\s\S]*?\n\n/, '')
    .replace(/!\[([^\]]*)\]\((?!https?:)([^)]+)\)/g, (_, alt, p) => `![${alt}](/content/${id}/${p})`)
    .replace(/\]\((?!https?:|#|\/content|mailto:)([^)]+)\)/g, (_, p) => `](${GH}${relative(src, join(src, id, p))})`)
}

function sections(md) {
  const parts = [], lines = md.split('\n')
  let cur = { title: 'Overview', body: [] }, fence = false
  for (const l of lines) {
    if (l.startsWith('```')) fence = !fence
    if (!fence && /^#{2} /.test(l)) { parts.push(cur); cur = { title: l.slice(3).trim(), body: [] } } else cur.body.push(l)
  }
  parts.push(cur)
  return parts.map(s => ({ title: s.title, body: s.body.join('\n').trim() })).filter(s => s.body)
}

const read = (...p) => readFileSync(join(...p), 'utf8')
const topics = {}
for (const root of ['algorithms', 'data-structures']) {
  for (const dir of walk(join(src, root))) {
    const id = relative(src, dir)
    const raw = read(dir, 'README.md')
    const title = raw.match(/^# (.+)/m)?.[1].trim() ?? id.split('/').at(-1)
    const code = files(dir).filter(f => f.endsWith('.js')).map(f => ({ name: f, code: read(dir, f) }))
    const testDir = join(dir, '__test__')
    const tests = existsSync(testDir) ? files(testDir).filter(f => f.endsWith('.js')).map(f => ({ name: f, code: read(testDir, f) })) : []
    const all = sections(clean(raw, id).replace(/^# .*\n/, ''))
    const complexity = all.find(s => /complexity/i.test(s.title))?.body ?? null
    const t = { id, title, kind: root === 'algorithms' ? 'Algorithm' : 'Data Structure', sections: all.filter(s => s.title !== 'References' && !/complexity/i.test(s.title)),
      references: all.find(s => s.title === 'References')?.body ?? '', code, tests, complexity, github: GH + id }
    topics[id] = t
    if (existsSync(join(dir, 'images'))) cpSync(join(dir, 'images'), join(out, id, 'images'), { recursive: true })
  }
}

// Files for a topic that live in a sub-topic folder (e.g. tree/avl-tree) are already separate topics.
const placed = new Set(CHAPTERS.flatMap(c => c.topics))
const missing = Object.keys(topics).filter(id => !placed.has(id))
const unknown = [...placed, ...PATTERNS.flatMap(p => p.topics)].filter(id => !topics[id])
if (unknown.length) throw new Error('curation references unknown topics: ' + unknown.join(', '))
if (missing.length) console.warn('topics not in any chapter (added to Misc):', missing)
CHAPTERS.find(c => c.id === 'misc').topics.push(...missing)

const level = Object.fromEntries(Object.entries(DIFFICULTY).flatMap(([n, s]) => s.split(' ').map(id => [id, +n])))
const meta = t => ({ id: t.id, title: t.title, kind: t.kind, level: level[t.id] ?? 2, sections: t.sections.map(s => s.title), complexity: t.complexity })
for (const t of Object.values(topics)) writeFileSync(join(out, 'topics', t.id.replaceAll('/', '__') + '.json'), JSON.stringify(t))
const patternsOf = id => PATTERNS.filter(p => p.topics.includes(id)).map(p => p.id)
writeFileSync(join(out, 'index.json'), JSON.stringify({
  chapters: CHAPTERS.map(c => ({ ...c, topics: [...new Set(c.topics)].map(id => ({ ...meta(topics[id]), patterns: patternsOf(id) })) })),
  patterns: PATTERNS,
}))
console.log(Object.keys(topics).length, 'topics')
