# data-structures/tree/avl-tree | before Code
The **balance factor** of a node is the height of its left subtree minus the height of its right subtree (a missing child has height 0). An AVL tree keeps every balance factor at -1, 0 or 1. Insert 1, 2, 3 in order: 1 gets a right child 2, and 2 gets a right child 3. Node 1 now has balance factor 0 - 2 = -2. The heavy side is right, and the heavy child (2) also leans right, so this is the Right-Right case. A **rotation** lifts 2 above 1: 2 becomes the top, 1 becomes its left child, 3 stays its right child. The in-order sequence is still 1, 2, 3, and the height dropped from 3 to 2. The Left-Left case is the mirror image. The "double" cases (Left-Right and Right-Left) fire when the heavy child leans the other way: first rotate the child so the lean matches, then do the single rotation.

Height after inserting the keys 1, 2, 3, ... in sorted order: a plain binary search tree degrades into a list, while the AVL tree keeps its height near log2 n. A plain search tree sends every new key to the right, so after inserting 1 to 7 its height is 7. The AVL tree rotates after the third key and again as the tree leans, ending as a perfect tree of height 3.

```mermaid Tree height (in nodes) after n sorted inserts: the plain tree grows with n, the AVL tree barely moves
xychart-beta
  x-axis "n keys inserted in order" [7, 15, 31, 63, 127]
  y-axis "tree height" 0 --> 130
  bar "plain BST" [7, 15, 31, 63, 127]
  bar "AVL" [3, 4, 5, 6, 7]
```

# data-structures/tree/red-black-tree | before Balancing during insertion
Notation for the cases: **x** is the node you just inserted (always painted red). **p** is its parent, **g** is its grandparent, and the **uncle** is the other child of g, the sibling of p. Insertion only needs a repair when p is red, because then x and p are two red nodes in a row. Example: insert 10, then 5, then 15, then 1. Node 1 (x) has parent 5 (p, red), grandparent 10 (g) and uncle 15 (red). Rule for a red uncle: paint p and the uncle black and g red (g stays black if it is the root). Here that gives 10 black, 5 black, 15 black, 1 red, and the tree is valid again.

# data-structures/tree/red-black-tree | before Code
The listing below only implements insertion. Its `remove` throws an error. Deletion in a red-black tree is a longer case analysis than insertion, so it is left out here (see the Tushar Roy deletion video in the References).

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

Recoloring makes p and the uncle black and g red (g stays black if it is the root), then the same check runs at g. After either rotation case the node that ends on top becomes black and g red. A black uncle also covers a missing uncle.

# data-structures/tree/avl-tree | after Code
**Known bug in this listing.** `rotateLeftLeft` and `rotateRightRight` attach the new subtree root with `rootNode.parent.setLeft(...)` and `rootNode.parent.setRight(...)` whichever side of its parent `rootNode` was on. Insert 1, 2, 5, 3, 4 in that order and the tree ends up as 2(4(3,5),5): the key 1 vanishes and 5 appears twice. The fix is to remember whether `rootNode` was its parent's left or right child before detaching it, and reattach on that same side (the red-black code on its own page does this with `grandParentNodeIsLeft`). Treat the listing as a way to see the shape of the algorithm, not as code to copy.

`remove` has a second weakness: it calls `balance` on the root only. After deleting 13, 15 and 14 from a full 15-key tree, node 12 is left with a left side of height 2 and an empty right side, and is never rotated. A correct delete walks from the removed node's parent up to the root and calls `balance` on every node on the way, as `insert` does. So the `O(log n)` promise above holds for a correct AVL tree, not for this listing.

# data-structures/tree/red-black-tree | after Code
**Known bug in this listing.** After a Left-Right or Right-Left rotation, one node loses its parent pointer. Insert 10, 30, 20, then 25: the result is 20(10 red, 30 red(25 red, -)), a red node with a red child, which the Properties section forbids. Use the listing to study the case analysis above, not as a working tree. A working version has to reset `parent` on every node it moves in a rotation.

# data-structures/tree/segment-tree | top
This lesson is about the array version of the segment tree. You have an array of numbers and you will be asked many times, "what is the sum (or minimum, or maximum) of positions i to j?" The tree stores the answer for slices of the array (the word "segment" here means a slice of positions, such as positions 0 to 2), so any query can be assembled from a few stored answers instead of scanning every position. The opening paragraph below describes a related but different structure that stores intervals; ignore it for the code on this page.

# data-structures/tree/segment-tree | before Application
Building costs O(n): there are n - 1 internal nodes, and each one is filled with a single call to the operation. For the six numbers below that is 5 calls. A range query costs O(log n), the height of the tree. The `O(n log n)` build time stated above is only an upper bound, not the real cost.

The diagram below (not the picture above) is a sum segment tree built on [2, 5, 1, 4, 9, 3]. Each box shows the range it covers and its stored sum. The highlighted boxes are the only ones read to answer sum of positions 1 to 4.

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

