'use client'
import { useSyncExternalStore } from 'react'

// Same localStorage key and shape as the Vite app, so progress carries over.
const KEY = 'dsa-progress-v1'
const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) ?? {} } catch { return {} } }
let state = null
const subs = new Set()
const current = () => (state ??= read())
const setStatus = (id, status) => {
  state = { ...current(), [id]: status }
  if (!status) delete state[id]
  try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* private mode */ }
  subs.forEach(f => f())
}
const EMPTY = {}
const useProgress = () => useSyncExternalStore(f => (subs.add(f), () => subs.delete(f)), current, () => EMPTY)

// status: undefined | 'learning' | 'done'
export function StatusButton({ id }) {
  const s = useProgress()[id]
  const next = { undefined: 'learning', learning: 'done', done: undefined }[s]
  const label = { undefined: 'Start learning', learning: 'Mark as done', done: 'Done' }[s]
  return (
    <button onClick={() => setStatus(id, next)} className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${s === 'done' ? 'bg-indigo-500/10 text-indigo-700 ring-1 ring-indigo-500/40 dark:text-indigo-300' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}>{label}</button>
  )
}
