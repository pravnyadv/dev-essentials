'use client'
import { useMemo, useState } from 'react'
import { Check, Search } from 'lucide-react'
import Chip from '../shared/Chip.jsx'
import PageContainer from '../shared/PageContainer.jsx'
import Panel from '../shared/Panel.jsx'
import { LEVELS, Pill, buttonClass } from '../shared/ui.jsx'
import SectionHeading from '../shared/SectionHeading.jsx'
import { ListRow, RowList } from '../shared/RowList.jsx'
import { ResourceRow } from './LessonParts.jsx'

// Dated news for the dashboard. radar.json holds the full list.
export function Radar({ items, updated }) {
  return (
    <section>
      <SectionHeading level={2}>Radar</SectionHeading>
      <p className="mb-4 mt-1 text-sm text-fd-muted-foreground">Recent releases and reads that changed this path. Last updated {updated}.</p>
      <RowList>
        {items.map(r => (
          <ListRow key={r.title} className="flex flex-col gap-1 sm:flex-row sm:gap-4">
            <span className="w-24 shrink-0 tabular-nums text-fd-muted-foreground">{r.date}</span>
            <div className="min-w-0 flex-1">
              <a href={r.url} target="_blank" rel="noreferrer" className="font-medium underline underline-offset-2">{r.title}</a>
              <p className="text-fd-muted-foreground">{r.why}{r.topicUrl && <> <a href={r.topicUrl} className="text-fd-primary underline underline-offset-2">Read: {r.topicTitle}</a></>}</p>
            </div>
          </ListRow>
        ))}
      </RowList>
    </section>
  )
}

// Search box with a magnifier, shared by the library and the glossary.
function SearchBox({ value, onChange, placeholder, label, className = '' }) {
  return (
    <label className={`relative block ${className}`}>
      <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fd-muted-foreground" />
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} aria-label={label} className="w-full rounded-lg border bg-fd-card py-2.5 pl-9 pr-3 text-sm shadow-sm max-md:min-h-11" />
    </label>
  )
}

const OPEN = { true: 'Open weights', false: 'Closed', null: 'Check license' }
const OPENNESS = [['all', 'All models'], ['open', 'Open weights'], ['closed', 'Closed']]
const linkClass = 'font-medium text-fd-foreground underline underline-offset-2 decoration-fd-border hover:decoration-fd-foreground max-md:py-3'

function ModelCard({ m }) {
  return (
    <Panel as="article" padding="p-5" className="flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <SectionHeading level={3} className="!text-lg leading-snug tracking-tight">{m.name}</SectionHeading>
        <time className="shrink-0 pt-1 text-xs tabular-nums text-fd-muted-foreground">{m.released}</time>
      </div>
      <p className="text-sm text-fd-muted-foreground">{m.lab}</p>
      <p className="mt-3 text-sm leading-relaxed">{m.why}</p>
      <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1.5 pt-4 text-xs">
        {m.verified === 'vendor' && <Pill tone="primary" className="inline-flex items-center gap-1"><Check aria-hidden className="size-3" />Vendor-confirmed</Pill>}
        {m.verified === 'tracker' && <Pill tone="outline" className="border-dashed">Tracker only</Pill>}
        {m.open !== undefined && <Pill tone="outline">{OPEN[m.open]}</Pill>}
        {m.tier && <Pill tone="outline">{m.tier}</Pill>}
        <span className="ml-auto flex gap-3">
          {m.topicUrl && <a href={m.topicUrl} className={linkClass}>Read more</a>}
          {m.url && <a href={m.url} target="_blank" rel="noreferrer" className={linkClass}>Source</a>}
        </span>
      </div>
    </Panel>
  )
}

