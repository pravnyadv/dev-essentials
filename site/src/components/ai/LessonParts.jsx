'use client'
import { useState } from 'react'
import { Callout } from 'fumadocs-ui/components/callout'
import { Quiz } from '../dsa/Walkthrough.jsx'
import { Pill } from '../dsa/ui.jsx'

const KIND = { article: 'Article', video: 'Video', course: 'Course', repo: 'Repo', paper: 'Paper', docs: 'Docs', tool: 'Tool', book: 'Book' }
const compact = n => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : n)

export function ResourceRow({ r, showTopics }) {
  return (
    <li className="px-4 py-3 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <Pill tone="primary">{KIND[r.kind]}</Pill>
        <a href={r.url} target={r.url.startsWith('/') ? undefined : '_blank'} rel="noreferrer" className="font-medium hover:underline">{r.title}</a>
        {r.stars && <span className="text-xs text-fd-muted-foreground" title="GitHub stars">★ {compact(r.stars)}</span>}
      </div>
      <p className="mt-1 text-fd-muted-foreground">{r.by && <span>{r.by} · </span>}{r.why}</p>
      {showTopics && <p className="mt-1 text-xs text-fd-muted-foreground">Used in: {r.topics.map((t, i) => <span key={t.url}>{i > 0 && ', '}<a href={t.url} className="text-fd-primary hover:underline">{t.title}</a></span>)}</p>}
    </li>
  )
}

export function Resources({ resources }) {
  return (
    <section className="mt-10">
      <h2 className="mb-3 text-2xl font-bold tracking-tight">Go deeper</h2>
      <ul className="divide-y divide-fd-border rounded-xl border bg-fd-card">{resources.map(r => <ResourceRow key={r.url} r={r} />)}</ul>
    </section>
  )
}

// A few multiple-choice questions, one answer picked per question.
export function CheckYourself({ quiz }) {
  const [picks, setPicks] = useState({})
  if (!quiz.length) return null
  return (
    <section className="mt-10">
      <h2 className="mb-3 text-2xl font-bold tracking-tight">Check yourself</h2>
      <div className="space-y-6 rounded-xl border bg-fd-card p-5">
        {quiz.map((q, i) => <Quiz key={i} quiz={q} picked={picks[i]} onPick={n => setPicks(p => ({ ...p, [i]: n }))} />)}
      </div>
    </section>
  )
}

// Glossary terms the lesson uses, so a newcomer never has to leave the page for a definition.
export function Terms({ terms }) {
  if (!terms.length) return null
  return (
    <details className="my-6 rounded-xl border bg-fd-card px-4 py-3 text-sm">
      <summary className="cursor-pointer font-medium">Words on this page ({terms.length})</summary>
      <dl className="mt-3 space-y-2">{terms.map(t => <div key={t.term}><dt className="inline font-semibold">{t.term}</dt><dd className="inline text-fd-muted-foreground">: {t.def}</dd></div>)}</dl>
    </details>
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
