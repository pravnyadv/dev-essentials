import Link from 'next/link'
import Panel from './Panel.jsx'

// A whole-card link: title with an arrow that nudges on hover, a description, then `children`.
export default function LinkCard({ href, title, description, className = '', children }) {
  return (
    <Panel as={Link} href={href} padding="p-6" className={`group flex flex-col shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-fd-foreground/40 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-foreground motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 text-lg font-semibold leading-snug tracking-tight">{title}</div>
        <span aria-hidden className="text-fd-muted-foreground transition group-hover:translate-x-1 group-hover:text-fd-foreground motion-reduce:transition-none">→</span>
      </div>
      {description && <p className="mt-2 text-sm leading-relaxed text-fd-muted-foreground">{description}</p>}
      {children}
    </Panel>
  )
}
