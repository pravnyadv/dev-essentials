'use client'
import { buttonClass } from './ui.jsx'

// One multi-choice question: pick an answer, see whether it is right and why.
export default function Quiz({ quiz, picked, onPick }) {
  const right = picked === quiz.answer
  return (
    <div className="w-full">
      <p className="mb-2 text-center text-sm font-medium">{quiz.q}</p>
      <div className="flex flex-wrap justify-center gap-2">
        {quiz.options.map((o, n) => (
          <button key={n} onClick={() => onPick(n)} className={buttonClass(picked === n ? (right ? 'primary' : 'secondary') : 'outline', 'sm', 'rounded-full px-3')}>{o}</button>
        ))}
      </div>
      <p aria-live="polite" className={`mt-2 min-h-14 text-center text-xs leading-relaxed ${picked === undefined ? 'invisible' : right ? 'text-success' : 'text-danger'}`}>{right ? 'Right. ' : 'Not quite. '}{quiz.why}</p>
    </div>
  )
}
