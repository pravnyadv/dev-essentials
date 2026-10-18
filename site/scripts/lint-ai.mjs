// Readability and depth report for the authored AI lessons. Usage: node scripts/lint-ai.mjs [--all]
// Flags lessons that are short, hard to read (Flesch-Kincaid grade), long-sentenced, light on examples or missing a story.
import { readFileSync } from 'node:fs'

const { chapters } = JSON.parse(readFileSync(new URL('../src/generated/ai.json', import.meta.url), 'utf8'))
const dir = new URL('../content/ai/', import.meta.url).pathname
const syll = w => Math.max(1, (w.toLowerCase().replace(/e$/, '').match(/[aeiouy]+/g) ?? []).length)
const rows = []
for (const c of chapters) for (const t of c.topics) {
  if (t.source) continue
  const md = readFileSync(`${dir}${c.id}/${t.slug}.md`, 'utf8').replace(/^---[\s\S]*?---/, '')
  const prose = `${t.summary}\n${md}`.replace(/```[\s\S]*?```/g, ' ').replace(/`[^`]*`/g, ' ').replace(/[#*>|-]/g, ' ')
  const sentences = prose.split(/[.!?]+\s/).filter(s => s.trim().split(/\s+/).length > 2)
  const words = prose.split(/\s+/).filter(w => /[a-z]/i.test(w))
  const syllables = words.reduce((n, w) => n + syll(w.replace(/[^a-z]/gi, '')), 0)
  const fk = 0.39 * (words.length / sentences.length) + 11.8 * (syllables / words.length) - 15.59
  rows.push({ id: `${c.id}/${t.slug}`, words: words.length, fk: +fk.toFixed(1), sent: +(words.length / sentences.length).toFixed(1), example: /example|for instance|suppose|imagine|picture|let's|say you/i.test(prose) || /\d/.test(prose), story: !!t.story, quiz: t.quiz.length, res: t.resources.length })
}
const flag = r => [r.words < 220 && 'short', r.fk > 11 && 'hard', r.sent > 22 && 'long-sentences', !r.example && 'no-example', !r.story && 'no-story', r.quiz < 2 && 'one-quiz'].filter(Boolean)
const show = process.argv.includes('--all') ? rows : rows.filter(r => flag(r).filter(f => f !== 'no-story' && f !== 'one-quiz').length)
for (const r of show) console.log(`${r.id.padEnd(58)} w${String(r.words).padStart(4)} fk${String(r.fk).padStart(5)} s${String(r.sent).padStart(5)} ${flag(r).join(',')}`)
const avg = k => (rows.reduce((n, r) => n + r[k], 0) / rows.length).toFixed(1)
console.log(`\n${rows.length} lessons. avg words ${avg('words')}, avg FK grade ${avg('fk')}, avg sentence ${avg('sent')}; flagged ${show.length}`)
