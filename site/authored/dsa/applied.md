# algorithms/uncategorized/knight-tour | before Code
How the search works: put the knight on the top left square and mark it visited. Try its moves in a fixed order. For the first legal square, mark it and repeat from there. If a square has no legal unvisited move and the board is not full, unmark the last square (this is the backtracking step) and try the next move from the square before it. Stop when all squares are marked. On a 3 by 3 board the center square can never be reached by any knight move, so every branch fails, after 15 calls.

The tour the code on this page finds on a 5 by 5 board. It starts at the top left corner, and each number is the move on which the knight lands on that square (row by row from the top).

| 1 | 4 | 11 | 16 | 25 |
| :-: | :-: | :-: | :-: | :-: |
| 12 | 17 | 2 | 5 | 10 |
| 3 | 20 | 7 | 24 | 15 |
| 18 | 13 | 22 | 9 | 6 |
| 21 | 8 | 19 | 14 | 23 |

The counts below come from that move order. These counts are the recursive calls the code makes for each board size, starting at the top left corner.

| Board | Tour found? | Recursive calls |
| :-- | :-- | :-- |
| 3 by 3 | no | 15 |
| 4 by 4 | no | 2223 |
| 5 by 5 | yes | 31693 |
| 6 by 6 | yes | 1219046 |

Plain backtracking explodes quickly: going from 5 by 5 to 6 by 6 multiplies the calls by about 38.

# algorithms/sets/cartesian-product | before Code
The two loops of the code on `A = {x, y, z}` and `B = {1, 2, 3}`. The outer loop walks A, the inner loop walks B, and each cell holds the pair created at that step (the number is the order of creation).

| | 1 | 2 | 3 |
| :-- | :-: | :-: | :-: |
| **x** | (x, 1) is pair 1 | (x, 2) is pair 2 | (x, 3) is pair 3 |
| **y** | (y, 1) is pair 4 | (y, 2) is pair 5 | (y, 3) is pair 6 |
| **z** | (z, 1) is pair 7 | (z, 2) is pair 8 | (z, 3) is pair 9 |

The product has 3 * 3 = 9 pairs, one per grid cell. In general its size is the size of A times the size of B.

# algorithms/sets/fisher-yates | before Code
The loop of the code on `A, B, C, D, E`. It walks `i` from the last index down to 1, swaps position `i` with a random position from 0 to `i`, and never touches positions after `i` again. The random picks here are chosen for illustration.

| i | Random position (0 to i) | Array after the swap | Final part |
| :-- | :-- | :-- | :-- |
| start | none | A B C D E | none |
| 4 | 1 | A E C D B | B |
| 3 | 3 (swaps with itself) | A E C D B | D B |
| 2 | 0 | C E A D B | A D B |
| 1 | 1 (swaps with itself) | C E A D B | E A D B |

The picks have 5, 4, 3 and 2 options, so 5 * 4 * 3 * 2 = 120 equally likely paths lead to the 120 orderings of five items: each ordering appears exactly once. A tempting alternative swaps every position with a random position from the whole array. For three items it has 27 equally likely paths, and 27 cannot split evenly into 6 orderings.

| Ordering of A B C | Paths with swap-with-anyone | Paths with Fisher-Yates |
| :-- | :-- | :-- |
| A B C | 4 | 1 |
| A C B | 5 | 1 |
| B A C | 5 | 1 |
| B C A | 5 | 1 |
| C A B | 4 | 1 |
| C B A | 4 | 1 |

# algorithms/sets/cartesian-product | after Code
One edge case: the product of any set with an empty set is the empty set, because there is no pair to make. This code returns `null` for that case instead of an empty array, so check for `null` before looping over the result.

# algorithms/sets/fisher-yates | after Code
A permutation is one ordering of the items. The tempting wrong version looks almost the same: `for (let i = 0; i < array.length; i += 1) { const j = Math.floor(Math.random() * array.length); [array[i], array[j]] = [array[j], array[i]]; }`. The only change is that j can be any index, so each step has 3 options for 3 items, 27 paths in total, which cannot divide evenly over 6 orderings.

