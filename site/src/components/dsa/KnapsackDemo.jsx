'use client'
import { useState } from 'react'
import Chip from '../shared/Chip.jsx'
import { ActionButton, Box, cell, fmt, Hint, Line, Slider, Stat, TONE } from '../shared/explainerKit.jsx'

const NAMES = 'ABCDE'
// Defaults are the lesson's worked example: capacity 10, items A(1,1) B(3,4) C(4,5) D(5,7), plus a spare fifth item.
const START = [[1, 1], [3, 4], [4, 5], [5, 7], [2, 3]]

// dp[i][w] = best value using the first i items with room w. Row 0 is all zeros.
export function buildTable(items, cap) {
  const dp = [Array(cap + 1).fill(0)]
  items.forEach(([wt, val], k) => {
    dp.push(dp[k].map((skip, w) => (wt <= w ? Math.max(skip, val + dp[k][w - wt]) : skip)))
  })
  return dp
}

// Walk back from the last cell: a row where the value changed means that item was taken.
export function traceBack(dp, items, cap) {
  const taken = [], path = [[items.length, cap]]
  for (let i = items.length, w = cap; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) { taken.push(i - 1); w -= items[i - 1][0] }
    path.push([i - 1, w])
  }
  return { taken: taken.reverse(), path }
}

const Stepper = ({ label, value, min, max, onChange }) => (
  <span className="flex items-center gap-1 text-sm">
    <span className="w-14 text-fd-muted-foreground">{label}</span>
    <ActionButton aria-label={`less ${label}`} disabled={value <= min} onClick={() => onChange(value - 1)}>-</ActionButton>
    <span className="w-6 text-center font-medium tabular-nums">{value}</span>
    <ActionButton aria-label={`more ${label}`} disabled={value >= max} onClick={() => onChange(value + 1)}>+</ActionButton>
  </span>
)

export default function KnapsackDemo() {
  const [items, setItems] = useState(START.slice(0, 4))
  const [cap, setCap] = useState(10)
  const [filled, setFilled] = useState(0)
  const n = items.length, cols = cap + 1, total = n * cols
  const dp = buildTable(items, cap)
  const done = filled === total
  const { taken, path } = traceBack(dp, items, cap)
  const onPath = new Set(path.map(([i, w]) => `${i},${w}`))
  const edit = fn => { fn(); setFilled(0) }
  const setItem = (k, j, v) => edit(() => setItems(items.map((it, x) => (x === k ? it.map((n2, y) => (y === j ? v : n2)) : it))))
  const setCount = c => edit(() => setItems(START.map(([a, b], k) => items[k] ?? [a, b]).slice(0, c)))

  const last = filled - 1, li = 1 + Math.floor(last / cols), lw = last % cols
  const [wt, val] = items[li - 1] ?? [0, 0]
  const reads = filled && !done ? [[li - 1, lw], ...(wt <= lw ? [[li - 1, lw - wt]] : [])] : []
  const tone = (i, w) => {
    const idx = (i - 1) * cols + w
    if (i === 0) return 'idle'
    if (idx >= filled) return 'idle'
    if (done) return onPath.has(`${i},${w}`) && i === n && w === cap ? 'pick' : onPath.has(`${i},${w}`) ? 'good' : 'idle'
    if (idx === last) return 'pick'
    return reads.some(([ri, rw]) => ri === i && rw === w) ? 'in' : 'idle'
  }
  const readTone = (i, w) => (reads.some(([ri, rw]) => ri === i && rw === w) ? 'in' : null)
  const show = (i, w) => (i === 0 || (i - 1) * cols + w < filled ? dp[i][w] : '')

  let line = 'Press Step to fill the first cell.'
  if (filled) {
    const skip = dp[li - 1][lw], take = wt <= lw ? val + dp[li - 1][lw - wt] : null
    line = `${NAMES[li - 1]} at w=${lw}: skip ${skip}, ${take === null ? `take does not fit (weight ${wt})` : `take ${val} + ${dp[li - 1][lw - wt]} = ${take}`}, keep ${dp[li][lw]}`
  }
  if (done) line = `Traced back: take ${taken.length ? taken.map(k => NAMES[k]).join(', ') : 'nothing'}`

  return (
    <Box title="0/1 knapsack: fill the table one cell at a time">
      <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
        <span className="w-28 font-medium">Items</span>
        {[2, 3, 4, 5].map(c => <Chip key={c} size="sm" on={n === c} onClick={() => setCount(c)}>{c}</Chip>)}
      </div>
      <div className="space-y-1">
        {items.map(([a, b], k) => (
          <div key={k} className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="w-14 text-sm font-medium">Item {NAMES[k]}</span>
            <Stepper label="weight" value={a} min={1} max={9} onChange={v => setItem(k, 0, v)} />
            <Stepper label="value" value={b} min={1} max={20} onChange={v => setItem(k, 1, v)} />
          </div>
        ))}
      </div>
      <div className="mt-2"><Slider label="Capacity" value={cap} onChange={c => edit(() => setCap(c))} min={1} max={12} step={1} /></div>
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        <ActionButton disabled={done} onClick={() => setFilled(filled + 1)}>Step</ActionButton>
        <ActionButton disabled={done} onClick={() => setFilled(total)}>Run</ActionButton>
        <ActionButton disabled={!filled} onClick={() => setFilled(0)}>Reset</ActionButton>
      </div>
      <div className="mt-3 overflow-x-auto pb-1">
        <div className="mx-auto w-max space-y-1">
          <div className="flex gap-1">
            <span className="w-14 shrink-0 text-xs text-fd-muted-foreground">w =</span>
            {Array.from({ length: cols }, (_, w) => <span key={w} className="w-10 shrink-0 text-center text-xs text-fd-muted-foreground">{w}</span>)}
          </div>
          {Array.from({ length: n + 1 }, (_, i) => (
            <div key={i} className="flex gap-1">
              <span className={`w-14 shrink-0 self-center text-xs font-medium ${done && taken.includes(i - 1) ? 'text-success' : 'text-fd-muted-foreground'}`}>{i === 0 ? 'none' : `${NAMES[i - 1]} ${items[i - 1][0]}/${items[i - 1][1]}`}</span>
              {Array.from({ length: cols }, (_, w) => {
                const t = tone(i, w), r = readTone(i, w)
                return <span key={w} className={`${cell} w-10 shrink-0 ${TONE[r ?? t]}`}>{show(i, w)}</span>
              })}
            </div>
          ))}
        </div>
      </div>
      <p className="mt-1 text-center text-xs text-fd-muted-foreground">Row labels show weight/value. Highlighted cells are the ones the newest cell reads.</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Stat label="Best value" value={done ? fmt(dp[n][cap]) : '?'} />
        <Stat label="Weight used" value={done ? `${taken.reduce((s, k) => s + items[k][0], 0)} of ${cap}` : '?'} />
      </div>
      <div className="flex min-h-12 flex-col justify-center"><Line tone={done ? 'good' : ''}>{line}</Line></div>
      <Hint>Each cell is the larger of skipping the item (the cell above) or taking it (its value plus the cell above, one item's weight to the left).</Hint>
    </Box>
  )
}
