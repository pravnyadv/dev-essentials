'use client'
import { Card, Cards } from 'fumadocs-ui/components/card'
import { useProgress } from './progress.jsx'
import SectionHeading from './SectionHeading.jsx'
import { Bar, Pill } from './ui.jsx'

// Landing page: pick a track and see how far you are in each.
export default function TrackPicker({ tracks }) {
  const progress = useProgress()
  return (
    <main id="nd-page" className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center gap-8 px-4 py-12">
      <header className="text-center">
        <SectionHeading level={1} className="sm:!text-5xl">What do you want to learn?</SectionHeading>
        <p className="mx-auto mt-3 max-w-xl text-fd-muted-foreground">Visual lessons with worked examples, quizzes and progress tracking. Pick a track. Your progress is saved in this browser.</p>
      </header>
      <Cards className="grid-cols-1 sm:grid-cols-2">
        {tracks.map(t => {
          const done = t.ids.filter(id => progress[id] === 'done').length
          return (
            <Card key={t.href} href={t.href} title={<span className="text-xl font-bold">{t.title}</span>} description={t.blurb} className="p-6">
              <div className="mt-4 flex flex-wrap gap-1.5">{t.tags.map(x => <Pill key={x}>{x}</Pill>)}</div>
              <div className="mt-5"><Bar value={done / t.ids.length} /></div>
              <p className="mt-2 text-xs tabular-nums">{done}/{t.ids.length} done</p>
            </Card>
          )
        })}
      </Cards>
    </main>
  )
}
