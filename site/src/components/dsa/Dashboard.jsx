'use client'
import { Card, Cards } from 'fumadocs-ui/components/card'
import { useProgress } from './progress.jsx'
import { Bar, Pill } from './ui.jsx'

export default function Dashboard({ tiers, chapters, patternCount }) {
  const progress = useProgress()
  const all = chapters.flatMap(c => c.topics)
  const done = all.filter(t => progress[t.id] === 'done').length
  const learning = all.filter(t => progress[t.id] === 'learning')
  const next = learning[0] ?? all.find(t => progress[t.id] !== 'done')
  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 px-4 py-8 md:px-8">
      <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-fd-primary to-fd-primary/60 p-8 text-fd-primary-foreground shadow-xl shadow-fd-primary/20 sm:p-10">
        <div className="absolute -right-10 -top-10 size-64 rounded-full bg-white/10 blur-2xl" />
        <p className="text-sm font-medium opacity-70">JavaScript · {all.length} topics · {patternCount} patterns</p>
        <h1 className="mt-2 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">Learn data structures &amp; algorithms, one visual lesson at a time</h1>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          {next && <a href={next.url} className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-fd-primary shadow hover:scale-[1.03]">{learning.length ? 'Resume' : done ? 'Continue' : 'Start'}: {next.title} →</a>}
          <a href="/patterns" className="rounded-full bg-white/15 px-5 py-2.5 text-sm font-semibold backdrop-blur hover:bg-white/25">Browse problem patterns</a>
        </div>
        <div className="mt-8 flex max-w-md items-center gap-3 text-sm">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/20"><div className="h-full rounded-full bg-white transition-all" style={{ width: `${(done / all.length) * 100}%` }} /></div>
          <span className="tabular-nums">{done}/{all.length} done · {learning.length} in progress</span>
        </div>
      </header>

      {tiers.map(tier => (
        <section key={tier.id}>
          <h2 className="text-xl font-bold">{tier.id}. {tier.title}</h2>
          <p className="mb-4 mt-1 text-sm text-fd-muted-foreground">{tier.blurb}</p>
          <Cards className="grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            {chapters.filter(c => c.tier === tier.id).map((c, i) => {
              const d = c.topics.filter(t => progress[t.id] === 'done').length
              return (
                <Card key={c.id} href={c.topics[0].url} title={<span className="text-base font-semibold">{c.title}</span>} description={c.blurb} className="p-5">
                  <div className="mt-4"><Bar value={d / c.topics.length} /></div>
                  <p className="mt-2 text-xs">Chapter {i + 1} · {d}/{c.topics.length} done</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {c.topics.slice(0, 5).map(t => <Pill key={t.id}>{t.title.replace(/ \(.*\)/, '')}</Pill>)}
                    {c.topics.length > 5 && <span className="px-1 text-xs">+{c.topics.length - 5}</span>}
                  </div>
                </Card>
              )
            })}
          </Cards>
        </section>
      ))}
    </div>
  )
}
