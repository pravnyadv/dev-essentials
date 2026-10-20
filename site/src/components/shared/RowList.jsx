// A bordered list of rows with dividers. `ListRow` gives each row the same padding and, with href, a hover link.
export function RowList({ as: Tag = 'ul', className = '', ...props }) {
  return <Tag {...props} className={`divide-y divide-fd-border overflow-hidden rounded-xl border bg-fd-card shadow-sm ${className}`} />
}

export function ListRow({ as: Tag = 'li', href, className = '', children }) {
  return href
    ? <Tag><a href={href} className={`block px-4 py-3 text-sm hover:bg-fd-accent/60 ${className}`}>{children}</a></Tag>
    : <Tag className={`px-4 py-3 text-sm ${className}`}>{children}</Tag>
}
