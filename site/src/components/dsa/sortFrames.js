// Replays a sorting algorithm as a list of frames: { a: values, hi: indices being compared or moved, done: indices in final place, note }.
const START = [5, 2, 8, 1, 9, 3]

export const SORTS = {
  'bubble-sort': a => {
    const f = [], done = []
    const snap = (hi, note) => f.push({ a: [...a], hi, done: [...done], note })
    snap([], 'Bubble sort: compare neighbours and swap if they are out of order. Each pass pushes the largest remaining value to the end.')
    for (let end = a.length - 1; end > 0; end--) {
      let swapped = false
      for (let j = 0; j < end; j++) {
        snap([j, j + 1], `Compare ${a[j]} and ${a[j + 1]}.`)
        if (a[j] > a[j + 1]) { [a[j], a[j + 1]] = [a[j + 1], a[j]]; swapped = true; snap([j, j + 1], `${a[j + 1]} is bigger, so swap them.`) }
      }
      if (!swapped) {
        for (let k = 0; k <= end; k++) done.push(k)
        snap([], 'No swaps this pass, so the array is already sorted. Stop early.')
        return f
      }
      done.push(end)
      snap([], `${a[end]} has bubbled to its final place.`)
    }
    done.push(0); snap([], 'Sorted. Worst case O(n²): about n passes of n compares.')
    return f
  },
  'selection-sort': a => {
    const f = [], done = []
    const snap = (hi, note) => f.push({ a: [...a], hi, done: [...done], note })
    snap([], 'Selection sort: find the smallest value in the unsorted part and put it at the front.')
    for (let i = 0; i < a.length - 1; i++) {
      let min = i
      for (let j = i + 1; j < a.length; j++) {
        snap([min, j], `Compare ${a[j]} with the smallest so far, ${a[min]}.`)
        if (a[j] < a[min]) min = j
      }
      if (min !== i) { [a[i], a[min]] = [a[min], a[i]]; snap([i, min], `Swap the smallest, ${a[i]}, into position ${i}.`) }
      done.push(i); snap([], `${a[i]} is in its final place.`)
    }
    done.push(a.length - 1); snap([], 'Sorted. Always O(n²) compares, but at most n swaps.')
    return f
  },
  'insertion-sort': a => {
    const f = [], done = [0]
    const snap = (hi, note) => f.push({ a: [...a], hi, done: [...done], note })
    snap([], 'Insertion sort: grow a sorted section on the left. Take the next value and slide it left until it fits.')
    for (let i = 1; i < a.length; i++) {
      let j = i
      snap([j], `Take ${a[i]} and find its place in the sorted part.`)
      while (j > 0 && a[j - 1] > a[j]) { [a[j - 1], a[j]] = [a[j], a[j - 1]]; j--; snap([j, j + 1], `${a[j]} is smaller than ${a[j + 1]}, so move it left.`) }
      done.push(i); snap([], `${a[j]} is placed. The sorted part now has ${i + 1} values.`)
    }
    snap([], 'Sorted. Fast on nearly sorted input (O(n)), O(n²) in the worst case.')
    return f
  },
  'merge-sort': a => {
    const f = []
    const snap = (range, note) => f.push({ a: [...a], hi: [], range, done: [], note })
    snap(null, 'Merge sort: split in half, sort each half, then merge two sorted halves into one.')
    const sort = (l, r) => {
      if (l >= r) return
      const m = (l + r) >> 1
      snap([l, r], `Split [${l}..${r}] into [${l}..${m}] and [${m + 1}..${r}].`)
      sort(l, m); sort(m + 1, r)
      const left = a.slice(l, m + 1), right = a.slice(m + 1, r + 1)
      for (let k = l, i = 0, j = 0; k <= r; k++) a[k] = j >= right.length || (i < left.length && left[i] <= right[j]) ? left[i++] : right[j++]
      snap([l, r], `Merge ${JSON.stringify(left)} and ${JSON.stringify(right)} into ${JSON.stringify(a.slice(l, r + 1))}.`)
    }
    sort(0, a.length - 1)
    f.push({ a: [...a], hi: [], done: a.map((_, i) => i), note: 'Sorted. Always O(n log n), but it needs O(n) extra memory for merging.' })
    return f
  },
  'quick-sort': a => {
    const f = [], done = new Set()
    const snap = (hi, note, range) => f.push({ a: [...a], hi, range, done: [...done], note })
    snap([], 'Quick sort: pick a pivot, move smaller values left of it and larger right, then repeat on each side.')
    const sort = (l, r) => {
      if (l > r) return
      if (l === r) { done.add(l); return }
      const p = a[r]
      let i = l
      snap([r], `Pivot is ${p} (the last value in [${l}..${r}]).`, [l, r])
      for (let j = l; j < r; j++) {
        snap([j, r], `Is ${a[j]} smaller than the pivot ${p}?`, [l, r])
        if (a[j] < p) { [a[i], a[j]] = [a[j], a[i]]; if (i !== j) snap([i, j], `Yes, swap it into the left side.`, [l, r]); i++ }
      }
      ;[a[i], a[r]] = [a[r], a[i]]; done.add(i)
      snap([], `Put the pivot ${p} at position ${i}. It is now in its final place.`)
      sort(l, i - 1); sort(i + 1, r)
    }
    sort(0, a.length - 1)
    snap([], 'Sorted. O(n log n) on average, O(n²) if pivots are always the smallest or largest.')
    return f
  },
}

export const framesFor = id => SORTS[id]?.([...START])
