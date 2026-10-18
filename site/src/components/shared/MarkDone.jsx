'use client'
import { useRouter } from 'next/navigation'
import { setStatus, useProgress } from './progress.jsx'
import { buttonClass } from './ui.jsx'

export default function MarkDone({ id, next }) {
  const router = useRouter()
  const status = useProgress()[id]
  if (status === 'done') return null
  return (
    <button onClick={() => { setStatus(id, 'done'); if (next) router.push(next.url) }} className={buttonClass('primary', undefined, 'mt-10 w-full rounded-xl py-3 text-base font-semibold')}>
      Mark done{next ? ` and go to ${next.title}` : ''} →
    </button>
  )
}
