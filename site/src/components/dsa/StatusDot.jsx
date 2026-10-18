'use client'
import { useProgress } from './progress.jsx'

// Sidebar marker: empty, in progress, or done.
export default function StatusDot({ id }) {
  const status = useProgress()[id]
  return (
    <span className={`grid size-3.5 shrink-0 place-items-center rounded-full border ${status === 'done' ? 'border-indigo-600 bg-indigo-600' : status === 'learning' ? 'border-indigo-500 bg-indigo-500/30' : 'border-stone-300 dark:border-stone-600'}`}>
      {status === 'done' && <span className="size-1 rounded-full bg-white" />}
    </span>
  )
}
