// Reads the DSA topics: every folder with an English README under javascript-algorithms/src (algorithms, data-structures)
// and authored/foundations, placed into chapters by curation.mjs. build-dsa.mjs turns the result into pages.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { CHAPTERS, DIFFICULTY, GROUPS, PATTERNS, TIERS } from './curation.mjs'

const GH = 'https://github.com/trekhleb/javascript-algorithms/blob/master/src/'
const AUTHORED = new URL('../authored/', import.meta.url).pathname // topics written for this app (fundamentals)

const isDir = p => statSync(p).isDirectory()
const files = d => readdirSync(d).filter(f => !isDir(join(d, f)))
const read = (...p) => readFileSync(join(...p), 'utf8')

// A topic is any folder under algorithms/ or data-structures/ with an English README.
function* walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f)
    if (!isDir(p) || f === '__test__' || f === 'images') continue
    if (existsSync(join(p, 'README.md'))) yield p
    yield* walk(p)
  }
}

// Relative links in an upstream README point at its GitHub folder; those in an authored one stay as they are.
function clean(md, id, upstream) {
  return md
    .replace(/_Read this in other languages:_[\s\S]*?\n\n/, '')
    .replace(/!\[([^\]]*)\]\((?!https?:)([^)]+)\)/g, (_, alt, p) => `![${alt}](/content/${id}/${p})`)
    .replace(/\]\((?!https?:|#|\/content|mailto:)([^)]+)\)/g, (_, p) => (upstream ? `](${GH}${relative(upstream, join(upstream, id, p))})` : `](${p})`))
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

// Gives short complexity blurbs the "Time Complexity" / "Space Complexity" heading pair the card lays out as two columns.
function normalizeComplexity(md) {
  md = md.replace(/^\*\*(Time|Space) complexity\*\*:\s*/im, (_, k) => `### ${k} Complexity\n\n`)
  if (/^#{2,3} /m.test(md)) return /^\|/.test(md) ? `### Time Complexity\n\n${md}` : md
  const lines = md.split('\n').filter(l => l.trim() && !l.startsWith('|'))
  if (lines.length !== md.split('\n').filter(l => l.trim()).length || lines.length < 2 || !lines.some(l => /space/i.test(l))) return md
  const strip = l => l.replace(/^- (Time|Space):\s*/, '').replace(/^(Worst|Best)-case (performance|space complexity)\s*/i, (_, w) => `${w}-case: `)
  const [space, time] = [lines.filter(l => /space/i.test(l)), lines.filter(l => !/space/i.test(l))]
  return `### Time Complexity\n\n${time.map(strip).join('  \n')}\n\n### Space Complexity\n\n${space.map(strip).join('  \n')}`
}

// Returns { tiers, chapters, patterns, groups, topics }. Chapters hold each topic's metadata in learning order, topics the
// full text by id, with `images` set to the folder that is served at /content/<id>/images.
export function loadUpstream(upstream) {
  const topics = {}
  const SOURCES = [
    { base: upstream, roots: ['algorithms', 'data-structures'], kind: root => (root === 'algorithms' ? 'Algorithm' : 'Data Structure'), github: id => GH + id },
    { base: AUTHORED, roots: ['foundations'], kind: () => 'Fundamentals', github: () => null },
  ]
  for (const { base, roots, kind, github } of SOURCES) {
    for (const root of roots) {
      for (const dir of walk(join(base, root))) {
        const id = relative(base, dir)
        const raw = read(dir, 'README.md')
        const title = raw.match(/^# (.+)/m)?.[1].trim() ?? id.split('/').at(-1)
        const code = files(dir).filter(f => f.endsWith('.js')).map(f => ({ name: f, code: read(dir, f) }))
        const all = sections(clean(raw, id, base === upstream && upstream).replace(/^# .*\n/, ''))
        const cx = all.filter(s => /complexit/i.test(s.title))
        const complexity = cx.length ? normalizeComplexity(cx.map(s => (cx.length > 1 ? `**${s.title}**\n\n` : '') + s.body).join('\n\n')) : null
        topics[id] = { id, title, kind: kind(root), sections: all.filter(s => s.title !== 'References' && !/complexit/i.test(s.title)),
          references: all.find(s => s.title === 'References')?.body ?? '', code, complexity, github: github(id),
          images: existsSync(join(dir, 'images')) ? join(dir, 'images') : null }
      }
    }
  }

  // Same title in two folders (graph vs tree BFS/DFS): suffix the parent folder.
  const seen = Object.values(topics).reduce((m, t) => m.set(t.title, (m.get(t.title) ?? 0) + 1), new Map())
  for (const t of Object.values(topics)) if (seen.get(t.title) > 1) t.title = `${t.title.replace(/ \(.*\)$/, '')} (${t.id.split('/').at(-2).replace('-', ' ')})`

  // Files for a topic that live in a sub-topic folder (e.g. tree/avl-tree) are already separate topics.
  const placed = new Set(CHAPTERS.flatMap(c => c.topics))
  const missing = Object.keys(topics).filter(id => !placed.has(id))
  const unknown = [...placed, ...PATTERNS.flatMap(p => p.topics)].filter(id => !topics[id])
  if (unknown.length) throw new Error('curation references unknown topics: ' + unknown.join(', '))
  if (missing.length) console.warn('topics not in any chapter (added to the last chapter):', missing)
  const chapterIds = CHAPTERS.map((c, i) => [...new Set(i === CHAPTERS.length - 1 ? [...c.topics, ...missing] : c.topics)])

  const level = Object.fromEntries(Object.entries(DIFFICULTY).flatMap(([n, s]) => s.split(' ').map(id => [id, +n])))
  const tierOf = Object.fromEntries(CHAPTERS.flatMap((c, i) => chapterIds[i].map(id => [id, c.tier])))
  const patternsOf = id => PATTERNS.filter(p => p.topics.includes(id)).map(p => p.id)
  const meta = t => ({ id: t.id, title: t.title, kind: t.kind, level: tierOf[t.id] === 2 ? 3 : level[t.id] ?? 2, sections: t.sections.map(s => s.title), patterns: patternsOf(t.id) })

  const noPattern = Object.keys(topics).filter(id => !patternsOf(id).length)
  console.log(Object.keys(topics).length, 'topics;', noPattern.length, 'without a pattern:', noPattern.map(id => id.split('/').slice(-1)[0]).join(', '))
  return {
    tiers: TIERS,
    chapters: CHAPTERS.map((c, i) => ({ ...c, topics: chapterIds[i].map(id => meta(topics[id])) })),
    patterns: PATTERNS,
    groups: GROUPS,
    topics,
  }
}
