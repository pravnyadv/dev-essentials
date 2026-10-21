'use client'
import { useState } from 'react'
import { Box, fmt, Hint, Line, Slider, Stat } from '../shared/explainerKit.jsx'

const Z = 1.96

// Standard error of a score (percent) measured on n questions, and of the gap between two independent scores.
export const scoreError = (pct, n) => 100 * Math.sqrt((pct / 100) * (1 - pct / 100) / n)
export const gapError = (a, b, n) => Math.hypot(scoreError(a, n), scoreError(b, n))

const lo = (v, e) => v - Z * e
const hi = (v, e) => v + Z * e
const pos = (v, from, to) => `${Math.min(100, Math.max(0, ((v - from) / (to - from)) * 100))}%`

function RangeBar({ from, to, a, b, value, tone = 'bg-fd-primary', zero }) {
  return (
    <div className="relative h-8 rounded-md bg-fd-muted/60">
      {zero !== undefined && <span className="absolute inset-y-0 w-0.5 bg-fd-foreground" style={{ left: pos(zero, from, to) }} />}
      <span className={`absolute top-2 h-4 rounded-sm opacity-40 ${tone}`} style={{ left: pos(a, from, to), width: `calc(${pos(b, from, to)} - ${pos(a, from, to)})` }} />
      <span className={`absolute top-1 h-6 w-1 -translate-x-1/2 rounded-sm ${tone}`} style={{ left: pos(value, from, to) }} />
    </div>
  )
}

// Two scores on n questions, with 95 percent ranges. Defaults are the lesson's worked example: 87.3 vs 86.9 on 500 questions.
export default function BenchmarkGapDemo() {
  const [a, setA] = useState(87.3)
  const [b, setB] = useState(86.9)
  const [power, setPower] = useState(2.699)
  const n = Math.round(10 ** power)
  const ea = scoreError(a, n), eb = scoreError(b, n), eg = gapError(a, b, n)
  const gap = a - b, reach = Z * eg
  const real = Math.abs(gap) > reach
  const from = Math.max(0, Math.floor(Math.min(lo(a, ea), lo(b, eb)) - 1)), to = Math.min(100, Math.ceil(Math.max(hi(a, ea), hi(b, eb)) + 1))
  const half = Math.max(4, Math.ceil(Math.abs(gap) + reach))
  return (
    <Box title="Is the gap real? Two scores and the noise around them">
      <div className="space-y-2">
        <Slider label="Model A score" value={a} onChange={setA} min={50} max={99} unit=" %" />
        <Slider label="Model B score" value={b} onChange={setB} min={50} max={99} unit=" %" />
        <Slider label="Test questions" value={power} onChange={setPower} min={1.699} max={4} step={0.001} display={fmt(n)} />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <Stat label="Model A, 95% range" value={`${a.toFixed(1)} ± ${(Z * ea).toFixed(1)}`} />
        <Stat label="Model B, 95% range" value={`${b.toFixed(1)} ± ${(Z * eb).toFixed(1)}`} />
        <Stat label="Gap A minus B, 95% range" value={`${gap.toFixed(1)} ± ${reach.toFixed(1)}`} />
      </div>
      <div className="mt-4 space-y-2">
        <p className="text-xs font-medium text-fd-muted-foreground">Scores in percent, A on top then B (axis {from} to {to})</p>
        <RangeBar from={from} to={to} a={lo(a, ea)} b={hi(a, ea)} value={a} />
        <RangeBar from={from} to={to} a={lo(b, eb)} b={hi(b, eb)} value={b} tone="bg-fd-muted-foreground" />
        <p className="pt-2 text-xs font-medium text-fd-muted-foreground">Gap in points (axis {-half} to {half}, black line is zero)</p>
        <RangeBar from={-half} to={half} a={gap - reach} b={gap + reach} value={gap} zero={0} tone={real ? 'bg-success' : 'bg-warning'} />
      </div>
      <div className="mt-3 flex min-h-16 items-center sm:min-h-7"><Line tone={real ? 'good' : ''}>{real ? `Likely real: the gap range ${(gap - reach).toFixed(1)} to ${(gap + reach).toFixed(1)} stays on one side of zero` : `Within noise: the gap range ${(gap - reach).toFixed(1)} to ${(gap + reach).toFixed(1)} includes zero`}</Line></div>
      <Hint>Each score has error sqrt(p(1 - p) / n). The gap error is the square root of the two errors squared and added. The range is about twice the error.</Hint>
    </Box>
  )
}
