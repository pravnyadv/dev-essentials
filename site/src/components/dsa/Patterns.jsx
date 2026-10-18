'use client'
import { Card, Cards } from 'fumadocs-ui/components/card'
import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock'
import Diagram from './Diagram.jsx'
import ProblemList, { solvedCount } from './ProblemList.jsx'
import BinarySearchExplainer from './BinarySearchExplainer.jsx'
import PrefixSumExplainer from './PrefixSumExplainer.jsx'
import SlidingWindowExplainer from './SlidingWindowExplainer.jsx'
import TwoPointersExplainer from './TwoPointersExplainer.jsx'
import Walkthrough from './Walkthrough.jsx'
import { useProgress } from './progress.jsx'
import { Bar, Pill } from './ui.jsx'

// Patterns whose walkthrough is a hand-built interactive component.
const EXPLAINERS = { 'prefix-sum': <PrefixSumExplainer />, 'two-pointers': <TwoPointersExplainer />, 'sliding-window': <SlidingWindowExplainer />, 'binary-search': <BinarySearchExplainer /> }
export const PatternSteps = ({ p }) => EXPLAINERS[p.id] ?? <Walkthrough key={p.id} steps={p.steps} />
const Label = ({ children }) => <h3 className="mb-1 mt-4 text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground">{children}</h3>

export function PatternDetail({ p, byId }) {
  const progress = useProgress()
  return (
    <div className="space-y-2">
      <a href="/dsa/patterns" className="text-sm text-fd-primary hover:underline">← All patterns</a>
      <div className="flex items-baseline justify-between gap-3">
        <h1 className="text-4xl font-extrabold tracking-tight">{p.name}</h1>
        <span className="text-sm text-fd-muted-foreground">{solvedCount(p.problems, progress)}/{p.problems.length} solved</span>
      </div>
      <div className="grid gap-x-8 pt-2 xl:grid-cols-[minmax(0,1fr)_27rem]">
        <div className="xl:col-start-1">
          <Label>What it is</Label>
          <p className="text-sm leading-relaxed">{p.what}</p>
          <Callout title="Used for" type="info" className="mt-4">{p.usedFor}</Callout>
        </div>
        <div className="my-6 xl:col-start-2 xl:row-span-2 xl:row-start-1 xl:my-0"><PatternSteps p={p} /></div>
        <div className="xl:col-start-1">
          <Label>You see</Label>
          <ul className="list-disc pl-5 text-sm">{p.signals.map(s => <li key={s}>{s}</li>)}</ul>
          <Label>Learn it in</Label>
          <p className="flex flex-wrap gap-2 text-sm">{p.topics.map(id => byId[id] && <Pill key={id} tone="primary" href={byId[id].url} className="px-3">{byId[id].title}</Pill>)}</p>
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
    <Card href={`/dsa/patterns/${p.id}`} title={<span className="flex items-center justify-between gap-2">{p.name}{p.core && <Pill tone="primary">core</Pill>}</span>}>
      <div className="my-3 flex min-h-20 items-center justify-center overflow-hidden"><Diagram d={p.steps[Math.min(1, p.steps.length - 1)].scene} compact /></div>
      <Bar value={done / p.problems.length} />
      <p className="mt-1 text-[11px]">{done}/{p.problems.length} solved</p>
    </Card>
  )
}

function Roadmap({ patterns, groups }) {
  const progress = useProgress()
  const byId = Object.fromEntries(patterns.map(p => [p.id, p]))
  return (
    <div className="relative ml-3 border-l-2 border-fd-primary/30 pl-8">
      {groups.map(g => {
        const ps = g.ids.map(id => byId[id]), solved = ps.reduce((n, p) => n + solvedCount(p.problems, progress), 0), total = ps.reduce((n, p) => n + p.problems.length, 0)
        return (
          <section key={g.title} className="relative pb-10">
            <span className="absolute -left-[2.6rem] top-1 size-4 rounded-full border-4 border-fd-primary bg-fd-background" />
            <div className="mb-3 flex items-baseline gap-3"><h2 className="text-lg font-bold">{g.title}</h2><span className="text-xs text-fd-muted-foreground">{solved}/{total} problems</span></div>
            <Cards className="grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">{ps.map(p => <Tile key={p.id} p={p} />)}</Cards>
          </section>
        )
      })}
    </div>
  )
}

function List({ patterns }) {
  const progress = useProgress()
  return (
    <ul className="divide-y divide-fd-border rounded-xl border bg-fd-card">
      {patterns.map(p => (
        <li key={p.id}><a href={`/dsa/patterns/${p.id}`} className="flex items-center gap-4 px-4 py-3 hover:bg-fd-accent/60">
          <span className="w-52 shrink-0 font-medium">{p.name}</span>
          <span className="hidden flex-1 truncate text-sm text-fd-muted-foreground md:block">{p.signals.join(' · ')}</span>
          <span className="shrink-0 text-xs text-fd-muted-foreground">{solvedCount(p.problems, progress)}/{p.problems.length}</span>
        </a></li>
      ))}
    </ul>
  )
}

export function PatternsIndex({ patterns, groups }) {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-4xl font-extrabold tracking-tight">Problem patterns</h1>
        <p className="mt-1 text-fd-muted-foreground">Spot the signal in a problem, open the pattern, step through it, then practise.</p>
      </header>
      <Tabs items={['Roadmap', 'List']}>
        <Tab value="Roadmap"><Roadmap patterns={patterns} groups={groups} /></Tab>
        <Tab value="List"><List patterns={patterns} /></Tab>
      </Tabs>
    </div>
  )
}
