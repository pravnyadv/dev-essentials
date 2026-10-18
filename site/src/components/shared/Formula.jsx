import katex from 'katex'

// A display formula typeset with KaTeX at build time. In lessons, write a line as $$ tex $$.
export default function Formula({ tex }) {
  const html = katex.renderToString(tex, { displayMode: true, throwOnError: false })
  return <div role="math" aria-label={tex} className="my-4 overflow-x-auto text-center" dangerouslySetInnerHTML={{ __html: html }} />
}
