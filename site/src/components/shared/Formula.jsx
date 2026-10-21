import katex from 'katex'

// A formula typeset with KaTeX at build time. In lessons, a line written as $$ tex $$ is a display formula
// and $tex$ inside a sentence is an inline one.
export default function Formula({ tex, inline = false }) {
  const html = katex.renderToString(tex, { displayMode: !inline, throwOnError: false })
  return inline
    ? <span role="math" aria-label={tex} dangerouslySetInnerHTML={{ __html: html }} />
    : <div role="math" aria-label={tex} className="my-4 overflow-x-auto text-center" dangerouslySetInnerHTML={{ __html: html }} />
}
