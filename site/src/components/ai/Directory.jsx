'use client'
import { useMemo, useState } from 'react'
import Chip from '../shared/Chip.jsx'
import PageContainer from '../shared/PageContainer.jsx'
import { Pill, buttonClass } from '../shared/ui.jsx'
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

const OPEN = { true: 'Open weights', false: 'Closed', null: 'Check license' }
export function ModelAtlas({ atlas }) {
  return (
    <PageContainer className="space-y-10">
      <header>
        <SectionHeading level={1}>Model atlas</SectionHeading>
        <p className="mt-2 max-w-2xl text-fd-muted-foreground">The models worth knowing, from the milestones that built the field to today's frontier. As of {atlas.asOf}. {atlas.caveat}</p>
      </header>
      {atlas.groups.map(g => (
        <section key={g.id}>
          <SectionHeading level={2}>{g.title}</SectionHeading>
          <p className="mb-3 mt-1 text-sm text-fd-muted-foreground">{g.blurb}</p>
          <RowList>
            {g.models.map(m => (
              <ListRow key={m.name} className="grid gap-1 sm:grid-cols-[11rem_1fr] sm:gap-4">
                <div>
                  <p className="font-semibold">{m.name}</p>
                  <p className="text-xs text-fd-muted-foreground">{m.lab} · {m.released}</p>
                </div>
                <div>
                  <p>{m.why}</p>
                  <p className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                    {m.open !== undefined && <Pill tone={m.open ? 'primary' : 'muted'}>{OPEN[m.open]}</Pill>}
                    {m.verified === 'vendor' && <Pill tone="primary">Vendor-confirmed</Pill>}
                    {m.verified === 'tracker' && <Pill>Tracker only</Pill>}
                    {m.tier && <Pill>{m.tier}</Pill>}
                    {m.topicUrl && <a href={m.topicUrl} className="text-fd-primary underline underline-offset-2">Read more</a>}
                    {m.url && <a href={m.url} target="_blank" rel="noreferrer" className="text-fd-primary underline underline-offset-2">Source</a>}
                  </p>
                </div>
              </ListRow>
            ))}
          </RowList>
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
  const reset = fn => v => { fn(v); setLimit(PAGE) }
  return (
    <PageContainer className="space-y-4">
      <header>
        <SectionHeading level={1}>Resource library</SectionHeading>
        <p className="mt-2 text-fd-muted-foreground">{library.length} articles, videos, courses, repositories and papers cited across the lessons. Everything linked is free to read. Some courses charge for a certificate. Repo stars are a snapshot.</p>
      </header>
      <div className="grid gap-3 sm:grid-cols-[1fr_16rem]">
        <input value={q} onChange={e => reset(setQ)(e.target.value)} placeholder="Search title, author or topic" aria-label="Search resources" className="w-full rounded-lg border bg-fd-background px-3 py-2 text-sm max-md:min-h-11" />
        <select value={chapter} onChange={e => reset(setChapter)(e.target.value)} aria-label="Filter by chapter" className="w-full rounded-lg border bg-fd-background px-3 py-2 text-sm max-md:min-h-11">
          <option value="">All chapters</option>
          {chapters.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </div>
      <div className="flex flex-wrap gap-2">
        <Chip on={!kind} onClick={() => reset(setKind)(null)}>All</Chip>
        {KINDS.map(k => <Chip key={k} on={kind === k} onClick={() => reset(setKind)(k)}>{k}</Chip>)}
      </div>
      <p className="text-sm text-fd-muted-foreground" aria-live="polite">Showing {Math.min(limit, shown.length)} of {shown.length}</p>
      <RowList>{shown.slice(0, limit).map(r => <ResourceRow key={r.url} r={r} showTopics />)}</RowList>
      {shown.length > limit && <button type="button" onClick={() => setLimit(limit + PAGE)} className={buttonClass('outline', undefined, 'w-full rounded-lg')}>Show {Math.min(PAGE, shown.length - limit)} more</button>}
    </PageContainer>
  )
}

export function Glossary({ glossary }) {
  const [q, setQ] = useState('')
  const shown = glossary.filter(g => `${g.term} ${g.names.join(' ')}`.toLowerCase().includes(q.trim().toLowerCase())).sort((a, b) => a.term.localeCompare(b.term))
  return (
    <PageContainer width="narrow" className="space-y-4">
      <header>
        <SectionHeading level={1}>Glossary</SectionHeading>
        <p className="mt-2 text-fd-muted-foreground">Every technical word the lessons use, in plain language. Each lesson also lists the ones it uses.</p>
      </header>
      <input value={q} onChange={e => setQ(e.target.value)} placeholder="Find a term" aria-label="Find a term" className="w-full rounded-lg border bg-fd-background px-3 py-2 text-sm max-md:min-h-11" />
      <RowList as="dl">
        {shown.map(g => <ListRow key={g.term} as="div"><dt className="font-semibold">{g.term}</dt><dd className="mt-0.5 text-fd-muted-foreground">{g.def}</dd></ListRow>)}
      </RowList>
    </PageContainer>
  )
}
