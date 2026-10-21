# Big O & Complexity

Big O describes how the work an algorithm does grows as the input grows. It ignores machine speed and constants and keeps only the shape of the growth. It is the vocabulary every other topic here uses.

## Common growth rates

Here n is the size of the input, for example the number of items in an array.

| Notation | Name | Example | n = 1,000,000 |
| --- | --- | --- | --- |
| O(1) | Constant | Array index, Map lookup | 1 |
| O(log n) | Logarithmic | Binary search | about 20 |
| O(n) | Linear | One loop over the input | 1 million |
| O(n log n) | Linearithmic | Merge sort, `Array.sort` | about 20 million |
| O(n²) | Quadratic | Nested loops over the input | 1 trillion |
| O(2ⁿ) | Exponential | All subsets | hopeless |
| O(n!) | Factorial | All permutations | hopeless |

## How to calculate it

- **Drop constants.** `3n` and `n + 100` are both O(n).
- **Keep the dominant term.** `n² + n` is O(n²).
- **Sequential steps add, nested steps multiply.** Two loops one after the other: O(n + m). A loop inside a loop: O(n × m).
- **Different inputs get different letters.** Looping over `a` then over `b` is O(a + b), not O(n).
- **Halving each step is log n.** Anything that cuts the problem in half per step (binary search, balanced tree height) is O(log n).

## Counting memory (space)

Count the extra memory you allocate, including the recursion call stack. A recursive function that goes `n` calls deep uses O(n) stack space even if it allocates nothing else.

## Best, average, worst, amortised

Big O usually means the worst case: the input that makes the algorithm do the most work, for example searching an array for an item that is not there. Quicksort is O(n log n) on average and O(n²) in the worst case. *Amortised* cost averages over a sequence: `array.push` is occasionally O(n) when the array grows, but O(1) amortised.

## Cost of common JavaScript operations

| Operation | Cost |
| --- | --- |
| `arr[i]`, `arr.push`, `arr.pop` | O(1) |
| `arr.shift`, `arr.unshift`, `arr.splice` in the middle | O(n) |
| `arr.indexOf`, `arr.includes`, `arr.find` | O(n) |
| `arr.slice`, `[...arr]`, `arr.concat` | O(n) |
| `arr.sort` | O(n log n) |
| `map.get`, `map.set`, `set.has`, `set.add` | O(1) average |
| `str + str` in a loop | O(n²) in the simple model where every `+` copies; engines often optimise it, but `array.join` never depends on that |

## What the input size tells you

Interview constraints hint at the target complexity.

| Input size n | Aim for |
| --- | --- |
| up to 10 | O(n!) is fine |
| up to 20 | O(2ⁿ) |
| up to 500 | O(n³) |
| up to 5,000 | O(n²) |
| up to 100,000 | O(n log n) |
| up to 1,000,000 | O(n) |
| larger | O(log n) or O(1) |

These limits assume roughly 100 million simple steps a second, so they are rules of thumb, not guarantees.
