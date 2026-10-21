// Writing generated files without touching unchanged ones, so a running dev server only recompiles what changed.
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

export function writeIfChanged(path, text) {
  if (existsSync(path) && readFileSync(path, 'utf8') === text) return
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, text)
}

// A track's Fumadocs page tree as [path, text] pairs: chapters under their tier's separator, one page per topic.
// `nav` holds the root entries before and after the tiers. page(topic) gives { slug, ext, title, description, body }.
export function pageTree({ tiers, chapters, nav, page }) {
  const files = [], rootPages = []
  for (const tier of tiers) {
    rootPages.push(`---${tier.id}. ${tier.title}---`)
    for (const c of chapters.filter(c => c.tier === tier.id)) {
      rootPages.push(c.id)
      const pages = c.topics.map(page)
      files.push([join(c.id, 'meta.json'), JSON.stringify({ title: c.title, pages: pages.map(p => p.slug) }, null, 2)])
      for (const p of pages) files.push([join(c.id, `${p.slug}${p.ext}`), `---\ntitle: ${JSON.stringify(p.title)}\ndescription: ${JSON.stringify(p.description)}\n---\n\n${p.body}\n`])
    }
  }
  files.push(['meta.json', JSON.stringify({ pages: [...nav.before, ...rootPages, ...nav.after] }, null, 2)])
  return files
}

// Writes a generated folder's files and deletes the ones a previous run left behind.
export function writeGenerated(root, files) {
  const kept = new Set(files.map(([path]) => join(root, path)))
  for (const [path, text] of files) writeIfChanged(join(root, path), text)
  if (!existsSync(root)) return
  for (const f of readdirSync(root, { recursive: true })) {
    const p = join(root, f)
    if (statSync(p).isFile() && !kept.has(p)) rmSync(p)
  }
}
