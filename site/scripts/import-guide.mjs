// Imports the technique pages of dair-ai/Prompt-Engineering-Guide (MIT) as a reference chapter.
// Their MDX uses Next components, so images become markdown images and promo blocks are dropped.
import { cpSync, existsSync, mkdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

const here = new URL('.', import.meta.url).pathname
const repo = join(here, '../../vendor/prompt-engineering-guide')
const SITE = 'https://www.promptingguide.ai'
const GITHUB = 'https://github.com/dair-ai/Prompt-Engineering-Guide'
// [file, level] in teaching order.
const PAGES = [['zeroshot', 1], ['fewshot', 1], ['cot', 2], ['consistency', 2], ['knowledge', 3], ['prompt_chaining', 2], ['tot', 3], ['rag', 2], ['react', 2], ['reflexion', 3], ['pal', 3], ['art', 3], ['activeprompt', 3], ['ape', 3], ['dsp', 3], ['multimodalcot', 3], ['graph', 3], ['meta-prompting', 3]]

function clean(md, file) {
  const images = {}
  md = md.replace(/^import\s+(\w+)\s+from\s+'[^']*?img\/([^']+)'.*$/gm, (_, name, path) => ((images[name] = path), ''))
  md = md.replace(/^import .*$/gm, '')
  md = md.replace(/\]\((\/[^)]*)\)/g, (_, p) => `](${SITE}${p})`)
  const copyImage = path => {
    const to = join(here, '../public/content/ai-ref', path)
    mkdirSync(dirname(to), { recursive: true })
    cpSync(join(repo, 'img', path), to)
    return `/content/ai-ref/${path}`
  }
  md = md.replace(/<Screenshot\s+src=\{(\w+)\}\s+alt="([^"]*)"\s*\/>/g, (_, name, alt) => {
    if (!images[name]) throw new Error(`${file}: image ${name} not imported`)
    return `![${alt}](${copyImage(images[name])})`
  })
  md = md.replace(/\]\((?:\.\.\/)+img\/([^)]+)\)/g, (_, path) => `](${copyImage(path)})`)
  md = md.replace(/<CoursesSection[\s\S]*?<\/CoursesSection>/g, '').replace(/<CoursePromo[\s\S]*?\/>/g, '')
  md = md.replace(/<iframe[\s\S]*?<\/iframe>/g, '').replace(/<Cards>[\s\S]*?<\/Cards>/g, '')
  const outsideFences = md.split(/^```[\s\S]*?^```/m).join('')
  const leftover = outsideFences.match(/<[A-Z][A-Za-z]*/)
  if (leftover) throw new Error(`${file}: unhandled component ${leftover[0]}`)
  return md.replace(/\n{3,}/g, '\n\n').trim()
}

export function importGuide(chapter, termsIn) {
  if (!existsSync(join(repo, 'pages/techniques'))) throw new Error('vendor/prompt-engineering-guide missing: run scripts/ensure-source.mjs')
  return PAGES.map(([file, level]) => {
    const raw = readFileSync(join(repo, 'pages/techniques', `${file}.en.mdx`), 'utf8')
    const [, title] = raw.match(/^# (.+)$/m)
    const body = clean(raw.replace(/^# .+$/m, ''), file)
    const slug = file === 'rag' ? 'rag-prompting' : file.replaceAll('_', '-') // `rag` is taken by the authored lesson
    const summary = body.split('\n\n').find(p => p.length > 80 && /^[A-Z]/.test(p) && !p.startsWith('Image')) ?? title
    const url = `${SITE}/techniques/${file}`
    return {
      id: `ai/${chapter.id}/${slug}`, slug, title, level, minutes: Math.max(3, Math.round(body.split(/\s+/).length / 180)), summary: summary.replace(/\s+/g, ' ').slice(0, 280),
      kind: 'Reference', chapter: chapter.title, url: `/ai/docs/${chapter.id}/${slug}`,
      resources: [{ kind: 'docs', title: `${title} on promptingguide.ai`, url, by: 'DAIR.AI', why: 'The original page, with the latest edits and translations.' }],
      quiz: [], terms: termsIn(body), body,
      source: { name: 'DAIR.AI Prompt Engineering Guide', url: `${GITHUB}/blob/main/pages/techniques/${file}.en.mdx`, license: 'MIT' },
    }
  })
}