# algorithms/statistics/weighted-random | after The Algorithm
The cumulative-weights method on the same items, with the lesson's example `randomNumber = 8`. Each item owns a slice of the numbers 1 to 11 as wide as its weight, and the first cumulative weight that is at least the random number wins.

| Item | Weight | Cumulative weight | Numbers that pick it | Chance |
| :-- | :-- | :-- | :-- | :-- |
| Banana | 3 | 3 | 1 to 3 | 3 / 11 |
| Apple | 7 | 10 | 4 to 10 | 7 / 11 |
| Carrot | 1 | 11 | 11 | 1 / 11 |

For 8, the first cumulative weight that is 8 or more is 10, so the pick is the apple.

The code's random number is a decimal such as 3.5, not a whole number. Banana wins for 0 up to 3, apple for anything above 3 up to 10, carrot for anything above 10 up to 11. The ranges are 3, 7 and 1 wide, which is why the chances are 3/11, 7/11 and 1/11.

# algorithms/ml/k-means | before Code Examples
Step 6 means: keep repeating steps 3 to 5 until a full pass changes nothing. The code checks this by watching the labels. If no point switches cluster, the next centroids would be the same as the last ones, so the loop can stop.

The centroid of a cluster is the average of its points, taken one coordinate at a time. For (1.5, 2) and (3, 4) it is (2.25, 3).

# algorithms/ml/k-means | after Code Examples
The Wikipedia article linked under References is titled "k-means clustering".

# algorithms/ml/k-means | before Code
```mermaid The k-means loop: assign points to the nearest center, move each center to the middle of its points, and stop when no point changes cluster
flowchart TD
  S[Centers start as the first k points] --> A[Assign every point to its nearest center]
  A --> M[Move each center to the mean of its points]
  M --> C{Did any point change cluster?}
  C -->|yes| A
  C -->|no| D[Done]
  class D good
```
Here is the code of this page run on 7 two-dimensional points with `k = 2`. Points are P1 (1, 1), P2 (1.5, 2), P3 (3, 4), P4 (5, 7), P5 (3.5, 5), P6 (4.5, 5) and P7 (3.5, 4.5). The first centers are P1 and P2. Centers are rounded to 2 decimals, as in the code.

| Round | Cluster of P1 to P7 | New center 0 | New center 1 | Any change? |
| :-- | :-- | :-- | :-- | :-- |
| 1 | 0, 1, 1, 1, 1, 1, 1 | (1, 1) | (3.5, 4.58) | yes |
| 2 | 0, 0, 1, 1, 1, 1, 1 | (1.25, 1.5) | (3.9, 5.1) | yes |
| 3 | 0, 0, 1, 1, 1, 1, 1 | (1.25, 1.5) | (3.9, 5.1) | no, stop |

The loop stops in round 3 because the assignments match round 2. The first two points end up in cluster 0 and the other five in cluster 1.

# algorithms/ml/knn | before Code
Distance from (3, 3) to (5, 4) is the square root of (5-3)^2 + (4-3)^2 = 4 + 1 = 5, so about 2.24.

A query point `(3, 3)` and 7 labelled points, sorted by distance as the code does it (distances rounded to 2 decimals, as in the code).

| Rank | Point | Label | Distance |
| :-- | :-- | :-- | :-- |
| 1 | (3.5, 3.5) | B | 0.71 |
| 2 | (2, 2) | A | 1.41 |
| 3 | (3, 1) | A | 2 |
| 4 | (5, 4) | B | 2.24 |
| 5 | (2, 6) | B | 3.16 |
| 6 | (0, 1) | A | 3.61 |
| 7 | (0, 0) | A | 4.24 |

The answer depends on how many neighbours vote.

| k | Labels among the k nearest | Winner |
| :-- | :-- | :-- |
| 1 | B | B |
| 3 | B, A, A | A |
| 5 | B, A, A, B, B | B |
| 7 | B, A, A, B, B, A, A | A |

