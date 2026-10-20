// The bordered card every box on the site uses. Pass `as` for details, aside, section and so on.
export default function Panel({ as: Tag = 'div', padding = 'p-5', className = '', ...props }) {
  return <Tag {...props} className={`rounded-xl border bg-fd-card shadow-sm ${padding} ${className}`} />
}
