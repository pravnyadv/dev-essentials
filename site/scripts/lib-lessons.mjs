// Reads the authored lesson files into { chapter, slug, title, sections: [{ title, text }] } for the lint scripts.
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const dir = new URL('../authored/ai/', import.meta.url).pathname
export function readLessons() {
  const out = []
  for (const f of readdirSync(dir).filter(f => f.endsWith('.md'))) {
    const text = readFileSync(join(dir, f), 'utf8')
    for (const raw of text.split(/^(?=# [a-z0-9-]+ \| )/m).filter(s => s.startsWith('# '))) {
      const [head, ...rest] = raw.split('\n')
      const [slug, title] = head.slice(2).split(' | ')
      const body = rest.join('\n').replace(/```[\s\S]*?```/g, '')
      const sections = body.split(/^(?=## )/m).filter(s => s.startsWith('## ')).map(s => ({ title: s.split('\n')[0].slice(3), text: s.split('\n').slice(1).join('\n') }))
      out.push({ chapter: f.replace('.md', ''), slug, title, sections })
    }
  }
  return out
}
