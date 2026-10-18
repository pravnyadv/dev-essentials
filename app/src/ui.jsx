import { setStatus, useProgress } from './lib.js'

export const LEVELS = { 1: ['Beginner', 'bg-emerald-500'], 2: ['Core', 'bg-amber-500'], 3: ['Advanced', 'bg-rose-500'] }
export const LevelDot = ({ level }) => <span title={LEVELS[level][0]} className={`inline-block size-2 rounded-full ${LEVELS[level][1]}`} />
export const LevelBadge = ({ level }) => <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-200/70 px-2.5 py-0.5 text-xs font-medium dark:bg-white/10"><LevelDot level={level} />{LEVELS[level][0]}</span>

// Accent per chapter, used for cards, bars and the topic header.
export const ACCENTS = {
  linear: ['from-sky-500 to-cyan-400', 'bg-sky-500', '🔗'], hashing: ['from-amber-500 to-orange-400', 'bg-amber-500', '#️⃣'],
  searching: ['from-teal-500 to-emerald-400', 'bg-teal-500', '🔍'], sorting: ['from-violet-500 to-fuchsia-400', 'bg-violet-500', '↕️'],
  trees: ['from-green-600 to-lime-400', 'bg-green-600', '🌳'], graphs: ['from-rose-500 to-pink-400', 'bg-rose-500', '🕸️'],
  recursion: ['from-indigo-500 to-blue-400', 'bg-indigo-500', '🔁'], dp: ['from-purple-600 to-indigo-400', 'bg-purple-600', '🧩'],
  strings: ['from-orange-500 to-red-400', 'bg-orange-500', '🔤'], math: ['from-cyan-600 to-sky-400', 'bg-cyan-600', '∑'],
  misc: ['from-stone-500 to-stone-400', 'bg-stone-500', '🧰'],
}

export const StatusButton = ({ id }) => {
  const s = useProgress()[id]
  const next = { undefined: 'learning', learning: 'done', done: undefined }[s]
  const label = { undefined: 'Start learning', learning: 'Mark as done', done: '✓ Done' }[s]
  const style = { undefined: 'bg-stone-900 text-white hover:bg-stone-700 dark:bg-white dark:text-stone-900', learning: 'bg-emerald-600 text-white hover:bg-emerald-500', done: 'bg-emerald-500/15 text-emerald-700 ring-1 ring-emerald-500/40 dark:text-emerald-300' }[s]
  return <button onClick={() => setStatus(id, next)} className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${style}`}>{label}</button>
}

export const Bar = ({ value, className = 'bg-emerald-500' }) => (
  <div className="h-1.5 overflow-hidden rounded-full bg-stone-200 dark:bg-white/10"><div className={`h-full rounded-full transition-all duration-500 ${className}`} style={{ width: `${value * 100}%` }} /></div>
)
