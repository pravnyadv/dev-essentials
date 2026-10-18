'use client'
import { useState } from 'react'
import Panel from './Panel.jsx'
import { roundIcon } from './ui.jsx'

// Steps through a list: a scene in a box, the explanation and prev/next arrows below it.
// `stage(k)` renders the scene for step k. Every step is stacked in one grid cell so the box never changes height.
// Arrow keys work anywhere inside it.
export default function Stepper({ steps, stage }) {
  const [i, setI] = useState(0)
  const go = d => setI(v => Math.min(steps.length - 1, Math.max(0, v + d)))
  const onKey = e => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    go(e.key === 'ArrowRight' ? 1 : -1)
  }
  return (
    <div tabIndex={0} role="group" aria-label="Step by step. Use the left and right arrow keys." onKeyDown={onKey} className="rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-fd-primary">
      <Panel className="flex items-start justify-center overflow-x-auto">
        <div className="grid w-full grid-cols-1">
          {steps.map((s, k) => <div key={k} aria-hidden={k !== i} className={`col-start-1 row-start-1 flex justify-center ${k === i ? '' : 'invisible'}`}>{stage(k)}</div>)}
        </div>
      </Panel>
      <div className="mt-3 flex items-start justify-between gap-4">
        <div aria-live="polite" className="grid grid-cols-1 text-sm leading-relaxed">
          {steps.map((s, k) => (
            <div key={k} className={`col-start-1 row-start-1 ${k === i ? '' : 'invisible'}`}>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-fd-primary">Step {k + 1} of {steps.length}</p>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
        <div className="flex shrink-0 gap-2">
          <button onClick={() => go(-1)} disabled={i === 0} className={roundIcon} aria-label="Previous step">←</button>
          <button onClick={() => go(1)} disabled={i === steps.length - 1} className={roundIcon} aria-label="Next step">→</button>
        </div>
      </div>
    </div>
  )
}
