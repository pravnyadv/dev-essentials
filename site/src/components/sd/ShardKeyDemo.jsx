'use client'
import { useState } from 'react'
import Chip from '../shared/Chip.jsx'
import { Box, fmt, Line, Slider, Stat } from '../shared/explainerKit.jsx'

// Writes per second on each shard for one key scheme. The total is the sharding lesson's 60,000 peak writes a second.
// Defaults are the lesson's hot-spot case: range by month, no hot key. The hot key sits on shard 2 under hash.
const TOTAL = 60000
const SCHEMES = [
  { id: 'range', label: 'Range by month', note: 'Every new write belongs to the current month, so one shard takes all of it. The hot key slider changes nothing here.' },
  { id: 'hash', label: 'Hash of user id', note: 'Ordinary users spread evenly. The hot key still lands whole on one shard.' },
  { id: 'directory', label: 'Directory lookup', note: 'The table gives the hot key its own shard and spreads the rest over the others.' },
]

export function shardLoads(scheme, shards, hotShare, total = TOTAL) {
  const hot = total * hotShare, rest = total - hot, even = total / shards
  if (scheme === 'range') return Array.from({ length: shards }, (_, i) => (i === 0 ? total : 0))
  if (scheme === 'hash') return Array.from({ length: shards }, (_, i) => rest / shards + (i === 1 ? hot : 0))
  // Directory: the hot key goes on shard 2, and the rest fill every shard up toward an even share.
  if (hot <= even) return Array.from({ length: shards }, () => even)
  return Array.from({ length: shards }, (_, i) => (i === 1 ? hot : rest / (shards - 1)))
}

export default function ShardKeyDemo() {
  const [scheme, setScheme] = useState('range')
  const [shards, setShards] = useState(8)
  const [hotPct, setHotPct] = useState(0)
  const loads = shardLoads(scheme, shards, hotPct / 100)
  const even = TOTAL / shards
  const peak = Math.max(...loads)
  const hottest = loads.indexOf(peak)
  const idle = loads.filter(l => l < even * 0.05).length
  const ratio = peak / even
  const bad = ratio > 1.5
  return (
    <Box title="Shard key: where do the writes land?">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {SCHEMES.map(s => <Chip key={s.id} on={scheme === s.id} onClick={() => setScheme(s.id)}>{s.label}</Chip>)}
      </div>
      <div className="space-y-2">
        <Slider label="Shards" value={shards} onChange={setShards} min={2} max={8} step={1} />
        <Slider label="Hot key share" value={hotPct} onChange={setHotPct} min={0} max={50} step={1} unit="%" />
      </div>
      <div className="relative mt-4 h-40 rounded-lg border px-2">
        <div className="flex h-full items-end gap-1 sm:gap-2">
          {loads.map((l, i) => (
            <div key={i} className="flex h-full flex-1 items-end">
              <div className={`w-full rounded-t transition-all ${i === hottest && bad ? 'bg-danger' : 'bg-fd-primary/60'}`} style={{ height: `${(l / TOTAL) * 100}%` }} />
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-x-2 border-t border-dashed border-fd-muted-foreground" style={{ bottom: `${(even / TOTAL) * 100}%` }}>
          <span className="absolute right-0 -top-5 bg-fd-background px-1 text-xs text-fd-muted-foreground">even share {fmt(even)}</span>
        </div>
      </div>
      <div className="mt-1 flex gap-1 px-2 sm:gap-2">
        {loads.map((l, i) => (
          <div key={i} className="flex-1 text-center text-xs tabular-nums">
            <p className={i === hottest && bad ? 'font-bold text-danger' : 'text-fd-muted-foreground'}>{i === hottest && bad ? 'hot' : `S${i + 1}`}</p>
            <p>{fmt(l)}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <Stat label="Hottest over average" value={`${ratio.toFixed(1)}x`} />
        <Stat label="Hottest shard" value={`S${hottest + 1}: ${fmt(peak)} /s`} />
        <Stat label="Idle shards" value={`${idle} of ${shards}`} />
      </div>
      <Line tone={bad ? 'bad' : 'good'}>{bad ? `Shard ${hottest + 1} takes ${Math.round((peak / TOTAL) * 100)}% of all writes` : 'Load is close to even across the shards'}</Line>
      <div className="mt-1 grid text-center text-xs text-fd-muted-foreground">
        {SCHEMES.map(s => <p key={s.id} className={`col-start-1 row-start-1 ${s.id === scheme ? '' : 'invisible'}`} aria-hidden={s.id !== scheme}>{s.note}</p>)}
      </div>
    </Box>
  )
}
