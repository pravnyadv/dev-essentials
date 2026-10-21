// Splitting an authored chapter file into topics, and reading every lesson's sections for the lint scripts.
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

// Each `# slug | Title | level | minutes` heading as trimmed fields, with the text under it.
export const topicsIn = text => text.split(/^(?=# [a-z0-9-]+ \| )/m).filter(s => s.startsWith('# ')).map(raw => {
  const [head, ...lines] = raw.split('\n')
  return { fields: head.slice(2).split(' | ').map(s => s.trim()), body: lines.join('\n') }
})

// Every lesson of a track as { chapter, slug, title, sections: [{ title, text }] }.
export function readLessons(track) {
  const dir = new URL(`../authored/${track}/`, import.meta.url).pathname
  const out = []
  for (const f of readdirSync(dir).filter(f => f.endsWith('.md'))) {
    const text = readFileSync(join(dir, f), 'utf8')
    for (const { fields: [slug, title], body: raw } of topicsIn(text)) {
      const body = raw.replace(/```[\s\S]*?```/g, '')
      const sections = body.split(/^(?=## )/m).filter(s => s.startsWith('## ')).map(s => ({ title: s.split('\n')[0].slice(3), text: s.split('\n').slice(1).join('\n') }))
      out.push({ chapter: f.replace('.md', ''), slug, title, sections })
    }
  }
  return out
}
