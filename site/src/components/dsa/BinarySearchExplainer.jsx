'use client'
import { useMemo, useState } from 'react'
import { ActionButton, CellRow, Hint, Line, useFrames } from './explainerKit.jsx'
import Walkthrough from './Walkthrough.jsx'

const A = [2, 5, 8, 12, 16, 23, 38]
const TARGETS = [23, 5, 38, 7]

// Each look at the middle, recorded: { lo, hi, mid, note, found }. lo > hi means the target is not in the list.
function framesOf(target) {
  const out = []
  let lo = 0, hi = A.length - 1
  while (lo <= hi) {
    const mid = (lo + hi) >> 1
    const calc = `middle of ${lo} to ${hi} is ${mid}, value ${A[mid]}`
    if (A[mid] === target) { out.push({ lo, hi, mid, note: `${calc}: it is ${target}. Found.`, found: true }); return out }
    out.push({ lo, hi, mid, note: `${calc}. ${A[mid]} is ${A[mid] < target ? 'smaller' : 'bigger'} than ${target}.` })
    if (A[mid] < target) lo = mid + 1; else hi = mid - 1
  }
  out.push({ lo, hi, mid: -1, note: `Nothing left to check, so ${target} is not in the list.`, missing: true })
  return out
}

const GUIDED = [
  { lo: 0, hi: 6, note: 'target = 23' },
  { lo: 0, hi: 6, mid: 3, note: 'middle = (0 + 6) / 2 = 3, value 12' },
  { lo: 4, hi: 6, note: '12 < 23, so keep only the right side' },
  { lo: 4, hi: 6, mid: 5, note: 'middle = (4 + 6) / 2 = 5, value 23', found: true },
  { lo: 4, hi: 6, mid: 5, note: 'found in 2 looks, not 6', found: true },
]

const STEPS = [
  'Goal: find 23 in this sorted list. Checking one number at a time could take 7 looks, and a million numbers would take up to a million. Because the list is sorted, we can do far better.',
  'Look at the middle number first. The middle of positions 0 to 6 is position 3, which holds 12.',
  '12 is smaller than 23, and the list is sorted, so 23 cannot be at or before 12. Throw away that whole half. Only positions 4 to 6 are left.',
  'Do the same thing on what is left. The middle of positions 4 to 6 is position 5, which holds 23. Found it.',
  'Two looks instead of up to seven. Every look halves what is left, so a million numbers need only about 20 looks. Halving the search area each time is called binary search.',
  'Your turn. Pick a target and press Next to watch each look. Try 7: it is not in the list.',
].map(text => ({ text }))

function Stage({ step, target, setTarget }) {
  const live = step === 5
  const frames = useMemo(() => framesOf(target), [target])
  const [f, i, next, reset] = useFrames(frames)
  const g = live ? f : GUIDED[step]
  const done = live && i === frames.length - 1
  const marks = {}
  for (const [k, name] of [[g.lo, 'lo'], [g.hi, 'hi'], [g.mid, 'mid']]) if (k >= 0 && k < A.length) marks[k] = marks[k] ? `${marks[k]}, ${name}` : name
  return (
    <div className="w-full py-2">
      <CellRow values={A} tone={k => (k === g.mid ? (g.found ? 'good' : 'pick') : k >= g.lo && k <= g.hi ? 'in' : 'idle')} gone={k => k < g.lo || k > g.hi} marks={marks} />
      <div className="mt-2"><Line tone={g.found ? 'good' : g.missing ? 'bad' : ''}>{g.note}</Line></div>
      <div className="mt-2 flex min-h-8 flex-wrap justify-center gap-2">
        {live && <>
          {TARGETS.map(t => <ActionButton key={t} onClick={() => { setTarget(t); reset() }}><span className={t === target ? 'text-indigo-600 dark:text-indigo-300' : ''}>find {t}</span></ActionButton>)}
          <ActionButton onClick={done ? reset : next}>{done ? 'Restart' : 'Next'}</ActionButton>
        </>}
      </div>
      <Hint>{live ? `Look ${i + 1} of ${frames.length}` : ''}</Hint>
    </div>
  )
}

export default function BinarySearchExplainer() {
  const [target, setTarget] = useState(TARGETS[0])
  return <Walkthrough steps={STEPS} stage={i => <Stage step={i} target={target} setTarget={setTarget} />} />
}