The winner flips as k grows, so k is a setting you tune, not a constant. With two classes an odd k cannot tie. With three or more classes it can (k = 3 and one vote each). This code then returns whichever class reached the top count first while counting, which is the one nearest the query.

# algorithms/cryptography/caesar-cipher | after Example
The code with a shift of 3 on `hello`, then on `xyz` to show the wrap-around. The letter number is its position in the alphabet starting at 0, and `% 26` brings it back to the start of the alphabet.

| Letter | Number | Number + 3 | After `% 26` | Cipher letter |
| :-- | :-- | :-- | :-- | :-- |
| h | 7 | 10 | 10 | k |
| e | 4 | 7 | 7 | h |
| l | 11 | 14 | 14 | o |
| l | 11 | 14 | 14 | o |
| o | 14 | 17 | 17 | r |
| x | 23 | 26 | 0 | a |
| y | 24 | 27 | 1 | b |
| z | 25 | 28 | 2 | c |

Decrypting uses the shift -3 through the same table, which is why the code builds one cipher map from either sign.

Direction matters. The text example (T becomes Q) shifts left by 3, which the code calls a shift of -3. The table with `hello` shifts right by 3, a shift of 3 (so h becomes k). Decrypting a shift of 3 is the same as encrypting with -3.

This code lowercases the message first, so capitals are lost. Characters outside a to z, such as spaces, are copied unchanged.

# algorithms/cryptography/caesar-cipher | top
Here n is the number of characters in the message: each character is looked up once. The cipher map has 26 entries whatever the message, so it adds no growth.

# algorithms/cryptography/hill-cipher | before Encryption
```mermaid Hill encryption of ACT with the lesson's key: letters become numbers, the key matrix mixes them, and the result is taken modulo 26
flowchart TD
  A[ACT] --> B[0 2 19]
  B --> C[Key matrix times the numbers]
  C --> D[67 222 319]
  D --> E[Modulo 26 gives 15 14 7]
  E --> F[POH]
```

# algorithms/cryptography/hill-cipher | after Defining the encrypting matrix
Over ordinary numbers a matrix has an inverse when its determinant is not zero. Modulo 26 the test is stricter: the determinant must share no factor with 26, so it must be odd and not a multiple of 13.

The lesson's 3 by 3 key has determinant 441, which is not zero and has no factor of 2 or 13 (441 is 3 * 3 * 7 * 7), so it is a valid key. Among all 456976 possible 2 by 2 matrices with entries from 0 to 25, only 157248 (about 34 percent) pass this check.

# algorithms/cryptography/hill-cipher | before References
Use capital letters only. The code accepts a to z too, but it turns a letter into a number as (character code) % 65, which gives 0 to 25 for capitals but 32 to 57 for lowercase. Encrypting `act` with the lesson's key returns `TOH` instead of `POH`. Convert the message and the key to uppercase first.

The code on this page only encrypts. Its decrypt function throws an error, and it does not check that the key is invertible, so a key that fails the determinant test will encrypt but can never be decrypted.

# algorithms/cryptography/rail-fence-cipher | top
A transposition cipher hides a message by shuffling its letters into a new order. No letter is changed, so the ciphertext has exactly the same letters as the message.

# algorithms/cryptography/rail-fence-cipher | before Code
A note on the drawing above: the sentence is the classic Wikipedia example in its older wording. Wikipedia's current page uses `RUN AT ONCE` and gets `WECRUO ERDSOEERNTNE AIVDAC`. Spaces and punctuation are dropped in the drawing, so only the 25 letters are placed.

The code below assumes at least 2 rails (with 1 rail there is no zigzag, and the ciphertext is just the message) and it recurses once per character, so it fails on messages of a few thousand letters. It is written to be read, not to be fast.

Encoding `HELLOWORLD` on 3 rails. The rail number bounces 0, 1, 2, 1, 0, 1, 2, 1, 0, 1 as the message is written along the fence.

