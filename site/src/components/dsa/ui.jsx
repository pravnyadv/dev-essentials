'use client'
export const LEVELS = { 1: 'Beginner', 2: 'Core', 3: 'Advanced' }
export const LevelBadge = ({ level }) => <span className="rounded-full bg-stone-200/70 px-2.5 py-0.5 text-xs font-medium dark:bg-white/10">{LEVELS[level]}</span>

export const Bar = ({ value }) => (
  <div className="h-1.5 overflow-hidden rounded-full bg-stone-200 dark:bg-white/10"><div className="h-full rounded-full bg-indigo-600 transition-all duration-500" style={{ width: `${value * 100}%` }} /></div>
)
