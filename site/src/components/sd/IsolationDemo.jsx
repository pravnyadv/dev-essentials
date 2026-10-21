'use client'
import { useState } from 'react'
import Chip from '../shared/Chip.jsx'
import { ActionButton, Box, Hint, Line, Stat } from '../shared/explainerKit.jsx'

// The lesson's two timelines (lost update on balance 100, write skew with two doctors on call) under PostgreSQL's levels.
// Lost update is stopped by an error on T2's write under repeatable read and serializable. Write skew is stopped only by serializable, at T2's commit.
export const LEVELS = { rc: 'Read committed', rr: 'Repeatable read', ser: 'Serializable' }
export const SCENARIOS = {
  lost: {
    name: 'Lost update', start: { balance: 100 }, correct: 'Balance 180',
    steps: [[1, 'read', 'T1 reads balance: 100'], [2, 'read', 'T2 reads balance: 100'], [1, 'write', 'T1 writes 100 + 50 = 150'], [1, 'commit', 'T1 commits'], [2, 'write', 'T2 writes 100 + 30 = 130'], [2, 'commit', 'T2 commits']],
    value: { 1: 150, 2: 130 }, key: 'balance', abort: (level, i) => level !== 'rc' && i === 4,
    cells: db => [['Balance in database', db.balance], ['Correct final balance', 180]],
    verdict: (db, aborted) => aborted ? ['good', `T2 got an error and was rolled back. Balance ${db.balance}, nothing lost. T2 retries on 150 and reaches 180.`] : [db.balance === 180 ? 'good' : 'bad', `Final balance ${db.balance}, it should be 180. T1's deposit vanished.`],
  },
  skew: {
    name: 'Write skew', start: { alice: 1, bob: 1 }, correct: 'At least 1 on call',
    steps: [[1, 'read', 'T1 counts doctors on call: 2'], [2, 'read', 'T2 counts doctors on call: 2'], [1, 'write', 'T1 sets Alice off call'], [1, 'commit', 'T1 commits'], [2, 'write', 'T2 sets Bob off call'], [2, 'commit', 'T2 commits']],
    value: { 1: 0, 2: 0 }, key: { 1: 'alice', 2: 'bob' }, abort: (level, i) => level === 'ser' && i === 5,
    cells: db => [['Alice on call', db.alice], ['Bob on call', db.bob]],
    verdict: (db, aborted) => { const n = db.alice + db.bob; return aborted ? ['good', `T2 got a serialization error and was rolled back. ${n} doctor on call, the rule holds. T2 retries, sees 1 and stays on.`] : [n > 0 ? 'good' : 'bad', `${n} doctors on call. The rule is broken, though each transaction saw a valid world.`] },
  },
}

// Frames after 0..6 steps: committed values, which steps ran, and whether T2 was aborted. Writes are held until the same transaction commits.
export function frames(scn, level) {
  const out = [{ db: { ...scn.start }, done: [], aborted: false }]
  let db = { ...scn.start }, pending = {}, aborted = false
  scn.steps.forEach(([tx, op], i) => {
    const key = typeof scn.key === 'string' ? scn.key : scn.key[tx]
    if (aborted && tx === 2) pending = {}
    else if (scn.abort(level, i)) { aborted = true; pending = {} }
    else if (op === 'write') pending = { ...pending, [tx]: scn.value[tx] }
    else if (op === 'commit' && pending[tx] !== undefined) { db = { ...db, [key]: pending[tx] }; delete pending[tx] }
    out.push({ db, done: out[i].done.concat({ i, failed: scn.abort(level, i) || (aborted && tx === 2) }), aborted })
  })
  return out
}

const opText = (scn, i, failed) => failed ? (scn.steps[i][1] === 'commit' ? 'Error: rolled back' : 'Error: conflict, rolled back') : scn.steps[i][2]

export default function IsolationDemo() {
  const [sKey, setS] = useState('lost')
  const [level, setLevel] = useState('rc')
  const [n, setN] = useState(0)
  const scn = SCENARIOS[sKey], f = frames(scn, level)[n], last = n === scn.steps.length
  const [tone, text] = last ? scn.verdict(f.db, f.aborted) : ['', n === 0 ? 'Press Step to run the first operation.' : opText(scn, n - 1, f.done[n - 1].failed)]
  const pick = (setter, v) => { setter(v); setN(0) }
  return (
    <Box title="Two transactions at once">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        {Object.entries(SCENARIOS).map(([k, s]) => <Chip key={k} size="sm" on={sKey === k} onClick={() => pick(setS, k)}>{s.name}</Chip>)}
        <span className="mx-1 text-fd-muted-foreground">|</span>
        {Object.entries(LEVELS).map(([k, name]) => <Chip key={k} size="sm" on={level === k} onClick={() => pick(setLevel, k)}>{name}</Chip>)}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[1, 2].map(tx => (
          <div key={tx} className="space-y-1">
            <p className="text-center text-xs font-medium text-fd-muted-foreground">Transaction T{tx}</p>
            {scn.steps.map(([t], i) => {
              const ran = f.done.find(d => d.i === i), mine = t === tx
              const tint = !mine ? 'border-transparent' : !ran ? 'border-dashed text-fd-muted-foreground/60' : ran.failed ? 'border-danger bg-danger/10 text-danger' : i === n - 1 ? 'border-fd-primary bg-fd-primary/15' : 'bg-fd-card'
              return <p key={i} className={`flex h-12 items-center rounded-md border px-2 text-xs sm:h-9 ${tint}`}>{mine ? opText(scn, i, ran?.failed) : ''}</p>
            })}
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {scn.cells(f.db).map(([label, v]) => <Stat key={label} label={label} value={v} />)}
        <Stat label="Aborted" value={f.aborted ? 'T2' : 'none'} />
      </div>
      <div className="flex min-h-16 items-center"><div className="w-full"><Line tone={tone}>{text}</Line></div></div>
      <div className="flex justify-center gap-2">
        <ActionButton onClick={() => setN(m => m + 1)} disabled={last}>Step</ActionButton>
        <ActionButton onClick={() => setN(0)}>Reset</ActionButton>
      </div>
      <Hint>Read committed lets both writes through. Repeatable read stops the lost update with an error but not write skew. Serializable stops both.</Hint>
    </Box>
  )
}
