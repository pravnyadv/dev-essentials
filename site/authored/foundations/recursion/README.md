# Recursion

A function is recursive when it calls itself on a smaller version of the same problem. Tree traversals, depth-first search on graphs, backtracking and top-down dynamic programming are all recursion, so it is worth getting comfortable first.

## Anatomy

Every recursive function needs:

1. **A base case**: an input so small the answer is immediate. Without it the function never stops.
2. **A recursive case**: solve the problem by calling yourself on a smaller input and combining the result.
3. **Progress**: each call must move toward the base case.

```js
function factorial(n) {
  if (n <= 1) return 1;          // base case
  return n * factorial(n - 1);   // smaller problem
}
```

## The call stack

Each call waits on the stack until the call it made returns. `factorial(3)` runs as:

```
factorial(3) = 3 * factorial(2)
                    = 2 * factorial(1)
                          = 1
```

then unwinds: 1, then 2, then 6. A very deep recursion overflows the stack (`RangeError: Maximum call stack size exceeded`, roughly 10,000 frames in JavaScript). Most JavaScript engines, including Chrome's and Node's, do not reuse the stack for a call that is the very last thing a function does (a tail call), and Safari is the exception. So do not count on it: turn deep recursion into a loop or an explicit stack.

## Reading the cost

Write the recurrence, then solve it.

| Recurrence | Time | Example |
| --- | --- | --- |
| T(n) = T(n-1) + O(1) | O(n) | factorial, list length |
| T(n) = T(n/2) + O(1) | O(log n) | binary search |
| T(n) = 2T(n/2) + O(n) | O(n log n) | merge sort |
| T(n) = 2T(n-1) + O(1) | O(2ⁿ) | all subsets |
| T(n) = T(n-1) + T(n-2) + O(1) | about O(1.6ⁿ), usually quoted as O(2ⁿ) | naive Fibonacci |

Space is the depth of the stack: O(n) for factorial, O(log n) for binary search.

## Common shapes

- **Linear**: one call per step (sum of a list).
- **Divide and conquer**: split in halves, combine (merge sort).
- **Tree recursion**: one call per child (tree traversals, DFS).
- **Backtracking**: choose, recurse, undo.
- **Overlapping calls**: the same input is solved again and again. Cache results: see Memoization.

## How to think about it

Do not trace every call. Assume the function already works for smaller inputs and ask only: given those answers, how do I build mine, and what is the base case?

## Common mistakes

- Missing or wrong base case, giving infinite recursion.
- Not making progress (calling with the same input).
- Copying arrays on every call (`slice`, spread) and silently making it O(n²). Pass indexes instead.
- Recomputing overlapping subproblems (naive Fibonacci is about O(1.6ⁿ), usually quoted as O(2ⁿ)).
