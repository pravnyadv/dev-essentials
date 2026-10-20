'use client'
import { AttentionDemo, DescentDemo, DotDemo, MatrixDemo, NeuronDemo, SamplerDemo, ThresholdDemo } from './MathDemos.jsx'
import { ErasDemo, HarnessDemo, LoopDemo, RagDemo, StackDemo, TimelineDemo } from './Stories.jsx'

// Keys match EXPLAINERS in scripts/ai-curation.mjs.
const DEMOS = { matrix: MatrixDemo, attention: AttentionDemo, sampler: SamplerDemo, dot: DotDemo, neuron: NeuronDemo, descent: DescentDemo, loop: LoopDemo, rag: RagDemo, harness: HarnessDemo, stack: StackDemo, eras: ErasDemo, timeline: TimelineDemo, threshold: ThresholdDemo }

export default function Explainer({ name }) {
  const Demo = DEMOS[name]
  return Demo ? <Demo /> : null
}
