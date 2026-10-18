import { useEffect, useState, useSyncExternalStore } from 'react'

const KEY = 'dsa-progress-v1'
const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) ?? {} } catch { return {} } }
let state = read()
const subs = new Set()
export const setStatus = (id, status) => {
  state = { ...state, [id]: status }
  if (!status) delete state[id]
  try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* private mode */ }
  subs.forEach(f => f())
}
// status: undefined | 'learning' | 'done'
export const useProgress = () => useSyncExternalStore(f => (subs.add(f), () => subs.delete(f)), () => state)

export const useHash = () => {
  const [h, setH] = useState(location.hash.slice(1) || '/')
  useEffect(() => {
    const f = () => { setH(location.hash.slice(1) || '/'); window.scrollTo(0, 0) }
    addEventListener('hashchange', f)
    return () => removeEventListener('hashchange', f)
  }, [])
  return h
}

const cache = new Map()
export const loadTopic = id => {
  if (!cache.has(id)) cache.set(id, fetch(`/content/topics/${id.replaceAll('/', '__')}.json`).then(r => r.json()))
  return cache.get(id)
}
export const loadIndex = () => cache.get('index') ?? (cache.set('index', fetch('/content/index.json').then(r => r.json())), cache.get('index'))
