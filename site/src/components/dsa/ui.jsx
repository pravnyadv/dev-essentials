'use client'
import { buttonVariants } from 'fumadocs-ui/components/ui/button'

export const LEVELS = { 1: 'Beginner', 2: 'Core', 3: 'Advanced' }

// Small rounded label. Pass href to make it a link.
export const Pill = ({ href = '', tone = 'muted', className = '', children }) => {
  const cls = `rounded-full px-2.5 py-0.5 text-xs font-medium ${tone === 'primary' ? 'bg-fd-primary/10 text-fd-primary hover:bg-fd-primary/20' : 'bg-fd-muted text-fd-muted-foreground'} ${className}`
  return href ? <a href={href} className={cls}>{children}</a> : <span className={cls}>{children}</span>
}
export const LevelBadge = ({ level }) => <Pill>{LEVELS[level]}</Pill>

export const Bar = ({ value }) => (
  <div className="h-1.5 overflow-hidden rounded-full bg-fd-border"><div className="h-full rounded-full bg-fd-primary transition-all duration-500" style={{ width: `${value * 100}%` }} /></div>
)

// Fumadocs button looks for our own <button>s.
export const buttonClass = (variant = 'outline', size, extra = '') => `${buttonVariants({ variant, size })} ${extra}`
export const roundIcon = buttonClass('outline', 'icon', 'size-9 rounded-full')
