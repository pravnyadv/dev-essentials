'use client'
import { useState } from 'react'
import { ActionButton, Box, CellRow, fmt, Hint, Line, Slider, Stat } from '../shared/explainerKit.jsx'


// 100 requests between 40 and 80 ms, then `slow` of them replaced by one slow latency. Percentiles use the nearest-rank method.
const BASE = Array.from({ length: 100 }, (_, i) => 40 + ((i * 37) % 41))
const pct = (sorted, p) => sorted[Math.ceil((p / 100) * sorted.length) - 1]

export function PercentilesDemo() {
  const [slow, setSlow] = useState(2)
  const [ms, setMs] = useState(1000)
  const [fanout, setFanout] = useState(50)
  const sorted = [...BASE.slice(0, 100 - slow), ...Array(slow).fill(ms)].sort((a, b) => a - b)
  const avg = sorted.reduce((a, b) => a + b, 0) / sorted.length
  const hitSlow = 1 - (1 - slow / 100) ** fanout
  return (
    <Box title="Averages hide the slow requests">
      <div className="space-y-2">
        <Slider label="Slow requests" value={slow} onChange={setSlow} min={0} max={10} step={1} unit="%" />
        <Slider label="Slow latency" value={ms} onChange={setMs} min={100} max={3000} step={100} unit="ms" />
      </div>
      <div className="mt-4 flex h-24 items-end gap-px" role="img" aria-label={`100 requests sorted by latency, ${slow} take ${ms} ms`}>
        {sorted.map((v, i) => <div key={i} className={`flex-1 rounded-t-sm ${v === ms && slow ? 'bg-danger' : 'bg-fd-primary/60'}`} style={{ height: `${Math.max(4, (v / Math.max(ms, 80)) * 100)}%` }} />)}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="Average" value={`${fmt(avg)} ms`} />
        <Stat label="p50 (median)" value={`${pct(sorted, 50)} ms`} />
        <Stat label="p95" value={`${pct(sorted, 95)} ms`} />
        <Stat label="p99" value={`${pct(sorted, 99)} ms`} />
      </div>
      <div className="mt-4"><Slider label="Servers per page" value={fanout} onChange={setFanout} min={1} max={100} step={1} /></div>
      <Line>A page that calls {fanout} servers is slow {(hitSlow * 100).toFixed(0)}% of the time</Line>
      <Hint>The median barely moves. The average and p99 jump. Fan-out turns a rare slow request into a common slow page.</Hint>
    </Box>
  )
}

// FNV-1a with MurmurHash3's finalizer, so short similar names like user-1 and user-2 land far apart on the ring.
const hash = s => {
  let h = 2166136261
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
  h = Math.imul(h ^ (h >>> 16), 0x85ebca6b)
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35)
  return (h ^ (h >>> 16)) >>> 0
}
const SERVERS = ['A', 'B', 'C', 'D', 'E']
const COLORS = ['var(--color-fd-primary)', 'var(--success)', 'var(--warning)', 'var(--danger)', 'var(--color-fd-muted-foreground)']
const KEYS = Array.from({ length: 24 }, (_, i) => `user-${i + 1}`)
const ringOf = (n, vnodes) => SERVERS.slice(0, n).flatMap((s, si) => Array.from({ length: vnodes }, (_, v) => ({ si, at: hash(`${s}#${v}`) / 2 ** 32 }))).sort((a, b) => a.at - b.at)
const onRing = (ring, at) => (ring.find(p => p.at >= at) ?? ring[0]).si
// Each point owns the arc back to the previous point, so a server's share of the ring is its expected share of keys.
const shares = ring => ring.reduce((acc, p, i) => {
  acc[p.si] = (acc[p.si] ?? 0) + p.at - (i ? ring[i - 1].at : ring.at(-1).at - 1)
  return acc
}, [])
const VNODES = 50
const assign = (n, vnodes) => {
  const ring = ringOf(n, vnodes)
  return KEYS.map(k => ({ ring: onRing(ring, hash(k) / 2 ** 32), mod: hash(k) % n }))
}

