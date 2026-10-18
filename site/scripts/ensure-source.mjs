// Clones the upstream content repos into ../vendor if absent (vendor/ is gitignored).
import { existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

const vendor = name => new URL(`../../vendor/${name}`, import.meta.url).pathname
const git = (...args) => execFileSync('git', args, { stdio: 'inherit' })

const algos = vendor('javascript-algorithms')
if (!existsSync(algos + '/src')) git('clone', '--depth', '1', 'https://github.com/trekhleb/javascript-algorithms.git', algos)

// Only the pages and images the AI track imports; the full repo is 80MB with translations.
const guide = vendor('prompt-engineering-guide')
if (!existsSync(guide + '/pages/techniques')) {
  if (!existsSync(guide)) git('clone', '--depth', '1', '--filter=blob:none', '--sparse', 'https://github.com/dair-ai/Prompt-Engineering-Guide.git', guide)
  git('-C', guide, 'sparse-checkout', 'set', 'pages/techniques', 'img')
}
