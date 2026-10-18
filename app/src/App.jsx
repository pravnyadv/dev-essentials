import { useEffect, useMemo, useRef, useState } from 'react'
import { loadIndex, useHash, useProgress } from './lib.js'
import { Bar } from './ui.jsx'
import Topic from './Topic.jsx'
import Patterns from './Patterns.jsx'

const THEME = 'dsa-theme'
const useTheme = () => {
  const [dark, setDark] = useState(() => { try { return localStorage.getItem(THEME) ? localStorage.getItem(THEME) === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches } catch { return false } })
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    try { localStorage.setItem(THEME, dark ? 'dark' : 'light') } catch { /* private mode */ }
  }, [dark])
  return [dark, () => setDark(!dark)]
}

const navLink = 'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-stone-200/60 dark:hover:bg-white/5'

function Sidebar({ index, route, q, setQ, searchRef }) {
  const progress = useProgress()
  const [open, setOpen] = useState({})
  const activeId = route.startsWith('/topic/') ? route.slice(7) : null
  const query = q.trim().toLowerCase()
  return (
    <nav className="space-y-0.5 p-3 text-sm">
      <div className="relative mb-3">
        <input ref={searchRef} value={q} onChange={e => setQ(e.target.value)} placeholder="Search topics…" className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 pr-8 outline-none focus:ring-2 focus:ring-indigo-500/40 dark:border-white/10 dark:bg-white/5" />
        <kbd className="absolute right-2 top-2.5 rounded border border-stone-300 px-1.5 text-[10px] text-stone-400 dark:border-white/15">/</kbd>
      </div>
      <a href="#/" className={`${navLink} ${route === '/' ? 'bg-stone-200/70 dark:bg-white/10' : ''}`}>Dashboard</a>
      <a href="#/patterns" className={`${navLink} ${route.startsWith('/patterns') ? 'bg-stone-200/70 dark:bg-white/10' : ''}`}>Problem patterns</a>
      {index.tiers.map(tier => (
        <div key={tier.id}>
      <p className="px-3 pb-1 pt-5 text-[11px] font-semibold uppercase tracking-wider text-stone-400">{tier.id}. {tier.title}</p>
      {index.chapters.filter(c => c.tier === tier.id).map(c => {
        const shown = c.topics.filter(t => !query || t.title.toLowerCase().includes(query))
        if (!shown.length) return null
        const done = c.topics.filter(t => progress[t.id] === 'done').length
        const isOpen = query || (open[c.id] ?? c.topics.some(t => t.id === activeId))
        return (
          <div key={c.id}>
            <button onClick={() => setOpen({ ...open, [c.id]: !isOpen })} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left font-medium hover:bg-stone-200/60 dark:hover:bg-white/5">
              <span className="flex-1 truncate">{c.title}</span>
              <span className={`text-xs tabular-nums ${done === c.topics.length ? 'text-indigo-500' : 'text-stone-400'}`}>{done}/{c.topics.length}</span>
            </button>
            {isOpen && <div className="ml-6 border-l border-stone-200 pl-2 dark:border-white/10">{shown.map(t => (
              <a key={t.id} href={`#/topic/${t.id}`} className={`flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-stone-200/60 dark:hover:bg-white/5 ${t.id === activeId ? 'bg-indigo-500/10 font-medium text-indigo-700 dark:text-indigo-300' : 'text-stone-600 dark:text-stone-400'}`}>
                <span className={`grid size-4 shrink-0 place-items-center rounded-full border text-[9px] text-white ${progress[t.id] === 'done' ? 'border-indigo-600 bg-indigo-600' : progress[t.id] === 'learning' ? 'border-indigo-500 bg-indigo-500/30' : 'border-stone-300 dark:border-stone-600'}`}>{progress[t.id] === 'done' && '✓'}</span>
                <span className="truncate">{t.title}</span>
              </a>
            ))}</div>}
          </div>
        )
      })}
        </div>
      ))}
    </nav>
  )
}

