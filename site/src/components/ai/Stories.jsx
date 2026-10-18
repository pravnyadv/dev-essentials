'use client'
import { useState } from 'react'
import Chip from '../shared/Chip.jsx'
import DemoFrame from '../shared/DemoFrame.jsx'
import Panel from '../shared/Panel.jsx'
import Stepper from '../shared/Stepper.jsx'
import { Pill } from '../shared/ui.jsx'
import { ERAS, HARNESS, LOOP_STEPS, RAG_CHUNKS, RAG_STEPS, STACK, TIMELINE, TIMELINE_ERAS } from './storyData.js'

const ACTORS = ['Model', 'Tools', 'You']

// The agent loop as a stepper: who acts, and the context growing underneath.
export function LoopDemo() {
  const stage = k => {
    const shown = LOOP_STEPS.slice(0, k + 1)
    const tokens = shown.reduce((n, s) => n + s.add[2], 0)
    return (
      <div className="w-full max-w-xl space-y-3">
        <div className="flex items-center justify-center gap-2 text-sm">
          {ACTORS.map(a => <span key={a} className={`rounded-lg border px-3 py-1.5 font-medium transition ${LOOP_STEPS[k].actor === a ? 'border-fd-primary bg-fd-primary text-fd-primary-foreground' : 'bg-fd-background text-fd-muted-foreground'}`}>{a}</span>)}
        </div>
        <ul className="space-y-1 text-xs">
          {LOOP_STEPS.map(({ add: [role, text] }, i) => (
            <li key={i} className={`flex gap-2 rounded-md border px-2 py-1 ${i > k ? 'invisible' : i === k ? 'border-fd-primary bg-fd-primary/10' : 'bg-fd-card'}`}>
              <b className="w-16 shrink-0">{role}</b><span className="min-w-0 flex-1 break-words">{text}</span>
            </li>
          ))}
        </ul>
        <p className="text-center text-sm font-medium tabular-nums">Context sent on the next call: ~{tokens.toLocaleString()} tokens</p>
      </div>
    )
  }
  return <DemoFrame title="The agent loop, step by step"><Stepper steps={LOOP_STEPS} stage={stage} /></DemoFrame>
}

// RAG as a stepper: question, embed, search, keep the best, prompt, answer.
export function RagDemo() {
  const stage = k => {
    const s = RAG_STEPS[k]
    const scored = k >= 2, kept = k >= 3
    return (
      <div className="w-full max-w-xl space-y-3 text-sm">
        <p className="rounded-lg border bg-fd-background px-3 py-2"><b>Question:</b> {RAG_STEPS[0].q}</p>
        <p className={`rounded-lg border px-3 py-2 font-mono text-xs ${k >= 1 ? '' : 'invisible'}`}>vector: {RAG_STEPS[1].vec}</p>
        <ul className="space-y-1">
          {RAG_CHUNKS.map(([text, score], i) => {
            const top = RAG_STEPS[3].top.includes(i)
            return (
              <li key={i} className={`flex items-center gap-2 rounded-md border px-2 py-1.5 text-xs transition ${kept && !top ? 'opacity-30' : ''} ${kept && top ? 'border-fd-primary bg-fd-primary/10' : 'bg-fd-card'}`}>
                <span className={`w-10 shrink-0 text-right tabular-nums font-semibold ${scored ? '' : 'invisible'}`}>{score.toFixed(2)}</span>
                <span className="min-w-0 flex-1">{text}</span>
              </li>
            )
          })}
        </ul>
        <div className="min-h-16 rounded-lg border bg-fd-background px-3 py-2 text-xs">
          {k === 4 && <><b>Prompt:</b> "Answer only from the sources. Cite them. [1] {RAG_CHUNKS[0][0]} [2] {RAG_CHUNKS[4][0]} [3] {RAG_CHUNKS[2][0]} Question: {RAG_STEPS[0].q}"</>}
          {k === 5 && <><b>Answer:</b> {s.answer}</>}
        </div>
      </div>
    )
  }
  return <DemoFrame title="Retrieval-augmented generation, step by step"><Stepper steps={RAG_STEPS} stage={stage} /></DemoFrame>
}

// A row of buttons and one detail panel. All panels share a grid cell so the box never changes height.
function DetailMap({ title, items, accent }) {
  const [i, setI] = useState(0)
  return (
    <DemoFrame title={title}>
      <Panel padding="p-4">
        <div className="flex flex-wrap gap-2">
          {items.map((it, n) => <Chip key={it.id} on={n === i} onClick={() => setI(n)}>{it.label}</Chip>)}
        </div>
        <div className="mt-4 grid grid-cols-1 text-sm leading-relaxed">
          {items.map((it, n) => (
            <div key={it.id} aria-hidden={n !== i} className={`col-start-1 row-start-1 space-y-2 ${n === i ? '' : 'invisible'}`}>
              <h3 className="text-base font-semibold">{it.title}</h3>
              <p>{it.body}</p>
              <p><b>{accent}</b> {it.fix}</p>
              <p className="text-fd-muted-foreground">{it.ex}</p>
            </div>
          ))}
        </div>
      </Panel>
    </DemoFrame>
  )
}
export const HarnessDemo = () => <DetailMap title="Agent = Model + Harness. Click a part" items={HARNESS} accent="Prevents:" />
export const StackDemo = () => <DetailMap title="The layers of the AI stack. Click a layer" items={STACK} accent="When you need it:" />
export const ErasDemo = () => <DetailMap title="How the craft changed. Click an era" items={ERAS} accent="Real or hype:" />

// Scrollable timeline: pick a year, read what happened. Colors are the eras.
export function TimelineDemo() {
  const [i, setI] = useState(TIMELINE.findIndex(e => e[0] === '2012'))
  return (
    <DemoFrame title="AI timeline. Click a year">
      <Panel padding="p-4">
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-fd-muted-foreground">
          {Object.values(TIMELINE_ERAS).map(([name, color]) => <span key={name} className="flex items-center gap-1.5"><i className={`size-2.5 rounded-full ${color}`} />{name}</span>)}
        </div>
        <div className="mt-3 flex gap-1.5 overflow-x-auto pb-2">
          {TIMELINE.map(([year, era], n) => (
            <Chip key={n} size="sm" on={n === i} onClick={() => setI(n)} className="shrink-0 tabular-nums">
              <i className={`mr-1.5 inline-block size-2 rounded-full ${TIMELINE_ERAS[era][1]}`} />{year}
            </Chip>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-1 text-sm">
          {TIMELINE.map(([year, era, title, text], n) => (
            <div key={n} aria-hidden={n !== i} className={`col-start-1 row-start-1 ${n === i ? '' : 'invisible'}`}>
              <Pill>{TIMELINE_ERAS[era][0]}</Pill>
              <h3 className="mt-2 text-base font-semibold">{year}: {title}</h3>
              <p className="mt-1 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </Panel>
    </DemoFrame>
  )
}
