'use client'
import { useState } from 'react'
import Chip from '../shared/Chip.jsx'
import { ActionButton, Box, CellRow, fmt, Hint, Line, Slider, Stat } from '../shared/explainerKit.jsx'

// Each default below is the worked example of the lesson the demo sits on, so the text and the demo agree.

const YEAR_MINUTES = 525960
const pct = a => `${(a * 100).toFixed(3).replace(/\.?0+$/, '')}%`
const downtime = a => {
  const m = (1 - a) * YEAR_MINUTES
  return m >= 120 ? `about ${fmt(m / 60)} hours` : `about ${fmt(m)} minutes`
}
const LEVELS = [0.99, 0.999, 0.9995, 0.9999]
const PARTS = [{ name: 'Load balancer', a: 0.9999 }, { name: 'App server', a: 0.999 }, { name: 'Database', a: 0.999 }]

// A chain of parts in sequence. A second copy of a part runs in parallel: it is down only when both copies are.
export function AvailabilityDemo() {
  const [parts, setParts] = useState(PARTS.map(p => ({ ...p, copies: 1 })))
  const set = (i, change) => setParts(parts.map((p, j) => (j === i ? { ...p, ...change } : p)))
  const each = parts.map(p => 1 - (1 - p.a) ** p.copies)
  const total = each.reduce((x, y) => x * y, 1)
  const weakest = parts[each.indexOf(Math.min(...each))].name
  return (
    <Box title="Availability of parts in a chain">
      <div className="space-y-3">
        {parts.map((p, i) => (
          <div key={p.name} className="grid items-center gap-2 text-sm sm:grid-cols-[7rem_1fr_auto]">
            <span className="font-medium">{p.name}</span>
            <div className="flex flex-wrap gap-1">{LEVELS.map(a => <Chip key={a} size="sm" on={p.a === a} onClick={() => set(i, { a })}>{pct(a)}</Chip>)}</div>
            <ActionButton onClick={() => set(i, { copies: 3 - p.copies })}>{p.copies === 1 ? 'Add a second copy' : 'Back to one copy'}</ActionButton>
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <Stat label="Whole chain" value={pct(total)} />
        <Stat label="Down per year" value={downtime(total)} />
        <Stat label="Weakest link" value={weakest} />
      </div>
      <Line>{parts.map((p, i) => (p.copies === 2 ? `(1 - ${+(1 - p.a).toFixed(4)}²)` : `${p.a}`)).join(' × ')} = {total.toFixed(6)}</Line>
      <Hint>Multiplying in sequence always loses availability. A second copy squares the chance of being down, so fix the weakest link first.</Hint>
    </Box>
  )
}

// Deterministic random numbers, so the server and the browser draw the same jittered retries.
const seeded = seed => () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 2 ** 32
}
const CLIENTS = 100, RETRIES = 4, BASE = 1, BUCKET = 0.25, SPAN = 16
const POLICIES = {
  fixed: { label: 'Wait 1 s each time', wait: () => 1 },
  backoff: { label: 'Exponential backoff', wait: k => BASE * 2 ** k },
  jitter: { label: 'Backoff with full jitter', wait: (k, r) => r() * BASE * 2 ** k },
}
// When each of 100 clients sends its retries, if every retry fails. Counted per quarter second.
const retryHistogram = policy => {
  const r = seeded(7), counts = Array(SPAN / BUCKET).fill(0)
  for (let c = 0; c < CLIENTS; c++) {
    let t = 0
    for (let k = 0; k < RETRIES; k++) {
      t += POLICIES[policy].wait(k, r)
      if (t < SPAN) counts[Math.floor(t / BUCKET)]++
    }
  }
  return counts
}
const HISTOGRAMS = Object.fromEntries(Object.keys(POLICIES).map(p => [p, retryHistogram(p)]))

export function RetryDemo() {
  const [layers, setLayers] = useState(3)
  const [tries, setTries] = useState(3)
  const [everyLayer, setEveryLayer] = useState(true)
  const [policy, setPolicy] = useState('fixed')
  const perClick = everyLayer ? tries ** layers : tries
  const load = 100 * perClick
  const counts = HISTOGRAMS[policy], peak = Math.max(...counts)
  return (
    <Box title="Retries multiply, and jitter spreads them out">
      <p className="mb-2 text-sm font-medium">1. One failing click, retried at each layer</p>
      <div className="space-y-2">
        <Slider label="Layers" value={layers} onChange={setLayers} min={1} max={4} step={1} />
        <Slider label="Tries per layer" value={tries} onChange={setTries} min={1} max={5} step={1} />
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <Chip size="sm" on={everyLayer} onClick={() => setEveryLayer(true)}>Every layer retries</Chip>
        <Chip size="sm" on={!everyLayer} onClick={() => setEveryLayer(false)}>Only the top layer retries</Chip>
      </div>
      <div className="mt-3 grid grid-cols-[7rem_1fr_7rem] items-center gap-3 text-sm">
        <span className="font-medium">Database load</span>
        <div className="relative h-4 overflow-hidden rounded bg-fd-border">
          <div className={`h-full rounded transition-all ${load > 1000 ? 'bg-danger' : 'bg-fd-primary'}`} style={{ width: `${Math.min(100, (load / 3000) * 100)}%` }} />
          <div className="absolute inset-y-0 w-0.5 bg-fd-foreground" style={{ left: `${(1000 / 3000) * 100}%` }} />
        </div>
        <span className="text-right tabular-nums">{fmt(load)}/s</span>
      </div>
      <Line tone={load > 1000 ? 'bad' : 'good'}>{perClick} queries per failing click, so 100 clicks a second send {fmt(load)}. Capacity is 1,000.</Line>

      <p className="mb-2 mt-4 border-t pt-4 text-sm font-medium">2. When 100 clients send their 4 retries</p>
      <div className="flex flex-wrap gap-2">
        {Object.entries(POLICIES).map(([k, p]) => <Chip key={k} size="sm" on={policy === k} onClick={() => setPolicy(k)}>{p.label}</Chip>)}
      </div>
      <div className="mt-3 flex h-24 items-end gap-px" role="img" aria-label={`Retries per quarter second over ${SPAN} seconds, peak ${peak}`}>
        {counts.map((n, i) => <div key={i} className={`flex-1 rounded-t-sm ${n > 50 ? 'bg-danger' : 'bg-fd-primary/60'}`} style={{ height: `${Math.max(2, n)}%` }} />)}
      </div>
      <div className="flex justify-between text-xs text-fd-muted-foreground"><span>0 s</span><span>{SPAN / 2} s</span><span>{SPAN} s</span></div>
      <Line tone={peak > 50 ? 'bad' : 'good'}>Busiest quarter second: {peak} retries arrive together</Line>
      <Hint>Backoff alone moves the spike later but keeps it whole. Jitter turns it into a trickle the service can absorb.</Hint>
    </Box>
  )
}

// A circuit breaker: opens after 5 failures, stays open 10 seconds, then lets one trial call through.
const THRESHOLD = 5, COOL = 10, TIMEOUT = 2, LOG = 8
const STATES = ['closed', 'open', 'half']
const STATE_LABEL = { closed: 'Closed', open: 'Open', half: 'Half-open' }
const START = { state: 'closed', fails: 0, t: 0, openedAt: 0, waited: 0, log: [] }

export function BreakerDemo() {
  const [healthy, setHealthy] = useState(false)
  const [s, setS] = useState(START)
  const send = n => setS(prev => {
    let x = { ...prev, log: [...prev.log] }
    for (let i = 0; i < n; i++) {
      if (x.state === 'open') { x.log.push('fast'); continue }
      if (healthy) {
        x.log.push('ok')
        x = { ...x, state: 'closed', fails: 0 }
        continue
      }
      x.log.push('timeout')
      x.waited += TIMEOUT
      const fails = x.fails + 1
      x = x.state === 'half' || fails >= THRESHOLD ? { ...x, state: 'open', fails, openedAt: x.t } : { ...x, fails }
    }
    return { ...x, log: x.log.slice(-LOG) }
  })
  const wait = () => setS(x => {
    const t = x.t + 5
    return { ...x, t, state: x.state === 'open' && t - x.openedAt >= COOL ? 'half' : x.state }
  })
  const last = s.log.at(-1)
  const message = {
    closed: `Closed: calls go through. ${s.fails} of ${THRESHOLD} failures before it opens.`,
    open: `Open: calls fail at once without waiting. ${Math.max(0, COOL - (s.t - s.openedAt))} s until a trial call.`,
    half: 'Half-open: the next call is a trial. Success closes the breaker, failure opens it again.',
  }[s.state]
  return (
    <Box title={`Circuit breaker: opens after ${THRESHOLD} failures, retries after ${COOL} s`}>
      <div className="grid grid-cols-3 gap-2 text-center text-sm">
        {STATES.map(st => <div key={st} className={`rounded-md border p-2 font-medium transition ${s.state === st ? 'border-fd-primary bg-fd-primary text-fd-primary-foreground' : ''}`}>{STATE_LABEL[st]}</div>)}
      </div>
      <Line>{message}</Line>
      <p className="mb-1 mt-2 text-center text-xs font-medium text-fd-muted-foreground">Last {LOG} calls at t = {s.t} s</p>
      <CellRow values={Array.from({ length: LOG }, (_, i) => ({ ok: 'OK', timeout: '2 s', fast: 'fast' })[s.log[i]] ?? '')} tone={i => ({ ok: 'good', timeout: 'bad', fast: 'in' })[s.log[i]] ?? 'idle'} />
      <Line tone={last === 'timeout' ? 'bad' : ''}>Time threads spent waiting on the dependency: {s.waited} s</Line>
      <div className="flex flex-wrap justify-center gap-2">
        <ActionButton onClick={() => setHealthy(!healthy)}>Dependency: {healthy ? 'healthy' : 'hanging'}</ActionButton>
        <ActionButton onClick={() => send(1)}>Send 1 call</ActionButton>
        <ActionButton onClick={() => send(5)}>Send 5 calls</ActionButton>
        <ActionButton onClick={wait}>Wait 5 s</ActionButton>
        <ActionButton onClick={() => setS(START)}>Reset</ActionButton>
      </div>
      <Hint>Each call to a hanging dependency holds a thread for the 2 s timeout. Once the breaker opens, calls fail in microseconds.</Hint>
    </Box>
  )
}

// A queue in front of workers that take 0.5 s per job, watched for 10 minutes.
const JOB_SECONDS = 0.5, MINUTES = 10, CAP = 1000, BARS = 30
export function BacklogDemo() {
  const [arrivals, setArrivals] = useState(120)
  const [workers, setWorkers] = useState(50)
  const [capped, setCapped] = useState(false)
  const service = workers / JOB_SECONDS
  const growth = Math.max(0, arrivals - service)
  const queueAt = t => (capped ? Math.min(CAP, growth * t) : growth * t)
  const queue = queueAt(MINUTES * 60)
  const rejected = capped && growth > 0 ? growth : 0
  const top = Math.max(CAP, growth * MINUTES * 60, 1)
  return (
    <Box title={`Arrivals against workers, each job ${JOB_SECONDS} s`}>
      <div className="space-y-2">
        <Slider label="Arrivals" value={arrivals} onChange={setArrivals} min={50} max={200} step={10} unit="/s" />
        <Slider label="Workers" value={workers} onChange={setWorkers} min={10} max={100} step={5} />
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <Chip size="sm" on={!capped} onClick={() => setCapped(false)}>Unbounded queue</Chip>
        <Chip size="sm" on={capped} onClick={() => setCapped(true)}>Queue capped at {fmt(CAP)}</Chip>
      </div>
      <div className="mt-3 flex h-24 items-end gap-px" role="img" aria-label={`Queue length over ${MINUTES} minutes, ending at ${fmt(queue)} jobs`}>
        {Array.from({ length: BARS }, (_, i) => <div key={i} className={`flex-1 rounded-t-sm ${growth > 0 ? 'bg-danger/70' : 'bg-fd-primary/60'}`} style={{ height: `${Math.max(2, (queueAt(((i + 1) * MINUTES * 60) / BARS) / top) * 100)}%` }} />)}
      </div>
      <div className="flex justify-between text-xs text-fd-muted-foreground"><span>0 min</span><span>Queue length</span><span>{MINUTES} min</span></div>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="Served" value={`${fmt(Math.min(arrivals, service))}/s`} />
        <Stat label="Queue at 10 min" value={fmt(queue)} />
        <Stat label="New job waits" value={`${fmt(queue / service)} s`} />
        <Stat label="Rejected (429)" value={`${fmt(rejected)}/s`} />
      </div>
      <Line tone={growth > 0 && !capped ? 'bad' : ''}>Workers busy (Little's law): {fmt(Math.min(arrivals, service))} jobs/s × {JOB_SECONDS} s = {fmt(Math.min(arrivals, service) * JOB_SECONDS)} of {workers}</Line>
      <Hint>When arrivals beat service the queue grows without end. A cap keeps the wait short and refuses the excess openly.</Hint>
    </Box>
  )
}
