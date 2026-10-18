// Draws one scene of a walkthrough. One accent colour: indigo marks what the step acts on.
const Cell = ({ v, on, tint, dim, compact }) => v === null ? <span className={compact ? 'size-5' : 'size-10'} /> : (
  <span className={`grid place-items-center rounded-md border font-medium transition ${compact ? 'h-5 min-w-5 px-0.5 text-[10px]' : 'size-10 min-w-10 px-1 text-sm'} ${
    on ? 'border-indigo-600 bg-indigo-600 text-white' : tint ? 'border-indigo-400 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300' : 'border-stone-300 dark:border-white/20'} ${dim ? 'opacity-30' : ''}`}>{v}</span>
)
const Tag = ({ children }) => <span className="mt-1 block h-4 text-center text-[11px] font-medium text-indigo-700 dark:text-indigo-300">{children}</span>
const RowLabel = ({ children }) => <span className="w-16 shrink-0 pr-2 text-right text-xs text-stone-500">{children}</span>

function ArrayRow({ row, compact }) {
  const [a, b] = row.win ?? [-1, -2]
  let boundary = 0
  const gapAfter = new Set((row.groups ?? []).map(g => (boundary += g) - 1))
  return (
    <div className="flex items-start">
      {!compact && <RowLabel><span className="inline-block pt-2.5">{row.label}</span></RowLabel>}
      <div className="flex">
        {row.cells.map((v, i) => (
          <div key={i} className={`mr-1 ${gapAfter.has(i) && i < row.cells.length - 1 ? '!mr-4' : ''}`}>
            <Cell v={v} compact={compact} on={row.hl?.includes(i)} tint={row.accent || (i >= a && i <= b)} dim={row.dim?.includes(i)} />
            {!compact && <Tag>{row.marks?.[i] ? `↑ ${row.marks[i]}` : ''}</Tag>}
          </div>
        ))}
      </div>
    </div>
  )
}

const POS = [[150, 22], [75, 72], [225, 72], [40, 122], [110, 122], [190, 122], [260, 122]]
const EDGES = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]]
const TRIE = { pos: [[150, 22], [150, 62], [150, 102], [115, 142], [185, 142]], edges: [[0, 1], [1, 2], [2, 3], [2, 4]], h: 165 }

function Tree({ d, compact }) {
  const L = d.layout === 'trie' ? TRIE : { pos: POS, edges: EDGES, h: 145 }
  const r = compact ? 11 : d.r ?? 16, seen = new Set(d.order ?? [])
  const last = d.order?.at(-1)
  return (
    <svg viewBox={`0 0 330 ${L.h}`} className={`w-full ${compact ? 'max-w-[9rem]' : 'max-w-sm'}`}>
      {L.edges.filter(([a, b]) => d.nodes[b] !== undefined).map(([a, b]) => <line key={`${a}-${b}`} x1={L.pos[a][0]} y1={L.pos[a][1]} x2={L.pos[b][0]} y2={L.pos[b][1]} className={seen.has(a) && seen.has(b) ? 'stroke-indigo-500' : 'stroke-stone-300 dark:stroke-white/25'} strokeWidth="2" />)}
      {d.nodes.map((v, i) => {
        const [x, y] = L.pos[i], on = seen.has(i)
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={r} className={`${on ? 'fill-indigo-600 stroke-indigo-600' : 'fill-white stroke-stone-400 dark:fill-stone-900'} ${i === last ? 'stroke-[4] !stroke-indigo-300' : ''}`} />
            <text x={x} y={y + 4} textAnchor="middle" className={`text-[12px] font-medium ${on ? 'fill-white' : 'fill-current'}`}>{v}</text>
            {!compact && on && d.order.length > 1 && <text x={x + r + 3} y={y - r + 4} className="fill-indigo-600 text-[11px] font-bold dark:fill-indigo-300">{d.order.indexOf(i) + 1}</text>}
          </g>
        )
      })}
      {!compact && d.levels?.map((l, k) => <text key={l} x="285" y={26 + k * 50} className="fill-stone-500 text-[10px]">{l}</text>)}
    </svg>
  )
}

