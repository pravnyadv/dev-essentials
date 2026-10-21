'use client'
import { useState } from 'react'
import Chip from '../shared/Chip.jsx'
import { Box, Hint, Line, Stat } from '../shared/explainerKit.jsx'

// 16 example weights; weight 0 is the lesson's 0.37. The outlier toggle sets weight 7 to 8, the lesson's "one weight in a row is 8".
// Method as in the lesson: levels evenly spaced over -m..m (m = largest absolute weight in the group), 2^bits levels,
// each weight stored as the nearest level number, and the scale (m) kept at 16 bits per group.
const WEIGHTS = [0.37, -0.82, 0.15, 0.29, -0.31, 0.44, 0.08, -0.12, 0.33, 1, -0.27, 0.21, 0.31, -0.05, 0.26, -0.4]
const OUTLIER = { index: 7, value: 8 }
const SCALE_BITS = 16
const ROW = WEIGHTS.length
const GROUP = 4

export function quantizeRow(weights, bits, groupSize) {
  const levels = 2 ** bits - 1
  const out = { restored: [], steps: [], error: [] }
  for (let g = 0; g < weights.length; g += groupSize) {
    const group = weights.slice(g, g + groupSize)
    const m = Math.max(...group.map(Math.abs))
    const step = (2 * m) / levels
    out.steps.push(step)
    for (const w of group) {
      const restored = step === 0 ? 0 : -m + Math.round((w + m) / step) * step
      out.restored.push(restored)
      out.error.push(Math.abs(w - restored))
    }
  }
  return out
}

const bitsPerWeight = (bits, groupSize) => bits + SCALE_BITS / groupSize
const tint = (err, w) => (err / Math.abs(w) > 0.3 ? 'border-danger bg-danger/10' : err / Math.abs(w) > 0.1 ? 'border-warning bg-warning/15' : 'border-fd-border bg-fd-card')
const num = (n, d = 2) => (Math.abs(n) < 0.0005 ? '0' : n.toFixed(d))

export default function QuantizeDemo() {
  const [bits, setBits] = useState(4)
  const [groupSize, setGroupSize] = useState(ROW)
  const [outlier, setOutlier] = useState(false)
  const weights = outlier ? WEIGHTS.map((w, i) => (i === OUTLIER.index ? OUTLIER.value : w)) : WEIGHTS
  const { restored, steps, error } = quantizeRow(weights, bits, groupSize)
  const crushed = weights.filter((w, i) => error[i] / Math.abs(w) > 0.3).length
  const bpw = bitsPerWeight(bits, groupSize)
  return (
    <Box title="Squeeze the weights">
      <div className="space-y-2 text-sm">
        <div className="flex flex-wrap items-center gap-2"><span className="w-28 font-medium">Bits per weight</span>
          {[8, 4, 3, 2].map(b => <Chip key={b} size="sm" on={bits === b} onClick={() => setBits(b)}>{b}-bit</Chip>)}</div>
        <div className="flex flex-wrap items-center gap-2"><span className="w-28 font-medium">One scale for</span>
          <Chip size="sm" on={groupSize === ROW} onClick={() => setGroupSize(ROW)}>the whole row</Chip>
          <Chip size="sm" on={groupSize === GROUP} onClick={() => setGroupSize(GROUP)}>groups of 4</Chip></div>
        <div className="flex flex-wrap items-center gap-2"><span className="w-28 font-medium">Outlier</span>
          <Chip size="sm" on={outlier} onClick={() => setOutlier(!outlier)}>Set weight 8 to {OUTLIER.value}</Chip></div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: ROW / GROUP }, (_, g) => (
          <div key={g}>
            <p className="mb-1 h-4 text-center text-xs font-medium text-fd-muted-foreground">step {num(steps[Math.floor((g * GROUP) / groupSize)], 3)}</p>
            <div className="grid grid-cols-2 gap-1">
              {weights.slice(g * GROUP, g * GROUP + GROUP).map((w, j) => {
                const i = g * GROUP + j
                return (
                  <div key={i} className={`rounded-md border px-1 py-1 text-center tabular-nums ${tint(error[i], w)}`}>
                    <p className="text-xs text-fd-muted-foreground">{num(w)}</p>
                    <p className="text-sm font-medium">{num(restored[i])}</p>
                    <p className="text-xs text-fd-muted-foreground">off {num(error[i], 3)}</p>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <Stat label="Largest error" value={num(Math.max(...error), 3)} />
        <Stat label="Levels per scale" value={2 ** bits} />
        <Stat label="Memory per weight" value={`${num(bpw, 1)} bits`} />
      </div>
      <Line tone={crushed ? 'bad' : 'good'}>{crushed ? `${crushed} of ${ROW} weights are over 30% off` : 'Every weight is within 30%'}</Line>
      <Hint>Each cell shows the original weight, the restored one, and the error. Amber is over 10% off, red over 30%. Each scale costs {SCALE_BITS} bits shared by its group, which looks big on a row this short (real groups hold 32 to 128 weights).</Hint>
    </Box>
  )
}
