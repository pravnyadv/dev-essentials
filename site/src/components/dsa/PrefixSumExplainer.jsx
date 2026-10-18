'use client'
import { useState } from 'react'
import { cell, idle } from './explainerKit.jsx'
import Walkthrough from './Walkthrough.jsx'

const N = [3, 1, 4, 2, 5]
const P = N.map((_, i) => N.slice(0, i + 1).reduce((a, b) => a + b))

const TEXT = [
  'Question: what is 1 + 4 + 2? Adding three numbers is easy. But if someone asks 1,000 range questions, you re-add the same numbers again and again.',
  'The fix: walk left to right once and write a running total under each number. Each bottom box means everything from the start up to here. The small sum under it shows how it was built.',
  'Want 1 + 4 + 2? Look at the running total under the 2: it is 10. That is too much, because it counts 3 + 1 + 4 + 2 and includes an extra 3 at the front.',
  'Remove the extra part. The running total just before your range is 3, so 10 − 3 = 7. That is two lookups and one subtraction, however long the range is. This list of running totals is called a prefix sum.',
  'Your turn. Tap a start number, then an end number. Try starting at the first number to see the "nothing before" case.',
]

const STEPS = TEXT.map(text => ({ text }))

const Label = ({ children }) => <div className="text-right text-xs leading-tight text-fd-muted-foreground">{children}</div>
const grid = { display: 'grid', gridTemplateColumns: '92px repeat(5, 40px)', gap: 4, alignItems: 'center' }
const bar = 'flex h-7 items-center whitespace-nowrap rounded-md px-2 text-xs'

function Stage({ step, s, e, picking, onPick }) {
  const last = step === 4
  const showTotals = step >= 1, showEnd = step >= 2, showBefore = step >= 3
  const rangeOn = step === 0 || showBefore
  const before = s > 0 ? P[s - 1] : 0
  return (
    <div className="py-2">
      <p className={`mb-2 h-5 text-center text-xs font-medium text-fd-primary ${last && picking ? '' : 'invisible'}`}>Now tap the end number.</p>
      <div style={grid}>
        <Label>numbers</Label>
        {N.map((v, i) => {
          const inRange = (rangeOn && i >= s && i <= e) || (!rangeOn && step >= 2 && i <= e)
          const out = showBefore && i < s
          const tone = inRange ? 'border-fd-primary bg-fd-primary/15 text-fd-primary' : out ? 'border-rose-400 bg-rose-500/10 text-rose-700 dark:text-rose-300' : idle
          return <button key={i} disabled={!last} onClick={() => onPick(i)} className={`${cell} ${tone} ${last ? 'cursor-pointer hover:border-fd-primary/70' : 'cursor-default'}`}>{v}</button>
        })}
        {showTotals && <>
          <Label>running total</Label>
          {P.map((v, i) => <div key={i} className={`${cell} ${idle} ${showEnd && i === e ? '!border-2 !border-emerald-500 text-emerald-700 dark:text-emerald-300' : ''} ${showBefore && i === s - 1 ? '!border-2 !border-rose-500 text-rose-700 dark:text-rose-300' : ''}`}>{v}</div>)}
          <span />
          {P.map((v, i) => <div key={i} className="text-center text-[10px] text-fd-muted-foreground">{i ? `${P[i - 1]} + ${N[i]}` : N[0]}</div>)}
        </>}
      </div>
      {showEnd && <div style={{ ...grid, marginTop: 10 }}><Label>total up to end</Label>
        <div className={`${bar} bg-emerald-500/15 text-emerald-700 dark:text-emerald-300`} style={{ gridColumn: `2 / span ${e + 1}` }}>{N.slice(0, e + 1).join(' + ')} = {P[e]}</div></div>}
      {showBefore && <>
        <div style={{ ...grid, marginTop: 4 }}><Label>extra before</Label>
          {s > 0 ? <div className={`${bar} bg-rose-500/15 text-rose-700 dark:text-rose-300`} style={{ gridColumn: `2 / span ${s}` }}>{P[s - 1]}</div>
            : <div className="text-xs text-fd-muted-foreground" style={{ gridColumn: '2 / span 5' }}>nothing before, so subtract 0</div>}</div>
        <p className="mt-3 text-center text-lg font-medium">{P[e]} − {before} = <span className="text-fd-primary">{P[e] - before}</span></p>
        <p className="mt-0.5 text-center text-xs text-fd-muted-foreground">check: {N.slice(s, e + 1).join(' + ')} = {P[e] - before}</p>
      </>}
    </div>
  )
}

export default function PrefixSumExplainer() {
  const [range, setRange] = useState({ s: 1, e: 3, picking: false })
  const pick = i => setRange(({ s, picking }) => picking ? { s: Math.min(s, i), e: Math.max(s, i), picking: false } : { s: i, e: i, picking: true })
  // The tapped range only applies on the last step; earlier steps always show 1 + 4 + 2.
  return <Walkthrough steps={STEPS} stage={i => <Stage step={i} s={i === 4 ? range.s : 1} e={i === 4 ? range.e : 3} picking={range.picking} onPick={pick} />} />
}
