// Readability and depth report for the authored AI lessons. Usage: node scripts/lint-ai.mjs [--all]
// Flags lessons that are short, hard to read (Flesch-Kincaid grade), long-sentenced, light on examples or missing a story.
import { readFileSync } from 'node:fs'
import { readLessons } from './lib-lessons.mjs'

const { chapters } = JSON.parse(readFileSync(new URL('../src/generated/ai.json', import.meta.url), 'utf8'))
const dir = new URL('../content/ai/', import.meta.url).pathname
const syll = w => Math.max(1, (w.toLowerCase().replace(/e$/, '').match(/[aeiouy]+/g) ?? []).length)
const rows = []
for (const c of chapters) for (const t of c.topics) {
  if (t.source) continue
  const md = readFileSync(`${dir}${c.id}/${t.slug}.mdx`, 'utf8').replace(/^---[\s\S]*?---/, '').replace(/<Term def=\{"(?:[^"\\]|\\.)*"\}>([^<]*)<\/Term>/g, '$1')
  const prose = `${t.summary}\n${md}`.replace(/```[\s\S]*?```/g, ' ').replace(/`[^`]*`/g, ' ').replace(/[#*>|-]/g, ' ')
  const sentences = prose.split(/[.!?]+\s/).filter(s => s.trim().split(/\s+/).length > 2)
  const words = prose.split(/\s+/).filter(w => /[a-z]/i.test(w))
  const syllables = words.reduce((n, w) => n + syll(w.replace(/[^a-z]/gi, '')), 0)
  const fk = 0.39 * (words.length / sentences.length) + 11.8 * (syllables / words.length) - 15.59
  rows.push({ id: `${c.id}/${t.slug}`, words: words.length, fk: +fk.toFixed(1), sent: +(words.length / sentences.length).toFixed(1), example: /example|for instance|suppose|imagine|picture|let's|say you/i.test(prose) || /\d/.test(prose), story: !!t.story, quiz: t.quiz.length, res: t.resources.length })
}
const flag = r => [r.words < 170 && 'short', r.fk > 11 && 'hard', r.sent > 22 && 'long-sentences', !r.example && 'no-example', !r.story && 'no-story', r.quiz < 2 && 'one-quiz'].filter(Boolean)
const show = process.argv.includes('--all') ? rows : rows.filter(r => flag(r).filter(f => f !== 'no-story' && f !== 'one-quiz').length)
for (const r of show) console.log(`${r.id.padEnd(58)} w${String(r.words).padStart(4)} fk${String(r.fk).padStart(5)} s${String(r.sent).padStart(5)} ${flag(r).join(',')}`)
const avg = k => (rows.reduce((n, r) => n + r[k], 0) / rows.length).toFixed(1)
console.log(`\n${rows.length} lessons. avg words ${avg('words')}, avg FK grade ${avg('fk')}, avg sentence ${avg('sent')}; flagged ${show.length}`)

// Content checks that fail `npm run lint:ai -- --strict`: sections that restate each other, and quiz keys that give the answer away (one position, or always the longest option).
const words = t => new Set(t.toLowerCase().match(/[a-z]{4,}/g) ?? [])
const problems = []
for (const l of readLessons()) {
  const s = l.sections.filter(x => x.title !== 'The code').map(x => ({ ...x, w: words(x.text) })) // code mirrors its worked example on purpose
  for (let i = 0; i < s.length; i++) for (let j = i + 1; j < s.length; j++) {
    const min = Math.min(s[i].w.size, s[j].w.size)
    if (min >= 12 && [...s[i].w].filter(x => s[j].w.has(x)).length / min >= 0.6) problems.push(`${l.chapter}/${l.slug}: sections "${s[i].title}" and "${s[j].title}" restate each other`)
  }
}
const { chapters: all } = JSON.parse(readFileSync(new URL('../src/generated/ai.json', import.meta.url), 'utf8'))
for (const c of all) {
  const keys = c.topics.flatMap(t => t.quiz.map(q => q.answer)), n = keys.length
  const top = Math.max(...[0, 1, 2].map(k => keys.filter(x => x === k).length))
  if (n >= 6 && top / n > 0.5) problems.push(`${c.id}: ${Math.round((top / n) * 100)}% of quiz keys sit at one position`)
  const qs = c.topics.flatMap(t => t.quiz)
  const longest = qs.filter(q => q.options[q.answer].length === Math.max(...q.options.map(o => o.length))).length
  if (n >= 6 && longest / n > 0.5) problems.push(`${c.id}: the keyed option is the longest in ${Math.round((longest / n) * 100)}% of quiz questions`)
}
for (const p of problems) console.log('PROBLEM', p)
if (process.argv.includes('--strict') && problems.length) process.exit(1)
