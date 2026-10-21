'use client'
import { useState } from 'react'
import Chip from '../shared/Chip.jsx'
import { ActionButton, Box, Hint, Line, Slider, Stat } from '../shared/explainerKit.jsx'

// Chained hash table. Defaults are the lesson's trace: 5 buckets, the sum hash, and its five keys (melon and lemon are anagrams).
const MAX_BUCKETS = 16, MAX_KEYS = 10
const codes = key => Array.from(key, ch => ch.charCodeAt(0))
export const HASHES = {
  sum: { label: 'Sum of codes (lesson code)', fn: (key, m) => codes(key).reduce((h, c) => h + c, 0) % m },
  poly: { label: 'Polynomial, 31', fn: (key, m) => codes(key).reduce((h, c) => (h * 31 + c) % m, 0) },
}

// Chains in insert order, plus the numbers: keys that landed in a used bucket, longest chain, mean comparisons to find a key.
export function build(keys, m, hash) {
  const buckets = Array.from({ length: m }, () => [])
  keys.forEach(k => buckets[hash(k, m)].push(k))
  const longest = Math.max(0, ...buckets.map(b => b.length))
  const collisions = keys.length - buckets.filter(b => b.length).length
  const steps = buckets.reduce((s, b) => s + (b.length * (b.length + 1)) / 2, 0)
  return { buckets, longest, collisions, avg: keys.length ? steps / keys.length : 0 }
}

export default function HashDemo() {
  const [keys, setKeys] = useState(['melon', 'apple', 'lemon', 'grape', 'mango'])
  const [m, setM] = useState(5)
  const [kind, setKind] = useState('sum')
  const [text, setText] = useState('')
  const { buckets, longest, collisions, avg } = build(keys, m, HASHES[kind].fn)
  const word = text.trim().toLowerCase().slice(0, 12)
  const add = () => {
    if (!word || keys.includes(word) || keys.length >= MAX_KEYS) return
    setKeys([...keys, word])
    setText('')
  }
  return (
    <Box title="Collisions in a chained hash table">
      <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
        <span className="w-28 font-medium">Hash function</span>
        {Object.entries(HASHES).map(([id, h]) => <Chip key={id} size="sm" on={kind === id} onClick={() => setKind(id)}>{h.label}</Chip>)}
      </div>
      <Slider label="Buckets" value={m} onChange={setM} min={3} max={MAX_BUCKETS} step={1} />
      <form className="my-3 flex gap-2" onSubmit={e => { e.preventDefault(); add() }}>
        <input value={text} onChange={e => setText(e.target.value)} maxLength={12} placeholder="Type a key" aria-label="New key" className="h-11 min-w-0 flex-1 rounded-md border border-fd-border bg-fd-card px-3 text-sm" />
        <ActionButton type="submit" disabled={!word || keys.includes(word) || keys.length >= MAX_KEYS}>Add</ActionButton>
      </form>
      <div className="mb-3 flex h-20 flex-wrap content-start gap-1 overflow-y-auto sm:h-9">
        {keys.map(k => <Chip key={k} size="sm" aria-label={`Remove ${k}`} onClick={() => setKeys(keys.filter(x => x !== k))}>{k}</Chip>)}
      </div>
      <div className="grid grid-flow-col grid-rows-8 gap-x-2 gap-y-1">
        {Array.from({ length: MAX_BUCKETS }, (_, i) => (
          <div key={i} className={`flex h-9 items-center gap-2 overflow-x-auto rounded-md border border-fd-border px-2 text-sm ${i < m ? '' : 'invisible'}`}>
            <span className="w-6 shrink-0 text-xs text-fd-muted-foreground">{i}</span>
            {(buckets[i] ?? []).map((k, j) => (
              <span key={k} className={`shrink-0 rounded-md border px-2 py-0.5 text-xs font-medium ${j ? 'border-danger bg-danger/10 text-danger' : 'border-fd-primary bg-fd-primary/15 text-fd-primary'}`}>{k}</span>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <Stat label="Collisions" value={collisions} />
        <Stat label="Longest chain" value={longest} />
        <Stat label="Avg lookup steps" value={avg.toFixed(2)} />
      </div>
      <Line tone={collisions ? 'bad' : 'good'}>{collisions ? `${collisions} ${collisions === 1 ? 'key shares' : 'keys share'} a bucket with an earlier key` : 'Every key has its own bucket'}</Line>
      <div className="min-h-16 sm:min-h-10"><Hint>{keys.length >= MAX_KEYS ? `The table holds at most ${MAX_KEYS} keys. Click a key chip to remove one.` : 31 % m === 1 ? `With ${m} buckets, 31 mod ${m} is 1, so the polynomial hash gives the same buckets as the sum. Try 7 buckets.` : 'Red keys landed in a bucket that was already used. Anagrams always collide under the sum hash. Click a key chip to remove it.'}</Hint></div>
    </Box>
  )
}
