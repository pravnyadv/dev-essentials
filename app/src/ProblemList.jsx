import { setStatus, useProgress } from './lib.js'

const DIFF = { E: 'Easy', M: 'Medium', H: 'Hard' }
const key = slug => `lc:${slug}`

export const solvedCount = (problems, progress) => problems.filter(p => progress[key(p.slug)] === 'done').length

export default function ProblemList({ problems }) {
  const progress = useProgress()
  return (
    <ul className="divide-y divide-stone-200 rounded-xl border border-stone-200 dark:divide-white/10 dark:border-white/10">
      {problems.map(p => {
        const done = progress[key(p.slug)] === 'done'
        return (
          <li key={p.slug} className="flex items-center gap-3 px-3 py-2 text-sm">
            <input type="checkbox" checked={done} onChange={() => setStatus(key(p.slug), done ? undefined : 'done')} className="size-4 accent-indigo-600" aria-label={`Solved ${p.name}`} />
            <a href={`https://leetcode.com/problems/${p.slug}/`} target="_blank" rel="noreferrer" className={`flex-1 hover:underline ${done ? 'text-stone-400 line-through' : ''}`}>{p.name}</a>
            <span className="w-14 text-right text-xs text-stone-500">{DIFF[p.d]}</span>
          </li>
        )
      })}
    </ul>
  )
}
