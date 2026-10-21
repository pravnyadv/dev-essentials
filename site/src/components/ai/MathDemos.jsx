'use client'
import { useState } from 'react'
import DemoFrame from '../shared/DemoFrame.jsx'
import { ActionButton, Hint, Line, Slider } from '../shared/explainerKit.jsx'

const Box = ({ title, children }) => <DemoFrame boxed title={title}>{children}</DemoFrame>

// The same scores as the worked example in the Probability and softmax lesson.
const TOKENS = [['cat', 2.0], ['dog', 1.0], ['fish', 0.1]]
const softmax = (logits, t) => {
  const e = logits.map(z => Math.exp(z / t))
  const sum = e.reduce((a, b) => a + b, 0)
  return e.map(x => x / sum)
}

// Logits to probabilities with a temperature knob, plus a sampler to see what the probabilities mean.
export function SamplerDemo() {
  const [t, setT] = useState(1)
  const [counts, setCounts] = useState([0, 0, 0])
  const p = softmax(TOKENS.map(x => x[1]), t)
  const draw = n => {
    const next = [...counts]
    for (let k = 0; k < n; k++) {
      let r = Math.random(), i = 0
      while (i < p.length - 1 && r > p[i]) r -= p[i++]
      next[i]++
    }
    setCounts(next)
  }
  const total = counts.reduce((a, b) => a + b, 0)
  return (
    <Box title="Temperature and softmax">
      <Slider label="Temperature" value={t} onChange={v => { setT(v); setCounts([0, 0, 0]) }} min={0.1} max={3} />
      <div className="mt-4 space-y-2">
        {TOKENS.map(([name, z], i) => (
          <div key={name} className="grid grid-cols-[3rem_1fr_8rem] items-center gap-3 text-sm">
            <span className="font-medium">{name}</span>
            <div className="h-5 overflow-hidden rounded bg-fd-border"><div className="h-full rounded bg-fd-primary transition-all" style={{ width: `${p[i] * 100}%` }} /></div>
            <span className="text-right text-xs leading-tight tabular-nums text-fd-muted-foreground">score {z} → {(p[i] * 100).toFixed(1)}%<br />picked {counts[i]}</span>
          </div>
        ))}
      </div>
      <Line>{total ? `${total} tokens sampled` : 'Pick the next token'}</Line>
      <div className="flex justify-center gap-2">
        <ActionButton onClick={() => draw(1)}>Sample 1</ActionButton>
        <ActionButton onClick={() => draw(20)}>Sample 20</ActionButton>
        <ActionButton onClick={() => setCounts([0, 0, 0])}>Reset</ActionButton>
      </div>
      <Hint>Low temperature: the top score almost always wins. High: choices spread out.</Hint>
    </Box>
  )
}

// Two arrows at chosen angles: dot product and cosine similarity.
export function DotDemo() {
  const [a, setA] = useState(30)
  const [b, setB] = useState(80)
  const rad = d => (d * Math.PI) / 180
  const A = [Math.cos(rad(a)) * 3, Math.sin(rad(a)) * 3], B = [Math.cos(rad(b)) * 2, Math.sin(rad(b)) * 2]
  const dot = A[0] * B[0] + A[1] * B[1]
  const cos = Math.cos(rad(a - b))
  const pt = ([x, y]) => `${60 + x * 30},${60 - y * 30}`
  return (
    <Box title="Dot product and cosine similarity">
      <div className="grid items-center gap-6 sm:grid-cols-[auto_1fr]">
        <svg viewBox="0 0 120 120" className="mx-auto w-48">
          <circle cx="60" cy="60" r="2" className="fill-fd-muted-foreground" />
          <line x1="60" y1="60" x2={pt(A).split(',')[0]} y2={pt(A).split(',')[1]} className="stroke-fd-primary" strokeWidth="2.5" />
          <line x1="60" y1="60" x2={pt(B).split(',')[0]} y2={pt(B).split(',')[1]} className="stroke-success" strokeWidth="2.5" />
          <text x={pt(A).split(',')[0]} y={+pt(A).split(',')[1] - 3} fontSize="8" className="fill-fd-primary">a</text>
          <text x={pt(B).split(',')[0]} y={+pt(B).split(',')[1] - 3} fontSize="8" className="fill-success">b</text>
        </svg>
        <div className="space-y-3">
          <Slider label="Angle of a" value={a} onChange={setA} min={0} max={180} step={5} unit="°" />
          <Slider label="Angle of b" value={b} onChange={setB} min={0} max={180} step={5} unit="°" />
        </div>
      </div>
      <Line>a · b = {dot.toFixed(2)} &nbsp;|&nbsp; cosine = {cos.toFixed(2)}</Line>
      <Hint>{cos > 0.9 ? 'Pointing the same way: very similar.' : cos > 0.3 ? 'Partly aligned.' : cos > -0.3 ? 'Nearly perpendicular: unrelated.' : 'Pointing apart: opposite.'} Lengths: a = 3, b = 2.</Hint>
    </Box>
  )
}

