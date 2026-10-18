'use client'
import { ListRow, RowList } from '../shared/RowList.jsx'
import { setStatus, useProgress } from '../shared/progress.jsx'

const DIFF = { E: 'Easy', M: 'Medium', H: 'Hard' }
const key = slug => `lc:${slug}`

export const solvedCount = (problems, progress) => problems.filter(p => progress[key(p.slug)] === 'done').length

export default function ProblemList({ problems }) {
  const progress = useProgress()
  return (
    <RowList>
      {problems.map(p => {
        const done = progress[key(p.slug)] === 'done'
        return (
          <ListRow key={p.slug} className="flex items-center gap-3">
            <input type="checkbox" checked={done} onChange={() => setStatus(key(p.slug), done ? undefined : 'done')} className="size-5 accent-[var(--color-fd-primary)]" aria-label={`Solved ${p.name}`} />
            <a href={`https://leetcode.com/problems/${p.slug}/`} target="_blank" rel="noreferrer" className={`flex-1 hover:underline ${done ? 'text-fd-muted-foreground line-through' : ''}`}>{p.name}</a>
            <span className="w-14 text-right text-xs text-fd-muted-foreground">{DIFF[p.d]}</span>
          </ListRow>
        )
      })}
    </RowList>
  )
}
