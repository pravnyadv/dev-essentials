'use client'
import { useLayoutEffect, useRef, useState } from 'react'
import { Cards } from 'fumadocs-ui/components/card'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import Chip from './Chip.jsx'
import Panel from './Panel.jsx'
import ProgressCard from './ProgressCard.jsx'
import Roadmap from './Roadmap.jsx'
import SectionHeading from './SectionHeading.jsx'
import StatusDot from './StatusDot.jsx'
import { ListRow, RowList } from './RowList.jsx'
import { useProgress } from './progress.jsx'
import { Bar, NumberBadge, Pill, buttonClass } from './ui.jsx'
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
  const chip = o => <Chip key={o.id} size="sm" onClick={() => onPick(o.id)}>{o.order}. {o.title}</Chip>
  return (
    <Panel as="section" padding="p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-2"><Pill tone="primary">Step {c.order}</Pill><Pill>{c.tier === 1 ? 'Must know' : 'Advanced'}</Pill><Pill>{c.topics.length} lessons · {hours(minutes(c))}</Pill></div>
      <SectionHeading level={2} className="mt-3 !text-2xl tracking-tight">{c.title}</SectionHeading>
      <p className="mt-1 text-fd-muted-foreground">{c.blurb}</p>
      <p className="mt-4 text-sm"><b>After this you can:</b> {c.outcome[0].toLowerCase() + c.outcome.slice(1)}</p>
      <Story text={c.story} />
      <div className="grid gap-4 text-sm sm:grid-cols-2">
        <div><p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground">Builds on</p><div className="flex flex-wrap gap-1.5">{c.after.length ? c.after.map(id => chip(byId[id])) : <span className="text-fd-muted-foreground">Nothing, start anywhere</span>}</div></div>
        <div><p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground">Leads to</p><div className="flex flex-wrap gap-1.5">{leads[c.id].length ? leads[c.id].map(chip) : <span className="text-fd-muted-foreground">Your own projects</span>}</div></div>
      </div>
      <RowList as="ol" className="mt-5">
        {c.topics.map(t => <ListRow key={t.id} href={t.url} className="flex items-center gap-3"><StatusDot id={t.id} /><span className="flex-1">{t.title}</span><span className="text-xs text-fd-muted-foreground">{t.minutes} min</span></ListRow>)}
      </RowList>
      <a href={next.url} className={buttonClass('primary', undefined, 'mt-5 rounded-full px-5 py-2')}>{started ? 'Continue' : 'Start'}: {next.title} →</a>
    </Panel>
  )
}

// Goal chips shared by all three views. A goal dims the chapters outside it and lists the route.
function GoalPicker({ goals, goalId, setGoalId, route }) {
  const goal = goals.find(g => g.id === goalId)
  return (
    <div className="mb-4 space-y-3">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="font-medium">I want to</span>
        {[{ id: null, title: 'See everything' }, ...goals].map(g => <Chip key={g.id ?? 'all'} on={g.id === goalId} onClick={() => setGoalId(g.id)}>{g.title}</Chip>)}
      </div>
      <p className="min-h-10 text-sm text-fd-muted-foreground">{goal ? <><b className="text-fd-foreground">{goal.blurb}</b> Your route: {route.map(c => c.order).join(' → ')}. Other chapters are dimmed.</> : 'Numbers show the recommended order and lines show what builds on what. Click a chapter to highlight its lines and see details.'}</p>
    </div>
  )
}

