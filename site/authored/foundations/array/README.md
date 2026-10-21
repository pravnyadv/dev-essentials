# Arrays

In the classic array model, items sit in one contiguous block of memory, so the position of item `i` is a single calculation. JavaScript engines usually store dense arrays this way, which is why reading `arr[i]` is O(1) and why almost every other structure is described by how it differs from an array.

## Operations and complexity

| Operation | Time | Why |
| --- | --- | --- |
| Read or write `arr[i]` | O(1) | Direct address calculation |
| Append (`push`) | O(1) amortised | Occasionally the block is copied to a bigger one |
| Remove last (`pop`) | O(1) | Nothing shifts |
| Insert or remove at the front (`unshift`, `shift`) | O(n) | Every later item shifts |
| Insert or remove in the middle (`splice`) | O(n) | Items after it shift |
| Search unsorted (`indexOf`, `includes`) | O(n) | Look at each item |
| Search sorted | O(log n) | Binary search |

Space is O(n).

## Dynamic arrays

A JavaScript array grows on demand. Under the hood a dynamic array keeps spare capacity and, when full, allocates a block about twice as large and copies. Doubling makes the copying cost average out to O(1) per `push`. See the code tab for a small implementation.

## JavaScript specifics

- `arr.sort()` with no comparator sorts as **strings**: `[10, 2, 1].sort()` gives `[1, 10, 2]`. Use `arr.sort((a, b) => a - b)`.
- `sort`, `reverse`, `splice`, `push`, `pop`, `shift` and `unshift` **mutate**. `map`, `filter`, `slice`, `concat` and the newer `toSorted`, `toReversed`, `with` return new arrays.
- `new Array(3).fill([])` makes three references to the **same** inner array. Use `Array.from({ length: 3 }, () => [])`.
- `arr.length = 0` empties the array in place.
- Copies are shallow: `[...arr]` copies the top level only.

## Useful methods

| Need | Use |
| --- | --- |
| Transform every item | `map` |
| Keep some items | `filter` |
| Fold to one value | `reduce` |
| First match | `find`, `findIndex` |
| Any or all match | `some`, `every` |
| Last item | `arr.at(-1)` |
| Flatten | `flat` |
| Range of numbers | `Array.from({ length: n }, (_, i) => i)` |

## Techniques that start with an array

Most array problems are one of these patterns, each with its own page:

- **Two pointers** for sorted input or in-place edits.
- **Sliding window** for contiguous ranges.
- **Prefix sums** for many range queries.
- **Sort first** when order or neighbours matter.
- **Hash map** when you need "seen before?" in O(1).

## Common mistakes

- Using `shift()` in a loop as a queue. It is O(n) each time, so the loop is O(n²).
- Mutating an array while iterating over it.
- Off-by-one on the last index: it is `length - 1`.
