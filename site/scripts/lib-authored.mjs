// Builds an authored lesson track: authored/<track>/*.md into Fumadocs pages under content/<track> plus src/generated/<track>.json.
// Topic format: `# slug | Title | level | minutes`, then a summary paragraph, `##` sections and ```resources, ```quiz, ```story and optional ```adapted fences.
// In the body, ```mermaid <caption> draws a diagram and ```card <name> holds one `Label | text` line per label of a CARDS shape.
// Each track's curation file supplies TIERS, STAGES, GOALS, CHAPTERS and EXPLAINERS, and optionally STYLES (the rules for a
// chapter's `style`); its build script adds what only it has.
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { diagramSvg, figureMdx } from './lib-diagrams.mjs'
import { pageTree, writeGenerated, writeIfChanged } from './lib-files.mjs'
import { topicsIn } from './lib-lessons.mjs'
import { LEVELS, RESOURCE_KINDS } from '../src/lib/vocab.mjs'

export const CARDS = {
  pattern: ['Problem', 'Solution', 'Use when', 'Avoid when'],
  antipattern: ['Symptoms', 'Why it hurts', 'Detect', 'Fix'],
  design: ['Requirements', 'Scale', 'Key decision', 'Main risk'],
}
const cardKind = labels => Object.keys(CARDS).find(k => CARDS[k].join() === labels.join())

