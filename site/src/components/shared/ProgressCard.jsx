import { Card } from 'fumadocs-ui/components/card'
import { Bar } from './ui.jsx'

// A Fumadocs card with a progress bar and a caption under it. `lead` goes above the bar, `children` below the caption.
export default function ProgressCard({ href, title, description, lead, value, caption, className = '', children }) {
  return (
    <Card href={href} title={title} description={description} className={className}>
      {lead}
      <div className="mt-3"><Bar value={value} /></div>
      <p className="mt-1.5 text-xs">{caption}</p>
      {children}
    </Card>
  )
}