// One lane per interval on a shared number line, so overlaps are visible as vertical alignment.
const SPAN = 13
function Intervals({ d, compact }) {
  const input = d.rows.find(r => r.label === 'input'), merged = d.rows.find(r => r.label === 'merged')?.items ?? []
  const current = input.hl?.[0] ?? -1
  const lane = (key, label, [s, e], tone) => (
    <div key={key} className="flex items-center gap-2">
      {!compact && <span className="w-12 shrink-0 text-right font-mono text-[11px] text-stone-500">{label}</span>}
      <div className={`relative flex-1 ${compact ? 'h-2' : 'h-4'}`}><span className={`absolute inset-y-0 rounded ${tone}`} style={{ left: `${(s / SPAN) * 100}%`, width: `${((e - s) / SPAN) * 100}%` }} /></div>
    </div>
  )
  const tone = k => k === current ? 'bg-indigo-600' : k < current ? 'bg-indigo-300 dark:bg-indigo-500/40' : 'bg-stone-300 dark:bg-white/25'
  return (
    <div className={`w-full ${compact ? 'max-w-[9rem] space-y-0.5' : 'max-w-md space-y-1.5'}`}>
      <div className="relative space-y-1.5">
        {!compact && <div className="pointer-events-none absolute inset-y-0 left-14 right-0">{Array.from({ length: SPAN + 1 }, (_, n) => <span key={n} className="absolute inset-y-0 border-l border-dashed border-stone-200 dark:border-white/10" style={{ left: `${(n / SPAN) * 100}%` }} />)}</div>}
        {input.items.map((it, k) => lane(k, `[${it}]`, it, tone(k)))}
      </div>
      {merged.length > 0 && <div className="relative space-y-1.5 border-t border-stone-300 pt-2 dark:border-white/20">
        {merged.map((it, k) => lane(`m${k}`, `[${it}]`, it, 'bg-indigo-600 ring-2 ring-indigo-300'))}
      </div>}
      {!compact && <div className="flex gap-2"><span className="w-12 shrink-0" /><div className="relative h-4 flex-1">{Array.from({ length: SPAN }, (_, n) => <span key={n} className="absolute -translate-x-1/2 text-[10px] text-stone-400" style={{ left: `${(n / SPAN) * 100}%` }}>{n}</span>)}</div></div>}
    </div>
  )
}

function List({ d, compact }) {
  return (
    <div className="flex flex-wrap items-start">
      {d.nullLeft && <div className="flex items-start"><span className="grid size-10 place-items-center text-xs text-stone-400">null</span><span className="mt-2 px-1 text-stone-400">←</span></div>}
      {d.nodes.map((v, i) => (
        <div key={i} className="flex items-start">
          <div><Cell v={v} compact={compact} on={!!d.marks?.[i]} /><Tag>{d.marks?.[i] ?? ''}</Tag></div>
          {i < d.nodes.length - 1 && <span className="mt-2 px-1 text-stone-400">{i < (d.rev ?? 0) ? '←' : '→'}</span>}
        </div>
      ))}
      {d.loopTo !== undefined && <span className="ml-2 mt-2.5 text-xs text-stone-500">↩ tail points to node {d.nodes[d.loopTo]}</span>}
    </div>
  )
}

export default function Diagram({ d, compact = false }) {
  let body
  if (d.kind === 'array') body = <div className="space-y-1">{d.rows.map((r, i) => <ArrayRow key={i} row={r} compact={compact} />)}</div>
  else if (d.kind === 'stack') body = (
    <div className="flex items-end gap-6">
      <div className="space-y-1">{d.rows.map((r, i) => <ArrayRow key={i} row={r} compact={compact} />)}</div>
      <div className="flex flex-col items-center"><div className="flex min-h-[2.75rem] min-w-12 flex-col-reverse gap-1 rounded-md border border-dashed border-stone-400 p-1">{d.stack.map((v, i) => <Cell key={i} v={v} compact={compact} tint />)}</div><Tag>stack</Tag></div>
    </div>
  )
  else if (d.kind === 'tree') body = <Tree d={d} compact={compact} />
  else if (d.kind === 'intervals') body = <Intervals d={d} compact={compact} />
  else if (d.kind === 'list') body = <List d={d} compact={compact} />
  else if (d.kind === 'grid') body = (
    <div className="inline-grid gap-1" style={{ gridTemplateColumns: `repeat(${d.cells[0].length}, auto)` }}>
      {d.cells.flatMap((row, r) => row.map((v, c) => <Cell key={`${r}-${c}`} v={v} compact={compact} on={d.hl?.some(([a, b]) => a === r && b === c)} dim={!d.hl?.some(([a, b]) => a === r && b === c) && v === 0} />))}
    </div>
  )
  return body
}