export function RingDemo() {
  const [n, setN] = useState(4)
  const [prevN, setPrevN] = useState(4)
  const [vnodes, setVnodes] = useState(1)
  const now = assign(n, vnodes), before = assign(prevN, vnodes)
  const movedRing = now.filter((a, i) => a.ring !== before[i].ring).length
  const movedMod = now.filter((a, i) => a.mod !== before[i].mod).length
  const ring = ringOf(n, vnodes), share = shares(ring)
  const change = d => { setPrevN(n); setN(n + d) }
  // Rounded so the server and browser render identical attributes.
  const xy = (at, r) => [110 + r * Math.sin(at * 2 * Math.PI), 110 - r * Math.cos(at * 2 * Math.PI)].map(v => Math.round(v * 10) / 10)
  return (
    <Box title="Consistent hashing: add or remove a server">
      <div className="grid items-center gap-4 sm:grid-cols-[auto_1fr]">
        <svg viewBox="0 0 220 220" className="mx-auto w-56" role="img" aria-label={`Hash ring with ${n} servers and ${KEYS.length} keys`}>
          <circle cx="110" cy="110" r="80" className="fill-none stroke-fd-border" strokeWidth="2" />
          {ring.map((p, i) => {
            const [x, y] = xy(p.at, 80), [lx, ly] = xy(p.at, 100), size = vnodes === 1 ? 10 : 5
            return <g key={i}><rect x={x - size / 2} y={y - size / 2} width={size} height={size} rx="1.5" style={{ fill: COLORS[p.si] }} />{vnodes === 1 && <text x={lx} y={ly + 4} textAnchor="middle" fontSize="12" fontWeight="700" style={{ fill: COLORS[p.si] }}>{SERVERS[p.si]}</text>}</g>
          })}
          {KEYS.map((k, i) => {
            const [x, y] = xy(hash(k) / 2 ** 32, 64)
            const moved = now[i].ring !== before[i].ring
            return <circle key={k} cx={x} cy={y} r={moved ? 5 : 3.5} style={{ fill: COLORS[now[i].ring] }} className={moved ? 'stroke-fd-foreground' : ''} strokeWidth="2" />
          })}
        </svg>
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-5 gap-1 text-center">
            {SERVERS.map((s, si) => <div key={s} className={si < n ? '' : 'invisible'}><b style={{ color: COLORS[si] }}>{s}</b><p className="tabular-nums">{Math.round((share[si] ?? 0) * 100)}% of ring</p><p className="tabular-nums text-fd-muted-foreground">{now.filter(a => a.ring === si).length} keys</p></div>)}
          </div>
          <div className="flex flex-wrap gap-2">
            <ActionButton onClick={() => change(1)} disabled={n >= SERVERS.length}>Add server</ActionButton>
            <ActionButton onClick={() => change(-1)} disabled={n <= 2}>Remove server</ActionButton>
            <ActionButton onClick={() => setVnodes(vnodes === 1 ? VNODES : 1)}>{vnodes === 1 ? `Use ${VNODES} virtual nodes each` : 'Use 1 point each'}</ActionButton>
          </div>
        </div>
      </div>
      <Line>{n === prevN ? 'Each key belongs to the next server clockwise' : `${prevN} to ${n} servers. Ring: ${movedRing} of 24 keys moved. hash mod N: ${movedMod} of 24 moved.`}</Line>
      <Hint>Moved keys are drawn larger. With one point each, arcs are uneven. Virtual nodes give each server many small arcs, so the shares even out.</Hint>
    </Box>
  )
}

