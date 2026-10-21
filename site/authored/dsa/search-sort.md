# algorithms/search/linear-search | before Code
A trace of the `linearSearch` code on `[4, 9, 2, 9, 5]` looking for 9. This version checks every element, with no early stop, and returns every index that matches, so it always does n comparisons.

| Index | Element | Equals 9? | foundIndices after |
| --- | --- | --- | --- |
| 0 | 4 | No | `[]` |
| 1 | 9 | Yes | `[1]` |
| 2 | 2 | No | `[1]` |
| 3 | 9 | Yes | `[1, 3]` |
| 4 | 5 | No | `[1, 3]` |

# algorithms/search/binary-search | before Code
A trace of `binarySearch` on the sorted array of odd numbers from 1 to 29 (15 items) looking for 21. Each step throws away half of what is left, so 4 steps are enough for 15 items. The code's middle check can compare twice per step (equal, then less than), so the counts below are steps, not comparator calls.

| Step | startIndex | endIndex | middleIndex | Value there | What happens |
| --- | --- | --- | --- | --- | --- |
| 1 | 0 | 14 | 7 | 15 | 15 is too small, start becomes 8 |
| 2 | 8 | 14 | 11 | 23 | 23 is too big, end becomes 10 |
| 3 | 8 | 10 | 9 | 19 | 19 is too small, start becomes 10 |
| 4 | 10 | 10 | 10 | 21 | Found, return 10 |

```mermaid Worst-case items checked for n items: linear search grows with n, binary search barely moves
xychart-beta
  x-axis "n items" [1, 2, 4, 8, 16, 32, 64]
  y-axis "items checked" 0 --> 70
  line "linear search" [1, 2, 4, 8, 16, 32, 64]
  line "binary search" [1, 2, 3, 4, 5, 6, 7]
```

Binary search worst case, counted by running the code on every target for n up to 1,000,000 (1,000,000,000 uses the same rule, floor of log2 n, plus 1). Larger sizes:

| n items | Linear search, items checked | Binary search, steps |
| --- | --- | --- |
| 1,000 | 1,000 | 10 |
| 1,000,000 | 1,000,000 | 20 |
| 1,000,000,000 | 1,000,000,000 | 30 |

# algorithms/sorting/bubble-sort | before Code
A pass-by-pass trace of the code on `[5, 1, 4, 2, 8]`. After pass 1 the biggest value has bubbled to the end, after pass 2 the next one is in place, and a pass with no swaps stops the loop early.

| Pass | Comparisons | Swaps | Array after the pass |
| --- | --- | --- | --- |
| 1 | 4 | 3 | `1 4 2 5 8` |
| 2 | 3 | 1 | `1 2 4 5 8` |
| 3 | 2 | 0 | `1 2 4 5 8` |

The early stop is where the best case of n comes from. Comparisons counted by running the code on 10 items:

| Input | Comparisons |
| --- | --- |
| Already sorted | 9 |
| Reverse order | 45 |

# algorithms/sorting/selection-sort | before Code
A trace of the code on `[64, 25, 12, 22, 11]`. Each pass scans the unsorted part for the smallest value, then swaps it into the next slot. The sorted part grows from the left.

| Pass | Smallest found at | Action | Array after the pass |
| --- | --- | --- | --- |
| 1 | index 4 | Swap with index 0 | `11 25 12 22 64` |
| 2 | index 2 | Swap with index 1 | `11 12 25 22 64` |
| 3 | index 3 | Swap with index 2 | `11 12 22 25 64` |
| 4 | index 3 | Already in place | `11 12 22 25 64` |

That long-distance swap is why the lesson lists selection sort as not stable. With two equal 3s, written `3a` and `3b` to tell them apart, the first pass moves `3a` behind `3b`:

| Step | Array |
| --- | --- |
| Start | `3a 3b 2c` |
| After pass 1 (swap index 0 with index 2) | `2c 3b 3a` |

# algorithms/sorting/insertion-sort | before Code
A trace of the code on `[5, 2, 4, 6, 1, 3]`. Each round takes the next item and swaps it left past every larger neighbour. Everything to its left is already sorted, so the item stops at the first neighbour that is not larger.

| Round i | Item inserted | Swaps | Array after the round |
| --- | --- | --- | --- |
| 1 | 2 | 1 | `2 5 4 6 1 3` |
| 2 | 4 | 1 | `2 4 5 6 1 3` |
| 3 | 6 | 0 | `2 4 5 6 1 3` |
| 4 | 1 | 4 | `1 2 4 5 6 3` |
| 5 | 3 | 3 | `1 2 3 4 5 6` |

The number of swaps depends on how out of order the input is, which is why the best case is n and the worst case is n squared. In the chart, the mixed input is `3 7 1 8 2 6 4 5`.

