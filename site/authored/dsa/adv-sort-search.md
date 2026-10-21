# algorithms/sorting/heap-sort | before Code
```mermaid The min heap after adding 5, 3, 8, 1, 9, 2: the smallest value sits at the top and every parent is smaller than its children
flowchart TD
  A[1] --> B[3]
  A --> C[2]
  B --> D[5]
  B --> E[9]
  C --> F[8]
  class A focus
```
The code on this page adds every value to a min heap, then removes the smallest value one at a time. Each removal moves the last heap value to the top and sinks it back down, so every step costs about log n.

| Step | Heap as an array after the step | Output so far |
| :-- | :-- | :-- |
| All six values added | 1, 3, 2, 5, 9, 8 | empty |
| Remove 1 | 2, 3, 8, 5, 9 | 1 |
| Remove 2 | 3, 5, 8, 9 | 1, 2 |
| Remove 3 | 5, 9, 8 | 1, 2, 3 |
| Remove 5 | 8, 9 | 1, 2, 3, 5 |
| Remove 8 | 9 | 1, 2, 3, 5, 8 |
| Remove 9 | empty | 1, 2, 3, 5, 8, 9 |

# algorithms/sorting/shell-sort | before Code
Shell sort on the lesson's array `35, 33, 42, 10, 14, 19, 27, 44` using the gaps the code picks (length 8, so gaps 4, 2, 1). Each row is the array after one full pass.

| Gap | Array after the pass | Swaps so far |
| :-- | :-- | :-- |
| start | 35, 33, 42, 10, 14, 19, 27, 44 | 0 |
| 4 | 14, 19, 27, 10, 35, 33, 42, 44 | 3 |
| 2 | 14, 10, 27, 19, 35, 33, 42, 44 | 4 |
| 1 | 10, 14, 19, 27, 33, 35, 42, 44 | 7 |

By the time the gap reaches 1 the array is nearly sorted, so the last pass only fixes small leftovers. The chart counts swaps for a list in reverse order, where plain insertion sort is at its worst.

```mermaid Swaps needed to sort a reversed list of n numbers: shell sort stays far below insertion sort as n grows
xychart-beta
  x-axis "n" [16, 32, 64, 128, 256]
  y-axis "swaps" 0 --> 33000
  line "insertion sort" [120, 496, 2016, 8128, 32640]
  line "shell sort" [32, 80, 192, 448, 1024]
```

# algorithms/sorting/radix-sort | before Efficiency
Radix sort on `170, 45, 75, 90, 802, 24, 2, 66`. Each pass drops the numbers into ten buckets by one digit, then reads the buckets from 0 to 9. The longest number has 3 digits, so there are 3 passes. Equal digits keep their earlier order, which is what makes the result correct.

| Pass | Digit used | Buckets that got numbers (bucket: values) | Array after the pass |
| :-- | :-- | :-- | :-- |
| start | none | none | 170, 45, 75, 90, 802, 24, 2, 66 |
| 1 | ones | 0: 170, 90 / 2: 802, 2 / 4: 24 / 5: 45, 75 / 6: 66 | 170, 90, 802, 2, 24, 45, 75, 66 |
| 2 | tens | 0: 802, 2 / 2: 24 / 4: 45 / 6: 66 / 7: 170, 75 / 9: 90 | 802, 2, 24, 45, 66, 170, 75, 90 |
| 3 | hundreds | 0: 2, 24, 45, 66, 75, 90 / 1: 170 / 8: 802 | 2, 24, 45, 66, 75, 90, 170, 802 |

# algorithms/sorting/bucket-sort | before Code
Bucket sort on `29, 25, 3, 49, 9, 37, 21, 43` with 4 buckets. The code sets the bucket width to ceil((49 - 3) / 4) = 12 and sends each value to bucket floor((value - 3) / 12).

| Value | (value - 3) / 12, rounded down | Bucket |
| :-- | :-- | :-- |
| 29 | 26 / 12 = 2 | 2 |
| 25 | 22 / 12 = 1 | 1 |
| 3 | 0 / 12 = 0 | 0 |
| 49 | 46 / 12 = 3 | 3 |
| 9 | 6 / 12 = 0 | 0 |
| 37 | 34 / 12 = 2 | 2 |
| 21 | 18 / 12 = 1 | 1 |
| 43 | 40 / 12 = 3 | 3 |

```mermaid Scatter puts each value in a bucket, each bucket is sorted on its own, and gather reads the buckets in order
flowchart LR
  A[29 25 3 49 9 37 21 43] --> B0[Bucket 0: 3 9]
  A --> B1[Bucket 1: 25 21]
  A --> B2[Bucket 2: 29 37]
  A --> B3[Bucket 3: 49 43]
  B0 --> R[3 9 21 25 29 37 43 49]
  B1 --> R
  B2 --> R
  B3 --> R
  class R good
```
Bucket 1 and bucket 3 are sorted inside (to 21, 25 and 43, 49) before the gather step. Buckets are already in value order, so no final merge is needed.

# algorithms/search/jump-search | before Code
Searching for 29 in the 16 sorted values `2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35, 38, 41, 44, 47`. The jump size is floor(sqrt(16)) = 4.

| Step | What the code checks | Result |
| :-- | :-- | :-- |
| 1 | index 3, value 11 | 29 is bigger, jump on |
| 2 | index 7, value 23 | 29 is bigger, jump on |
| 3 | index 11, value 35 | 29 is not bigger, the answer is in indexes 8 to 11 |
| 4 | linear scan, index 8, value 26 | not equal |
| 5 | linear scan, index 9, value 29 | found at index 9 |

Only 5 values are read instead of 10 for a plain left-to-right scan. The block size matters: the worst case is n / m + m - 1 comparisons, computed here for n = 100.

```mermaid Worst-case comparisons for 100 items by block size m: the lowest bar is at m = 10, the square root of 100
xychart-beta
  x-axis "block size m" [1, 2, 5, 10, 20, 50, 100]
  y-axis "worst-case comparisons" 0 --> 110
  bar "n / m + m - 1" [100, 51, 24, 19, 24, 51, 100]
```

# algorithms/search/interpolation-search | before Code
Searching for 78 in 20 evenly spaced values `3, 8, 13, ..., 98` (each is 5 more than the last). The formula needs one calculation: pos = 0 + (78 - 3) * (19 - 0) / (98 - 3) = 75 * 19 / 95 = 15. Index 15 holds 78, so the search ends on the first probe. Binary search needs four probes on the same array (indexes 9, 14, 17, 15).

The speed depends on the data being evenly spread. The second case has values `1, 2, 3, 4, 5, 6, 7, 8, 9, 1000` and searches for 9.

| Array | Target | Interpolation search probes | Binary search probes |
| :-- | :-- | :-- | :-- |
| 20 evenly spaced values | 78 | 1 | 4 |
| 1 to 9, then 1000 | 9 | 9 | 3 |

The huge last value makes every interpolated guess land near the left end, so the search creeps one index at a time.
