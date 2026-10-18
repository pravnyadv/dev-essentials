'use client'
import { useEffect, useState } from 'react'
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock'
import Diagram from './Diagram.jsx'
import ProblemList, { solvedCount } from './ProblemList.jsx'
import BinarySearchExplainer from './BinarySearchExplainer.jsx'
import PrefixSumExplainer from './PrefixSumExplainer.jsx'
import SlidingWindowExplainer from './SlidingWindowExplainer.jsx'
import TwoPointersExplainer from './TwoPointersExplainer.jsx'
import Walkthrough from './Walkthrough.jsx'
import { useProgress } from './progress.jsx'

// Patterns whose walkthrough is a hand-built interactive component.
const EXPLAINERS = { 'prefix-sum': <PrefixSumExplainer />, 'two-pointers': <TwoPointersExplainer />, 'sliding-window': <SlidingWindowExplainer />, 'binary-search': <BinarySearchExplainer /> }
export const PatternSteps = ({ p }) => EXPLAINERS[p.id] ?? <Walkthrough key={p.id} steps={p.steps} />
const MODE = 'dsa-patterns-mode'
const Label = ({ children }) => <h3 className="mb-1 mt-4 text-xs font-semibold uppercase tracking-wide text-stone-500">{children}</h3>

export function PatternDetail({ p, byId }) {
  const progress = useProgress()
  return (
    <div className="space-y-2">
      <a href="/patterns" className="text-sm text-indigo-600 hover:underline dark:text-indigo-300">← All patterns</a>
      <div className="flex items-baseline justify-between gap-3">
        <h1 className="text-4xl font-extrabold tracking-tight">{p.name}</h1>
        <span className="text-sm text-stone-500">{solvedCount(p.problems, progress)}/{p.problems.length} solved</span>
      </div>
      <div className="grid gap-x-8 pt-2 xl:grid-cols-[minmax(0,1fr)_27rem]">
        <div className="xl:col-start-1">
          <Label>What it is</Label>
          <p className="text-sm leading-relaxed">{p.what}</p>
          <Label>Used for</Label>
          <p className="text-sm leading-relaxed">{p.usedFor}</p>
        </div>
        <div className="my-6 xl:col-start-2 xl:row-span-2 xl:row-start-1 xl:my-0"><PatternSteps p={p} /></div>
        <div className="xl:col-start-1">
          <Label>You see</Label>
          <ul className="list-disc pl-5 text-sm">{p.signals.map(s => <li key={s}>{s}</li>)}</ul>
          <Label>Learn it in</Label>
          <p className="flex flex-wrap gap-2 text-sm">{p.topics.map(id => byId[id] && <a key={id} href={byId[id].url} className="rounded-full bg-indigo-500/10 px-3 py-0.5 text-indigo-700 hover:bg-indigo-500/20 dark:text-indigo-300">{byId[id].title}</a>)}</p>
        </div>
      </div>
      <Label>Template</Label>
      <DynamicCodeBlock lang="js" code={p.code} />
      <Label>Practice problems</Label>
      <ProblemList problems={p.problems} />
    </div>
  )
}

function Tile({ p }) {
  const progress = useProgress()
  const done = solvedCount(p.problems, progress)
  return (
    <a href={`/patterns/${p.id}`} className="group flex flex-col rounded-xl border border-stone-200 bg-white p-3 transition hover:-translate-y-0.5 hover:border-indigo-400 hover:shadow-lg dark:border-white/10 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between gap-2"><h3 className="text-sm font-semibold">{p.name}</h3>{p.core && <span className="rounded bg-indigo-500/10 px-1.5 text-[10px] font-medium text-indigo-700 dark:text-indigo-300">core</span>}</div>
      <div className="my-3 flex min-h-20 flex-1 items-center justify-center overflow-hidden"><Diagram d={p.steps[Math.min(1, p.steps.length - 1)].scene} compact /></div>
      <div className="h-1 overflow-hidden rounded-full bg-stone-200 dark:bg-white/10"><div className="h-full bg-indigo-600" style={{ width: `${(done / p.problems.length) * 100}%` }} /></div>
      <p className="mt-1 text-[11px] text-stone-500">{done}/{p.problems.length} solved</p>
    </a>
  )
}

function Roadmap({ patterns, groups }) {
  const progress = useProgress()
  const byId = Object.fromEntries(patterns.map(p => [p.id, p]))
  return (
    <div className="relative ml-3 border-l-2 border-indigo-200 pl-8 dark:border-indigo-500/30">
      {groups.map(g => {
        const ps = g.ids.map(id => byId[id]), solved = ps.reduce((n, p) => n + solvedCount(p.problems, progress), 0), total = ps.reduce((n, p) => n + p.problems.length, 0)
        return (
          <section key={g.title} className="relative pb-10">
            <span className="absolute -left-[2.6rem] top-1 size-4 rounded-full border-4 border-indigo-600 bg-stone-50 dark:bg-[#0b0d12]" />
            <div className="mb-3 flex items-baseline gap-3"><h2 className="text-lg font-bold">{g.title}</h2><span className="text-xs text-stone-500">{solved}/{total} problems</span></div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{ps.map(p => <Tile key={p.id} p={p} />)}</div>
          </section>
        )
      })}
    </div>
  )
}

function List({ patterns }) {
  const progress = useProgress()
  return (
    <ul className="divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white dark:divide-white/10 dark:border-white/10 dark:bg-white/[0.03]">
      {patterns.map(p => (
        <li key={p.id}><a href={`/patterns/${p.id}`} className="flex items-center gap-4 px-4 py-3 hover:bg-stone-100/70 dark:hover:bg-white/5">
          <span className="w-52 shrink-0 font-medium">{p.name}</span>
          <span className="hidden flex-1 truncate text-sm text-stone-500 md:block">{p.signals.join(' · ')}</span>
          <span className="shrink-0 text-xs text-stone-500">{solvedCount(p.problems, progress)}/{p.problems.length}</span>
        </a></li>
      ))}
    </ul>
  )
}

export function PatternsIndex({ patterns, groups }) {
  const [mode, setMode] = useState('roadmap')
  useEffect(() => { try { setMode(localStorage.getItem(MODE) ?? 'roadmap') } catch { /* private mode */ } }, [])
  const pick = m => { setMode(m); try { localStorage.setItem(MODE, m) } catch { /* private mode */ } }
  const seg = m => `rounded-full px-4 py-1 text-sm font-medium ${mode === m ? 'bg-white shadow dark:bg-white/15' : 'text-stone-500'}`
  return (
    <div className="max-w-6xl space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Problem patterns</h1>
          <p className="mt-1 text-stone-500">Spot the signal in a problem, open the pattern, step through it, then practise.</p>
        </div>
        <div className="flex gap-1 rounded-full bg-stone-200/60 p-1 dark:bg-white/5"><button onClick={() => pick('roadmap')} className={seg('roadmap')}>Roadmap</button><button onClick={() => pick('list')} className={seg('list')}>List</button></div>
      </header>
      {mode === 'roadmap' ? <Roadmap patterns={patterns} groups={groups} /> : <List patterns={patterns} />}
    </div>
  )
}
