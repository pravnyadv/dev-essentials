'use client'
import { useState } from 'react'
import { Callout } from 'fumadocs-ui/components/callout'
import Panel from './Panel.jsx'
import { ListRow, RowList } from './RowList.jsx'
import SectionHeading from './SectionHeading.jsx'
import Quiz from './Quiz.jsx'
import { buttonClass, Pill } from './ui.jsx'

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
        {showTopics && <p className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-fd-muted-foreground">Used in {r.topics.map(t => <Pill key={t.url} href={t.url} className="max-md:inline-flex max-md:min-h-11 max-md:items-center">{t.title}</Pill>)}</p>}
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

// The lesson quiz, one question at a time: answer, read why beside Next, then move on; after the last one, the score.
// The first answer to a question counts and stays until Try again.
export function CheckYourself({ quiz }) {
  const [picks, setPicks] = useState({})
  const [at, setAt] = useState(0)
  if (!quiz.length) return null
  const done = at === quiz.length
  const score = quiz.filter((q, i) => picks[i] === q.answer).length
  const picked = picks[at], right = !done && picked === quiz[at].answer
  const tone = i => (picks[i] === undefined ? (i === at ? 'bg-fd-primary/40' : 'bg-fd-border') : picks[i] === quiz[i].answer ? 'bg-success' : 'bg-danger')
  return (
    <section className="mt-10">
      <SectionHeading lesson className="mb-3">Check yourself</SectionHeading>
      <Panel>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex flex-1 gap-1.5" aria-hidden>{quiz.map((_, i) => <span key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${tone(i)}`} />)}</div>
          <span className="shrink-0 text-sm tabular-nums text-fd-muted-foreground">{done ? `${score} of ${quiz.length} right` : `${at + 1} of ${quiz.length}`}</span>
        </div>
        {done ? (
          <div>
            <p className="text-2xl font-bold tabular-nums">{score} of {quiz.length}</p>
            <p className="mt-1 text-sm text-fd-muted-foreground">{score === quiz.length ? 'All right. On to the next lesson.' : 'Open a missed question to see why, or try again.'}</p>
            <ol className="mt-3 space-y-1 text-sm">
              {quiz.map((q, i) => (
                <li key={i}>
                  <button type="button" onClick={() => setAt(i)} className="flex w-full items-start gap-2 rounded-md py-1 text-left hover:underline max-md:min-h-11">
                    <span className={`w-14 shrink-0 font-semibold ${picks[i] === q.answer ? 'text-success' : 'text-danger'}`}>{picks[i] === q.answer ? 'Right' : 'Missed'}</span>
                    <span>{q.q}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <Quiz key={at} quiz={quiz[at]} picked={picked} showWhy={false} onPick={n => picked === undefined && setPicks(p => ({ ...p, [at]: n }))} />
        )}
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3 border-t pt-4 sm:flex-nowrap">
          <p aria-live="polite" className={`min-w-0 flex-1 basis-full text-sm leading-snug empty:hidden sm:basis-auto sm:empty:block ${right ? 'text-success' : 'text-danger'}`}>
            {!done && picked !== undefined && <>{right ? 'Right. ' : 'Not quite. '}{quiz[at].why}</>}
          </p>
          <div className="ml-auto flex shrink-0 gap-2">
            {at > 0 && <button type="button" onClick={() => setAt(at - 1)} className={buttonClass('outline', 'sm', 'rounded-full px-4')}>Back</button>}
            {done
              ? <button type="button" onClick={() => { setPicks({}); setAt(0) }} className={buttonClass('primary', 'sm', 'rounded-full px-4')}>Try again</button>
              : <button type="button" onClick={() => setAt(at + 1)} disabled={picked === undefined} className={buttonClass('primary', 'sm', 'rounded-full px-4')}>{at === quiz.length - 1 ? 'See score' : 'Next'}</button>}
          </div>
        </div>
      </Panel>
    </section>
  )
}

// Glossary terms the lesson uses, so a newcomer never has to leave the page for a definition.
export function Terms({ terms }) {
  if (!terms.length) return null
  return (
    <Panel as="details" padding="px-4 py-1 md:py-3" className="my-6 text-sm">
      <summary className="cursor-pointer font-medium max-md:flex max-md:min-h-11 max-md:items-center">Words on this page ({terms.length})</summary>
      <dl className="mt-3 space-y-2">{terms.map(t => <div key={t.term}><dt className="inline font-semibold">{t.term}</dt><dd className="inline text-fd-muted-foreground">: {t.def}</dd></div>)}</dl>
    </Panel>
  )
}

export function SourceNote({ source }) {
  if (!source) return null
  return <Callout title="Imported lesson">From the <a href={source.url}>{source.name}</a>, {source.license} licensed. Shown here as part of the learning path with progress tracking.</Callout>
}

// Credit for a lesson that adapts openly licensed text. CC BY asks for the source, the license and a note that it was changed.
export function AdaptedNote({ adapted }) {
  if (!adapted?.length) return null
  const sources = adapted.map((a, i) => <span key={a.url}>{i ? ' and ' : ''}<a href={a.url} className="underline underline-offset-2">{a.name}</a> ({a.license})</span>)
  return <p className="mt-10 text-sm text-fd-muted-foreground">Parts of this lesson are adapted from {sources}, rewritten and extended for this course.</p>
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
