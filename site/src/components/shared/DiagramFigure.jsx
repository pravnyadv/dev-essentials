import Panel from './Panel.jsx'

// A lesson diagram. scripts/lib-authored.mjs renders the ```mermaid block to SVG at build time, coloured by theme variables.
export default function DiagramFigure({ caption, svg }) {
  return (
    <figure className="not-prose my-6">
      <Panel padding="p-3 sm:p-4" className="overflow-x-auto">
        <div role="img" aria-label={caption} dangerouslySetInnerHTML={{ __html: svg }} />
      </Panel>
      <figcaption className="mt-2 text-center text-sm text-fd-muted-foreground">{caption}</figcaption>
    </figure>
  )
}
