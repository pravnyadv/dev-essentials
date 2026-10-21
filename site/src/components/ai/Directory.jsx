'use client'
import { useState } from 'react'
import { Check } from 'lucide-react'
import Chip from '../shared/Chip.jsx'
import PageContainer from '../shared/PageContainer.jsx'
import Panel from '../shared/Panel.jsx'
import { Pill } from '../shared/ui.jsx'
import { ARTICLE_TOPICS, LEVELS } from '../../lib/vocab.mjs'
import SectionHeading from '../shared/SectionHeading.jsx'
import { ListRow, RowList } from '../shared/RowList.jsx'
import { SearchBox } from '../shared/Reference.jsx'

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
        {Object.entries(ARTICLE_TOPICS).filter(([t]) => count(t)).map(([t, label]) => <Chip key={t} on={topic === t} onClick={() => setTopic(t)}>{label} {count(t)}</Chip>)}
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
              <Pill tone="outline">{ARTICLE_TOPICS[a.topic]}</Pill>
              <Pill tone="outline">{LEVELS[a.level]}</Pill>
              Pairs with <Pill href={a.lessonUrl} className="max-md:inline-flex max-md:min-h-11 max-md:items-center">{a.lessonTitle}</Pill>
            </p>
          </ListRow>
        ))}
      </RowList>
    </PageContainer>
  )
}
