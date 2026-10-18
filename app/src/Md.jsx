import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Code from './Code.jsx'

const components = {
  code({ className, children }) {
    const text = String(children).replace(/\n$/, '')
    if (!className && !text.includes('\n')) return <code>{children}</code>
    const lang = className?.replace('language-', '') ?? 'text'
    return <div className="my-5"><Code code={text} name={lang} lang={lang} /></div>
  },
  pre: ({ children }) => <>{children}</>,
  a: ({ href, children }) => <a href={href} target="_blank" rel="noreferrer">{children}</a>,
}

export default ({ children }) => (
  <div className="prose prose-stone max-w-none dark:prose-invert prose-headings:scroll-mt-4 prose-pre:my-4">
    <Markdown remarkPlugins={[remarkGfm]} components={components}>{children}</Markdown>
  </div>
)
