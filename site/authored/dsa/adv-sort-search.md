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

Read the array left to right as the tree top to bottom: 1 is the top, 3 and 2 are its children, 5 and 9 are the children of 3, and 8 is the child of 2. To sink a value, swap it with its smaller child until it is no larger than both children.

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
Shell sort on the lesson's array `35, 33, 42, 10, 14, 19, 27, 44` using the gaps the code picks (length 8, so gaps 4, 2, 1). Each row is the array after one full pass. If the gap 2 picture above disagrees with this table, trust the table, which was traced with the code.

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
Radix sort on `170, 45, 75, 90, 802, 24, 2, 66`. Each pass drops the numbers into ten buckets by one digit, then reads the buckets from 0 to 9. The longest number has 3 digits, so there are 3 passes. Equal digits keep their earlier order, which is what makes the result correct. In the table above k is the number of passes (3 here). The Efficiency text below calls the same thing w.

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
Binary search needs fewer steps (about 7 for 100 items, against 19 here), so on an array in memory you would normally pick binary search. Jump search is worth knowing for data where stepping backwards is expensive, such as a tape or a stream: it only ever moves forward, and moves back at most one block.

A note on the code below. The text above describes checking the first element of each block. The code checks the last element of each block (indexes m - 1, 2m - 1, 3m - 1, and so on) and stops at the first block whose last value is not smaller than the target. Both versions find the same block. The trace that follows matches the code.

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
The O(log(log(n))) figure above is the average for evenly spread values. In the worst case, for example when a few huge values skew the spread, it falls to O(n), which is slower than binary search. A probe is one array position the search looks at.

The position formula can give a fraction, so the code rounds it down. For example 8 * 9 / 999 is about 0.07, which becomes index 0. (The upstream text writes `arr[Lo]` with a capital L; it means `arr[lo]`.)

Searching for 78 in 20 evenly spaced values `3, 8, 13, ..., 98` (each is 5 more than the last). The formula needs one calculation: pos = 0 + (78 - 3) * (19 - 0) / (98 - 3) = 75 * 19 / 95 = 15. Index 15 holds 78, so the search ends on the first probe. Binary search needs four probes on the same array (indexes 9, 14, 17, 15).

The speed depends on the data being evenly spread. The second case has values `1, 2, 3, 4, 5, 6, 7, 8, 9, 1000` and searches for 9.

| Array | Target | Interpolation search probes | Binary search probes |
| :-- | :-- | :-- | :-- |
| 20 evenly spaced values | 78 | 1 | 4 |
| 1 to 9, then 1000 | 9 | 9 | 3 |

The huge last value makes every interpolated guess land near the left end, so the search creeps one index at a time.

# algorithms/sorting/heap-sort | after Complexity

The Memory column of the table lists the in-place version of heap sort, which needs 1 extra slot. The code below is a simpler version. It copies every value into a separate min heap and then into a new output array, so it uses O(n) extra memory. The time stays n log(n) either way.

The intro above describes the in-place version, which uses a max heap and moves the largest value to the end of the array. The code on this page uses a min heap and takes the smallest value first. Both give a sorted result.

# algorithms/sorting/shell-sort | after Complexity

The Best and Worst columns assume a well-chosen gap sequence. The code below uses the simple halving gaps (n/2, n/4, ..., 1), and with those the worst case is O(n^2). Better gap sequences give about n (log(n))^2.

This code also does not stop early. For each position it compares all the way back along the gap chain, so even a sorted list costs about n^2 / 2 comparisons in the last pass. The n log(n) best case needs an insertion step that stops at the first value that is already in place.

# algorithms/sorting/radix-sort | after Code

This code only sorts whole numbers that are 0 or larger, or words made of the letters a to z. Negative numbers and decimals do not work. To handle negatives, sort the negatives and the non-negatives separately, or add the smallest value to every number first and subtract it afterwards.

# algorithms/sorting/bucket-sort | after Complexity

The code on this page sorts each bucket with radix sort, not insertion sort. If every value lands in one bucket, the cost is then that of radix sort, about n * k for numbers with k digits, instead of n^2. Space is O(n + number of buckets) and the sort is stable only if the inner sort is stable (radix sort is).

# algorithms/sorting/bucket-sort | after Code

Because each bucket is sorted by radix sort, this code only accepts whole numbers that are 0 or larger.