function Dashboard({ index }) {
  const progress = useProgress()
  const all = index.chapters.flatMap(c => c.topics)
  const done = all.filter(t => progress[t.id] === 'done').length
  const learning = all.filter(t => progress[t.id] === 'learning')
  const next = learning[0] ?? all.find(t => progress[t.id] !== 'done')
  return (
    <div className="space-y-10">
      <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 to-indigo-500 p-8 text-white shadow-xl shadow-indigo-500/20 sm:p-10">
        <div className="absolute -right-10 -top-10 size-64 rounded-full bg-white/10 blur-2xl" />
        <p className="text-sm font-medium text-white/70">JavaScript · {all.length} topics · {index.patterns.length} patterns</p>
        <h1 className="mt-2 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">Learn data structures &amp; algorithms, one visual lesson at a time</h1>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          {next && <a href={`#/topic/${next.id}`} className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-indigo-700 shadow hover:scale-[1.03]">{learning.length ? 'Resume' : done ? 'Continue' : 'Start'}: {next.title} →</a>}
          <a href="#/patterns" className="rounded-full bg-white/15 px-5 py-2.5 text-sm font-semibold backdrop-blur hover:bg-white/25">Browse problem patterns</a>
        </div>
        <div className="mt-8 flex max-w-md items-center gap-3 text-sm">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/20"><div className="h-full rounded-full bg-white transition-all" style={{ width: `${(done / all.length) * 100}%` }} /></div>
          <span className="tabular-nums">{done}/{all.length} done · {learning.length} in progress</span>
        </div>
      </header>

      {index.tiers.map(tier => (
      <section key={tier.id}>
        <h2 className="text-xl font-bold">{tier.id}. {tier.title}</h2>
        <p className="mb-4 mt-1 text-sm text-stone-500">{tier.blurb}</p>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {index.chapters.filter(c => c.tier === tier.id).map((c, i) => {
            const d = c.topics.filter(t => progress[t.id] === 'done').length
            return (
              <a key={c.id} href={`#/topic/${c.topics[0].id}`} className="group overflow-hidden rounded-2xl border border-stone-200 bg-white transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-white/[0.03]">
                <div className="p-5">
                  <p className="text-xs text-stone-400">Chapter {i + 1}</p>
                  <h3 className="font-semibold leading-tight">{c.title}</h3>
                  <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">{c.blurb}</p>
                  <div className="mt-4"><Bar value={d / c.topics.length} /></div>
                  <p className="mt-2 text-xs text-stone-400">{d}/{c.topics.length} done</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {c.topics.slice(0, 5).map(t => <span key={t.id} className="rounded-full bg-stone-100 px-2 py-0.5 text-xs dark:bg-white/10">{t.title.replace(/ \(.*\)/, '')}</span>)}
                    {c.topics.length > 5 && <span className="px-1 text-xs text-stone-400">+{c.topics.length - 5}</span>}
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      </section>
      ))}
    </div>
  )
}

export default function App() {
  const route = useHash()
  const [dark, toggleTheme] = useTheme()
  const [index, setIndex] = useState(null)
  const [q, setQ] = useState('')
  const [menu, setMenu] = useState(false)
  const searchRef = useRef()
  useEffect(() => { loadIndex().then(setIndex) }, [])
  useEffect(() => setMenu(false), [route])
  useEffect(() => {
    const f = e => { if (e.key === '/' && !/input|textarea/i.test(e.target.tagName)) { e.preventDefault(); setMenu(true); searchRef.current?.focus() } }
    addEventListener('keydown', f)
    return () => removeEventListener('keydown', f)
  }, [])
  const byId = useMemo(() => Object.fromEntries((index?.chapters ?? []).flatMap(c => c.topics.map(t => [t.id, { ...t, chapter: c.title, chapterId: c.id }]))), [index])
  if (!index) return <p className="p-8 text-stone-500">Loading…</p>
  const page = route.startsWith('/topic/') ? <Topic key={route} id={route.slice(7)} index={index} byId={byId} />
    : route.startsWith('/patterns') ? <Patterns patterns={index.patterns} groups={index.groups} byId={byId} activeId={route.split('/')[2]} />
    : <Dashboard index={index} />
  return (
    <div className="mx-auto flex max-w-[1600px]">
      <div className="fixed right-3 top-3 z-20 flex gap-2">
        <button onClick={toggleTheme} aria-label="Toggle theme" className="rounded-full border border-stone-200 bg-white/80 px-3 py-1.5 text-sm backdrop-blur dark:border-white/10 dark:bg-white/10">{dark ? 'Light' : 'Dark'}</button>
        <button onClick={() => setMenu(!menu)} className="rounded-full border border-stone-200 bg-white/80 px-3 py-1.5 text-sm backdrop-blur lg:hidden dark:border-white/10 dark:bg-white/10">Menu</button>
      </div>
      <aside className={`${menu ? 'block' : 'hidden'} fixed inset-y-0 left-0 z-10 w-72 overflow-y-auto border-r border-stone-200 bg-stone-50 lg:sticky lg:top-0 lg:block lg:h-screen lg:shrink-0 dark:border-white/10 dark:bg-[#0b0d12]`}>
        <Sidebar index={index} route={route} q={q} setQ={setQ} searchRef={searchRef} />
      </aside>
      <main className="min-w-0 flex-1 px-5 py-8 lg:px-10">{page}</main>
    </div>
  )
}