// One ReLU neuron over two inputs; the grid shows its output for every (x1, x2).
export function NeuronDemo() {
  const [w1, setW1] = useState(0.5)
  const [w2, setW2] = useState(-1)
  const [b, setB] = useState(0.5)
  const [x1, setX1] = useState(1)
  const [x2, setX2] = useState(2)
  const z = w1 * x1 + w2 * x2 + b
  const out = Math.max(0, z)
  const cells = Array.from({ length: 11 }, (_, r) => Array.from({ length: 11 }, (_, c) => Math.max(0, w1 * (c - 5) * 0.6 + w2 * (5 - r) * 0.6 + b)))
  const peak = Math.max(...cells.flat(), 0.01)
  return (
    <Box title="One neuron: y = ReLU(w₁x₁ + w₂x₂ + b)">
      <div className="grid gap-6 sm:grid-cols-[1fr_auto]">
        <div className="space-y-2">
          <Slider label="x₁ (input)" value={x1} onChange={setX1} min={-3} max={3} />
          <Slider label="x₂ (input)" value={x2} onChange={setX2} min={-3} max={3} />
          <Slider label="w₁ (weight)" value={w1} onChange={setW1} min={-2} max={2} />
          <Slider label="w₂ (weight)" value={w2} onChange={setW2} min={-2} max={2} />
          <Slider label="b (bias)" value={b} onChange={setB} min={-3} max={3} />
        </div>
        <div className="mx-auto">
          <div className="grid grid-cols-[repeat(11,1fr)] gap-px overflow-hidden rounded border bg-fd-border" style={{ width: 176 }} aria-label="Neuron output over inputs">
            {cells.flat().map((v, i) => <div key={i} className="aspect-square bg-fd-primary" style={{ opacity: 0.06 + 0.94 * (v / peak) }} />)}
          </div>
          <p className="mt-1 text-center text-xs text-fd-muted-foreground">output for x₁ (→) and x₂ (↑)</p>
        </div>
      </div>
      <Line>{w1}×{x1} + {w2}×{x2} + {b} = {z.toFixed(2)} → ReLU → <b className="ml-1">{out.toFixed(2)}</b></Line>
      <Hint>{z <= 0 ? 'The sum is negative, so ReLU clips it to 0: the neuron stays silent.' : 'Positive sum: the neuron fires.'}</Hint>
    </Box>
  )
}

