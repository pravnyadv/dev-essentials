import { useEffect, useRef, useState } from 'react'
import Diagram from './Diagram.jsx'

// Steps through a pattern: scene in a box, explanation and prev/next arrows outside it.
export default function Walkthrough({ steps }) {
  const [i, setI] = useState(0)
  const ref = useRef()
  useEffect(() => setI(0), [steps])
  const go = d => setI(v => Math.min(steps.length - 1, Math.max(0, v + d)))
  const btn = 'grid size-10 place-items-center rounded-full border border-stone-300 text-lg transition enabled:hover:bg-indigo-600 enabled:hover:text-white disabled:opacity-30 dark:border-white/20'
  return (
    <div ref={ref} tabIndex={0} onKeyDown={e => { if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1) }} className="outline-none">
      <div className="flex min-h-56 items-center justify-center overflow-x-auto rounded-xl border border-stone-200 bg-stone-50 p-5 dark:border-white/10 dark:bg-white/[0.03]">
        <Diagram d={steps[i].scene} />
      </div>
      <div className="mt-3 flex items-start justify-between gap-4">
        <div className="min-h-[4.5rem] text-sm leading-relaxed">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-300">Step {i + 1} of {steps.length}</p>
          <p>{steps[i].text}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button onClick={() => go(-1)} disabled={i === 0} className={btn} aria-label="Previous step">←</button>
          <button onClick={() => go(1)} disabled={i === steps.length - 1} className={btn} aria-label="Next step">→</button>
        </div>
      </div>
    </div>
  )
}
