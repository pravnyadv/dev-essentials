// The one place that decides how wide a custom page is and where it sits in the docs layout grid.
// `id` is the target of the skip link in the root layout; Fumadocs' own DocsPage uses the same id.
const WIDTH = { wide: 'max-w-6xl', normal: 'max-w-5xl', narrow: 'max-w-3xl' }

export default function PageContainer({ width = 'normal', className = '', children }) {
  return <div id="nd-page" className={`[grid-area:main] min-w-0 mx-auto w-full ${WIDTH[width]} px-4 py-8 md:px-8 ${className}`}>{children}</div>
}
