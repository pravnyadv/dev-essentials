'use client'
import { useState } from 'react'
import Chip from '../shared/Chip.jsx'
import { Box, fmt, Hint, Line, Slider, Stat } from '../shared/explainerKit.jsx'

const PARAGRAPHS = [
  'Northwind sells project planning software to small teams. The product started as a task list and has grown into a full workspace with boards, calendars and shared documents. Most customers sign up for a monthly plan and move to a yearly plan once the team settles in.',
  'Support is available by chat and email on every plan. Chat answers arrive within minutes, and email replies usually take under a day. Customers on the business plan get a named contact who knows their account.',
  'Billing follows the plan you pick. Monthly plans renew on the same day each month, and yearly plans renew once a year with a reminder sent two weeks before. The refund window for annual plans is 45 days from the date of purchase. Monthly plans can be cancelled at any time and are not charged again.',
  'Security matters to our customers, so all data is encrypted in transit and at rest. Backups run every night and are kept for thirty days. Admins can export their data whenever they like, and exports include every board, comment and attachment.',
  'We ship improvements every two weeks and publish short release notes for each one. Larger changes are announced a month ahead, so teams have time to adjust their habits and update any shared guides.',
  'Our community forum is open to everyone, including people who have not bought anything yet. Members share templates, ask for advice and vote on the features they want next. Staff read the forum daily and reply to the questions that nobody else has answered after a day or two.',
  'New customers can follow a short guided tour that sets up a first board in about ten minutes. The tour covers inviting teammates, assigning tasks and linking a calendar. Larger teams can book a live onboarding call, where we help move existing projects over from spreadsheets or other tools.',
]
const FACT = 'The refund window for annual plans is 45 days from the date of purchase.'
const WORDS = PARAGRAPHS.flatMap((p, pi) => p.split(' ').map(w => ({ w, pi })))
const N = WORDS.length
const factStart = WORDS.findIndex((_, i) => WORDS.slice(i, i + FACT.split(' ').length).map(x => x.w).join(' ') === FACT)
const FACT_RANGE = [factStart, factStart + FACT.split(' ').length]

// Windows of `size` words that start `size - overlap` apart, inside [from, to). Returns [start, end) pairs.
export function windows(from, to, size, overlap) {
  const out = []
  for (let s = from; s < to; s += size - overlap) {
    out.push([s, Math.min(s + size, to)])
    if (s + size >= to) break
  }
  return out
}

// Fixed: windows over the whole document. Paragraph: one chunk per paragraph, with long paragraphs cut into windows.
export function chunk(words, mode, size, overlap) {
  if (mode === 'fixed') return windows(0, words.length, size, overlap)
  const out = []
  for (let from = 0; from < words.length;) {
    let to = from
    while (to < words.length && words[to].pi === words[from].pi) to++
    out.push(...windows(from, to, size, overlap))
    from = to
  }
  return out
}

export function stats(chunks, n, [fs, fe]) {
  const stored = chunks.reduce((t, [s, e]) => t + e - s, 0)
  return { count: chunks.length, stored, cost: n ? ((stored - n) / n) * 100 : 0, whole: chunks.some(([s, e]) => s <= fs && e >= fe) }
}

// Chunking one 7-paragraph document (words stand in for tokens). The lesson's 400-token chunks with 50 overlap
// on 1,000 tokens scale to 120 and 15 here, because this document is about a third of that length.
export default function ChunkDemo() {
  const [mode, setMode] = useState('fixed')
  const [size, setSize] = useState(120)
  const [overlap, setOverlap] = useState(15)
  const ov = Math.min(overlap, size - 1)
  const chunks = chunk(WORDS, mode, size, ov)
  const { count, stored, cost, whole } = stats(chunks, N, FACT_RANGE)
  const owners = WORDS.map((_, i) => chunks.map((c, k) => (i >= c[0] && i < c[1] ? k : -1)).filter(k => k >= 0))
  const tint = k => (k % 2 ? 'bg-warning/20' : 'bg-fd-primary/15')
  return (
    <Box title="Chunking: size, overlap and where the cuts fall">
      <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
        <span className="w-28 font-medium">Split by</span>
        <Chip size="sm" on={mode === 'fixed'} onClick={() => setMode('fixed')}>Fixed size</Chip>
        <Chip size="sm" on={mode === 'para'} onClick={() => setMode('para')}>Paragraph</Chip>
      </div>
      <div className="space-y-2">
        <Slider label="Chunk size" value={size} onChange={setSize} min={20} max={200} step={5} display={`${size} words`} />
        <Slider label="Overlap" value={ov} onChange={setOverlap} min={0} max={Math.min(60, size - 1)} step={1} display={`${ov} words`} />
      </div>
      <div className="relative mt-4 h-8 rounded-md border">
        {chunks.map(([s, e], k) => (
          <div key={k} className={`absolute h-1/2 rounded-sm border border-fd-border ${tint(k)}`} style={{ left: `${(s / N) * 100}%`, width: `${((e - s) / N) * 100}%`, top: k % 2 ? '50%' : 0 }} />
        ))}
        <div className="absolute inset-y-0 w-1 bg-success" style={{ left: `${(FACT_RANGE[0] / N) * 100}%`, width: `${((FACT_RANGE[1] - FACT_RANGE[0]) / N) * 100}%`, minWidth: 3 }} />
      </div>
      <div className="mt-3 h-64 overflow-y-auto rounded-lg border p-3 text-sm leading-7">
        {WORDS.map(({ w, pi }, i) => {
          const o = owners[i]
          const inFact = i >= FACT_RANGE[0] && i < FACT_RANGE[1]
          const starts = chunks.findIndex(c => c[0] === i)
          return (
            <span key={i}>
              {i > 0 && pi !== WORDS[i - 1].pi && <br />}
              {starts >= 0 && <sup className="mr-0.5 text-xs font-bold text-fd-primary">[{starts + 1}</sup>}
              <span className={`${tint(o[0] ?? 0)} ${o.length > 1 ? 'border-b-2 border-fd-primary' : ''} ${inFact ? 'font-bold text-success' : ''}`}>{w}</span>{' '}
            </span>
          )
        })}
      </div>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <Stat label="Chunks" value={fmt(count)} />
        <Stat label="Words stored" value={`${fmt(stored)} of ${fmt(N)}`} />
        <Stat label="Overlap cost" value={`${cost.toFixed(0)}%`} />
      </div>
      <Line tone={whole ? 'good' : 'bad'}>{whole ? 'The fact sits whole inside one chunk' : 'The fact is cut across two chunks'}</Line>
      <Hint>Words stand in for tokens. The lesson's 400 size and 50 overlap become 120 and 15 here. Underlined words are stored twice. Green marks the key fact. In Paragraph mode, overlap only matters for paragraphs longer than the size.</Hint>
    </Box>
  )
}
