import { setStatus, useProgress } from './lib.js'

export const LEVELS = { 1: 'Beginner', 2: 'Core', 3: 'Advanced' }
export const LevelBadge = ({ level }) => <span className="rounded-full bg-stone-200/70 px-2.5 py-0.5 text-xs font-medium dark:bg-white/10">{LEVELS[level]}</span>

export const StatusButton = ({ id }) => {
  const s = useProgress()[id]
  const next = { undefined: 'learning', learning: 'done', done: undefined }[s]
  const label = { undefined: 'Start learning', learning: 'Mark as done', done: '✓ Done' }[s]
  const style = s === 'done' ? 'bg-indigo-500/10 text-indigo-700 ring-1 ring-indigo-500/40 dark:text-indigo-300' : 'bg-indigo-600 text-white hover:bg-indigo-500'
  return <button onClick={() => setStatus(id, next)} className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${style}`}>{label}</button>
}

export const Bar = ({ value }) => (
  <div className="h-1.5 overflow-hidden rounded-full bg-stone-200 dark:bg-white/10"><div className="h-full rounded-full bg-indigo-600 transition-all duration-500" style={{ width: `${value * 100}%` }} /></div>
)
