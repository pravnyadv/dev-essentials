// Fails when UI code drifts from the shared components and tokens. Part of `npm run verify`.
// Each rule names the one place a pattern may live. Add to an allow-list only with a reason.
import { readFileSync, readdirSync } from 'node:fs'
import { join, relative } from 'node:path'

const root = new URL('../src/', import.meta.url).pathname
const files = readdirSync(root, { recursive: true }).filter(f => /\.(jsx|tsx)$/.test(f)).map(f => join(root, f))

const RULES = [
  { name: 'custom pixel font size: use text-xs, text-sm or a heading scale', re: /text-\[\d+px\]/, allow: ['components/dsa/Diagram.jsx', 'components/dsa/PrefixSumExplainer.jsx', 'components/dsa/Patterns.jsx'] },
  { name: 'raw palette color: use the success, danger, warning or fd-* tokens', re: /\b(?:text|bg|border|stroke|fill)-(?:emerald|rose|amber|sky|violet|indigo|red|green|blue|yellow)-\d/, allow: ['components/ai/storyData.js'] },
  { name: 'grid-area:main belongs to PageContainer', re: /grid-area:main/, allow: ['components/shared/PageContainer.jsx'] },
  { name: 'bordered card: use <Panel> or <RowList>', re: /rounded-xl border bg-fd-card/, allow: ['components/shared/Panel.jsx', 'components/shared/RowList.jsx', 'components/shared/LearningMap.jsx'] },
  { name: 'page title or section heading: use <SectionHeading>', re: /<h[12][ >]/, allow: ['components/shared/SectionHeading.jsx'] },
  { name: 'filter or toggle pill: use <Chip>', re: /rounded-full border px-\d/, allow: ['components/shared/Chip.jsx'] },
]

const errors = []
for (const file of files) {
  const rel = relative(root, file), lines = readFileSync(file, 'utf8').split('\n')
  for (const rule of RULES) if (!rule.allow.includes(rel)) lines.forEach((l, i) => rule.re.test(l) && errors.push(`${rel}:${i + 1}  ${rule.name}`))
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1) }
console.log(`ui ok: ${files.length} files, ${RULES.length} rules`)
