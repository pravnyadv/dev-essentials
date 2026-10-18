'use client'
import { useMemo, useState } from 'react'
import { Pill } from '../dsa/ui.jsx'
import { ResourceRow } from './LessonParts.jsx'

const Chip = ({ on, onClick, children }) => (
  <button onClick={onClick} className={`rounded-full border px-3 py-1 text-sm transition ${on ? 'border-fd-primary bg-fd-primary text-fd-primary-foreground' : 'hover:border-fd-primary/60'}`}>{children}</button>
)

// Dated news for the dashboard. Keep it short: radar.json holds the full list.
export function Radar({ items, updated }) {
  return (
    <section>
      <h2 className="text-xl font-bold">Radar</h2>
      <p className="mb-4 mt-1 text-sm text-fd-muted-foreground">Recent releases and reads that changed this path. Last updated {updated}.</p>
      <ul className="divide-y divide-fd-border rounded-xl border bg-fd-card">
        {items.map(r => (
          <li key={r.title} className="flex flex-col gap-1 px-4 py-3 text-sm sm:flex-row sm:gap-4">
            <span className="w-24 shrink-0 tabular-nums text-fd-muted-foreground">{r.date}</span>
            <div className="min-w-0 flex-1">
              <a href={r.url} target="_blank" rel="noreferrer" className="font-medium hover:underline">{r.title}</a>
              <p className="text-fd-muted-foreground">{r.why}{r.topicUrl && <> <a href={r.topicUrl} className="text-fd-primary hover:underline">Read the lesson</a></>}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

const OPEN = { true: 'Open weights', false: 'Closed', null: 'Check license' }
export function ModelAtlas({ atlas }) {
  return (
    <div className="[grid-area:main] min-w-0 mx-auto w-full max-w-5xl space-y-10 px-4 py-8 md:px-8">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight">Model atlas</h1>
        <p className="mt-2 max-w-2xl text-fd-muted-foreground">The models worth knowing, from the milestones that built the field to today's frontier. As of {atlas.asOf}. {atlas.caveat}</p>
      </header>
      {atlas.groups.map(g => (
        <section key={g.id}>
          <h2 className="text-xl font-bold">{g.title}</h2>
          <p className="mb-3 mt-1 text-sm text-fd-muted-foreground">{g.blurb}</p>
          <ul className="divide-y divide-fd-border rounded-xl border bg-fd-card">
            {g.models.map(m => (
              <li key={m.name} className="grid gap-1 px-4 py-3 text-sm sm:grid-cols-[11rem_1fr] sm:gap-4">
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
                    {m.topicUrl && <a href={m.topicUrl} className="text-fd-primary hover:underline">Read more</a>}
                    {m.url && <a href={m.url} target="_blank" rel="noreferrer" className="text-fd-primary hover:underline">Source</a>}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

const KINDS = ['article', 'video', 'course', 'repo', 'paper', 'docs', 'tool', 'book']
// Every resource the lessons cite, once each, filterable by kind and searchable.
export function Library({ library }) {
  const [kind, setKind] = useState(null)
  const [q, setQ] = useState('')
  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return library.filter(r => (!kind || r.kind === kind) && (!needle || `${r.title} ${r.by} ${r.why}`.toLowerCase().includes(needle)))
  }, [library, kind, q])
  return (
    <div className="[grid-area:main] min-w-0 mx-auto w-full max-w-4xl space-y-4 px-4 py-8 md:px-8">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight">Resource library</h1>
        <p className="mt-2 text-fd-muted-foreground">{library.length} articles, videos, courses, repositories and papers cited across the lessons. Repo stars are a snapshot.</p>
      </header>
      <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search title, author or topic" aria-label="Search resources" className="w-full rounded-lg border bg-fd-background px-3 py-2 text-sm" />
      <div className="flex flex-wrap gap-2">
        <Chip on={!kind} onClick={() => setKind(null)}>All</Chip>
        {KINDS.map(k => <Chip key={k} on={kind === k} onClick={() => setKind(k)}>{k}</Chip>)}
      </div>
      <p className="text-sm text-fd-muted-foreground">{shown.length} shown</p>
      <ul className="divide-y divide-fd-border rounded-xl border bg-fd-card">{shown.map(r => <ResourceRow key={r.url} r={r} showTopics />)}</ul>
    </div>
  )
}

export function Glossary({ glossary }) {
  const [q, setQ] = useState('')
  const shown = glossary.filter(g => `${g.term} ${g.names.join(' ')}`.toLowerCase().includes(q.trim().toLowerCase())).sort((a, b) => a.term.localeCompare(b.term))
  return (
    <div className="[grid-area:main] min-w-0 mx-auto w-full max-w-3xl space-y-4 px-4 py-8 md:px-8">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight">Glossary</h1>
        <p className="mt-2 text-fd-muted-foreground">Every technical word the lessons use, in plain language. Each lesson also lists the ones it uses.</p>
      </header>
      <input value={q} onChange={e => setQ(e.target.value)} placeholder="Find a term" aria-label="Find a term" className="w-full rounded-lg border bg-fd-background px-3 py-2 text-sm" />
      <dl className="divide-y divide-fd-border rounded-xl border bg-fd-card">
        {shown.map(g => <div key={g.term} className="px-4 py-3 text-sm"><dt className="font-semibold">{g.term}</dt><dd className="mt-0.5 text-fd-muted-foreground">{g.def}</dd></div>)}
      </dl>
    </div>
  )
}
