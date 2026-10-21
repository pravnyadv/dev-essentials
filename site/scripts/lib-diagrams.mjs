// Lesson diagrams and charts: Mermaid source to SVG at build time with beautiful-mermaid, used by every track's build.
// Colours come from CSS variables, so the SVG follows the light or dark theme with no client code.
import { renderMermaidSVG } from 'beautiful-mermaid'

// Highlight classes a diagram may use (`class X bad`), drawn in the theme's status colours.
const HIGHLIGHTS = Object.entries({ bad: '--color-danger', good: '--color-success', warn: '--color-warning', focus: '--color-fd-primary' })
  .map(([cls, v]) => `  classDef ${cls} fill:var(${v}),stroke:var(${v}),color:var(--color-fd-background)`).join('\n')
const xml = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
// Chart series colours, from the theme so they stay distinct in light and dark mode (the renderer's own are fixed blues).
const SERIES = ['--color-fd-primary', '--color-success', '--color-warning', '--color-danger', '--color-fd-muted-foreground']

// Charts (xychart): the renderer cannot name series, so `line "O(n)" [..]` names are taken out before rendering and written
// over its "Line 1" legend after. Lines are redrawn straight between the points, because its spline overshoots (a curve
// through 10, 100, 1000 dips below zero). Quotes around x-axis categories are dropped, since it would print them.
function renderChart(chart, options) {
  const names = { line: [], bar: [] }
  const source = chart.split('\n').map(line => {
    const series = line.match(/^(\s*)(line|bar)\s+(?:"([^"]*)"\s*)?\[/)
    if (series) {
      names[series[2]].push(series[3])
      return line.replace(/^(\s*)(line|bar)\s+"[^"]*"\s*\[/, '$1$2 [')
    }
    return line.replace(/^(\s*x-axis\s+(?:"[^"]*"\s*)?)\[([^\]]*)\]/, (_, head, cats) => `${head}[${cats.replace(/"/g, '')}]`)
  }).join('\n')
  let svg = renderMermaidSVG(source, options)
    .replace(/(<path d=")([^"]*)(" class="xychart-line)/g, (_, a, d, b) => a + d.replace(/ C[-\d.]+,[-\d.]+ [-\d.]+,[-\d.]+ ([-\d.]+,[-\d.]+)/g, ' L$1') + b)
    .replace(/--xychart-color-(\d+): [^;]*;/g, (_, i) => `--xychart-color-${i}: var(${SERIES[i % SERIES.length]});`)
  if (![...names.line, ...names.bar].some(Boolean)) return svg
  for (const [kind, label] of [['line', 'Line'], ['bar', 'Bar']]) {
    names[kind].forEach((name, i) => { if (name) svg = svg.replace(`>${label} ${i + 1}</text>`, `>${xml(name)}</text>`) })
  }
  return respaceLegend(svg)
}

// The legend was laid out for "Line 1" labels; lay it out again around the same centre for the real names
// (about 7.6 px per character at its 14 px font, the swatch 14 px, then a 6 px gap and 16 px between items).
function respaceLegend(svg) {
  // A swatch (a legend line, or a 14 px square for bar series) directly followed by its label.
  const item = /<(?:line [^>]*class="xychart-legend-[^"]*"|rect [^>]*width="14" height="14"[^>]*)\/>\s*<text [^>]*>([^<]*)<\/text>/g
  const items = [...svg.matchAll(item)]
  if (items.length < 2) return svg
  const width = labels => labels.reduce((sum, l) => sum + 20 + l.length * 7.6, 0) + 16 * (labels.length - 1)
  const start = +items[0][0].match(/ x1?="([\d.]+)"/)[1]
  const centre = start + width(items.map((_, i) => `Line ${i + 1}`)) / 2
  let x = centre - width(items.map(m => m[1].replace(/&\w+;/g, ' '))) / 2
  for (const m of items) {
    const delta = x - +m[0].match(/ x1?="([\d.]+)"/)[1]
    svg = svg.replace(m[0], m[0].replace(/ (x1|x2|x)="([\d.]+)"/g, (_, k, v) => ` ${k}="${(+v + delta).toFixed(1)}"`))
    x += 20 + m[1].replace(/&\w+;/g, ' ').length * 7.6 + 16
  }
  return svg
}

const svgCache = new Map()
// The renderer imports a web font, which is dropped so text uses the page font. Wide diagrams scroll rather than shrink unreadably.
export function diagramSvg(chart) {
  if (!svgCache.has(chart)) {
    const options = { bg: 'var(--color-fd-card)', fg: 'var(--color-fd-foreground)', accent: 'var(--color-fd-primary)', muted: 'var(--color-fd-muted-foreground)', padding: 16, transparent: true }
    const svg = /^xychart/.test(chart) ? renderChart(chart, options)
      : renderMermaidSVG(/^(flowchart|graph|stateDiagram)/.test(chart) ? `${chart}\n${HIGHLIGHTS}` : chart, options)
    const w = Math.round(+svg.match(/width="([\d.]+)"/)[1])
    svgCache.set(chart, svg.replace(/@import url\([^)]*\);/g, '').replace(/font-family: '[^']*', system-ui, sans-serif/g, 'font-family: inherit')
      .replace(/ width="[\d.]+" height="[\d.]+" style="/, ` width="100%" style="display:block;margin:auto;height:auto;max-width:${w}px;min-width:${Math.round(w * 0.75)}px;`))
  }
  return svgCache.get(chart)
}

// The MDX for one ```mermaid <caption> block, rendered by components/shared/DiagramFigure.
export const figureMdx = (caption, chart) => `<DiagramFigure caption={${JSON.stringify(caption)}} svg={${JSON.stringify(diagramSvg(chart))}} />`
