import { useEffect, useState } from 'react'
import { loadTopic, setStatus, useProgress } from './lib.js'
import { LevelBadge, StatusButton } from './ui.jsx'
import ProblemList from './ProblemList.jsx'
import Code from './Code.jsx'
import Md from './Md.jsx'
import { PatternSteps } from './Patterns.jsx'
import SortVisualizer from './SortVisualizer.jsx'
import { SORTS } from './sortFrames.js'


// Highlights the section heading currently in view.
const useActiveSection = count => {
  const [active, setActive] = useState(0)
  useEffect(() => {
    const els = [...Array(count).keys()].map(k => document.getElementById(`sec-${k}`)).filter(Boolean)
    const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && setActive(+e.target.id.slice(4))), { rootMargin: '-10% 0px -75% 0px' })
    els.forEach(e => io.observe(e))
    return () => io.disconnect()
  }, [count])
  return active
}

export default function Topic({ id, index, byId }) {
  const [t, setT] = useState(null)
  const [tab, setTab] = useState('Learn')
  const [file, setFile] = useState(0)
  const progress = useProgress()
  useEffect(() => { loadTopic(id).then(setT) }, [id])
  const active = useActiveSection(t && tab === 'Learn' ? t.sections.length : 0)
  const meta = byId[id]
  if (!meta) return <p>Unknown topic.</p>
  if (!t) return <p className="text-stone-500">Loading…</p>
  const order = index.chapters.flatMap(c => c.topics)
  const i = order.findIndex(x => x.id === id)
  const prev = order[i - 1], next = order[i + 1]
  const files = t.code
  const patterns = index.patterns.filter(p => meta.patterns.includes(p.id))
  const tabs = ['Learn', ...(t.code.length ? ['Code'] : []), ...(patterns.length ? ['Practice'] : [])]
  const sortId = id.split('/').at(-1)
  const demo = SORTS[sortId] ? <SortVisualizer algo={sortId} />
    : patterns[0] && t.kind !== 'Fundamentals' && <div className="my-6 rounded-xl border border-stone-200 p-4 dark:border-white/10"><p className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-500">Step through it: <a href={`#/patterns/${patterns[0].id}`} className="normal-case tracking-normal text-indigo-600 hover:underline dark:text-indigo-300">{patterns[0].name} pattern</a></p><PatternSteps p={patterns[0]} /></div>
  const finish = () => { setStatus(id, 'done'); if (next) location.hash = `#/topic/${next.id}` }
  return (
    <div className="flex gap-10">
      <article className="min-w-0 max-w-3xl flex-1">
        <p className="text-sm text-stone-500">{meta.chapter} · {t.kind}</p>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-4xl font-extrabold tracking-tight">{t.title}</h1>
          <StatusButton id={id} />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <LevelBadge level={meta.level} />
          {patterns.map(p => <a key={p.id} href={`#/patterns/${p.id}`} className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-medium text-indigo-700 hover:bg-indigo-500/20 dark:text-indigo-300">{p.name}</a>)}
        </div>
        {t.complexity && <div className="cx mt-5 flex flex-wrap items-baseline gap-x-5 gap-y-1 rounded-2xl border border-stone-200 px-4 py-3 dark:border-white/10"><Md>{t.complexity}</Md></div>}

        <div className="mt-8 flex gap-1 rounded-xl bg-stone-200/60 p-1 dark:bg-white/5">
          {tabs.map(x => (
            <button key={x} onClick={() => { setTab(x); setFile(0) }} className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${tab === x ? 'bg-white shadow dark:bg-white/15' : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'}`}>{x}</button>
          ))}
        </div>

        <div className="mt-8">
          {tab === 'Learn' ? (
            <div className="space-y-10">
              {t.sections.map((s, k) => (
                <section key={k} id={`sec-${k}`} className="scroll-mt-6">
                  {s.title !== 'Overview' && <h2 className="mb-3 text-2xl font-bold tracking-tight">{s.title}</h2>}
                  <Md>{s.body}</Md>
                  {k === 0 && demo}
                </section>
              ))}
              {t.references && <details className="rounded-xl border border-stone-200 p-4 dark:border-white/10"><summary className="cursor-pointer text-sm font-medium text-stone-500">References</summary><Md>{t.references}</Md></details>}
            </div>
          ) : tab === 'Practice' ? (
            <div className="space-y-8">{patterns.map(p => <div key={p.id}><h2 className="mb-2 text-xl font-bold"><a href={`#/patterns/${p.id}`}>{p.name}</a></h2><ProblemList problems={p.problems} /></div>)}</div>
          ) : (
            <div className="space-y-3">
              {files.length > 1 && <div className="flex flex-wrap gap-2 text-sm">{files.map((f, k) => <button key={f.name} onClick={() => setFile(k)} className={`rounded-full px-3 py-1 font-mono text-xs ${k === file ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900' : 'bg-stone-200 dark:bg-white/10'}`}>{f.name}</button>)}</div>}
              <Code code={files[file].code} name={files[file].name} />
              {t.github && <a className="inline-block text-sm text-indigo-600 hover:underline dark:text-indigo-300" href={t.github} target="_blank" rel="noreferrer">View on GitHub ↗</a>}
            </div>
          )}
        </div>

        <div className="mt-12 rounded-2xl border border-stone-200 p-5 dark:border-white/10">
          {progress[id] !== 'done' && <button onClick={finish} className="mb-4 w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-500">Mark done{next ? ` and go to ${next.title}` : ''} →</button>}
          <div className="flex justify-between gap-4 text-sm">
            {prev ? <a href={`#/topic/${prev.id}`} className="hover:underline">← {prev.title}</a> : <span />}
            {next && <a href={`#/topic/${next.id}`} className="text-right hover:underline">{next.title} →</a>}
          </div>
        </div>
      </article>

      {tab === 'Learn' && t.sections.length > 1 && (
        <aside className="sticky top-8 hidden h-fit w-56 shrink-0 xl:block">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-stone-400">On this page</p>
          <ul className="space-y-0.5 border-l border-stone-200 text-sm dark:border-white/10">
            {t.sections.map((s, k) => (
              <li key={k}><a href={`#sec-${k}`} onClick={e => { e.preventDefault(); document.getElementById(`sec-${k}`)?.scrollIntoView({ behavior: 'smooth' }) }} className={`-ml-px block border-l-2 py-1 pl-3 ${active === k ? 'border-indigo-500 font-medium text-indigo-700 dark:text-indigo-300' : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'}`}>{s.title}</a></li>
            ))}
          </ul>
        </aside>
      )}
    </div>
  )
}
