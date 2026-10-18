'use client'
import { useMemo, useState } from 'react'
import { ActionButton, CellRow, Hint, Line, useFrames } from '../shared/explainerKit.jsx'
import Walkthrough from './Walkthrough.jsx'

const WORDS = ['abcadef', 'pwwkew', 'bbbbb', 'tmmzuxt']

// Longest substring without repeats, recorded one move at a time: { l, r, best, note, dup }.
function framesOf(s) {
  const out = [], seen = new Set()
  let l = 0, best = 0
  const push = (r, note, dup) => out.push({ l, r, best, note, dup })
  for (let r = 0; r < s.length; r++) {
    while (seen.has(s[r])) { push(r, `"${s[r]}" is already in the window.`, true); seen.delete(s[l]); l++; push(r, `Drop "${s[l - 1]}" from the left.`, true) }
    seen.add(s[r]); best = Math.max(best, r - l + 1)
    push(r, `Add "${s[r]}". Window "${s.slice(l, r + 1)}", length ${r - l + 1}.`)
  }
  return out
}

const GUIDED = {
  word: 'abcadef',
  steps: [
    { l: 0, r: 0, best: 1, note: 'Window "a", length 1' },
    { l: 0, r: 2, best: 3, note: 'Window "abc", length 3' },
    { l: 0, r: 3, best: 3, note: 'The new "a" repeats the first one', dup: true },
    { l: 1, r: 3, best: 3, note: 'Window "bca", length 3' },
    { l: 1, r: 6, best: 6, note: 'Window "bcadef", length 6' },
  ],
}

const STEPS = [
  'Goal: find the longest stretch of letters with no letter repeated. Checking every stretch is slow. Instead keep one window over the string and only ever slide it forward.',
  'Grow the window to the right while each new letter is different. "abc" has no repeats, so its length, 3, is the best so far.',
  'The next letter is "a", but the window already has an "a". The window is no longer valid.',
  'Fix it by shrinking from the left until the repeat is gone. Dropping the first "a" leaves "bca", valid again.',
  'Keep growing: add "d", "e", "f". The best is now "bcadef", length 6. The left edge and right edge only ever move forward, so each letter is added once and dropped at most once. This is called a sliding window.',
  'Your turn. Pick a word and press Next to watch the window grow and shrink.',
].map(text => ({ text }))

function Stage({ step, word, setWord }) {
  const live = step === 5
  const frames = useMemo(() => framesOf(word), [word])
  const [f, i, next, reset] = useFrames(frames)
  const g = live ? f : GUIDED.steps[step]
  const s = live ? word : GUIDED.word
  const done = live && i === frames.length - 1
  return (
    <div className="w-full py-2">
      <CellRow values={[...s]} tone={k => (g.dup && k === g.r ? 'bad' : k >= g.l && k <= g.r ? 'in' : 'idle')} gone={k => k < g.l}
        marks={{ [g.l]: 'L', [g.r]: g.l === g.r ? 'L, R' : 'R' }} />
      <div className="mt-2"><Line tone={g.dup ? 'bad' : ''}>{g.note}</Line></div>
      <p className="text-center text-xs text-fd-muted-foreground">best so far: <span className="font-medium text-fd-foreground">{g.best}</span></p>
      <div className="mt-2 flex min-h-8 flex-wrap justify-center gap-2">
        {live && <>
          {WORDS.map(w => <ActionButton key={w} onClick={() => { setWord(w); reset() }} aria-pressed={w === word}><span className={w === word ? 'text-fd-primary' : ''}>{w}</span></ActionButton>)}
          <ActionButton onClick={done ? reset : next}>{done ? 'Restart' : 'Next'}</ActionButton>
        </>}
      </div>
      <Hint>{live ? (done ? `Longest stretch without a repeat: ${g.best}` : `Move ${i + 1} of ${frames.length}`) : ''}</Hint>
    </div>
  )
}

export default function SlidingWindowExplainer() {
  const [word, setWord] = useState(WORDS[1])
  return <Walkthrough steps={STEPS} stage={i => <Stage step={i} word={word} setWord={setWord} />} />
}
