import { useEffect, useState } from 'react'
import { loadTopic } from './lib.js'
import { LevelDot, LEVELS, StatusButton } from './ui.jsx'
import Code from './Code.jsx'
import Md from './Md.jsx'

const TABS = ['Learn', 'Code', 'Tests']

export default function Topic({ id, index, byId }) {
  const [t, setT] = useState(null)
  const [tab, setTab] = useState('Learn')
  const [file, setFile] = useState(0)
  useEffect(() => { loadTopic(id).then(setT) }, [id])
  const meta = byId[id]
  if (!meta) return <p>Unknown topic.</p>
  if (!t) return <p>Loading…</p>
  const order = index.chapters.flatMap(c => c.topics)
  const i = order.findIndex(x => x.id === id)
  const prev = order[i - 1], next = order[i + 1]
  const files = tab === 'Code' ? t.code : t.tests
  const patterns = index.patterns.filter(p => meta.patterns.includes(p.id))
  return (
    <article className="max-w-4xl">
      <p className="text-sm text-stone-500">{meta.chapter} · {t.kind} · <LevelDot level={meta.level} /> {LEVELS[meta.level][0]}</p>
      <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">{t.title}</h1><StatusButton id={id} />
      </div>
      {patterns.length > 0 && <p className="mt-2 text-sm">Pattern: {patterns.map(p => <a key={p.id} href={`#/patterns/${p.id}`} className="mr-2 rounded-full bg-indigo-500/15 px-2 py-0.5 text-indigo-700 dark:text-indigo-300">{p.name}</a>)}</p>}
      {t.complexity && <div className="mt-4 rounded-xl border border-stone-200 p-3 dark:border-stone-800"><Md>{t.complexity}</Md></div>}
      <div className="mt-6 flex gap-1 border-b border-stone-200 dark:border-stone-800">
        {TABS.filter(x => x === 'Learn' || (x === 'Code' ? t.code : t.tests).length).map(x => (
          <button key={x} onClick={() => { setTab(x); setFile(0) }} className={`-mb-px border-b-2 px-4 py-2 text-sm ${tab === x ? 'border-stone-900 font-medium dark:border-stone-100' : 'border-transparent text-stone-500'}`}>{x}</button>
        ))}
      </div>
      <div className="mt-6">
        {tab === 'Learn' ? (
          <div className="space-y-8">
            <nav className="flex flex-wrap gap-2 text-sm">{t.sections.map((s, k) => <a key={k} href={`#sec-${k}`} onClick={e => { e.preventDefault(); document.getElementById(`sec-${k}`)?.scrollIntoView({ behavior: 'smooth' }) }} className="rounded-full bg-stone-200 px-3 py-0.5 dark:bg-stone-800">{s.title}</a>)}</nav>
            {t.sections.map((s, k) => (
              <section key={k} id={`sec-${k}`} className="scroll-mt-4">
                {s.title !== 'Overview' && <h2 className="mb-2 text-xl font-semibold">{s.title}</h2>}
                <Md>{s.body}</Md>
              </section>
            ))}
            {t.references && <details><summary className="cursor-pointer text-sm text-stone-500">References</summary><Md>{t.references}</Md></details>}
          </div>
        ) : (
          <div className="space-y-3">
            {files.length > 1 && <div className="flex flex-wrap gap-2 text-sm">{files.map((f, k) => <button key={f.name} onClick={() => setFile(k)} className={`rounded-full px-3 py-0.5 ${k === file ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900' : 'bg-stone-200 dark:bg-stone-800'}`}>{f.name}</button>)}</div>}
            <Code code={files[file].code} name={files[file].name} />
            <a className="text-sm underline" href={t.github} target="_blank" rel="noreferrer">View on GitHub</a>
          </div>
        )}
      </div>
      <div className="mt-12 flex justify-between border-t border-stone-200 pt-4 text-sm dark:border-stone-800">
        {prev ? <a href={`#/topic/${prev.id}`}>← {prev.title}</a> : <span />}
        {next && <a href={`#/topic/${next.id}`}>{next.title} →</a>}
      </div>
    </article>
  )
}
