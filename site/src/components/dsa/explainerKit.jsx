'use client'
import { useState } from 'react'
import { buttonClass } from './ui.jsx'

// Shared pieces for the hand-built pattern explainers.
export const cell = 'grid h-10 place-items-center rounded-md border text-sm font-medium transition'
export const idle = 'border-fd-border bg-fd-card'
export const TONE = {
  idle,
  in: 'border-fd-primary bg-fd-primary/15 text-fd-primary',
  pick: 'border-fd-primary bg-fd-primary text-fd-primary-foreground',
  good: 'border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  bad: 'border-rose-400 bg-rose-500/10 text-rose-700 dark:text-rose-300',
}

// A row of cells, each with an optional pointer label underneath. tone(i) -> key of TONE, gone(i) -> faded out.
export function CellRow({ values, tone = () => 'idle', gone = () => false, marks = {}, onClick }) {
  return (
    <div className="flex justify-center gap-1">
      {values.map((v, i) => (
        <div key={i} className={`w-10 transition-opacity ${gone(i) ? 'opacity-30' : ''}`}>
          <button disabled={!onClick} onClick={() => onClick?.(i)} className={`${cell} w-full ${TONE[tone(i)]} ${onClick ? 'cursor-pointer hover:border-fd-primary/70' : 'cursor-default'}`}>{v}</button>
          <span className="mt-0.5 block h-4 text-center text-[11px] font-medium text-fd-primary">{marks[i] ?? ''}</span>
        </div>
      ))}
    </div>
  )
}

// One fixed-height line for a calculation or verdict, so steps never change the box height.
export const Line = ({ children, tone = '' }) => (
  <p className={`flex min-h-7 items-center justify-center text-center text-sm font-medium ${{ good: 'text-emerald-700 dark:text-emerald-300', bad: 'text-rose-700 dark:text-rose-300' }[tone] ?? ''}`}>{children}</p>
)

export const Hint = ({ children }) => <p className="mt-1 min-h-5 text-center text-xs text-fd-muted-foreground">{children}</p>

export const ActionButton = ({ children, ...p }) => (
  <button {...p} className={buttonClass('outline', 'sm', 'rounded-full px-3')}>{children}</button>
)

// Steps through a precomputed list of frames. Returns [frame, index, next, reset].
export function useFrames(frames) {
  const [i, setI] = useState(0)
  return [frames[Math.min(i, frames.length - 1)], i, () => setI(v => Math.min(frames.length - 1, v + 1)), () => setI(0)]
}
