'use client'
import { useProgress } from './progress.jsx'
import PageContainer from './PageContainer.jsx'
import ProgressCard from './ProgressCard.jsx'
import SectionHeading from './SectionHeading.jsx'
import { NumberBadge } from './ui.jsx'

// " · 1.6 h" for tracks whose topics carry minutes, nothing otherwise.
const length = topics => {
  const m = topics.reduce((n, t) => n + (t.minutes ?? 0), 0)
  return m ? ` · ${m >= 90 ? `${(m / 60).toFixed(1)} h` : `${m} min`}` : ''
}

// Track home: hero with resume link, then chapters per tier. `eyebrow` is the line above the title ({n} = topic count), `links` the secondary buttons, `children` extra sections under the chapters.
/** @param {{ tiers: any[], chapters: any[], eyebrow: string, title: string, links: { href: string, label: string }[], children?: import('react').ReactNode }} props */
export default function Dashboard({ tiers, chapters, eyebrow, title, links, children }) {
  const progress = useProgress()
  const all = chapters.flatMap(c => c.topics)
  const done = all.filter(t => progress[t.id] === 'done').length
  const learning = all.filter(t => progress[t.id] === 'learning')
  const next = learning[0] ?? all.find(t => progress[t.id] !== 'done')
  return (
    <PageContainer width="wide" className="space-y-10">
      <header className="relative overflow-hidden rounded-3xl bg-fd-foreground p-8 text-fd-background shadow-xl sm:p-10">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(color-mix(in_oklab,var(--color-fd-background)_18%,transparent)_1px,transparent_1px)] [background-size:20px_20px] [mask-image:linear-gradient(to_bottom_left,black,transparent_70%)]" />
        <p className="relative text-sm font-medium uppercase tracking-widest opacity-70">{eyebrow.replace('{n}', all.length)}</p>
        <SectionHeading level={1} className="relative mt-3 max-w-2xl leading-tight sm:!text-5xl">{title}</SectionHeading>
        <div className="relative mt-8 flex flex-wrap items-center gap-3">
          {next && <a href={next.url} className="rounded-full bg-fd-background px-5 py-2.5 text-sm font-semibold text-fd-foreground shadow transition hover:scale-[1.03] motion-reduce:transition-none">{learning.length ? 'Resume' : done ? 'Continue' : 'Start'}: {next.title} →</a>}
          {links.map(l => <a key={l.href} href={l.href} className="rounded-full border border-fd-background/30 px-5 py-2.5 text-sm font-semibold transition hover:bg-fd-background/15">{l.label}</a>)}
        </div>
        <div className="relative mt-8 flex max-w-md items-center gap-3 text-sm">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-fd-background/20"><div className="h-full rounded-full bg-fd-background transition-all" style={{ width: `${(done / all.length) * 100}%` }} /></div>
          <span className="tabular-nums">{done}/{all.length} done · {learning.length} in progress</span>
        </div>
      </header>

      {tiers.map(tier => (
        <section key={tier.id}>
          <div className="mb-5 border-b pb-4">
            <SectionHeading level={2}>{tier.id}. {tier.title}</SectionHeading>
            <p className="mt-1 max-w-3xl text-sm text-fd-muted-foreground">{tier.blurb}</p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {chapters.filter(c => c.tier === tier.id).map(c => {
              const d = c.topics.filter(t => progress[t.id] === 'done').length
              return (
                <ProgressCard key={c.id} href={c.topics[0].url} className="!p-5" title={<span className="flex items-center gap-3"><NumberBadge n={chapters.indexOf(c) + 1} />{c.title}</span>} description={c.blurb} value={d / c.topics.length} caption={`${d}/${c.topics.length} lessons done${length(c.topics)}`} />
              )
            })}
          </div>
        </section>
      ))}
      {children}
    </PageContainer>
  )
}
