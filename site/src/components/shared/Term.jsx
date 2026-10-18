'use client'
import { Popover, PopoverContent, PopoverTrigger } from 'fumadocs-ui/components/ui/popover'

// Inline glossary term. A real button, so it opens on tap, click, Enter and Space, unlike a title tooltip.
export default function Term({ def, children }) {
  return (
    <Popover>
      <PopoverTrigger className="cursor-help rounded-sm underline decoration-dotted decoration-fd-primary underline-offset-4 focus-visible:outline-2 focus-visible:outline-fd-primary">{children}</PopoverTrigger>
      <PopoverContent className="max-w-xs text-sm leading-relaxed">{def}</PopoverContent>
    </Popover>
  )
}
