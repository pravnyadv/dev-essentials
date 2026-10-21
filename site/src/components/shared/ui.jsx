'use client'
import { buttonVariants } from 'fumadocs-ui/components/ui/button'
import { LEVELS } from '../../lib/vocab.mjs'

// Small rounded label. Pass href to make it a link.
const PILL = { muted: 'bg-fd-muted text-fd-muted-foreground', primary: 'bg-fd-primary/10 text-fd-primary hover:bg-fd-primary/20', outline: 'border text-fd-muted-foreground' }
export const Pill = ({ href = '', tone = 'muted', className = '', children }) => {
  const cls = `rounded-full px-2.5 py-0.5 text-xs font-medium ${PILL[tone]} ${className}`
  return href ? <a href={href} className={cls}>{children}</a> : <span className={cls}>{children}</span>
}
// Numbered circle for recommended order.
export const NumberBadge = ({ n }) => <span className="grid size-6 shrink-0 place-items-center rounded-full bg-fd-primary text-xs font-bold text-fd-primary-foreground">{n}</span>
export const LevelBadge = ({ level }) => <Pill>Level: {LEVELS[level]}</Pill>

export const Bar = ({ value }) => (
  <div className="h-1.5 overflow-hidden rounded-full bg-fd-border"><div className="h-full rounded-full bg-fd-primary transition-all duration-500" style={{ width: `${value * 100}%` }} /></div>
)

// Fumadocs button looks for our own <button>s.
// min-h-11 is a 44px touch target on phones.
export const buttonClass = (variant = 'outline', size, extra = '') => `${buttonVariants({ variant, size })} max-md:min-h-11 ${extra}`
export const roundIcon = buttonClass('outline', 'icon', 'size-9 max-md:size-11 rounded-full')
