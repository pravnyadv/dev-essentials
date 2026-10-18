'use client'
import { useLayoutEffect, useRef, useState } from 'react'
import { Card, Cards } from 'fumadocs-ui/components/card'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import StatusDot from '../dsa/StatusDot.jsx'
import { useProgress } from '../dsa/progress.jsx'
import { Bar, Pill, buttonClass } from '../dsa/ui.jsx'
import { Story } from './LessonParts.jsx'

const minutes = c => c.topics.reduce((n, t) => n + t.minutes, 0)
const hours = m => (m >= 90 ? `${(m / 60).toFixed(m >= 600 ? 0 : 1)} h` : `${m} min`)
const doneOf = (c, progress) => c.topics.filter(t => progress[t.id] === 'done').length

// Chapters grouped by stage, in learning order. `order` is the 1-based position in the whole path.
function useMapData(chapters, stages) {
  const ordered = chapters.map((c, i) => ({ ...c, order: i + 1 }))
  const byId = Object.fromEntries(ordered.map(c => [c.id, c]))
  const leads = Object.fromEntries(ordered.map(c => [c.id, ordered.filter(o => o.after.includes(c.id))]))
  const byStage = stages.map(st => ({ ...st, chapters: ordered.filter(c => c.stage === st.id) }))
  return { ordered, byId, leads, byStage }
}

// Detail for one chapter: what you can do after it, a story, what it builds on and unlocks, and its lessons.
function ChapterPanel({ c, byId, leads, onPick }) {
  const progress = useProgress()
  const next = c.topics.find(t => progress[t.id] !== 'done') ?? c.topics[0]
  const started = c.topics.some(t => progress[t.id])
  const chip = o => <button key={o.id} onClick={() => onPick(o.id)} className="rounded-full border px-2.5 py-0.5 text-xs hover:border-fd-primary">{o.order}. {o.title}</button>
  return (
    <section className="rounded-2xl border bg-fd-card p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-2"><Pill tone="primary">Step {c.order}</Pill><Pill>{c.tier === 1 ? 'Must know' : 'Advanced'}</Pill><Pill>{c.topics.length} lessons · {hours(minutes(c))}</Pill></div>
      <h2 className="mt-3 text-2xl font-bold tracking-tight">{c.title}</h2>
      <p className="mt-1 text-fd-muted-foreground">{c.blurb}</p>
      <p className="mt-4 text-sm"><b>After this you can:</b> {c.outcome[0].toLowerCase() + c.outcome.slice(1)}</p>
      <Story text={c.story} />
      <div className="grid gap-4 text-sm sm:grid-cols-2">
        <div><p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-fd-muted-foreground">Builds on</p><div className="flex flex-wrap gap-1.5">{c.after.length ? c.after.map(id => chip(byId[id])) : <span className="text-fd-muted-foreground">Nothing, start anywhere</span>}</div></div>
        <div><p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-fd-muted-foreground">Leads to</p><div className="flex flex-wrap gap-1.5">{leads[c.id].length ? leads[c.id].map(chip) : <span className="text-fd-muted-foreground">Your own projects</span>}</div></div>
      </div>
      <ol className="mt-5 divide-y divide-fd-border rounded-xl border">
        {c.topics.map(t => (
          <li key={t.id}><a href={t.url} className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-fd-accent/60"><StatusDot id={t.id} /><span className="flex-1">{t.title}</span><span className="text-xs text-fd-muted-foreground">{t.minutes} min</span></a></li>
        ))}
      </ol>
      <a href={next.url} className={buttonClass('primary', undefined, 'mt-5 rounded-full px-5 py-2')}>{started ? 'Continue' : 'Start'}: {next.title} →</a>
    </section>
  )
}

