'use client'
import { useState } from 'react'
import Chip from '../shared/Chip.jsx'
import { Box, CellRow, fmt, Hint, Line, Slider, Stat } from '../shared/explainerKit.jsx'

const choose = (n, k) => (k < 0 || k > n ? 0 : Array.from({ length: k }, (_, i) => (n - i) / (i + 1)).reduce((a, b) => a * b, 1))
const NAMES = 'ABCDE'

// N copies; a write waits for W of them, a read asks R. The read shown is the worst case: the copies the write reached last.
export function QuorumDemo() {
  const [n, setN] = useState(3)
  const [w, setW] = useState(2)
  const [r, setR] = useState(2)
  const pickN = k => { setN(k); setW(Math.min(w, k)); setR(Math.min(r, k)) }
  const missing = choose(n - w, r), total = choose(n, r)
  const overlap = w + r > n
  return (
    <Box title="Quorums: N copies, W write acks, R read replies">
      <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
        <span className="w-28 font-medium">Copies (N)</span>
        {[3, 5].map(k => <Chip key={k} size="sm" on={n === k} onClick={() => pickN(k)}>{k}</Chip>)}
      </div>
      <div className="space-y-2">
        <Slider label="Write acks (W)" value={w} onChange={setW} min={1} max={n} step={1} />
        <Slider label="Read replies (R)" value={r} onChange={setR} min={1} max={n} step={1} />
      </div>
      <p className="mb-1 mt-4 text-center text-xs font-medium text-fd-muted-foreground">The write of version 2 reached {w} of {n} copies. The worst read asks the last {r}.</p>
      <CellRow values={Array.from({ length: n }, (_, i) => (i < w ? 'v2' : 'v1'))} tone={i => (i < w ? 'good' : 'idle')} marks={Object.fromEntries(Array.from({ length: n }, (_, i) => [i, i >= n - r ? `read ${NAMES[i]}` : NAMES[i]]))} />
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <Stat label="Read sets that miss v2" value={`${fmt(missing)} of ${fmt(total)}`} />
        <Stat label="Writes survive" value={`${n - w} ${n - w === 1 ? 'copy' : 'copies'} down`} />
        <Stat label="Reads survive" value={`${n - r} ${n - r === 1 ? 'copy' : 'copies'} down`} />
      </div>
      <Line tone={overlap ? 'good' : 'bad'}>W + R = {w + r} {overlap ? `> ${n}: every read set includes a copy with v2` : `≤ ${n}: a read can return only stale copies`}</Line>
      <Hint>Raising W or R makes reads fresher and leaves fewer copies you can lose. W + R &gt; N is the overlap rule.</Hint>
    </Box>
  )
}

// Fan-out work for one post, at the Primer's 60,000 deliveries a second. A reader on fan-out-on-read merges 300 authors.
const RATE = 60000, FOLLOWING = 300, CUTOFF = 100000
const seconds = s => (s < 1 ? 'under 1 s' : s < 600 ? `${fmt(s)} s` : `${fmt(s / 60)} min`)
export function FanoutDemo() {
  const [power, setPower] = useState(7)
  const [celebs, setCelebs] = useState(5)
  const followers = Math.round(10 ** power)
  const hybridPush = followers <= CUTOFF
  const rows = [
    { name: 'Fan-out on write', post: followers, time: followers / RATE, read: 1 },
    { name: 'Fan-out on read', post: 1, time: 0, read: FOLLOWING },
    { name: 'Hybrid', post: hybridPush ? followers : 1, time: hybridPush ? followers / RATE : 0, read: 1 + celebs },
  ]
  return (
    <Box title="Fan-out: do the work when posting or when reading">
      <div className="space-y-2">
        <Slider label="Followers" value={power} onChange={setPower} min={2} max={7} step={0.5} display={fmt(followers)} />
        <Slider label="Celebrities followed" value={celebs} onChange={setCelebs} min={0} max={20} step={1} />
      </div>
      <div className="mt-4 grid gap-2">
        <div className="grid grid-cols-[8rem_1fr_1fr_1fr] gap-2 text-xs font-medium text-fd-muted-foreground">
          <span /><span>Writes for this post</span><span>Time to deliver</span><span>Lookups per feed read</span>
        </div>
        {rows.map(row => (
          <div key={row.name} className="grid grid-cols-[8rem_1fr_1fr_1fr] items-center gap-2 rounded-lg border p-2 text-sm tabular-nums">
            <span className="font-medium">{row.name}</span>
            <span className={row.post > CUTOFF ? 'text-danger' : ''}>{fmt(row.post)}</span>
            <span className={row.time > 60 ? 'text-danger' : ''}>{seconds(row.time)}</span>
            <span className={row.read > 100 ? 'text-warning' : ''}>{fmt(row.read)}</span>
          </div>
        ))}
      </div>
      <Line>{hybridPush ? `Under ${fmt(CUTOFF)} followers, the hybrid pushes like fan-out on write` : `Over ${fmt(CUTOFF)} followers, the hybrid skips fan-out and readers merge this author's posts`}</Line>
      <Hint>Pushing costs one write per follower. Pulling costs a lookup per followed author on every read. The hybrid pays each only where it is cheap.</Hint>
    </Box>
  )
}
