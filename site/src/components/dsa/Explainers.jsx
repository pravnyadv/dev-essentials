'use client'
import GrowthDemo from './GrowthDemo.jsx'
import HashDemo from './HashDemo.jsx'
import KnapsackDemo from './KnapsackDemo.jsx'

// Keys match DEMOS in scripts/curation.mjs.
const DEMOS = { growth: GrowthDemo, hashing: HashDemo, knapsack: KnapsackDemo }

export default function Explainer({ name }) {
  const Demo = DEMOS[name]
  return Demo ? <Demo /> : null
}
