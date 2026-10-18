import { useMemo, useState } from 'react'
import hljs from 'highlight.js/lib/core'
import js from 'highlight.js/lib/languages/javascript'

hljs.registerLanguage('javascript', js)
const JS = new Set(['javascript', 'js', 'jsx'])
const escape = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// lang: 'javascript' (default) is highlighted; anything else (pseudocode, text) is shown plain.
export default function Code({ code, name, lang = 'javascript' }) {
  const [copied, setCopied] = useState(false)
  const html = useMemo(() => (JS.has(lang) ? hljs.highlight(code, { language: 'javascript' }).value : escape(code)), [code, lang])
  const copy = () => navigator.clipboard.writeText(code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1200) })
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0d1117] text-[13px] leading-relaxed shadow-lg shadow-black/5">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-stone-400">
        <span className="flex items-center gap-2"><i className="size-2.5 rounded-full bg-rose-400/80" /><i className="size-2.5 rounded-full bg-amber-400/80" /><i className="size-2.5 rounded-full bg-emerald-400/80" /><span className="ml-2 font-mono">{name}</span></span>
        <button onClick={copy} className="rounded px-2 py-0.5 hover:bg-white/10">{copied ? 'Copied ✓' : 'Copy'}</button>
      </div>
      <pre className="max-h-[36rem] overflow-auto p-4 text-stone-200"><code className="hljs" dangerouslySetInnerHTML={{ __html: html }} /></pre>
    </div>
  )
}
