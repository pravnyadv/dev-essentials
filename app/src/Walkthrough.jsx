import { useRef, useState } from 'react'
import Diagram from './Diagram.jsx'

// Steps through a pattern: scene in a box, explanation and prev/next arrows outside it.
// `stage(i)` replaces the data-driven Diagram with a custom interactive scene.
export default function Walkthrough({ steps, stage }) {
  const [i, setI] = useState(0)
  const ref = useRef()
  const go = d => setI(v => Math.min(steps.length - 1, Math.max(0, v + d)))
  const btn = 'grid size-10 place-items-center rounded-full border border-stone-300 text-lg transition enabled:hover:bg-indigo-600 enabled:hover:text-white disabled:opacity-30 dark:border-white/20'
  return (
    <div ref={ref} tabIndex={0} onKeyDown={e => { if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1) }} className="outline-none">
      <div className="flex items-start justify-center overflow-x-auto rounded-xl border border-stone-200 bg-stone-50 p-5 dark:border-white/10 dark:bg-white/[0.03]">
        <div className="grid w-full grid-cols-1">
          {steps.map((s, k) => <div key={k} aria-hidden={k !== i} className={`col-start-1 row-start-1 flex justify-center ${k === i ? '' : 'invisible'}`}>{stage ? stage(k) : <Diagram d={s.scene} />}</div>)}
        </div>
      </div>
      <div className="mt-3 flex items-start justify-between gap-4">
        <div className="grid grid-cols-1 text-sm leading-relaxed">
          {steps.map((s, k) => (
            <div key={k} className={`col-start-1 row-start-1 ${k === i ? '' : 'invisible'}`}>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-300">Step {k + 1} of {steps.length}</p>
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
