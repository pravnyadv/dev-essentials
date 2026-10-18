'use client'
import { PatternSteps } from './Patterns.jsx'
import ProblemList from './ProblemList.jsx'
import SortVisualizer from './SortVisualizer.jsx'
import DemoFrame from '../shared/DemoFrame.jsx'
import SectionHeading from '../shared/SectionHeading.jsx'
import { LevelBadge, Pill } from '../shared/ui.jsx'

export function TopicBadges({ level, patterns }) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
      <LevelBadge level={level} />
      {patterns.map(p => <Pill key={p.id} tone="primary" href={`/dsa/patterns/${p.id}`}>{p.name}</Pill>)}
    </div>
  )
}

// Sorting topics get the step player; other algorithm and data-structure topics show their first pattern's walkthrough.
export function TopicDemo({ sortAlgo, pattern }) {
  if (sortAlgo) return <SortVisualizer algo={sortAlgo} />
  if (!pattern) return null
  return (
    <DemoFrame boxed title={<>Step through it: <a href={`/dsa/patterns/${pattern.id}`} className="normal-case tracking-normal text-fd-primary hover:underline">{pattern.name} pattern</a></>}>
      <PatternSteps p={pattern} />
    </DemoFrame>
  )
}

export function Practice({ patterns }) {
  if (!patterns.length) return null
  return (
    <section className="mt-10">
      <SectionHeading lesson className="mb-3">Practice</SectionHeading>
      <div className="space-y-8">{patterns.map(p => <div key={p.id}><h3 className="mb-2 text-lg font-semibold"><a href={`/dsa/patterns/${p.id}`}>{p.name}</a></h3><ProblemList problems={p.problems} /></div>)}</div>
    </section>
  )
}
