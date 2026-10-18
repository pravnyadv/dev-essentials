import Code from './Code.jsx'

export default function Patterns({ patterns, byId, activeId }) {
  const list = activeId ? patterns.filter(p => p.id === activeId) : patterns
  return (
    <div className="max-w-5xl space-y-6">
      <header>
        <h1 className="text-4xl font-extrabold tracking-tight">Problem patterns</h1>
        <p className="mt-1 text-stone-500">Read the problem, spot the signal, open the topic.{activeId && <> <a className="underline" href="#/patterns">Show all</a></>}</p>
      </header>
      {list.map(p => (
        <section key={p.id} id={p.id} className="rounded-2xl border border-stone-200 bg-white p-6 dark:border-white/10 dark:bg-white/[0.03]">
          <h2 className="text-2xl font-bold"><a href={`#/patterns/${p.id}`}>{p.name}</a></h2>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500">You see</h3>
              <ul className="list-disc pl-5 text-sm">{p.signals.map(s => <li key={s}>{s}</li>)}</ul>
              <h3 className="mt-3 text-xs font-semibold uppercase tracking-wide text-stone-500">Classic problems</h3>
              <p className="text-sm">{p.examples.join(' · ')}</p>
              <h3 className="mt-3 text-xs font-semibold uppercase tracking-wide text-stone-500">Learn it in</h3>
              <p className="flex flex-wrap gap-2 text-sm">{p.topics.map(id => <a key={id} href={`#/topic/${id}`} className="rounded-full bg-indigo-500/10 px-3 py-0.5 text-indigo-700 hover:bg-indigo-500/20 dark:text-indigo-300">{byId[id]?.title}</a>)}</p>
            </div>
            <Code code={p.code} name="template.js" />
          </div>
        </section>
      ))}
    </div>
  )
}