const RATES = [0.05, 0.1, 0.5, 1.1]
// Gradient descent on loss(w) = (w - 3)²: the step size decides whether it converges.
export function DescentDemo() {
  const [rate, setRate] = useState(0.1)
  const [path, setPath] = useState([0])
  const w = path.at(-1)
  const loss = v => (v - 3) ** 2
  const step = () => setPath(p => [...p, p.at(-1) - rate * 2 * (p.at(-1) - 3)].slice(-40))
  const X = v => 20 + ((Math.max(-3, Math.min(9, v)) + 3) / 12) * 260
  const Y = v => 95 - Math.min(v, 36) * 2.4
  const curve = Array.from({ length: 49 }, (_, i) => { const v = -3 + i * 0.25; return `${X(v)},${Y(loss(v))}` }).join(' ')
  return (
    <Box title="Gradient descent on loss(w) = (w − 3)²">
      <svg viewBox="0 0 300 110" className="mx-auto w-full max-w-md">
        <polyline points={curve} fill="none" className="stroke-fd-border" strokeWidth="2" />
        {path.map((v, i) => <circle key={i} cx={X(v)} cy={Y(loss(v))} r={i === path.length - 1 ? 5 : 2.5} className={i === path.length - 1 ? 'fill-fd-primary' : 'fill-fd-primary/40'} />)}
      </svg>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-sm">
        <span className="font-medium">Learning rate</span>
        {RATES.map(r => <ActionButton key={r} onClick={() => { setRate(r); setPath([0]) }} aria-pressed={r === rate}>{r === rate ? `● ${r}` : r}</ActionButton>)}
      </div>
      <Line>w = {w.toFixed(3)} &nbsp;|&nbsp; loss = {loss(w).toFixed(3)} &nbsp;|&nbsp; gradient = {(2 * (w - 3)).toFixed(2)}</Line>
      <div className="flex justify-center gap-2"><ActionButton onClick={step}>Take a step</ActionButton><ActionButton onClick={() => setPath([0])}>Reset</ActionButton></div>
      <Hint>{rate > 1 ? 'Too large: each step overshoots further and the loss grows.' : rate < 0.1 ? 'Small steps: safe but slow.' : 'w ← w − rate × gradient. Watch it settle at 3.'}</Hint>
    </Box>
  )
}

const num = v => (Number.isFinite(v) ? v : 0)
const Cell = ({ value, onChange, label }) => (
  <input type="number" value={value} aria-label={label} onChange={e => onChange(num(+e.target.value))} className="h-10 w-14 rounded-md border bg-fd-background px-1 text-center text-sm tabular-nums max-md:h-11" />
)

// A 2 by 3 matrix times a 3-number vector: each output is the dot product of a row with the input.
export function MatrixDemo() {
  const [M, setM] = useState([[1, 0, 2], [0, 1, 1]])
  const [x, setX] = useState([3, 4, 5])
  const out = M.map(row => row.reduce((n, m, j) => n + m * x[j], 0))
  const setCell = (i, j) => v => setM(M.map((row, r) => (r === i ? row.map((c, k) => (k === j ? v : c)) : row)))
  return (
    <Box title="Matrix times vector: edit any number">
      <div className="flex flex-wrap items-center justify-center gap-6">
        <div className="space-y-1">{M.map((row, i) => <div key={i} className="flex gap-1">{row.map((c, j) => <Cell key={j} value={c} label={`Matrix row ${i + 1}, column ${j + 1}`} onChange={setCell(i, j)} />)}</div>)}</div>
        <span className="text-lg">×</span>
        <div className="space-y-1">{x.map((c, j) => <Cell key={j} value={c} label={`Vector entry ${j + 1}`} onChange={v => setX(x.map((o, k) => (k === j ? v : o)))} />)}</div>
        <span className="text-lg">=</span>
        <div className="space-y-1">{out.map((o, i) => <div key={i} className="grid h-10 w-14 place-items-center rounded-md border border-fd-primary bg-fd-primary/10 font-semibold tabular-nums max-md:h-11">{o}</div>)}</div>
      </div>
      <Line>{M.map((row, i) => `row ${i + 1}: ${row.map((m, j) => `${m}×${x[j]}`).join(' + ')} = ${out[i]}`).join('   |   ')}</Line>
      <Hint>Each output is a dot product of one row with the input. A neural network layer is this, plus a bend.</Hint>
    </Box>
  )
}

