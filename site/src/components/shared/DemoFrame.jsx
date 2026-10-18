import Panel from './Panel.jsx'

// Frame for an interactive demo: a small label, then the demo. `boxed` puts both in a panel,
// otherwise the child brings its own box (a stepper, a details panel).
export default function DemoFrame({ title, boxed = false, children }) {
  const label = <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-fd-muted-foreground">{title}</p>
  return boxed
    ? <Panel className="my-6">{label}{children}</Panel>
    : <div className="my-6">{label}{children}</div>
}
