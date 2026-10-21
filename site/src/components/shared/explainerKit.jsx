'use client'
import { useState } from 'react'
import DemoFrame from './DemoFrame.jsx'
import { buttonClass } from './ui.jsx'

// Shared pieces for the hand-built pattern explainers.
export const cell = 'grid h-10 place-items-center rounded-md border text-sm font-medium transition'
export const idle = 'border-fd-border bg-fd-card'
export const TONE = {
  idle,
  in: 'border-fd-primary bg-fd-primary/15 text-fd-primary',
  pick: 'border-fd-primary bg-fd-primary text-fd-primary-foreground',
  good: 'border-success bg-success/15 text-success',
  bad: 'border-danger bg-danger/10 text-danger',
}

// A row of cells, each with an optional pointer label underneath. tone(i) -> key of TONE, gone(i) -> faded out.
export function CellRow({ values, tone = () => 'idle', gone = () => false, marks = {}, onClick }) {
  return (
    <div className="flex justify-center gap-1">
      {values.map((v, i) => (
        <div key={i} className={`w-10 transition-opacity ${gone(i) ? 'opacity-30' : ''}`}>
          <button disabled={!onClick} onClick={() => onClick?.(i)} className={`${cell} w-full ${TONE[tone(i)]} ${onClick ? 'cursor-pointer hover:border-fd-primary/70' : 'cursor-default'}`}>{v}</button>
          <span className="mt-0.5 block h-4 text-center text-xs font-medium text-fd-primary">{marks[i] ?? ''}</span>
        </div>
      ))}
    </div>
  )
}

// One fixed-height line for a calculation or verdict, so steps never change the box height.
export const Line = ({ children, tone = '' }) => (
  <p className={`flex min-h-7 items-center justify-center text-center text-sm font-medium ${{ good: 'text-success', bad: 'text-danger' }[tone] ?? ''}`}>{children}</p>
)

// A labelled range input with its value on the right. `display` replaces the shown value when the slider moves along a scale.
export const Slider = ({ label, value, onChange, min, max, step = 0.1, unit = '', display }) => (
  <label className="flex items-center gap-3 text-sm">
    <span className="w-28 shrink-0 font-medium">{label}</span>
    <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(+e.target.value)} className="min-w-0 flex-1 accent-[var(--color-fd-primary)]" />
    <span className={`${display ? 'w-24' : 'w-14'} shrink-0 text-right tabular-nums`}>{display ?? `${value}${unit}`}</span>
  </label>
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

// A boxed demo with its title, a labelled number tile, and whole numbers with thousands separators.
export const Box = ({ title, children }) => <DemoFrame boxed title={title}>{children}</DemoFrame>
export const Stat = ({ label, value }) => (
  <div className="rounded-lg border p-3 text-center">
    <p className="text-xs text-fd-muted-foreground">{label}</p>
    <p className="text-lg font-bold tabular-nums">{value}</p>
  </div>
)
export const fmt = n => Math.round(n).toLocaleString('en-US')