const blocksIn = body => [...body.matchAll(/^```(mermaid|card) (.+)\n([\s\S]*?)^```$/gm)].map(m => ({ kind: m[1], arg: m[2].trim(), lines: m[3].trim().split('\n') }))
const here = new URL('.', import.meta.url).pathname
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const repoOf = url => url.match(/^https:\/\/github\.com\/([^/]+\/[^/#?]+)\/?$/)?.[1]

// Inline maths is $tex$ with no space just inside either dollar and no digit right after the closing one,
// so prices such as "$3 and $15" or "$5/$10" stay text. Write \$ for a literal dollar that would otherwise match.
const INLINE_MATH = String.raw`(?<![\\$])\$(?=[^\s$])(?:[^$\n\\]|\\.)+?(?<=[^\s\\])\$(?![\d$])`
// Spans left as they are: links, code, finished <Term> and <Formula> tags, and inline maths still to convert.
const protect = new RegExp(String.raw`(\[[^\]]*\]\([^)]*\)|` + '`[^`]*`' + String.raw`|<Term def=\{"(?:[^"\\]|\\.)*"\}>[^<]*<\/Term>|<Formula inline tex=\{"(?:[^"\\]|\\.)*"\} \/>|${INLINE_MATH})`)
// Escapes characters MDX would read as markup.
const mdxText = t => t.replace(/</g, '&lt;').replace(/[{}]/g, c => '\\' + c).replace(/\\\$/g, '$')
const span = part => (part.startsWith('$') ? `<Formula inline tex={${JSON.stringify(part.slice(1, -1))}} />` : part)

export function loadTrack(name, { CHAPTERS, EXPLAINERS, TIERS, STAGES, GOALS, STYLES = {}, LESSON_STYLES = {} }, { imported } = {}) {
  const authored = join(here, `../authored/${name}`)
  const out = join(here, `../content/${name}`)
  const errors = []
  const data = f => JSON.parse(readFileSync(join(authored, 'data', f), 'utf8'))

  // Glossary: "term [alias, alias] | definition".
  const glossary = readFileSync(join(authored, 'glossary.txt'), 'utf8').split('\n').filter(l => l.trim() && !l.startsWith('#')).map(line => {
    const [head, ...rest] = line.split(' | ')
    const m = head.match(/^(.*?)(?: \[(.*)\])?$/)
    const names = [m[1], ...(m[2]?.split(', ') ?? [])]
    return { term: m[1], names, def: rest.join(' | ') }
  })
  const termRe = Object.fromEntries(glossary.map(g => [g.term, new RegExp(`(?<![\\w-])(?:${g.names.map(esc).join('|')})(?![\\w-])`, 'i')]))
  const termsIn = text => glossary.map(g => ({ g, at: text.search(termRe[g.term]) })).filter(x => x.at >= 0).sort((a, b) => a.at - b.at).map(x => ({ term: x.g.term, def: x.g.def }))
  const stars = existsSync(join(authored, 'data/stars.json')) ? data('stars.json').stars : {}

  // Escapes MDX markup, turns $$ lines and $inline$ maths into <Formula>, and wraps the first use of each glossary term in <Term>.
  // Fences, tables and quotes are left alone. ```mermaid and ```card blocks become <DiagramFigure> and <LessonCard>,
  // and card text gets the same treatment as prose.
  function toMdx(md, terms) {
    const pending = terms.map(t => ({ ...t, re: termRe[t.term] }))
    const prose = line => {
      const math = line.match(/^\$\$(.+)\$\$$/)
      if (math) return `<Formula tex={${JSON.stringify(math[1].trim())}} />`
      line = line.split(protect).map((part, i) => (i % 2 ? span(part) : mdxText(part))).join('')
      if (/^#/.test(line)) return line
      for (const t of pending) {
        if (t.done) continue
        const parts = line.split(protect) // re-split per term so earlier <Term> tags stay protected
        const at = parts.findIndex((part, i) => i % 2 === 0 && t.re.test(part))
        if (at < 0) continue
        t.done = true
        parts[at] = parts[at].replace(t.re, m => `<Term def={${JSON.stringify(t.def)}}>${m}</Term>`)
        line = parts.join('')
      }
      return line
    }
    const card = ({ arg, lines }) => {
      const fields = lines.map(l => l.split(' | '))
      return [`<LessonCard kind="${cardKind(fields.map(f => f[0]))}" title={${JSON.stringify(arg)}}>`, ...fields.map(([label, text]) => `**${label}.** ${prose(text)}`), '</LessonCard>'].join('\n\n')
    }
    let fenced = false, block = null
    return md.split('\n').map(line => {
      if (block) {
        if (line !== '```') { block.lines.push(line); return null }
        const b = block
        block = null
        return b.kind === 'card' ? card(b) : figureMdx(b.arg, b.lines.join('\n'))
      }
      const open = !fenced && line.match(/^```(mermaid|card) (.+)$/)
      if (open) { block = { kind: open[1], arg: open[2].trim(), lines: [] }; return null }
      if (line.startsWith('```')) { fenced = !fenced; return line }
      if (fenced || /^(\||>|---)/.test(line)) return line
      return prose(line)
    }).filter(l => l !== null).join('\n')
  }
  // The story is shown by its own component, so it is not in the page body. Repeating it in a hidden block puts it in the search index.
  const hiddenStory = story => (story ? `<div hidden>\n\n${toMdx(story, [])}\n\n</div>` : '')

  // Where a topic lives. The id is the topic's progress key in localStorage, so its format must never change.
  const place = (chapter, slug) => ({ id: `${name}/${chapter.id}/${slug}`, chapter: chapter.title, url: `/${name}/docs/${chapter.id}/${slug}` })

  function parseTopic(chapter, { fields: [slug, title, level, minutes], body }, file) {
    const fail = msg => errors.push(`${file} ${slug}: ${msg}`)
    const fence = kind => {
      const re = new RegExp('```' + kind + '\\n([\\s\\S]*?)```\\n?')
      const m = body.match(re)
      body = body.replace(re, '')
      return m ? m[1].trim().split('\n').filter(Boolean) : []
    }
    const resources = fence('resources').map(l => {
      const [kind, title, url, by, why] = l.split(' | ')
      if (!Object.hasOwn(RESOURCE_KINDS, kind ?? '') || !new RegExp(`^(https?://|/${name}/)`).test(url ?? '') || !why) fail(`bad resource line: ${l}`)
      const repo = repoOf(url ?? '')
      return { kind, title, url, by, why, ...(repo && stars[repo] ? { stars: stars[repo] } : {}) }
    })
    const quiz = fence('quiz').map(l => {
      const [q, opts, answer, why] = l.split(' | ')
      const options = (opts ?? '').split(' ; ').map(s => s.trim())
      if (!why || !(+answer in options) || options.length < 2) fail(`bad quiz line: ${l}`)
      return { q, options, answer: +answer, why }
    })
    const story = fence('story').join(' ')
    // Attribution for a lesson that adapts openly licensed text, one `name | url | license` line per source.
    const adapted = fence('adapted').map(l => {
      const [name, url, license] = l.split(' | ')
      if (!/^https?:\/\//.test(url ?? '') || !license) fail(`bad adapted line: ${l}`)
      return { name, url, license }
    })
    body = body.trim()
    const summary = body.split('\n\n')[0]
    if (!level || !minutes || summary.startsWith('#')) fail('missing header fields or summary paragraph')
    if (/(^|\n)1\. [^\n]* 2\. /.test(body)) fail('numbered steps on one line: put each step on its own line')
    if (!resources.length) fail('no resources')
    if (!quiz.length) fail('no quiz')
    const blocks = blocksIn(body)
    const cards = []
    for (const b of blocks) {
      if (b.kind === 'mermaid') {
        try { diagramSvg(b.lines.join('\n')) } catch (e) { fail(`diagram "${b.arg}" does not render: ${e.message}`) }
        continue
      }
      const fields = b.lines.map(l => l.split(' | '))
      const kind = cardKind(fields.map(f => f[0]))
      if (!kind || fields.some(f => f.length !== 2 || !f[1].trim())) fail(`card "${b.arg}" needs one "Label | text" line per label, in order: ${Object.values(CARDS).map(c => c.join(', ')).join(' or ')}`)
      else cards.push({ kind, name: b.arg, text: fields[0][1] })
    }
    // A chapter's style (or a lesson's own, in LESSON_STYLES) names the sections, card and visuals the lesson must have.
    const styleName = LESSON_STYLES[slug] ?? chapter.style
    const style = STYLES[styleName]
    if (style) {
      const sections = [...body.matchAll(/^## (.+)$/gm)].map(m => m[1])
      for (const re of style.sections) if (!sections.some(s => re.test(s))) fail(`a ${styleName} lesson needs a section matching ${re}`)
      const diagrams = blocks.filter(b => b.kind === 'mermaid').length
      if (!diagrams && !EXPLAINERS[slug]) fail('needs a ```mermaid diagram or a demo')
      if (style.card && !cards.some(c => c.kind === style.card)) fail(`needs a ${style.card} card`)
      if (style.diagramPerCard && diagrams < cards.length) fail(`${cards.length} cards but ${diagrams} diagrams: draw each one`)
    }
    const rest = body.slice(summary.length).trim()
    return {
      ...place(chapter, slug), slug, title, level: +level, minutes: +minutes, summary, kind: 'Lesson', resources, quiz, terms: termsIn(`${summary}\n${rest.replace(/^```mermaid[\s\S]*?^```$/gm, '')}`),
      explainer: EXPLAINERS[slug], story, ...(adapted.length && { adapted }), ...(cards.length && { cards }), body: rest,
    }
  }

  const chapters = CHAPTERS.map(c => {
    if (c.imported) return { ...c, topics: imported(termsIn).map(t => ({ ...place(c, t.slug), ...t })) }
    const file = `${c.id}.md`
    const text = readFileSync(join(authored, file), 'utf8')
    return { ...c, topics: topicsIn(text).map(topic => parseTopic(c, topic, file)) }
  })

  const topics = Object.fromEntries(chapters.flatMap(c => c.topics.map(t => [t.id, t])))
  const slugs = chapters.flatMap(c => c.topics.map(t => t.slug))
  for (const s of slugs) if (slugs.indexOf(s) !== slugs.lastIndexOf(s)) errors.push(`duplicate topic slug: ${s}`)
  for (const k of Object.values(EXPLAINERS)) if (!k) errors.push('empty explainer')
  for (const slug of Object.keys(EXPLAINERS)) if (!slugs.includes(slug)) errors.push(`explainer for unknown topic: ${slug}`)
  const urlOf = Object.fromEntries(Object.values(topics).map(t => [t.slug, t.url]))
  const titleOf = Object.fromEntries(Object.values(topics).map(t => [t.slug, t.title]))

  // Fails on any error collected so far, then writes the page tree and the generated JSON.
  // `reference` is the sidebar's Reference section, `extra` merges into the JSON. Returns the resource library.
  function emit({ reference, extra = {} }) {
    // One entry per URL for the library page, with every topic that cites it.
    const library = {}
    for (const t of Object.values(topics)) for (const r of t.resources) (library[r.url] ??= { ...r, topics: [] }).topics.push({ title: t.title, url: t.url })
    if (errors.length) { console.error(errors.join('\n')); process.exit(1) }

    writeGenerated(out, pageTree({
      tiers: TIERS,
      chapters,
      nav: { before: [`[Dashboard](/${name})`, `[Learning map](/${name}/map)`], after: ['---Reference---', ...reference] },
      page: t => ({
        slug: t.slug, ext: t.source ? '.md' : '.mdx', title: t.title, description: `${t.minutes} min · ${LEVELS[t.level]}`,
        body: t.source ? t.body : `${toMdx(t.body, t.terms)}\n\n${hiddenStory(t.story)}`,
      }),
    }))

    const slim = Object.fromEntries(Object.entries(topics).map(([id, t]) => [id, { ...t, body: undefined }]))
    writeIfChanged(join(here, `../src/generated/${name}.json`), JSON.stringify({
      tiers: TIERS, stages: STAGES, goals: GOALS,
      chapters: chapters.map(c => ({ ...c, topics: c.topics.map(t => slim[t.id]) })),
      topics: slim,
      order: chapters.flatMap(c => c.topics.map(t => t.url)),
      glossary, library: Object.values(library), ...extra,
    }))
    return Object.values(library)
  }

  return { errors, data, chapters, topics, slugs, urlOf, titleOf, glossary, emit }
}
