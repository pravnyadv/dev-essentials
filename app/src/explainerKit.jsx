import { useState } from 'react'

// Shared pieces for the hand-built pattern explainers.
export const cell = 'grid h-10 place-items-center rounded-md border text-sm font-medium transition'
export const idle = 'border-stone-300 bg-white dark:border-white/20 dark:bg-white/5'
export const TONE = {
  idle,
  in: 'border-indigo-500 bg-indigo-500/15 text-indigo-700 dark:text-indigo-300',
  pick: 'border-indigo-600 bg-indigo-600 text-white',
  good: 'border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  bad: 'border-rose-400 bg-rose-500/10 text-rose-700 dark:text-rose-300',
}

// A row of cells, each with an optional pointer label underneath. tone(i) -> key of TONE, gone(i) -> faded out.
export function CellRow({ values, tone = () => 'idle', gone = () => false, marks = {}, onClick }) {
  return (
    <div className="flex justify-center gap-1">
      {values.map((v, i) => (
        <div key={i} className={`w-10 transition-opacity ${gone(i) ? 'opacity-30' : ''}`}>
          <button disabled={!onClick} onClick={() => onClick?.(i)} className={`${cell} w-full ${TONE[tone(i)]} ${onClick ? 'cursor-pointer hover:border-indigo-400' : 'cursor-default'}`}>{v}</button>
          <span className="mt-0.5 block h-4 text-center text-[11px] font-medium text-indigo-700 dark:text-indigo-300">{marks[i] ?? ''}</span>
        </div>
      ))}
    </div>
  )
}

// One fixed-height line for a calculation or verdict, so steps never change the box height.
export const Line = ({ children, tone = '' }) => (
  <p className={`flex min-h-7 items-center justify-center text-center text-sm font-medium ${{ good: 'text-emerald-700 dark:text-emerald-300', bad: 'text-rose-700 dark:text-rose-300' }[tone] ?? ''}`}>{children}</p>
)

export const Hint = ({ children }) => <p className="mt-1 min-h-5 text-center text-xs text-stone-500">{children}</p>

export const ActionButton = ({ children, ...p }) => (
  <button {...p} className="rounded-full border border-stone-300 px-3 py-1.5 text-xs font-medium transition enabled:hover:bg-indigo-600 enabled:hover:text-white disabled:opacity-30 dark:border-white/20">{children}</button>
)

// Steps through a precomputed list of frames. Returns [frame, index, next, reset].
export function useFrames(frames) {
  const [i, setI] = useState(0)
  return [frames[Math.min(i, frames.length - 1)], i, () => setI(v => Math.min(frames.length - 1, v + 1)), () => setI(0)]
}