| Position | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
| :-- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| Letter | H | E | L | L | O | W | O | R | L | D |
| Rail | 0 | 1 | 2 | 1 | 0 | 1 | 2 | 1 | 0 | 1 |

Reading the rails from top to bottom gives rail 0 = `HOL`, rail 1 = `ELWRD`, rail 2 = `LO`, so the ciphertext is `HOLELWRDLO`. To decode, walk the same bounce pattern to learn that the rails hold 3, 5 and 2 letters, cut the ciphertext into those pieces, and read the letters back in zigzag order.

# algorithms/image-processing/seam-carving | top
This page teaches seam carving, a way to shrink an image's width without squashing the objects in it. The idea: score every pixel by how much it stands out, find the top-to-bottom path of least important pixels, delete it, and repeat. Finding that path quickly is a dynamic programming problem, meaning we solve it by saving the answer to each smaller piece so we never compute the same piece twice. The interactive resizer mentioned below is on the author's site (linked); here you get the pictures, the reasoning and the code.

# algorithms/image-processing/seam-carving | before Implementation in TypeScript
```mermaid Shrinking an image by one column at a time: measure energy, find the cheapest top-to-bottom seam, delete it, repeat
flowchart TD
  I[Image] --> E[Compute the energy of every pixel]
  E --> S[Find the lowest energy seam with dynamic programming]
  S --> R[Remove the seam]
  R --> Q{Narrow enough?}
  Q -->|no| E
  Q -->|yes| O[Resized image]
  class O good
```

# algorithms/image-processing/seam-carving | after How Seam Carving algorithms works
Correction to the energy range above: the biggest energy happens when both neighbors differ from the middle pixel by 255 in every color channel. That gives the square root of 2 * 3 * 255 * 255 = 390150, which is about 624.6, so the range is 0 to 625 when rounded, not 626. Real pixels are far below that.

# algorithms/image-processing/seam-carving | before Objects removal
About the naive search under the dynamic programming approach: the naive search grows by a factor of 3 for every extra row, so even a 100-row image has more than 10^47 paths to try per starting column (3^100 is about 5.15 * 10^47). Keep the width in the formula, w * 3^h, as the chart below does. Pixels on the left and right edges have 2 choices instead of 3, so 3^h is an upper bound.

A small energy map, filled in with the dynamic programming rule from this page. Each cell of the second table holds the cheapest seam energy that ends there: its own energy plus the smallest value among the three cells above it.

| Energy map | Col 0 | Col 1 | Col 2 | Col 3 |
| :-- | :-: | :-: | :-: | :-: |
| Row 0 | 9 | 3 | 7 | 6 |
| Row 1 | 5 | 8 | 2 | 9 |
| Row 2 | 4 | 6 | 3 | 1 |
| Row 3 | 7 | 2 | 8 | 5 |

| Seam energies | Col 0 | Col 1 | Col 2 | Col 3 |
| :-- | :-: | :-: | :-: | :-: |
| Row 0 | 9 | 3 | 7 | 6 |
| Row 1 | 8 | 11 | 5 | 15 |
| Row 2 | 12 | 11 | 8 | 6 |
| Row 3 | 18 | 10 | 14 | 11 |

The smallest value in the last row is 10, in column 1. Following the smallest cell above each time gives the seam at columns 1, 2, 2, 1 (energies 3, 2, 3, 2). The greedy approach, which always takes the cheapest next pixel, starts in column 1, then picks columns 2, 3, 3 for a total of 11. It misses the cheaper seam by 1.

The chart shows why the table approach is needed: checking every path costs about w * 3^h steps, while the table costs about w * h. Here the width w is 10 and h is the image height.

```mermaid Steps to find a seam in an image 10 pixels wide: all paths against the table method as the height grows
xychart-beta
  x-axis "image height" [1, 2, 3, 4, 5, 6]
  y-axis "steps" 0 --> 7500
  line "all paths, w * 3^h" [30, 90, 270, 810, 2430, 7290]
  line "table, w * h" [10, 20, 30, 40, 50, 60]
```
