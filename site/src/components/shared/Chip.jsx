'use client'

// A toggle button shaped like a pill: filters, goals, jump links. `on` marks the active one.
const SIZE = { md: 'px-3 py-1 text-sm max-md:min-h-11', sm: 'px-2.5 py-0.5 text-xs' }

export default function Chip({ on = false, size = 'md', className = '', ...props }) {
  return <button type="button" aria-pressed={on} {...props} className={`rounded-full border transition focus-visible:outline-2 focus-visible:outline-fd-primary ${SIZE[size]} ${on ? 'border-fd-primary bg-fd-primary text-fd-primary-foreground' : 'hover:border-fd-primary/60'} ${className}`} />
}
