'use client'
import { useState } from 'react'
import Chip from '../shared/Chip.jsx'
import { Box, Hint, Line, Slider, Stat } from '../shared/explainerKit.jsx'

const TITLE = { A: 'Draft', B: 'Final' }
const DOT = { A: 'bg-fd-primary', B: 'bg-fd-muted-foreground' }
const LO = -10, HI = 20

// Seconds after 12:00:00 as a clock time.
export const clock = s => {
  const t = 12 * 3600 + s, p = n => String(n).padStart(2, '0')
  return `${p(Math.floor(t / 3600))}:${p(Math.floor(t / 60) % 60)}:${p(t % 60)}`
}

// Both edits happen at true times tA and tB. A's clock is `skew` seconds off, B's is right. Ties go to the higher server id (B).
// Lamport: A stamps 1. B stamps max(0, 1) + 1 = 2 if it read A's edit first (only possible when B is later), else 1.
export function resolve({ skew, tA, tB, rule, read }) {
  const stampA = tA + skew, stampB = tB, saw = read && tB > tA
  const cA = 1, cB = saw ? 2 : 1
  const [a, b] = rule === 'lww' ? [stampA, stampB] : [cA, cB]
  return { stampA, stampB, cA, cB, saw, winner: a > b ? 'A' : 'B', truth: tA === tB ? null : tA > tB ? 'A' : 'B' }
}

const pct = s => (s - LO) / (HI - LO) * 100

function Lane({ label, items }) {
  return (
    <div className="grid grid-cols-[4.5rem_1fr] items-center gap-2 text-xs">
      <span className="font-medium text-fd-muted-foreground">{label}</span>
      <div className="relative mx-3 h-12 border-b border-fd-border">
        {items.map(({ id, at, text }) => {
          const flip = pct(at) > 60
          return (
            <div key={id} className={`absolute flex items-center gap-1 ${id === 'A' ? 'top-0' : 'top-6'} ${flip ? 'flex-row-reverse' : ''}`}
              style={{ [flip ? 'right' : 'left']: `calc(${flip ? 100 - pct(at) : pct(at)}% - 0.375rem)` }}>
              <span className={`size-3 shrink-0 rounded-full ${DOT[id]}`} />
              <span className="whitespace-nowrap tabular-nums">{TITLE[id]} {text}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Defaults are the Clocks and Ordering worked example: A 5 s fast, Draft at 12:00:00, Final at 12:00:03, Bob read Draft first.
export default function ClockDemo() {
  const [skew, setSkew] = useState(5)
  const [tA, setTA] = useState(0)
  const [tB, setTB] = useState(3)
  const [rule, setRule] = useState('lww')
  const [read, setRead] = useState(true)
  const r = resolve({ skew, tA, tB, rule, read })
  const lww = rule === 'lww'
  const win = TITLE[r.winner], lose = TITLE[r.winner === 'A' ? 'B' : 'A'], last = r.truth && TITLE[r.truth]
  let verdict, tone = ''
  if (lww) {
    tone = r.truth === null ? '' : r.winner === r.truth ? 'good' : 'bad'
    verdict = r.truth === null ? `Same true instant, so no edit is truly last. ${win} wins the tie.` : r.winner === r.truth ? `${win} survives, and it did happen last.` : `${win} survives, but ${last} happened last. ${lose} is dropped with no error.`
  } else if (r.saw) {
    tone = 'good'
    verdict = 'Bob read Draft first, so Final gets counter 2 against 1. Final survives, ordered by cause.'
  } else {
    verdict = `Neither edit saw the other, so both counters are 1 and cannot say which came last. The tie break keeps ${win}. A good store keeps both.`
  }
  const stamp = (s, c) => (lww ? clock(s) : `counter ${c}`)
  return (
    <Box title="Skewed clocks and last write wins">
      <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
        <span className="w-28 font-medium">Rule</span>
        <Chip on={lww} onClick={() => setRule('lww')}>Wall clock stamp</Chip>
        <Chip on={!lww} onClick={() => setRule('lamport')}>Lamport counter</Chip>
      </div>
      <div className="space-y-2">
        <Slider label="Server A skew" value={skew} onChange={setSkew} min={-10} max={10} step={1} display={`${skew > 0 ? '+' : ''}${skew} s`} />
        <Slider label="Draft saved at" value={tA} onChange={setTA} min={0} max={10} step={1} display={clock(tA)} />
        <Slider label="Final saved at" value={tB} onChange={setTB} min={0} max={10} step={1} display={clock(tB)} />
      </div>
      <div className="mt-2 flex min-h-11 flex-wrap items-center gap-2 text-sm">
        <span className="w-28 font-medium">Bob read Draft</span>
        <Chip on={r.saw} disabled={tB <= tA} onClick={() => setRead(!read)}>{tB <= tA ? 'Not possible' : r.saw ? 'Yes' : 'No'}</Chip>
      </div>
      <div className="mt-3 space-y-1">
        <Lane label="True time" items={[{ id: 'A', at: tA, text: clock(tA) }, { id: 'B', at: tB, text: clock(tB) }]} />
        {lww
          ? <Lane label="Stamped" items={[{ id: 'A', at: r.stampA, text: clock(r.stampA) }, { id: 'B', at: r.stampB, text: clock(r.stampB) }]} />
          : <div className="grid h-12 place-items-center px-2 text-center text-xs text-fd-muted-foreground">A counter has no time of day, so there is no stamped lane.</div>}
      </div>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <Stat label="Draft (server A)" value={stamp(r.stampA, r.cA)} />
        <Stat label="Final (server B)" value={stamp(r.stampB, r.cB)} />
        <Stat label="Survives" value={win} />
      </div>
      <div className="grid min-h-16 items-center"><Line tone={tone}>{verdict}</Line></div>
      <div className="min-h-10"><Hint>{lww ? 'Set the skew to 0 and last write wins gets it right. A fast clock on the older edit flips it.' : 'A counter orders edits only when one saw the other. It cannot say which concurrent edit came last.'}</Hint></div>
    </Box>
  )
}