In the code the tree lives in a flat array. The root is at index 0, and the children of the node at index i are at 2i + 1 and 2i + 2. For the six numbers above the array is [24, 8, 16, 7, 1, 13, 3, 2, 5, null, null, 4, 9, null, null]: the size is rounded up to 15 (2 * 8 - 1) so every level is full, and the null cells are unused.

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

In the code, `i & -i` is how the lowest set bit is computed: in binary, -i flips every bit of i and adds 1, so only the lowest 1 bit survives the AND. For i = 6 (0110), -6 is ...11111010, and 6 & -6 = 0010 = 2. So `i -= (i & -i)` is the "remove the lowest set bit" step from the prefix walk (7, 6, 4, 0), and `i += (i & -i)` is the "add the lowest set bit" step from the update walk (5, 6, 8). The cells called bit[...] above are `this.treeArray[...]` in the code.

To change element 5 from 4 to 9, call `increase(5, 5)`: the code adds a difference, it does not overwrite. To load the array [3, 2, 5, 1, 4, 6, 2, 7], start from an empty tree of size 8 and call `increase(i, value)` for each position; the cells then hold the Stored sum column above.

# data-structures/bloom-filter | after Making the filter
A "maybe" is never a guarantee, even when only one item has been inserted. A different item can land on exactly the same positions as that one item, and the filter would still answer "maybe". Only a "no" is certain.

# data-structures/bloom-filter | before False Positives
A tiny filter with m = 10 bits and k = 2 hash functions. The hash positions here are made up for the example, and they show how a false positive happens.

| Step | Hash positions | Bits set afterwards (positions 0 to 9) | Answer |
|---|---|---|---|
| Insert "cat" | 1 and 4 | 0100100000 | stored |
| Insert "dog" | 4 and 7 | 0100100100 | stored |
| Search "fox" | 2 and 4 | 0100100100 | bit 2 is 0, so definitely not in the set |
| Search "bird" | 1 and 7 | 0100100100 | both bits are 1, so possibly in the set (a false positive: "bird" was never inserted) |

# data-structures/bloom-filter | after False Positives
Worked example: k = 3, m = 100 bits, n = 10 items. kn/m = 0.3, e^-0.3 = 0.741, 1 - 0.741 = 0.259, and 0.259^3 = 0.017. About 1.7% of searches for items never inserted will wrongly say "maybe". (e is the constant 2.718..., and the error rate climbs as the filter fills, because n grows.) That matches the chart below: m/n = 10 gives 1.7%.

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

A correction to the formula above: for the symbols s0 to sk (k + 1 of them), the first term is s0 * p^k, not p^(k-1). In the three-letter `ace` example, the first letter gets the highest power, 2.

Now the same roll with a modulus. Use M = 101 and keep base 26. hash(`ace`) = 759 mod 101 = 52. To roll to `ceb`, the leading letter's share is 1 * 26^2 mod 101 = 70, and 52 - 70 is negative (-18). So the code adds M first: 52 + 101 - 70 = 83, then multiplies by 26 and adds b = 2, giving 2160, and 2160 mod 101 = 39. Hashing `ceb` from scratch also gives 39.

In JavaScript the problem with long keys is not an int overflow. Numbers are floats that stay exact only up to 9,007,199,254,740,991 (Number.MAX_SAFE_INTEGER). A 15-character key with base 13 already goes past that, and the result silently becomes inexact.

# algorithms/cryptography/polynomial-hash | before Code
A *multiset* is a collection where order is ignored but repeats count, and *overflow* means a number grew too big to store exactly. *Rabin-Karp* is a string search that hashes the pattern once and rolls a same-length window along the text, comparing hashes instead of letters.

Three warnings before the code. First, `SimplePolynomialHash` runs the polynomial the other way round: the first letter gets the lowest power of the base, so rolling removes it by subtracting and dividing by the base, then adds the new letter times base^(length - 1). The result is a valid hash, just not the same number as the Horner version above. Second, it never uses a modulus, so it only works for short words, and division cannot be undone modulo M. `PolynomialHash` uses the Horner order and a modulus, which is the one Rabin-Karp uses.

Third, the defaults in `PolynomialHash` (base 37, modulus 101) are tiny so the numbers stay readable. With M = 101 only 101 different hash values exist, so any two different words collide about 1 time in 101. Real uses pick a large prime M, such as 1,000,000,007.

# data-structures/bloom-filter | top
The filter is named after Burton Bloom, who described it in 1970 for problems where storing every item exactly would need too much memory.

# data-structures/bloom-filter | after Code
These three hash functions are written for readability. The first two share the same multiplier, so their results move together, and the real false positive rate will be somewhat higher than the formula predicts. The formula assumes the k hash functions are independent, so production filters use strong, well-mixed hashes (or derive k positions from two good hashes).
