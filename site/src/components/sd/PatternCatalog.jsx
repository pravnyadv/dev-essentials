'use client'
import { useState } from 'react'
import Chip from '../shared/Chip.jsx'
import PageContainer from '../shared/PageContainer.jsx'
import SectionHeading from '../shared/SectionHeading.jsx'
import { ListRow, RowList } from '../shared/RowList.jsx'
import { SearchBox } from '../shared/Reference.jsx'

const KINDS = { pattern: 'Patterns', antipattern: 'Antipatterns' }

// Every named pattern and antipattern with the problem it answers (the first field of its lesson card), grouped by chapter.
export default function PatternCatalog({ patterns, chapters }) {
  const [kind, setKind] = useState(null)
  const [q, setQ] = useState('')
  const needle = q.trim().toLowerCase()
  const shown = patterns.filter(p => (!kind || p.kind === kind) && (!needle || `${p.name} ${p.text}`.toLowerCase().includes(needle)))
  const count = k => patterns.filter(p => p.kind === k).length
  return (
    <PageContainer className="space-y-5">
      <header>
        <SectionHeading level={1}>Pattern catalog</SectionHeading>
        <p className="mt-2 max-w-3xl text-fd-muted-foreground">
          The {count('pattern')} patterns of the cloud design catalog and {count('antipattern')} performance antipatterns, each with the problem it answers and the lesson that teaches it. Search by a symptom you see, such as "slow", "duplicate" or "overload", to find the names that fit.
        </p>
      </header>
      <SearchBox value={q} onChange={setQ} placeholder="Search a pattern or a problem" label="Search patterns" className="max-w-md" />
      <div className="flex flex-wrap gap-2">
        <Chip on={!kind} onClick={() => setKind(null)}>All {patterns.length}</Chip>
        {Object.entries(KINDS).map(([k, label]) => <Chip key={k} on={kind === k} onClick={() => setKind(k)}>{label} {count(k)}</Chip>)}
      </div>
      {!shown.length && <p className="text-fd-muted-foreground">Nothing matches "{q}".</p>}
      {chapters.filter(c => shown.some(p => p.chapter === c)).map(c => (
        <section key={c} className="space-y-3">
          <SectionHeading level={2}>{c}</SectionHeading>
          <RowList>
            {shown.filter(p => p.chapter === c).sort((a, b) => a.name.localeCompare(b.name)).map(p => (
              <ListRow key={p.name} href={p.url}>
                <span className="font-semibold">{p.name}</span>
                {p.kind === 'antipattern' && <span className="ml-2 text-xs text-danger">antipattern</span>}
                <span className="mt-0.5 block text-fd-muted-foreground">{p.text}</span>
                <span className="mt-1 block text-xs text-fd-muted-foreground">Taught in {p.lesson}</span>
              </ListRow>
            ))}
          </RowList>
        </section>
      ))}
    </PageContainer>
  )
}
