'use client'
import { useEffect, useMemo, useState } from 'react'
import { roundIcon } from './ui.jsx'
import { framesFor } from './sortFrames.js'

const btn = roundIcon

// Plays a sorting algorithm one frame at a time on a small fixed array.
export default function SortVisualizer({ algo }) {
  const frames = useMemo(() => framesFor(algo), [algo])
  const [i, setI] = useState(0)
  const [playing, setPlaying] = useState(false)
  const last = frames.length - 1
  useEffect(() => {
    if (!playing) return
    if (i >= last) return setPlaying(false)
    const t = setTimeout(() => setI(i + 1), 700)
    return () => clearTimeout(t)
  }, [playing, i, last])
  const f = frames[i], max = Math.max(...f.a)
  return (
    <div className="my-6 rounded-xl border bg-fd-card p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-fd-muted-foreground">Watch it run</p>
      <div className="flex h-40 items-end justify-center gap-2">
        {f.a.map((v, k) => {
          const inRange = !f.range || (k >= f.range[0] && k <= f.range[1])
          const tone = f.hi.includes(k) ? 'bg-fd-primary text-fd-primary-foreground' : f.done.includes(k) ? 'bg-emerald-500/70 text-white' : 'bg-fd-muted-foreground/40'
          return <div key={k} className={`grid w-10 place-items-start rounded-t-md pt-1 text-sm font-medium transition-all duration-300 ${tone} ${inRange ? '' : 'opacity-30'}`} style={{ height: `${25 + (v / max) * 75}%` }}>{v}</div>
        })}
      </div>
      <div className="mt-3 flex items-start justify-between gap-4">
        <div className="min-h-[3.25rem] text-sm leading-relaxed">
          <p className="text-xs font-semibold uppercase tracking-wider text-fd-primary">Step {i + 1} of {frames.length}</p>
          <p>{f.note}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button className={btn} disabled={i === 0} onClick={() => { setPlaying(false); setI(i - 1) }} aria-label="Previous step">←</button>
          <button className={btn} onClick={() => { if (i >= last) setI(0); setPlaying(!playing) }} aria-label={playing ? 'Pause' : 'Play'}>{playing ? '❚❚' : '▶'}</button>
          <button className={btn} disabled={i === last} onClick={() => { setPlaying(false); setI(i + 1) }} aria-label="Next step">→</button>
        </div>
      </div>
    </div>
  )
}
