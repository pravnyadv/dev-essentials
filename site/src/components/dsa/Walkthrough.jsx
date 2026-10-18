'use client'
import { useRef, useState } from 'react'
import Diagram from './Diagram.jsx'
import { buttonClass, roundIcon } from './ui.jsx'

// One multi-choice question: pick an answer, see whether it is right and why.
export function Quiz({ quiz, picked, onPick }) {
  const right = picked === quiz.answer
  return (
    <div className="w-full">
      <p className="mb-2 text-center text-sm font-medium">{quiz.q}</p>
      <div className="flex flex-wrap justify-center gap-2">
        {quiz.options.map((o, n) => (
          <button key={n} onClick={() => onPick(n)} className={buttonClass(picked === n ? (right ? 'primary' : 'secondary') : 'outline', 'sm', 'rounded-full px-3')}>{o}</button>
        ))}
      </div>
      <p className={`mt-2 min-h-14 text-center text-xs leading-relaxed ${picked === undefined ? 'invisible' : right ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>{right ? 'Right. ' : 'Not quite. '}{quiz.why}</p>
    </div>
  )
}

// Scene for one data-driven step: diagram, the working under it, and an optional quiz.
function DataStage({ step, picked, onPick }) {
  return (
    <div className="flex w-full flex-col items-center gap-2">
      <Diagram d={step.scene} />
      <p className="flex min-h-6 items-center text-center text-sm font-medium">{step.calc}</p>
      {step.quiz && <Quiz quiz={step.quiz} picked={picked} onPick={onPick} />}
    </div>
  )
}

// Steps through a pattern: scene in a box, explanation and prev/next arrows outside it.
// `stage(i)` replaces the data-driven Diagram with a custom interactive scene.
export default function Walkthrough({ steps, stage }) {
  const [i, setI] = useState(0)
  const [picks, setPicks] = useState({})
  const ref = useRef()
  const go = d => setI(v => Math.min(steps.length - 1, Math.max(0, v + d)))
  const btn = roundIcon
  return (
    <div ref={ref} tabIndex={0} onKeyDown={e => { if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1) }} className="outline-none">
      <div className="flex items-start justify-center overflow-x-auto rounded-xl border bg-fd-card p-5">
        <div className="grid w-full grid-cols-1">
          {steps.map((s, k) => <div key={k} aria-hidden={k !== i} className={`col-start-1 row-start-1 flex justify-center ${k === i ? '' : 'invisible'}`}>{stage ? stage(k) : <DataStage step={s} picked={picks[k]} onPick={n => setPicks(p => ({ ...p, [k]: n }))} />}</div>)}
        </div>
      </div>
      <div className="mt-3 flex items-start justify-between gap-4">
        <div className="grid grid-cols-1 text-sm leading-relaxed">
          {steps.map((s, k) => (
            <div key={k} className={`col-start-1 row-start-1 ${k === i ? '' : 'invisible'}`}>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-fd-primary">Step {k + 1} of {steps.length}</p>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
        <div className="flex shrink-0 gap-2">
          <button onClick={() => go(-1)} disabled={i === 0} className={btn} aria-label="Previous step">←</button>
          <button onClick={() => go(1)} disabled={i === steps.length - 1} className={btn} aria-label="Next step">→</button>
        </div>
      </div>
    </div>
  )
}