function GraphMap({ data, goals, goalId, setGoalId, selected, setSelected }) {
  const progress = useProgress()
  const wrap = useRef(), nodes = useRef({}), [lines, setLines] = useState([])
  const { ordered, byStage } = data
  const edges = ordered.flatMap(c => c.after.filter(a => data.byId[a].stage < c.stage).map(a => [a, c.id]))
  useLayoutEffect(() => {
    const measure = () => {
      const w = wrap.current.getBoundingClientRect()
      setLines(edges.map(([a, b]) => {
        const A = nodes.current[a].getBoundingClientRect(), B = nodes.current[b].getBoundingClientRect()
        return { a, b, x1: A.right - w.left, y1: A.top + A.height / 2 - w.top, x2: B.left - w.left, y2: B.top + B.height / 2 - w.top }
      }))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(wrap.current)
    return () => ro.disconnect()
  }, [])
  const goal = goals.find(g => g.id === goalId)
  const on = c => !goal || c.goals.includes(goal.id)
  const route = goal && ordered.filter(on)
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="font-medium">I want to</span>
        {[{ id: null, title: 'See everything' }, ...goals].map(g => <button key={g.id ?? 'all'} onClick={() => setGoalId(g.id)} className={`rounded-full border px-3 py-1 transition ${g.id === goalId ? 'border-fd-primary bg-fd-primary text-fd-primary-foreground' : 'hover:border-fd-primary/60'}`}>{g.title}</button>)}
      </div>
      <p className="min-h-10 text-sm text-fd-muted-foreground">{goal ? <><b className="text-fd-foreground">{goal.blurb}</b> Your route: {route.map(c => c.order).join(' → ')}. Other chapters are dimmed.</> : 'Numbers show the recommended order. Arrows show what builds on what. Click a chapter for details.'}</p>
      <div ref={wrap} className="relative">
        <svg className="pointer-events-none absolute inset-0 hidden size-full md:block" aria-hidden>
          {lines.map(l => {
            const dx = Math.max(24, (l.x2 - l.x1) / 2), hot = l.a === selected || l.b === selected
            const dim = on(data.byId[l.a]) && on(data.byId[l.b]) ? '' : 'opacity-20'
            return (
              <g key={l.a + l.b} className={`transition-all ${dim}`}>
                <path d={`M${l.x1},${l.y1} C${l.x1 + dx},${l.y1} ${l.x2 - dx},${l.y2} ${l.x2},${l.y2}`} fill="none" strokeWidth={hot ? 2.5 : 1.5} className={hot ? 'stroke-fd-primary' : 'stroke-fd-muted-foreground/40'} />
                <circle cx={l.x2} cy={l.y2} r={hot ? 4 : 3} className={hot ? 'fill-fd-primary' : 'fill-fd-muted-foreground/50'} />
              </g>
            )
          })}
        </svg>
        <div className="relative grid gap-6 md:grid-cols-5 md:gap-x-10">
          {byStage.map(st => (
            <div key={st.id} className="space-y-2">
              <div className="mb-3"><p className="text-xs font-semibold uppercase tracking-wider text-fd-primary">Stage {st.id}</p><p className="font-bold">{st.title}</p><p className="text-xs text-fd-muted-foreground">{st.blurb}</p></div>
              {st.chapters.map(c => (
                <button key={c.id} ref={el => (nodes.current[c.id] = el)} onClick={() => setSelected(c.id)} className={`block w-full rounded-xl border bg-fd-card p-3 text-left transition hover:border-fd-primary/70 ${selected === c.id ? 'border-fd-primary ring-2 ring-fd-primary/30' : ''} ${on(c) ? '' : 'opacity-35'}`}>
                  <span className="flex items-start gap-2"><span className="grid size-5 shrink-0 place-items-center rounded-full bg-fd-primary text-[11px] font-bold text-fd-primary-foreground">{c.order}</span><span className="text-sm font-semibold leading-snug">{c.title}</span></span>
                  <span className="mt-2 block text-[11px] text-fd-muted-foreground">{c.topics.length} lessons · {hours(minutes(c))}</span>
                  <span className="mt-1.5 block"><Bar value={doneOf(c, progress) / c.topics.length} /></span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Roadmap({ data }) {
  const progress = useProgress()
  return (
    <div className="relative ml-3 border-l-2 border-fd-primary/30 pl-8">
      {data.byStage.map(st => (
        <section key={st.id} className="relative pb-10">
          <span className="absolute -left-[2.6rem] top-1 size-4 rounded-full border-4 border-fd-primary bg-fd-background" />
          <div className="mb-3 flex flex-wrap items-baseline gap-x-3"><h2 className="text-lg font-bold">{st.id}. {st.title}</h2><span className="text-xs text-fd-muted-foreground">{st.blurb}</span></div>
          <Cards className="grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            {st.chapters.map(c => (
              <Card key={c.id} href={c.topics[0].url} title={<span className="flex items-center gap-2"><span className="grid size-5 place-items-center rounded-full bg-fd-primary text-[11px] font-bold text-fd-primary-foreground">{c.order}</span>{c.title}</span>} description={c.blurb}>
                <div className="mt-3"><Bar value={doneOf(c, progress) / c.topics.length} /></div>
                <p className="mt-1 text-[11px]">{doneOf(c, progress)}/{c.topics.length} done · {hours(minutes(c))}</p>
              </Card>
            ))}
          </Cards>
        </section>
      ))}
    </div>
  )
}

function List({ data }) {
  const progress = useProgress()
  return (
    <ul className="divide-y divide-fd-border rounded-xl border bg-fd-card">
      {data.ordered.map(c => (
        <li key={c.id}><a href={c.topics[0].url} className="flex items-center gap-4 px-4 py-3 hover:bg-fd-accent/60">
          <span className="w-6 shrink-0 text-center text-sm font-bold text-fd-primary">{c.order}</span>
          <span className="w-56 shrink-0 font-medium">{c.title}</span>
          <span className="hidden flex-1 truncate text-sm text-fd-muted-foreground md:block">{c.outcome}</span>
          <span className="shrink-0 text-xs text-fd-muted-foreground">{doneOf(c, progress)}/{c.topics.length}</span>
        </a></li>
      ))}
    </ul>
  )
}

export default function LearningMap({ chapters, stages, goals }) {
  const data = useMapData(chapters, stages)
  const [selected, setSelected] = useState(chapters[0].id)
  const [goalId, setGoalId] = useState(null)
  const panel = useRef()
  const pick = id => { setSelected(id); panel.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }) }
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-4xl font-extrabold tracking-tight">Learning map</h1>
        <p className="mt-1 max-w-2xl text-fd-muted-foreground">Where to start, what builds on what, and where each chapter leads. Pick a goal to see your route, then click a chapter.</p>
      </header>
      <Tabs items={['Map', 'Roadmap', 'List']}>
        <Tab value="Map">
          <GraphMap data={data} goals={goals} goalId={goalId} setGoalId={setGoalId} selected={selected} setSelected={pick} />
          <div ref={panel} className="mt-6 scroll-mt-20"><ChapterPanel c={data.byId[selected]} byId={data.byId} leads={data.leads} onPick={pick} /></div>
        </Tab>
        <Tab value="Roadmap"><Roadmap data={data} /></Tab>
        <Tab value="List"><List data={data} /></Tab>
      </Tabs>
    </div>
  )
}
