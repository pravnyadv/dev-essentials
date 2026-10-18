'use client'
import { useProgress } from './progress.jsx'

// Sidebar marker: empty, in progress, or done.
export default function StatusDot({ id }) {
  const status = useProgress()[id]
  return (
    <span className={`grid size-3.5 shrink-0 place-items-center rounded-full border ${status === 'done' ? 'border-fd-primary bg-fd-primary' : status === 'learning' ? 'border-fd-primary bg-fd-primary/30' : 'border-fd-border'}`}>
      {status === 'done' && <span className="size-1 rounded-full bg-white" />}
    </span>
  )
}
