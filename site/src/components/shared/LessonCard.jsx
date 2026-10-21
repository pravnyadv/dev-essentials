import Panel from './Panel.jsx'

const LABEL = { pattern: 'Pattern', antipattern: 'Antipattern', design: 'Design summary' }

// A summary card from a ```card block: the four fields of a pattern, an antipattern or a design, two per row on wide screens.
export default function LessonCard({ kind, title, children }) {
  return (
    <Panel as="aside" aria-label={`${LABEL[kind]}: ${title}`} className="my-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-fd-muted-foreground">{LABEL[kind]}</p>
      <p className="mt-1 text-lg font-bold">{title}</p>
      <div className="mt-2 grid gap-x-6 text-sm sm:grid-cols-2 [&_p]:my-1.5">{children}</div>
    </Panel>
  )
}
