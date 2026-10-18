// Heading scale for custom pages. Level 1 is the page title, 2 a section, 3 a sub-section.
// `lesson` matches the size of the h2 inside lesson text, for sections placed beside it (quiz, resources).
const STYLE = {
  1: 'text-3xl font-extrabold tracking-tight sm:text-4xl',
  2: 'text-xl font-bold',
  3: 'text-base font-semibold',
  lesson: 'text-2xl font-bold tracking-tight',
}

export default function SectionHeading({ level = 2, lesson = false, aside, className = '', children }) {
  const Tag = `h${level}`
  const heading = <Tag className={`${STYLE[lesson ? 'lesson' : level]} ${className}`}>{children}</Tag>
  return aside ? <div className="flex flex-wrap items-baseline gap-x-3">{heading}<span className="text-xs text-fd-muted-foreground">{aside}</span></div> : heading
}