export function ModelAtlas({ atlas }) {
  const [openness, setOpenness] = useState('all')
  const keep = m => openness === 'all' || (openness === 'open' ? m.open === true : m.open === false)
  const groups = atlas.groups.map(g => ({ ...g, models: g.models.filter(keep) })).filter(g => g.models.length)
  return (
    <PageContainer className="space-y-10">
      <header>
        <SectionHeading level={1}>Model atlas</SectionHeading>
        <p className="mt-2 max-w-2xl text-fd-muted-foreground">The models worth knowing, from the milestones that built the field to today's frontier. As of {atlas.asOf}. {atlas.caveat}</p>
        <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filter by license">
          {OPENNESS.map(([id, label]) => <Chip key={id} on={openness === id} onClick={() => setOpenness(id)}>{label}</Chip>)}
        </div>
      </header>
      {groups.map(g => (
        <section key={g.id}>
          <div className="mb-5 border-b pb-4">
            <SectionHeading level={2}>{g.title}</SectionHeading>
            <p className="mt-1 max-w-3xl text-sm text-fd-muted-foreground">{g.blurb}</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">{g.models.map(m => <ModelCard key={m.name} m={m} />)}</div>
        </section>
      ))}
    </PageContainer>
  )
}

const KINDS = ['article', 'video', 'course', 'repo', 'paper', 'docs', 'tool', 'book']
const PAGE = 40
const chapterOf = r => r.topics.map(t => t.url.split('/')[3])

// Every resource the lessons cite, once each. Filter by kind or chapter, search, and page through 40 at a time.
export function Library({ library, chapters }) {
  const [kind, setKind] = useState(null)
  const [chapter, setChapter] = useState('')
  const [q, setQ] = useState('')
  const [limit, setLimit] = useState(PAGE)
  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return library.filter(r => (!kind || r.kind === kind) && (!chapter || chapterOf(r).includes(chapter)) && (!needle || `${r.title} ${r.by} ${r.why}`.toLowerCase().includes(needle)))
  }, [library, kind, chapter, q])
  const counts = useMemo(() => Object.fromEntries(KINDS.map(k => [k, library.filter(r => r.kind === k).length])), [library])
  const reset = fn => v => { fn(v); setLimit(PAGE) }
  return (
    <PageContainer className="space-y-5">
      <header>
        <SectionHeading level={1}>Resource library</SectionHeading>
        <p className="mt-2 max-w-3xl text-fd-muted-foreground">{library.length} articles, videos, courses, repositories and papers cited across the lessons. Everything linked is free to read. Some courses charge for a certificate. Repo stars are a snapshot.</p>
      </header>
      <div className="grid gap-3 sm:grid-cols-[1fr_16rem]">
        <SearchBox value={q} onChange={reset(setQ)} placeholder="Search title, author or topic" label="Search resources" />
        <select value={chapter} onChange={e => reset(setChapter)(e.target.value)} aria-label="Filter by chapter" className="w-full rounded-lg border bg-fd-card px-3 py-2.5 text-sm shadow-sm max-md:min-h-11">
          <option value="">All chapters</option>
          {chapters.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </div>
      <div className="flex flex-wrap gap-2">
        <Chip on={!kind} onClick={() => reset(setKind)(null)}>All {library.length}</Chip>
        {KINDS.map(k => <Chip key={k} on={kind === k} onClick={() => reset(setKind)(k)}>{k} {counts[k]}</Chip>)}
      </div>
      <p className="text-sm text-fd-muted-foreground" aria-live="polite">Showing {Math.min(limit, shown.length)} of {shown.length}</p>
      <RowList>{shown.slice(0, limit).map(r => <ResourceRow key={r.url} r={r} showTopics />)}</RowList>
      {shown.length > limit && <button type="button" onClick={() => setLimit(limit + PAGE)} className={buttonClass('outline', undefined, 'w-full rounded-lg')}>Show {Math.min(PAGE, shown.length - limit)} more</button>}
    </PageContainer>
  )
}

const letterOf = term => (/[a-z]/i.test(term[0]) ? term[0].toUpperCase() : '#')

