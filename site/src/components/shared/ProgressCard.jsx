import LinkCard from './LinkCard.jsx'
import { Bar } from './ui.jsx'

// A LinkCard with a progress bar and caption pinned to the bottom, so cards in a row line up. `lead` goes above the bar.
export default function ProgressCard({ href, title, description, lead, value, caption, className = '', children }) {
  return (
    <LinkCard href={href} title={title} description={description} className={className}>
      {lead}
      <div className="mt-auto pt-5">
        <Bar value={value} />
        <p className="mt-2 text-xs tabular-nums text-fd-muted-foreground">{caption}</p>
      </div>
      {children}
    </LinkCard>
  )
}