```mermaid Swaps insertion sort makes on 8 items: none when sorted, 28 when reversed
xychart-beta
  x-axis [Sorted, Mixed, Reversed]
  y-axis "swaps" 0 --> 30
  bar [0, 13, 28]
```

# algorithms/sorting/merge-sort | before Code
The heart of merge sort is the merge of two sorted halves. This trace runs `mergeSortedArrays` on `[3, 27, 38]` and `[9, 10, 43, 82]`. Each step compares only the two front items and takes the smaller, so the merge never looks back. The table shows the left and right positions before each step.

| Left, right position | Compare | Action | Output so far |
| --- | --- | --- | --- |
| 0, 0 | 3 vs 9 | Take 3 from the left | `3` |
| 1, 0 | 27 vs 9 | Take 9 from the right | `3 9` |
| 1, 1 | 27 vs 10 | Take 10 from the right | `3 9 10` |
| 1, 2 | 27 vs 43 | Take 27 from the left | `3 9 10 27` |
| 2, 2 | 38 vs 43 | Take 38 from the left | `3 9 10 27 38` |
| 3, 2 | Left is used up | Append the rest of the right: 43, 82 | `3 9 10 27 38 43 82` |

```mermaid Comparisons to sort n items in reverse order, counted by running both algorithms
xychart-beta
  x-axis "n items" [8, 16, 32, 64, 128]
  y-axis "comparisons" 0 --> 8500
  line "bubble sort" [28, 120, 496, 2016, 8128]
  line "merge sort" [12, 32, 80, 192, 448]
```

# algorithms/sorting/quick-sort | before Code
The partition step of `QuickSortInPlace` on `[6, 3, 8, 2, 9, 1, 5]`. The pivot is the last item (5). Items smaller than the pivot are swapped into a growing left zone, and at the end the pivot is swapped in right after that zone, where it stays for good.

| Index | Item | Smaller than 5? | Left zone size after | Array after |
| --- | --- | --- | --- | --- |
| 0 | 6 | No | 0 | `6 3 8 2 9 1 5` |
| 1 | 3 | Yes, swap with index 0 | 1 | `3 6 8 2 9 1 5` |
| 2 | 8 | No | 1 | `3 6 8 2 9 1 5` |
| 3 | 2 | Yes, swap with index 1 | 2 | `3 2 8 6 9 1 5` |
| 4 | 9 | No | 2 | `3 2 8 6 9 1 5` |
| 5 | 1 | Yes, swap with index 2 | 3 | `3 2 1 6 9 8 5` |
| end | - | Swap pivot 5 into index 3 | 3 | `3 2 1 5 9 8 6` |

The simple version at the top of the code uses the first item as the pivot. On already-sorted input that pivot splits off nothing, which is the n squared worst case from the Complexity table. Items compared against a pivot, counted by running that version on sorted input, and the exact average over every possible order for the shuffled line (computed from the recurrence, so it is not a sample):

```mermaid Items compared against a pivot, first-item pivot: sorted input grows as n squared, shuffled input as n log n
xychart-beta
  x-axis "n items" [16, 32, 64, 128]
  y-axis "comparisons" 0 --> 8500
  line "already sorted" [120, 496, 2016, 8128]
  line "shuffled, average" [51, 140, 361, 890]
```

# algorithms/sorting/counting-sort | before Code
The three steps on `[4, 2, 2, 8, 3, 3, 1]`, following the code, which sizes the count array from 0 to the largest value (8). Row by row: count each value, turn the counts into running totals, then shift the totals right by one so each entry becomes the first output position for that value.

| Stage | value 0 | value 1 | value 2 | value 3 | value 4 | value 5 | value 6 | value 7 | value 8 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Counts | 0 | 1 | 2 | 2 | 1 | 0 | 0 | 0 | 1 |
| Running totals | 0 | 1 | 3 | 5 | 6 | 6 | 6 | 6 | 7 |
| First output position | 0 | 0 | 1 | 3 | 5 | 6 | 6 | 6 | 6 |

Placing each input item in order. Each placement uses the position for its value, then moves that value's position up by one, so equal items keep their input order.

| Item | Placed at index | Output so far |
| --- | --- | --- |
| 4 | 5 | `_ _ _ _ _ 4 _` |
| 2 | 1 | `_ 2 _ _ _ 4 _` |
| 2 | 2 | `_ 2 2 _ _ 4 _` |
| 8 | 6 | `_ 2 2 _ _ 4 8` |
| 3 | 3 | `_ 2 2 3 _ 4 8` |
| 3 | 4 | `_ 2 2 3 3 4 8` |
| 1 | 0 | `1 2 2 3 3 4 8` |
