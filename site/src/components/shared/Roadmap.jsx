import SectionHeading from './SectionHeading.jsx'

// A vertical timeline of groups. Each group is { id, title, aside, content }.
export default function Roadmap({ groups }) {
  return (
    <div className="relative ml-3 border-l-2 border-fd-primary/30 pl-8">
      {groups.map(g => (
        <section key={g.id} className="relative pb-10">
          <span className="absolute -left-[2.6rem] top-1 size-4 rounded-full border-4 border-fd-primary bg-fd-background" />
          <SectionHeading level={2} aside={g.aside}>{g.title}</SectionHeading>
          <div className="mt-3">{g.content}</div>
        </section>
      ))}
    </div>
  )
}