export function Glossary({ glossary }) {
  const [q, setQ] = useState('')
  const needle = q.trim().toLowerCase()
  const shown = glossary.filter(g => `${g.term} ${g.names.join(' ')}`.toLowerCase().includes(needle)).sort((a, b) => a.term.localeCompare(b.term))
  const letters = [...new Set(shown.map(g => letterOf(g.term)))]
  return (
    <PageContainer className="space-y-5">
      <header>
        <SectionHeading level={1}>Glossary</SectionHeading>
        <p className="mt-2 max-w-2xl text-fd-muted-foreground">{glossary.length} technical words the lessons use, in plain language. Each lesson also lists the ones it uses.</p>
      </header>
      <SearchBox value={q} onChange={setQ} placeholder="Find a term" label="Find a term" className="max-w-md" />
      <nav aria-label="Jump to letter" className="flex flex-wrap gap-1">
        {letters.map(l => <a key={l} href={`#g-${l}`} className="grid size-8 place-items-center rounded-md border text-sm font-medium hover:bg-fd-accent max-md:size-11">{l}</a>)}
      </nav>
      {!shown.length && <p className="text-fd-muted-foreground">No term matches "{q}".</p>}
      {letters.map(l => (
        <section key={l} id={`g-${l}`} className="scroll-mt-20">
          <div className="mb-3 border-b pb-2"><SectionHeading level={2} className="!text-2xl">{l}</SectionHeading></div>
          <dl className="grid gap-3 md:grid-cols-2">
            {shown.filter(g => letterOf(g.term) === l).map(g => (
              <Panel key={g.term} padding="p-4">
                <dt className="font-semibold">{g.term}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-fd-muted-foreground">{g.def}</dd>
              </Panel>
            ))}
          </dl>
        </section>
      ))}
    </PageContainer>
  )
}

const TOPICS = { 'how-llms-work': 'How LLMs work', prompting: 'Prompting', agents: 'Agents', retrieval: 'Retrieval', evals: 'Evals', safety: 'Safety', building: 'Building', coding: 'Coding with AI', history: 'History', critical: 'Critical views' }

// Hand-picked free reading, one lesson each. Filter by topic or search.
export function Articles({ articles }) {
  const [topic, setTopic] = useState(null)
  const [q, setQ] = useState('')
  const needle = q.trim().toLowerCase()
  const shown = articles.filter(a => (!topic || a.topic === topic) && (!needle || `${a.title} ${a.author} ${a.why}`.toLowerCase().includes(needle)))
  const count = t => articles.filter(a => a.topic === t).length
  return (
    <PageContainer className="space-y-5">
      <header>
        <SectionHeading level={1}>Free articles</SectionHeading>
        <p className="mt-2 max-w-3xl text-fd-muted-foreground">{articles.length} articles worth reading, picked by hand. Every one is free and was opened to check it loads. Each pairs with a lesson, so you can read it right after.</p>
      </header>
      <SearchBox value={q} onChange={setQ} placeholder="Search title, author or topic" label="Search articles" className="max-w-md" />
      <div className="flex flex-wrap gap-2">
        <Chip on={!topic} onClick={() => setTopic(null)}>All {articles.length}</Chip>
        {Object.entries(TOPICS).filter(([t]) => count(t)).map(([t, label]) => <Chip key={t} on={topic === t} onClick={() => setTopic(t)}>{label} {count(t)}</Chip>)}
      </div>
      <p className="text-sm text-fd-muted-foreground" aria-live="polite">Showing {shown.length} of {articles.length}</p>
      <RowList>
        {shown.map(a => (
          <ListRow key={a.url}>
            <div className="flex flex-wrap items-baseline gap-x-2">
              <a href={a.url} target="_blank" rel="noreferrer" className="inline-block py-1 font-semibold hover:underline max-md:py-3">{a.title}</a>
              <span className="text-xs text-fd-muted-foreground">{a.author}{a.year ? `, ${a.year}` : ''}</span>
            </div>
            <p className="text-fd-muted-foreground">{a.why}</p>
            <p className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-fd-muted-foreground">
              <Pill tone="outline">{TOPICS[a.topic]}</Pill>
              <Pill tone="outline">{LEVELS[a.level]}</Pill>
              Pairs with <Pill href={a.lessonUrl} className="max-md:inline-flex max-md:min-h-11 max-md:items-center">{a.lessonTitle}</Pill>
            </p>
          </ListRow>
        ))}
      </RowList>
    </PageContainer>
  )
}
