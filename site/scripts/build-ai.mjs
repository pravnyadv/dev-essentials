// Turns authored/ai/*.md into Fumadocs pages under content/ai plus src/generated/ai.json.
// Topic format: see ai-curation.mjs. Data that changes over time lives in authored/ai/data (models, radar, stars, meta).
import { mkdirSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { CHAPTERS, EXPLAINERS, GOALS, KINDS, STAGES, TIERS } from './ai-curation.mjs'
import { importGuide } from './import-guide.mjs'

const here = new URL('.', import.meta.url).pathname
const authored = join(here, '../authored/ai')
const out = join(here, '../content/ai')
const LEVEL = { 1: 'Beginner', 2: 'Core', 3: 'Advanced' }
const errors = []
const json = f => JSON.parse(readFileSync(join(authored, 'data', f), 'utf8'))
const write = (path, text) => { mkdirSync(join(path, '..'), { recursive: true }); writeFileSync(path, text) }
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// Glossary: "term [alias, alias] | definition".
const glossary = readFileSync(join(authored, 'glossary.txt'), 'utf8').split('\n').filter(l => l.trim() && !l.startsWith('#')).map(line => {
  const [head, ...rest] = line.split(' | ')
  const m = head.match(/^(.*?)(?: \[(.*)\])?$/)
  const names = [m[1], ...(m[2]?.split(', ') ?? [])]
  return { term: m[1], names, def: rest.join(' | ') }
})
const termRe = Object.fromEntries(glossary.map(g => [g.term, new RegExp(`(?<![\\w-])(?:${g.names.map(esc).join('|')})(?![\\w-])`, 'i')]))
const termsIn = text => glossary.map(g => ({ g, at: text.search(termRe[g.term]) })).filter(x => x.at >= 0).sort((a, b) => a.at - b.at).map(x => ({ term: x.g.term, def: x.g.def }))

const stars = existsSync(join(authored, 'data/stars.json')) ? json('stars.json').stars : {}
const repoOf = url => url.match(/^https:\/\/github\.com\/([^/]+\/[^/#?]+)\/?$/)?.[1]


// Wraps the first use of each glossary term on a page in <abbr title="definition">, outside code, links, headings and tables.
function defineInline(md, terms) {
  const pending = terms.map(t => ({ ...t, re: termRe[t.term] })), protect = /(\[[^\]]*\]\([^)]*\)|`[^`]*`|<abbr[^>]*>[^<]*<\/abbr>)/
  let fenced = false
  return md.split('\n').map(line => {
    if (line.startsWith('```')) fenced = !fenced
    if (fenced || line.startsWith('```') || /^(#|\||>|---|\s*<)/.test(line)) return line
    for (const t of pending) {
      if (t.done) continue
      const parts = line.split(protect) // re-split per term so earlier <abbr> titles stay protected
      const at = parts.findIndex((part, i) => i % 2 === 0 && t.re.test(part))
      if (at < 0) continue
      t.done = true
      parts[at] = parts[at].replace(t.re, m => `<abbr title="${t.def.replace(/"/g, '&quot;')}">${m}</abbr>`)
      line = parts.join('')
    }
    return line
  }).join('\n')
}

function parseTopic(chapter, raw, file) {
  const [head, ...lines] = raw.split('\n')
  const [slug, title, level, minutes] = head.slice(2).split(' | ').map(s => s.trim())
  const id = `ai/${chapter.id}/${slug}`
  const fail = msg => errors.push(`${file} ${slug}: ${msg}`)
  let body = lines.join('\n')
  const fence = name => {
    const re = new RegExp('```' + name + '\\n([\\s\\S]*?)```\\n?')
    const m = body.match(re)
    body = body.replace(re, '')
    return m ? m[1].trim().split('\n').filter(Boolean) : []
  }
  const resources = fence('resources').map(l => {
    const [kind, name, url, by, why] = l.split(' | ')
    if (!KINDS.includes(kind) || !/^(https?:\/\/|\/ai\/)/.test(url ?? '') || !why) fail(`bad resource line: ${l}`)
    const repo = repoOf(url ?? '')
    return { kind, title: name, url, by, why, ...(repo && stars[repo] ? { stars: stars[repo] } : {}) }
  })
  const quiz = fence('quiz').map(l => {
    const [q, opts, answer, why] = l.split(' | ')
    const options = (opts ?? '').split(' ; ').map(s => s.trim())
    if (!why || !(+answer in options) || options.length < 2) fail(`bad quiz line: ${l}`)
    return { q, options, answer: +answer, why }
  })
  const story = fence('story').join(' ')
  body = body.trim()
  const summary = body.split('\n\n')[0]
  if (!level || !minutes || summary.startsWith('#')) fail('missing header fields or summary paragraph')
  if (!resources.length) fail('no resources')
  if (!quiz.length) fail('no quiz')
  const rest = body.slice(summary.length).trim()
  return {
    id, slug, title, level: +level, minutes: +minutes, summary, kind: 'Lesson', chapter: chapter.title,
    url: `/ai/docs/${chapter.id}/${slug}`, resources, quiz, terms: termsIn(`${summary}\n${rest}`),
    explainer: EXPLAINERS[slug], story, body: rest,
  }
}

rmSync(out, { recursive: true, force: true })
const chapters = CHAPTERS.map(c => {
  if (c.imported) return { ...c, topics: importGuide(c, termsIn) }
  const file = `${c.id}.md`
  const text = readFileSync(join(authored, file), 'utf8')
  const topics = text.split(/^(?=# [a-z0-9-]+ \| )/m).filter(s => s.startsWith('# ')).map(raw => parseTopic(c, raw, file))
  return { ...c, topics }
})

const topics = Object.fromEntries(chapters.flatMap(c => c.topics.map(t => [t.id, t])))
const slugs = chapters.flatMap(c => c.topics.map(t => t.slug))
for (const s of slugs) if (slugs.indexOf(s) !== slugs.lastIndexOf(s)) errors.push(`duplicate topic slug: ${s}`)
for (const k of Object.values(EXPLAINERS)) if (!k) errors.push('empty explainer')
for (const slug of Object.keys(EXPLAINERS)) if (!slugs.includes(slug)) errors.push(`explainer for unknown topic: ${slug}`)

const models = json('models.json'), radar = json('radar.json'), meta = json('meta.json')
for (const m of models.groups.flatMap(g => g.models)) if (m.topic && !slugs.includes(m.topic)) errors.push(`model ${m.name} -> unknown topic ${m.topic}`)
for (const r of radar) if (r.topic && !slugs.includes(r.topic)) errors.push(`radar ${r.title} -> unknown topic ${r.topic}`)
const urlOf = Object.fromEntries(Object.values(topics).map(t => [t.slug, t.url]))
for (const m of models.groups.flatMap(g => g.models)) if (m.topic) m.topicUrl = urlOf[m.topic]
for (const r of radar) if (r.topic) r.topicUrl = urlOf[r.topic]

// One entry per URL for the library page, with every topic that cites it.
const library = {}
for (const t of Object.values(topics)) for (const r of t.resources) (library[r.url] ??= { ...r, topics: [] }).topics.push({ title: t.title, url: t.url })
if (errors.length) { console.error(errors.join('\n')); process.exit(1) }

const rootPages = []
for (const tier of TIERS) {
  rootPages.push(`---${tier.id}. ${tier.title}---`)
  for (const c of chapters.filter(c => c.tier === tier.id)) {
    rootPages.push(c.id)
    write(join(out, c.id, 'meta.json'), JSON.stringify({ title: c.title, pages: c.topics.map(t => t.slug) }, null, 2))
    for (const t of c.topics) write(join(out, c.id, `${t.slug}.md`), `---\ntitle: ${JSON.stringify(t.title)}\ndescription: ${JSON.stringify(`${t.minutes} min · ${LEVEL[t.level]}`)}\n---\n\n${t.source ? t.body : defineInline(t.body, t.terms)}\n`)
  }
}
write(join(out, 'meta.json'), JSON.stringify({ pages: ['[Dashboard](/ai)', '[Learning map](/ai/map)', ...rootPages, '---Reference---', '[Model atlas](/ai/models)', '[Resource library](/ai/library)', '[Glossary](/ai/glossary)'] }, null, 2))

const slim = Object.fromEntries(Object.entries(topics).map(([id, t]) => [id, { ...t, body: undefined }]))
write(join(here, '../src/generated/ai.json'), JSON.stringify({
  tiers: TIERS, stages: STAGES, goals: GOALS,
  chapters: chapters.map(c => ({ ...c, topics: c.topics.map(t => slim[t.id]) })),
  topics: slim,
  order: chapters.flatMap(c => c.topics.map(t => t.url)),
  models, radar, meta, glossary, library: Object.values(library),
}))
console.log(`ai: ${Object.keys(topics).length} topics, ${chapters.length} chapters, ${Object.keys(library).length} unique resources, ${glossary.length} terms`)
