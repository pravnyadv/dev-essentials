'use client'
import { useRouter } from 'next/navigation'
import { PatternSteps } from './Patterns.jsx'
import ProblemList from './ProblemList.jsx'
import SortVisualizer from './SortVisualizer.jsx'
import { setStatus, useProgress } from './progress.jsx'
import { LevelBadge } from './ui.jsx'

export function TopicBadges({ level, patterns }) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
      <LevelBadge level={level} />
      {patterns.map(p => <a key={p.id} href={`/patterns/${p.id}`} className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-medium text-indigo-700 hover:bg-indigo-500/20 dark:text-indigo-300">{p.name}</a>)}
    </div>
  )
}

// Sorting topics get the step player; other algorithm and data-structure topics show their first pattern's walkthrough.
export function TopicDemo({ sortAlgo, pattern }) {
  if (sortAlgo) return <SortVisualizer algo={sortAlgo} />
  if (!pattern) return null
  return (
    <div className="my-6 rounded-xl border border-stone-200 p-4 dark:border-white/10">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-500">Step through it: <a href={`/patterns/${pattern.id}`} className="normal-case tracking-normal text-indigo-600 hover:underline dark:text-indigo-300">{pattern.name} pattern</a></p>
      <PatternSteps p={pattern} />
    </div>
  )
}

export function Practice({ patterns }) {
  if (!patterns.length) return null
  return (
    <section className="mt-10">
      <h2 className="mb-3 text-2xl font-bold tracking-tight">Practice</h2>
      <div className="space-y-8">{patterns.map(p => <div key={p.id}><h3 className="mb-2 text-lg font-semibold"><a href={`/patterns/${p.id}`}>{p.name}</a></h3><ProblemList problems={p.problems} /></div>)}</div>
    </section>
  )
}

export function MarkDone({ id, next }) {
  const router = useRouter()
  const status = useProgress()[id]
  if (status === 'done') return null
  return (
    <button onClick={() => { setStatus(id, 'done'); if (next) router.push(next.url) }} className="mt-10 w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-500">
      Mark done{next ? ` and go to ${next.title}` : ''} →
    </button>
  )
}
