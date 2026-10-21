'use client'
import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import Chip from './Chip.jsx'
import PageContainer from './PageContainer.jsx'
import Panel from './Panel.jsx'
import { buttonClass } from './ui.jsx'
import SectionHeading from './SectionHeading.jsx'
import { RowList } from './RowList.jsx'
import { ResourceRow } from './LessonParts.jsx'

// Reference pages every authored track has: the resource library and the glossary.

// Search box with a magnifier, shared by the library and the glossary.
export function SearchBox({ value, onChange, placeholder, label, className = '' }) {
  return (
    <label className={`relative block ${className}`}>
      <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fd-muted-foreground" />
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} aria-label={label} className="w-full rounded-lg border bg-fd-card py-2.5 pl-9 pr-3 text-sm shadow-sm max-md:min-h-11" />
    </label>
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
