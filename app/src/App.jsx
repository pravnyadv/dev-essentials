import { useEffect, useMemo, useState } from 'react'
import { loadIndex, useHash, useProgress } from './lib.js'
import { LevelDot } from './ui.jsx'
import Topic from './Topic.jsx'
import Patterns from './Patterns.jsx'

const Ring = ({ done, total }) => <span className="text-xs tabular-nums text-stone-500">{done}/{total}</span>

function Sidebar({ index, route, q, setQ }) {
  const progress = useProgress()
  const [open, setOpen] = useState({})
  const activeId = route.startsWith('/topic/') ? route.slice(7) : null
  const query = q.trim().toLowerCase()
  return (
    <nav className="space-y-1 p-3 text-sm">
      <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search topics…" className="mb-2 w-full rounded-lg border border-stone-300 bg-transparent px-3 py-1.5 dark:border-stone-700" />
      <a href="#/" className="block rounded px-2 py-1.5 hover:bg-stone-200/60 dark:hover:bg-stone-800">Dashboard</a>
      <a href="#/patterns" className="block rounded px-2 py-1.5 hover:bg-stone-200/60 dark:hover:bg-stone-800">Problem patterns</a>
      <div className="my-2 border-t border-stone-200 dark:border-stone-800" />
      {index.chapters.map((c, i) => {
        const shown = c.topics.filter(t => !query || t.title.toLowerCase().includes(query))
        if (!shown.length) return null
        const done = c.topics.filter(t => progress[t.id] === 'done').length
        const isOpen = query || open[c.id] || c.topics.some(t => t.id === activeId)
        return (
          <div key={c.id}>
            <button onClick={() => setOpen({ ...open, [c.id]: !open[c.id] })} className="flex w-full items-center justify-between rounded px-2 py-1.5 text-left font-medium hover:bg-stone-200/60 dark:hover:bg-stone-800">
              <span>{i + 1}. {c.title}</span><Ring done={done} total={c.topics.length} />
            </button>
            {isOpen && shown.map(t => (
              <a key={t.id} href={`#/topic/${t.id}`} className={`flex items-center gap-2 rounded py-1 pl-6 pr-2 hover:bg-stone-200/60 dark:hover:bg-stone-800 ${t.id === activeId ? 'bg-stone-200 dark:bg-stone-800' : ''}`}>
                <span className={`size-3 shrink-0 rounded-full border ${progress[t.id] === 'done' ? 'border-emerald-500 bg-emerald-500' : progress[t.id] === 'learning' ? 'border-amber-500 bg-amber-500/40' : 'border-stone-400'}`} />
                <span className="truncate">{t.title}</span>
              </a>
            ))}
          </div>
        )
      })}
    </nav>
  )
}

function Dashboard({ index }) {
  const progress = useProgress()
  const all = index.chapters.flatMap(c => c.topics)
  const done = all.filter(t => progress[t.id] === 'done').length
  const next = all.find(t => progress[t.id] !== 'done')
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Data Structures &amp; Algorithms in JavaScript</h1>
        <p className="mt-2 max-w-2xl text-stone-600 dark:text-stone-400">{all.length} topics from <a className="underline" href="https://github.com/trekhleb/javascript-algorithms">trekhleb/javascript-algorithms</a>, ordered as a learning path, with the problem patterns that tell you which one to reach for.</p>
        <div className="mt-4 flex items-center gap-4">
          <div className="h-2 w-64 overflow-hidden rounded-full bg-stone-200 dark:bg-stone-800"><div className="h-full bg-emerald-500" style={{ width: `${(done / all.length) * 100}%` }} /></div>
          <span className="text-sm text-stone-500">{done} of {all.length} done</span>
          {next && <a href={`#/topic/${next.id}`} className="rounded-full bg-stone-900 px-4 py-1.5 text-sm text-white dark:bg-stone-100 dark:text-stone-900">{done ? 'Continue' : 'Start'}: {next.title}</a>}
        </div>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {index.chapters.map((c, i) => {
          const d = c.topics.filter(t => progress[t.id] === 'done').length
          return (
            <section key={c.id} className="rounded-xl border border-stone-200 p-4 dark:border-stone-800">
              <h2 className="font-semibold">{i + 1}. {c.title} <Ring done={d} total={c.topics.length} /></h2>
              <p className="mb-2 text-sm text-stone-500">{c.blurb}</p>
              <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-stone-200 dark:bg-stone-800"><div className="h-full bg-emerald-500" style={{ width: `${(d / c.topics.length) * 100}%` }} /></div>
              <ul className="space-y-0.5 text-sm">
                {c.topics.slice(0, 6).map(t => <li key={t.id}><a href={`#/topic/${t.id}`} className="hover:underline"><LevelDot level={t.level} /> {t.title}</a></li>)}
                {c.topics.length > 6 && <li className="text-stone-500">+ {c.topics.length - 6} more</li>}
              </ul>
            </section>
          )
        })}
      </div>
    </div>
  )
}

export default function App() {
  const route = useHash()
  const [index, setIndex] = useState(null)
  const [q, setQ] = useState('')
  const [menu, setMenu] = useState(false)
  useEffect(() => { loadIndex().then(setIndex) }, [])
  useEffect(() => setMenu(false), [route])
  const byId = useMemo(() => Object.fromEntries((index?.chapters ?? []).flatMap(c => c.topics.map(t => [t.id, { ...t, chapter: c.title }]))), [index])
  if (!index) return <p className="p-8">Loading…</p>
  const page = route.startsWith('/topic/') ? <Topic key={route} id={route.slice(7)} index={index} byId={byId} />
    : route.startsWith('/patterns') ? <Patterns patterns={index.patterns} byId={byId} activeId={route.split('/')[2]} />
    : <Dashboard index={index} />
  return (
    <div className="mx-auto flex max-w-[1500px]">
      <button onClick={() => setMenu(!menu)} className="fixed right-3 top-3 z-20 rounded-lg border bg-stone-50 px-3 py-1 text-sm lg:hidden dark:border-stone-700 dark:bg-stone-900">Menu</button>
      <aside className={`${menu ? 'block' : 'hidden'} fixed inset-y-0 left-0 z-10 w-72 overflow-y-auto border-r border-stone-200 bg-stone-50 lg:sticky lg:top-0 lg:block lg:h-screen lg:shrink-0 dark:border-stone-800 dark:bg-stone-950`}>
        <Sidebar index={index} route={route} q={q} setQ={setQ} />
      </aside>
      <main className="min-w-0 flex-1 px-5 py-8 lg:px-10">{page}</main>
    </div>
  )
}
