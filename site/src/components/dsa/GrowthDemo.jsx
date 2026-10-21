'use client'
import { useState } from 'react'
import Chip from '../shared/Chip.jsx'
import { Box, fmt, Hint, Line, Slider } from '../shared/explainerKit.jsx'

// Steps for each growth rate at input size n. Defaults come from the lesson: n = 1,000,000 (its table column) and the
// "What the input size tells you" table. 100 million steps a second is the speed assumed for one simple step per tick.
const SPEED = 1e8, BIG = 1e100, UNIVERSE_S = 13.8e9 * 31557600
const fact = n => { if (n > 170) return Infinity; let f = 1; for (let i = 2; i <= n; i++) f *= i; return f }
export const RATES = [
  { name: 'O(1)', steps: () => 1 },
  { name: 'O(log n)', steps: n => Math.max(1, Math.round(Math.log2(n))) },
  { name: 'O(n)', steps: n => n },
  { name: 'O(n log n)', steps: n => Math.max(1, Math.round(n * Math.log2(n))) },
  { name: 'O(n²)', steps: n => n * n },
  { name: 'O(2ⁿ)', steps: n => 2 ** n },
  { name: 'O(n!)', steps: fact },
]
export const AIM = [[10, 'O(n!)'], [20, 'O(2ⁿ)'], [500, 'O(n³)'], [5000, 'O(n²)'], [100000, 'O(n log n)'], [1e6, 'O(n)']]
export const aimFor = n => (AIM.find(([max]) => n <= max) ?? [0, 'O(log n) or O(1)'])[1]

export const showSteps = v => {
  if (v > BIG) return 'more than 1e100'
  return v < 1e13 ? fmt(v) : v.toExponential(1).replace('.0e', 'e').replace('e+', 'e')
}
const YEAR = 31557600
// [seconds per unit, name, how many of this unit make the next one]
const UNITS = [[1, 'second', 60], [60, 'minute', 60], [3600, 'hour', 24], [86400, 'day', 365]]
const round1 = x => Math.round(x * 10) / 10
const amount = x => (x < 10 ? String(round1(x)) : fmt(x))
const plural = (x, unit) => `${amount(x)} ${unit}${round1(x) === 1 ? '' : 's'}`
export const showTime = steps => {
  const t = steps / SPEED
  if (t > UNIVERSE_S) return 'longer than the age of the universe'
  if (t < 1e-3) return 'under 1 ms'
  if (Math.round(t * 1000) < 1000) return `${fmt(t * 1000)} ms`
  for (const [size, unit, next] of UNITS) if (Math.round(t / size) < next) return plural(t / size, unit)
  const years = t / YEAR
  if (Math.round(years) < 1e6) return plural(years, 'year')
  if (Math.round(years / 1e6) < 1000) return `${amount(years / 1e6)} million years`
  return `${amount(years / 1e9)} billion years`
}
export const fitsInSecond = steps => steps <= SPEED

export default function Demo() {
  const [power, setPower] = useState(6)
  const [shown, setShown] = useState(() => RATES.map(() => true))
  const n = Math.round(10 ** power)
  return (
    <Box title="Growth rates: how many steps, and how long">
      <Slider label="Input size n" value={power} onChange={setPower} min={0} max={6} step={0.01} display={fmt(n)} />
      <div className="mt-3 flex flex-wrap gap-2">
        {RATES.map((r, i) => <Chip key={r.name} size="sm" on={shown[i]} onClick={() => setShown(s => s.map((v, j) => (j === i ? !v : v)))}>{r.name}</Chip>)}
      </div>
      <div className="mt-3 space-y-2">
        {RATES.map((r, i) => {
          const v = r.steps(n), ok = fitsInSecond(v)
          return (
            <div key={r.name} className={`rounded-lg border p-2 text-sm ${shown[i] ? '' : 'invisible'} ${ok ? 'border-success' : ''}`}>
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">{r.name}</span>
                <span className={`text-xs font-medium ${ok ? 'text-success' : 'text-fd-muted-foreground'}`}>{ok ? 'Finishes within 1 second' : 'Takes over 1 second'}</span>
              </div>
              <div className="relative my-1.5 h-3 overflow-hidden rounded bg-fd-border">
                <div className={`h-3 rounded ${ok ? 'bg-success' : 'bg-danger'}`} style={{ width: `${Math.max(1, Math.min(100, Math.log10(v)))}%` }} />
                <div className="absolute inset-y-0 w-px bg-fd-foreground" style={{ left: '8%' }} />
              </div>
              <div className="grid grid-cols-2 gap-2 tabular-nums">
                <span className="min-h-20 sm:min-h-14"><span className="block text-xs text-fd-muted-foreground">Steps</span>{showSteps(v)}</span>
                <span className="min-h-20 sm:min-h-14"><span className="block text-xs text-fd-muted-foreground">Time at 100 million steps a second</span>{showTime(v)}</span>
              </div>
            </div>
          )
        })}
      </div>
      <Line>At n = {fmt(n)}, the lesson says to aim for {aimFor(n)} or better</Line>
      <Hint>Bar length is the number of digits in the step count, so a full bar is 1e100. The vertical line marks 100 million steps, one second.</Hint>
    </Box>
  )
}
