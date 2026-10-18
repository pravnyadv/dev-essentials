'use client'
import { useState } from 'react'
import { ActionButton, CellRow, Hint, Line } from './explainerKit.jsx'
import Walkthrough from './Walkthrough.jsx'

const A = [1, 2, 4, 6, 8, 11]

const STEPS = [
  'Goal: find two numbers in this sorted list that add up to 10. Trying every pair is slow. Instead, put one marker at each end of the list.',
  'Add the two marked numbers: 1 + 11 = 12. That is more than 10, so the sum is too big.',
  'To make the sum smaller we need a smaller right number, and everything left of 11 is smaller. 11 can never be part of the answer, so cross it out and move the right marker in.',
  'Now 1 + 8 = 9, which is too small. To make it bigger we need a bigger left number, so cross out 1 and move the left marker in.',
  '2 + 8 = 10. Found it. Every move crossed out one number for good, so we look at each number at most once. Two markers closing in on each other is called two pointers, and it works because the list is sorted.',
  'Your turn. The target is now 14. Look at the sum, then choose which marker to move.',
].map(text => ({ text }))

// l, r and what the sum was, per guided step.
const GUIDED = [
  { l: 0, r: 5, calc: 'target = 10' },
  { l: 0, r: 5, calc: '1 + 11 = 12, too big', tone: 'bad' },
  { l: 0, r: 4, calc: '1 + 8 = 9, too small', tone: 'bad', gone: [5] },
  { l: 1, r: 4, calc: '2 + 8 = 10, found', tone: 'good', gone: [0, 5] },
  { l: 1, r: 4, calc: '2 + 8 = 10, found', tone: 'good', gone: [0, 5] },
]

function Stage({ step, play, move, reset }) {
  const live = step === 5
  const g = live ? { l: play.l, r: play.r, gone: A.map((_, i) => i).filter(i => i < play.l || i > play.r) } : GUIDED[step]
  const sum = A[g.l] + A[g.r]
  const target = live ? 14 : 10
  const done = live ? sum === target : g.tone === 'good'
  const calc = live ? `${A[g.l]} + ${A[g.r]} = ${sum}${done ? ', found' : sum < target ? ', too small' : ', too big'}` : g.calc
  const tone = live ? (done ? 'good' : 'bad') : g.tone
  return (
    <div className="w-full py-2">
      <CellRow values={A} tone={i => (i === g.l || i === g.r ? (done ? 'good' : 'in') : 'idle')} gone={i => g.gone?.includes(i)} marks={{ [g.l]: 'left', [g.r]: 'right' }} />
      <div className="mt-2"><Line tone={tone}>{calc}</Line></div>
      <div className="mt-1 flex min-h-8 justify-center gap-2">
        {live && (done
          ? <ActionButton onClick={reset}>Try again</ActionButton>
          : <><ActionButton onClick={() => move('left')}>Move left marker in</ActionButton><ActionButton onClick={() => move('right')}>Move right marker in</ActionButton></>)}
      </div>
      <Hint>{live ? play.hint : ''}</Hint>
    </div>
  )
}

export default function TwoPointersExplainer() {
  const [play, setPlay] = useState({ l: 0, r: 5, hint: 'Sum too small? Too big? That decides which marker can help.' })
  const reset = () => setPlay({ l: 0, r: 5, hint: 'Sum too small? Too big? That decides which marker can help.' })
  const move = side => setPlay(({ l, r }) => {
    const sum = A[l] + A[r], needBigger = sum < 14
    if ((side === 'left') === needBigger) return side === 'left' ? { l: l + 1, r, hint: 'Right: a bigger left number is the only way to raise the sum.' } : { l, r: r - 1, hint: 'Right: a smaller right number is the only way to lower the sum.' }
    return { l, r, hint: needBigger ? `Not that one. ${sum} is too small, so moving the right marker in would only make it smaller.` : `Not that one. ${sum} is too big, so moving the left marker in would only make it bigger.` }
  })
  return <Walkthrough steps={STEPS} stage={i => <Stage step={i} play={play} move={move} reset={reset} />} />
}
