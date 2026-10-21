# data-structures/tree/avl-tree | before Code
Height after inserting the keys 1, 2, 3, ... in sorted order: a plain binary search tree degrades into a list, while the AVL tree keeps its height near log2 n.

```mermaid Tree height (in nodes) after n sorted inserts: the plain tree grows with n, the AVL tree barely moves
xychart-beta
  x-axis "n keys inserted in order" [7, 15, 31, 63, 127]
  y-axis "tree height" 0 --> 130
  bar "plain BST" [7, 15, 31, 63, 127]
  bar "AVL" [3, 4, 5, 6, 7]
```

# data-structures/tree/red-black-tree | before Code
Each insertion paints the new node red, then repairs any red parent of a red node. The color of the uncle decides the repair.

```mermaid Red-black insertion fix: a red uncle only needs recoloring, a black uncle needs rotations
flowchart TD
  X[New red node x] --> B{Parent p red?}
  B -->|no| Z[Done]
  B -->|yes| C{Uncle is red?}
  C -->|yes| D[Recolor, repeat at g]
  C -->|no| F{x same side as p?}
  F -->|yes: LL or RR| G[Rotate g, recolor]
  F -->|no: LR or RL| H[Rotate p, then g, recolor]
  class D warn
  class G focus
  class H focus
```

The letters are the lesson's: x is the new node, p its parent and g its grandparent. Recoloring makes p and the uncle black and g red (g stays black if it is the root), then the same check runs at g. After either rotation case the node that ends on top becomes black and g red. A black uncle also covers a missing uncle.

# data-structures/tree/segment-tree | before Application
A sum segment tree built on [2, 5, 1, 4, 9, 3]. Each box shows the range it covers and its stored sum. The highlighted boxes are the only ones read to answer sum of positions 1 to 4.

```mermaid Segment tree on [2, 5, 1, 4, 9, 3]: the query for positions 1 to 4 reads three stored sums
flowchart TD
  N0_5[0..5 = 24]
  N0_2[0..2 = 8]
  N0_1[0..1 = 7]
  N0_0[a0 = 2]
  N1_1[a1 = 5]
  N2_2[a2 = 1]
  N3_5[3..5 = 16]
  N3_4[3..4 = 13]
  N3_3[a3 = 4]
  N4_4[a4 = 9]
  N5_5[a5 = 3]
  N0_5 --> N0_2
  N0_5 --> N3_5
  N0_2 --> N0_1
  N0_2 --> N2_2
  N0_1 --> N0_0
  N0_1 --> N1_1
  N3_5 --> N3_4
  N3_5 --> N5_5
  N3_4 --> N3_3
  N3_4 --> N4_4
  class N1_1 focus
  class N2_2 focus
  class N3_4 focus
```

Trace of the query for positions 1 to 4, visiting from the root:

| Node range | Relation to query | Action |
|---|---|---|
| [0, 5] | partly inside | split into two halves |
| [0, 2] | partly inside | split into two halves |
| [0, 1] | partly inside | split into two halves |
| [0, 0] | outside the query | skip, adds 0 |
| [1, 1] | inside the query | use stored 5 |
| [2, 2] | inside the query | use stored 1 |
| [3, 5] | partly inside | split into two halves |
| [3, 4] | inside the query | use stored 13 |
| [5, 5] | outside the query | skip, adds 0 |

The answer is 5 + 1 + 13 = 19. On six elements the saving is small, but a query only walks down two paths of the tree, so its cost follows the height (about log2 n), not the length of the range.

# data-structures/tree/fenwick-tree | before References
Which slice of the array each Fenwick cell stores, for the array [3, 2, 5, 1, 4, 6, 2, 7] with 1-based indexes. The lowest set bit of the index is the slice length.

| Index | Binary | Lowest set bit | Covers positions | Stored sum |
|---|---|---|---|---|
| 1 | 0001 | 1 | 1 to 1 | 3 |
| 2 | 0010 | 2 | 1 to 2 | 5 |
| 3 | 0011 | 1 | 3 to 3 | 5 |
| 4 | 0100 | 4 | 1 to 4 | 11 |
| 5 | 0101 | 1 | 5 to 5 | 4 |
| 6 | 0110 | 2 | 5 to 6 | 10 |
| 7 | 0111 | 1 | 7 to 7 | 2 |
| 8 | 1000 | 8 | 1 to 8 | 30 |

Prefix sum of the first 7 elements: start at 7 and repeatedly remove the lowest set bit (7, 6, 4, then 0). Add the cells bit[7] = 2, bit[6] = 10, bit[4] = 11. The total is 23, which matches 3 + 2 + 5 + 1 + 4 + 6 + 2 = 23.

Changing element 5 goes the other way: add the lowest set bit to the index (5, 6, 8) and update each of those cells, because each one covers position 5. Both walks take O(log n) hops.

# data-structures/bloom-filter | before False Positives
A tiny filter with m = 10 bits and k = 2 hash functions. The hash positions here are made up for the example, and they show how a false positive happens.

| Step | Hash positions | Bits set afterwards (positions 0 to 9) | Answer |
|---|---|---|---|
| Insert "cat" | 1 and 4 | 0100100000 | stored |
| Insert "dog" | 4 and 7 | 0100100100 | stored |
| Search "fox" | 2 and 4 | 0100100100 | bit 2 is 0, so definitely not in the set |
| Search "bird" | 1 and 7 | 0100100100 | both bits are 1, so possibly in the set (a false positive: "bird" was never inserted) |

# data-structures/bloom-filter | after False Positives
The false positive formula from this lesson with k = 3 hash functions, computed for different filter sizes per stored item (m divided by n). More bits per item sharply cuts the error rate.

```mermaid False positive rate (percent) for k = 3 as bits per item grow, computed from the formula above
xychart-beta
  x-axis "bits per item (m / n)" [4, 6, 8, 10, 12, 16]
  y-axis "false positive rate in percent" 0 --> 20
  line "k = 3" [14.7, 6.1, 3.1, 1.7, 1.1, 0.5]
```

# algorithms/cryptography/polynomial-hash | after Polynomial String Hashing
Horner's method on the word `ace` with base 26 and letter values a = 1, c = 3, e = 5 (no modulo, because the numbers are small). Each step multiplies the hash so far by the base and adds the next letter.

| Letter | Value | Step | Hash so far |
|---|---|---|---|
| a | 1 | 0 * 26 + 1 | 1 |
| c | 3 | 1 * 26 + 3 | 29 |
| e | 5 | 29 * 26 + 5 | 759 |

The result 759 equals 1 * 26^2 + 3 * 26 + 5 = 759, the formula in the lesson.

Rolling that window one letter along the text `aceb`, from `ace` to `ceb` (b = 2): remove the leading letter's share, shift, add the new letter. (759 - 1 * 676) * 26 + 2 = 2160. Hashing `ceb` from scratch gives 3 * 676 + 5 * 26 + 2 = 2160, the same number, but the rolled update took one subtraction, one multiplication and one addition instead of redoing the whole window.
