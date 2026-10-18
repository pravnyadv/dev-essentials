'use client'
import { useProgress } from './progress.jsx'
import { Bar } from './ui.jsx'

// Sidebar footer: how much of the whole path is done.
export default function OverallProgress({ ids }) {
  const progress = useProgress()
  const done = ids.filter(id => progress[id] === 'done').length
  return (
    <div className="mt-3 text-xs text-fd-muted-foreground">
      <Bar value={done / ids.length} />
      <p className="mt-1.5 tabular-nums">{done}/{ids.length} topics done</p>
    </div>
  )
}