// Every dependency is a faint line; the selected chapter's lines are drawn dark on top.
function GraphMap({ data, on, selected, setSelected }) {
  const progress = useProgress()
  const wrap = useRef(), nodes = useRef({}), [lines, setLines] = useState([])
  const { ordered, byStage } = data
  const hot = l => (l.a === selected || l.b === selected ? 1 : 0)
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
  return (
    <div ref={wrap} className="relative">
      <svg className="pointer-events-none absolute inset-0 hidden size-full md:block" aria-hidden>
        {[...lines].sort((p, q) => hot(p) - hot(q)).map(l => {
          const dx = Math.max(24, (l.x2 - l.x1) / 2), h = hot(l), dim = !on(data.byId[l.a]) || !on(data.byId[l.b])
          return (
            <g key={l.a + l.b} className={dim && !h ? 'opacity-30' : ''}>
              <path d={`M${l.x1},${l.y1} C${l.x1 + dx},${l.y1} ${l.x2 - dx},${l.y2} ${l.x2},${l.y2}`} fill="none" strokeWidth={h ? 2.5 : 1.5} className={h ? 'stroke-fd-primary' : 'stroke-fd-muted-foreground/40'} />
              <circle cx={l.x2} cy={l.y2} r={h ? 4 : 3} className={h ? 'fill-fd-primary' : 'fill-fd-muted-foreground/50'} />
            </g>
          )
        })}
      </svg>
      <div className="relative grid gap-6 md:grid-cols-5 md:gap-x-10">
        {byStage.map(st => (
          <div key={st.id} className="space-y-2">
            <div className="mb-3"><p className="text-xs font-semibold uppercase tracking-wide text-fd-primary">Stage {st.id}</p><p className="font-bold">{st.title}</p><p className="text-xs text-fd-muted-foreground">{st.blurb}</p></div>
            {st.chapters.map(c => (
              <button key={c.id} ref={el => (nodes.current[c.id] = el)} onClick={() => setSelected(c.id)} aria-pressed={selected === c.id} className={`block w-full rounded-xl border bg-fd-card p-3 text-left shadow-sm transition hover:border-fd-primary/70 focus-visible:outline-2 focus-visible:outline-fd-primary ${selected === c.id ? 'border-fd-primary ring-2 ring-fd-primary/30' : ''} ${on(c) ? '' : 'opacity-50'}`}>
                <span className="flex items-start gap-2"><NumberBadge n={c.order} /><span className="text-sm font-semibold leading-snug">{c.title}</span></span>
                <span className="mt-2 block text-xs text-fd-muted-foreground">{c.topics.length} lessons · {hours(minutes(c))}</span>
                <span className="mt-1.5 block"><Bar value={doneOf(c, progress) / c.topics.length} /></span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function RoadmapView({ data, on }) {
  const progress = useProgress()
  const groups = data.byStage.map(st => ({
    id: st.id, title: `${st.id}. ${st.title}`, aside: st.blurb,
    content: (
      <Cards className="grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        {st.chapters.map(c => (
          <ProgressCard key={c.id} href={c.topics[0].url} className={on(c) ? '' : 'opacity-50'} title={<span className="flex items-center gap-2"><NumberBadge n={c.order} />{c.title}</span>} description={c.blurb} value={doneOf(c, progress) / c.topics.length} caption={`${doneOf(c, progress)}/${c.topics.length} done · ${hours(minutes(c))}`} />
        ))}
      </Cards>
    ),
  }))
  return <Roadmap groups={groups} />
}

function ListView({ data, on }) {
  const progress = useProgress()
  return (
    <RowList>
      {data.ordered.map(c => (
        <ListRow key={c.id} href={c.topics[0].url} className={`flex items-start gap-4 ${on(c) ? '' : 'opacity-50'}`}>
          <span className="w-6 shrink-0 text-center font-bold text-fd-primary">{c.order}</span>
          <span className="w-44 shrink-0 font-medium sm:w-56">{c.title}</span>
          <span className="hidden flex-1 text-fd-muted-foreground md:block">{c.outcome}</span>
          <span className="shrink-0 text-xs text-fd-muted-foreground">{doneOf(c, progress)}/{c.topics.length}</span>
        </ListRow>
      ))}
    </RowList>
  )
}

export default function LearningMap({ chapters, stages, goals }) {
  const data = useMapData(chapters, stages)
  const [selected, setSelected] = useState(chapters[0].id)
  const [goalId, setGoalId] = useState(null)
  const panel = useRef()
  const on = c => !goalId || c.goals.includes(goalId)
  const [flash, setFlash] = useState(0)
  const pick = id => { setSelected(id); setFlash(n => n + 1); requestAnimationFrame(() => panel.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })) }
  return (
    <div className="space-y-6">
      <header>
        <SectionHeading level={1}>Learning map</SectionHeading>
        <p className="mt-1 max-w-2xl text-fd-muted-foreground">Where to start, what builds on what, and where each chapter leads. Pick a goal to see your route, then click a chapter.</p>
      </header>
      <GoalPicker goals={goals} goalId={goalId} setGoalId={setGoalId} route={data.ordered.filter(on)} />
      <Tabs items={['Map', 'Roadmap', 'List']}>
        <Tab value="Map">
          <GraphMap data={data} on={on} selected={selected} setSelected={pick} />
          <div ref={panel} key={flash} className="mt-6 scroll-mt-20 animate-[map-flash_1.2s_ease-out] rounded-xl"><ChapterPanel c={data.byId[selected]} byId={data.byId} leads={data.leads} onPick={pick} /></div>
        </Tab>
        <Tab value="Roadmap"><RoadmapView data={data} on={on} /></Tab>
        <Tab value="List"><ListView data={data} on={on} /></Tab>
      </Tabs>
    </div>
  )
}
