'use client'
import { DescentDemo, DotDemo, NeuronDemo, SamplerDemo } from './MathDemos.jsx'
import { ErasDemo, HarnessDemo, LoopDemo, RagDemo, StackDemo, TimelineDemo } from './Stories.jsx'

// Keys match EXPLAINERS in scripts/ai-curation.mjs.
const DEMOS = { sampler: SamplerDemo, dot: DotDemo, neuron: NeuronDemo, descent: DescentDemo, loop: LoopDemo, rag: RagDemo, harness: HarnessDemo, stack: StackDemo, eras: ErasDemo, timeline: TimelineDemo }

export default function Explainer({ name }) {
  const Demo = DEMOS[name]
  return Demo ? <Demo /> : null
}
