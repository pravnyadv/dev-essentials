'use client'
import { useProgress } from './progress.jsx'
import LinkCard from './LinkCard.jsx'
import SectionHeading from './SectionHeading.jsx'
import GithubIcon from './GithubIcon.jsx'
import { Bar } from './ui.jsx'

const line = 'fill-none stroke-current'

// A small drawing per track, in currentColor: an array with a pointer for DSA, a layered network for AI.
const ArrayArt = () => (
  <svg viewBox="0 0 240 100" className="h-full w-full" aria-hidden>
    {[0, 1, 2, 3, 4].map(i => <rect key={i} x={22 + i * 40} y="40" width="34" height="34" rx="7" strokeWidth="1.5" className={i === 3 ? 'fill-current' : `${line} opacity-40`} />)}
    <path d="M39 32 C 39 6, 139 6, 139 32" className={line} strokeWidth="1.5" strokeDasharray="3 4" />
    <path d="M134 27 l5 6 l5 -6" className={line} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const LAYERS = [[28, 50, 72], [20, 40, 60, 80], [36, 64]]
const NetworkArt = () => (
  <svg viewBox="0 0 240 100" className="h-full w-full" aria-hidden>
    {LAYERS.slice(1).map((ys, l) => LAYERS[l].flatMap((y1, a) => ys.map((y2, b) => <line key={`${l}${a}${b}`} x1={50 + l * 70} y1={y1} x2={120 + l * 70} y2={y2} className={`${line} opacity-25`} strokeWidth="1" />)))}
    {LAYERS.map((ys, l) => ys.map((y, i) => <circle key={`${l}${i}`} cx={50 + l * 70} cy={y} r="7" strokeWidth="1.5" className={(l + i) % 3 === 1 ? 'fill-current stroke-current' : 'fill-fd-card stroke-current'} />))}
  </svg>
)

const ART = { '/dsa': ArrayArt, '/ai': NetworkArt }

// Landing page: pick a track and see how far you are in each.
export default function TrackPicker({ tracks, repoUrl }) {
  const progress = useProgress()
  return (
    <main id="nd-page" className="relative isolate mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center gap-10 px-4 py-12">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(var(--color-fd-border)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <a href={repoUrl} target="_blank" rel="noreferrer" className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full border bg-fd-card px-3.5 py-1.5 text-sm font-medium shadow-sm transition hover:border-fd-foreground/40 max-md:min-h-11"><GithubIcon className="size-4" />GitHub</a>
      <header className="text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-fd-muted-foreground">Learn by doing</p>
        <SectionHeading level={1} className="mt-3 text-balance sm:!text-5xl">What do you want to learn?</SectionHeading>
        <p className="mx-auto mt-3 max-w-xl text-pretty text-fd-muted-foreground">Visual lessons with worked examples, quizzes and progress tracking. Your progress is saved in this browser.</p>
      </header>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {tracks.map(t => {
          const done = t.ids.filter(id => progress[id] === 'done').length
          const Art = ART[t.href]
          return (
            <LinkCard key={t.href} href={t.href} className="!p-4" title={<span className="text-xl font-bold">{t.title}</span>} description={t.blurb}>
              <div className="order-first mb-4 h-24 overflow-hidden rounded-lg border bg-fd-background bg-[radial-gradient(var(--color-fd-border)_1px,transparent_1px)] p-2 text-fd-foreground [background-size:14px_14px]"><Art /></div>
              <ul className="mt-4 grid grid-cols-3 gap-3 border-t pt-4">
                {t.stats.map(([n, label]) => (
                  <li key={label}>
                    <p className="text-lg font-bold tabular-nums tracking-tight">{n}</p>
                    <p className="text-xs text-fd-muted-foreground">{label}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <Bar value={done / t.ids.length} />
                <p className="mt-2 text-xs tabular-nums text-fd-muted-foreground">{done}/{t.ids.length} done</p>
              </div>
            </LinkCard>
          )
        })}
      </div>
    </main>
  )
}
