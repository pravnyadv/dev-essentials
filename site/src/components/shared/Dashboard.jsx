'use client'
import { Cards } from 'fumadocs-ui/components/card'
import { useProgress } from './progress.jsx'
import PageContainer from './PageContainer.jsx'
import ProgressCard from './ProgressCard.jsx'
import SectionHeading from './SectionHeading.jsx'
import { Pill } from './ui.jsx'

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
      <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-fd-primary to-fd-primary/60 p-8 text-fd-primary-foreground shadow-xl shadow-fd-primary/20 sm:p-10">
        <div className="absolute -right-10 -top-10 size-64 rounded-full bg-white/10 blur-2xl" />
        <p className="text-sm font-medium opacity-70">{eyebrow.replace('{n}', all.length)}</p>
        <SectionHeading level={1} className="mt-2 max-w-2xl leading-tight">{title}</SectionHeading>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          {next && <a href={next.url} className="rounded-full bg-fd-background px-5 py-2.5 text-sm font-semibold text-fd-foreground shadow hover:scale-[1.03]">{learning.length ? 'Resume' : done ? 'Continue' : 'Start'}: {next.title} →</a>}
          {links.map(l => <a key={l.href} href={l.href} className="rounded-full bg-white/15 px-5 py-2.5 text-sm font-semibold backdrop-blur hover:bg-white/25">{l.label}</a>)}
        </div>
        <div className="mt-8 flex max-w-md items-center gap-3 text-sm">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/20"><div className="h-full rounded-full bg-white transition-all" style={{ width: `${(done / all.length) * 100}%` }} /></div>
          <span className="tabular-nums">{done}/{all.length} done · {learning.length} in progress</span>
        </div>
      </header>

      {tiers.map(tier => (
        <section key={tier.id}>
          <SectionHeading level={2}>{tier.id}. {tier.title}</SectionHeading>
          <p className="mb-4 mt-1 text-sm text-fd-muted-foreground">{tier.blurb}</p>
          <Cards className="grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            {chapters.filter(c => c.tier === tier.id).map(c => {
              const d = c.topics.filter(t => progress[t.id] === 'done').length
              return (
                <ProgressCard key={c.id} href={c.topics[0].url} title={<span className="text-base font-semibold">{c.title}</span>} description={c.blurb} className="p-5" value={d / c.topics.length} caption={`Chapter ${chapters.indexOf(c) + 1} · ${d}/${c.topics.length} done`}>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {c.topics.slice(0, 5).map(t => <Pill key={t.id}>{t.title.replace(/ \(.*\)/, '')}</Pill>)}
                    {c.topics.length > 5 && <span className="px-1 text-xs">+{c.topics.length - 5}</span>}
                  </div>
                </ProgressCard>
              )
            })}
          </Cards>
        </section>
      ))}
      {children}
    </PageContainer>
  )
}
