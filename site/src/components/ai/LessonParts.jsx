'use client'
import { useState } from 'react'
import { Callout } from 'fumadocs-ui/components/callout'
import Panel from '../shared/Panel.jsx'
import { ListRow, RowList } from '../shared/RowList.jsx'
import SectionHeading from '../shared/SectionHeading.jsx'
import Quiz from '../shared/Quiz.jsx'
import { Pill } from '../shared/ui.jsx'

const KIND = { article: 'Article', video: 'Video', course: 'Course', repo: 'Repo', paper: 'Paper', docs: 'Docs', tool: 'Tool', book: 'Book' }
const compact = n => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : n)

export function ResourceRow({ r, showTopics }) {
  const external = !r.url.startsWith('/')
  return (
    <ListRow className="flex gap-4">
      <span className="w-16 shrink-0 pt-1.5 text-xs font-semibold uppercase tracking-wider text-fd-muted-foreground max-md:hidden">{KIND[r.kind]}</span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <a href={r.url} target={external ? '_blank' : undefined} rel="noreferrer" className="inline-block py-1 font-semibold hover:underline max-md:py-3">{r.title}</a>
          <span className="text-xs text-fd-muted-foreground md:hidden">{KIND[r.kind]}</span>
          {r.stars && <span className="text-xs text-fd-muted-foreground" title="GitHub stars">★ {compact(r.stars)}</span>}
        </div>
        <p className="text-fd-muted-foreground">{r.by && <span className="text-fd-foreground">{r.by} · </span>}{r.why}</p>
        {showTopics && <p className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-fd-muted-foreground">Used in {r.topics.map(t => <Pill key={t.url} href={t.url} className="max-md:py-2">{t.title}</Pill>)}</p>}
      </div>
    </ListRow>
  )
}

export function Resources({ resources }) {
  return (
    <section className="mt-10">
      <SectionHeading lesson className="mb-3">Go deeper</SectionHeading>
      <RowList>{resources.map(r => <ResourceRow key={r.url} r={r} />)}</RowList>
    </section>
  )
}

// A few multiple-choice questions, one answer picked per question.
export function CheckYourself({ quiz }) {
  const [picks, setPicks] = useState({})
  if (!quiz.length) return null
  return (
    <section className="mt-10">
      <SectionHeading lesson className="mb-3">Check yourself</SectionHeading>
      <Panel className="space-y-6">
        {quiz.map((q, i) => <Quiz key={i} quiz={q} picked={picks[i]} onPick={n => setPicks(p => ({ ...p, [i]: n }))} />)}
      </Panel>
    </section>
  )
}

// Glossary terms the lesson uses, so a newcomer never has to leave the page for a definition.
export function Terms({ terms }) {
  if (!terms.length) return null
  return (
    <Panel as="details" padding="px-4 py-3" className="my-6 text-sm">
      <summary className="cursor-pointer font-medium">Words on this page ({terms.length})</summary>
      <dl className="mt-3 space-y-2">{terms.map(t => <div key={t.term}><dt className="inline font-semibold">{t.term}</dt><dd className="inline text-fd-muted-foreground">: {t.def}</dd></div>)}</dl>
    </Panel>
  )
}

export function SourceNote({ source }) {
  if (!source) return null
  return <Callout title="Imported lesson">From the <a href={source.url}>{source.name}</a>, {source.license} licensed. Shown here as part of the learning path with progress tracking.</Callout>
}

// A short real-world scenario that shows what the chapter or lesson means in practice.
export function Story({ text, label = 'Picture this' }) {
  if (!text) return null
  return (
    <aside className="my-6 rounded-xl border-l-4 border-fd-primary bg-fd-primary/5 px-4 py-3 text-sm leading-relaxed">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-fd-primary">{label}</p>
      {text}
    </aside>
  )
}
