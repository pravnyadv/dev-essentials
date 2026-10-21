'use client'
import { buttonClass } from './ui.jsx'

// One multi-choice question: pick an answer, see whether it is right and why. `showWhy={false}` leaves the verdict to the caller.
export default function Quiz({ quiz, picked, onPick, showWhy = true }) {
  const right = picked === quiz.answer
  return (
    <div className="w-full">
      <p className="mb-3 font-medium">{quiz.q}</p>
      <div className="flex flex-col gap-2">
        {quiz.options.map((o, n) => (
          <button key={n} onClick={() => onPick(n)} aria-pressed={picked === n} className={buttonClass(picked === n ? (right ? 'primary' : 'secondary') : 'outline', 'sm', 'h-auto min-h-9 w-full justify-start whitespace-normal rounded-lg px-3 py-2 text-left leading-snug')}>{o}</button>
        ))}
      </div>
      {showWhy && <p aria-live="polite" className={`mt-3 min-h-12 text-sm leading-relaxed ${picked === undefined ? 'invisible' : right ? 'text-success' : 'text-danger'}`}>{right ? 'Right. ' : 'Not quite. '}{quiz.why}</p>}
    </div>
  )
}