// Average latency and database load for 10,000 reads a second with a 1 ms cache in front of the database.
const READS = 10000, CACHE_MS = 1
export function CacheDemo() {
  const [hit, setHit] = useState(90)
  const [dbMs, setDbMs] = useState(20)
  const h = hit / 100
  const avg = h * CACHE_MS + (1 - h) * dbMs
  const dbLoad = (1 - h) * READS
  const bar = (label, value, max, text) => (
    <div className="grid grid-cols-[7rem_1fr_7rem] items-center gap-3 text-sm">
      <span className="font-medium">{label}</span>
      <div className="h-4 overflow-hidden rounded bg-fd-border"><div className="h-full rounded bg-fd-primary transition-all" style={{ width: `${(value / max) * 100}%` }} /></div>
      <span className="text-right tabular-nums">{text}</span>
    </div>
  )
  return (
    <Box title="Hit ratio: 10,000 reads a second">
      <div className="space-y-2">
        <Slider label="Hit ratio" value={hit} onChange={setHit} min={0} max={100} step={1} unit="%" />
        <Slider label="Database read" value={dbMs} onChange={setDbMs} min={5} max={100} step={5} unit="ms" />
      </div>
      <div className="mt-4 space-y-2">
        {bar('Avg latency', avg, dbMs, `${avg.toFixed(1)} ms`)}
        {bar('Database load', dbLoad, READS, `${fmt(dbLoad)}/s`)}
      </div>
      <Line>{hit}% from the cache at {CACHE_MS} ms, {100 - hit}% from the database at {dbMs} ms</Line>
      <Hint>Going from 90% to 99% hits cuts database reads tenfold, from 1,000 to 100 a second.</Hint>
    </Box>
  )
}

// A token bucket: 5 tokens at most, 2 added each second, each request spends one. Same numbers as the lesson's worked example.
const CAPACITY = 5, REFILL = 2, SLOTS = 6
export function BucketDemo() {
  const [state, setState] = useState({ tokens: CAPACITY, t: 0, log: [] })
  const send = k => setState(s => {
    const allowed = Math.min(k, Math.floor(s.tokens))
    const results = [...Array(allowed).fill(200), ...Array(k - allowed).fill(429)]
    return { ...s, tokens: s.tokens - allowed, log: [...s.log, ...results].slice(-SLOTS) }
  })
  const wait = () => setState(s => ({ ...s, t: s.t + 1, tokens: Math.min(CAPACITY, s.tokens + REFILL) }))
  const last = state.log.at(-1)
  return (
    <Box title={`Token bucket: ${CAPACITY} tokens, refills ${REFILL} per second`}>
      <p className="mb-1 text-center text-xs font-medium text-fd-muted-foreground">Tokens in the bucket at t = {state.t}s</p>
      <CellRow values={Array(CAPACITY).fill('')} tone={i => (i < state.tokens ? 'pick' : 'idle')} />
      <p className="mb-1 mt-2 text-center text-xs font-medium text-fd-muted-foreground">Last {SLOTS} responses</p>
      <CellRow values={Array.from({ length: SLOTS }, (_, i) => state.log[i] ?? '')} tone={i => ({ 200: 'good', 429: 'bad' })[state.log[i]] ?? 'idle'} />
      <Line tone={last === 429 ? 'bad' : last === 200 ? 'good' : ''}>{last === 429 ? '429 Too Many Requests: the bucket is empty' : last === 200 ? '200 OK: one token spent' : `Send more than ${REFILL} requests a second and see what happens`}</Line>
      <div className="flex flex-wrap justify-center gap-2">
        <ActionButton onClick={() => send(1)}>Send 1 request</ActionButton>
        <ActionButton onClick={() => send(4)}>Send a burst of 4</ActionButton>
        <ActionButton onClick={wait}>Wait 1 second</ActionButton>
        <ActionButton onClick={() => setState({ tokens: CAPACITY, t: 0, log: [] })}>Reset</ActionButton>
      </div>
      <Hint>A full bucket allows a burst of {CAPACITY}. After that, only {REFILL} requests a second get through.</Hint>
    </Box>
  )
}