const KEYS = [[1, 0], [0, 1]], VALUES = [[10, 0], [0, 10]], NAMES = ['token 1', 'token 2']
// Attention for one query over two tokens, with the same numbers as the lesson. Turn the query to see the weights move.
export function AttentionDemo() {
  const [deg, setDeg] = useState(0)
  const q = [Math.cos((deg * Math.PI) / 180), Math.sin((deg * Math.PI) / 180)]
  const scores = KEYS.map(k => (q[0] * k[0] + q[1] * k[1]) / Math.sqrt(2))
  const e = scores.map(Math.exp), total = e.reduce((a, b) => a + b, 0), w = e.map(v => v / total)
  const out = [0, 1].map(c => w.reduce((n, wi, i) => n + wi * VALUES[i][c], 0))
  return (
    <Box title="Attention for one query: turn it toward a key">
      <Slider label="Query angle" value={deg} onChange={setDeg} min={0} max={90} step={5} unit="°" />
      <div className="mt-4 space-y-2">
        {NAMES.map((n, i) => (
          <div key={n} className="grid grid-cols-[4.5rem_1fr_9rem] items-center gap-3 text-sm">
            <span className="font-medium">{n}</span>
            <div className="h-5 overflow-hidden rounded bg-fd-border"><div className="h-full rounded bg-fd-primary transition-all" style={{ width: `${w[i] * 100}%` }} /></div>
            <span className="text-right text-xs leading-tight tabular-nums text-fd-muted-foreground">score {scores[i].toFixed(2)}<br />weight {(w[i] * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
      <Line>output = {w[0].toFixed(2)} × [10, 0] + {w[1].toFixed(2)} × [0, 10] = [{out[0].toFixed(1)}, {out[1].toFixed(1)}]</Line>
      <Hint>At 0° this is the lesson's example. The output leans toward whichever key the query matches best.</Hint>
    </Box>
  )
}

// 20 card payments with a risk score. Moving the threshold trades missed fraud against false alarms.
const PAYMENTS = [[95, 1], [88, 1], [80, 0], [72, 1], [62, 0], [55, 0], [45, 1], [40, 0], [35, 0], [30, 0], [28, 0], [25, 0], [22, 0], [20, 0], [18, 0], [15, 0], [12, 0], [10, 0], [8, 0], [6, 0]]
export function ThresholdDemo() {
  const [t, setT] = useState(50)
  const flagged = PAYMENTS.filter(([score]) => score >= t)
  const caught = flagged.filter(([, fraud]) => fraud).length
  const fraudTotal = PAYMENTS.filter(([, fraud]) => fraud).length
  const pct = (a, b) => (b ? `${Math.round((a / b) * 100)}%` : 'n/a')
  return (
    <Box title="Fraud threshold: 20 payments, 4 are fraud">
      <Slider label="Flag if score is at least" value={t} onChange={setT} min={5} max={95} step={1} />
      <div className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-10" role="img" aria-label={`${flagged.length} payments flagged, ${caught} of ${fraudTotal} fraud caught`}>
        {PAYMENTS.map(([score, fraud]) => (
          <div key={score} className={`grid h-12 place-items-center rounded-md border text-center text-xs font-medium leading-tight transition ${score >= t ? 'bg-fd-primary text-fd-primary-foreground' : 'bg-fd-card text-fd-muted-foreground'} ${fraud ? 'border-2 border-fd-foreground' : ''}`}>
            <span>{score}<br />{fraud ? 'fraud' : 'ok'}</span>
          </div>
        ))}
      </div>
      <Line>Flagged {flagged.length} · caught {caught} of {fraudTotal} fraud · precision {pct(caught, flagged.length)} · recall {pct(caught, fraudTotal)}</Line>
      <Hint>Filled cells are flagged. Lower the threshold to catch every fraud and watch the false alarms pile up.</Hint>
    </Box>
  )
}
