# algorithms/math/fibonacci | before Code
The code below is iterative. The textbook recursive definition, fib(n) = fib(n - 1) + fib(n - 2), repeats work:

```mermaid Plain recursion for fib(4) makes 9 calls: the two marked fib(2) boxes are the same work done twice
flowchart TD
  f4[fib 4] --> f3[fib 3]
  f4 --> f2b[fib 2]
  f3 --> f2a[fib 2]
  f3 --> f1a[fib 1]
  f2a --> f1b[fib 1]
  f2a --> f0a[fib 0]
  f2b --> f1c[fib 1]
  f2b --> f0b[fib 0]
  class f2a warn
  class f2b warn
```

```mermaid Calls needed for fib(n): plain recursion explodes, while remembering results stays close to 2n
xychart-beta
  x-axis "n" [5, 10, 15, 20]
  y-axis "function calls" 0 --> 22000
  line "plain recursion" [15, 177, 1973, 21891]
  line "remembering results" [9, 19, 29, 39]
```

# foundations/memoization | after When it applies
How often each question is asked when computing `fib(5)`. Plain recursion makes 15 calls. With the cache from the code below it makes 9, and each `fib(k)` from 2 up does its real work only once.

| Question | Calls, plain recursion | Calls, with cache | Times real work is done | Cache hits |
| --- | --- | --- | --- | --- |
| fib(5) | 1 | 1 | 1 | 0 |
| fib(4) | 1 | 1 | 1 | 0 |
| fib(3) | 2 | 2 | 1 | 1 |
| fib(2) | 3 | 2 | 1 | 1 |
| fib(1) | 5 | 2 | base case | 0 |
| fib(0) | 3 | 1 | base case | 0 |

# foundations/memoization | after Top-down: recursion plus a cache
Order of events for `fib(5)` with the cache. A row that says "stores" is not a new call: it is the earlier call of that name finishing. The 13 rows are 9 calls plus 4 stores.

| Step | Call | What happens |
| --- | --- | --- |
| 1 | fib(5) | not cached, compute |
| 2 | fib(4) | not cached, compute |
| 3 | fib(3) | not cached, compute |
| 4 | fib(2) | not cached, compute |
| 5 | fib(1) | base case, returns 1 |
| 6 | fib(0) | base case, returns 0 |
| 7 | fib(2) | stores 1 |
| 8 | fib(1) | base case, returns 1 |
| 9 | fib(3) | stores 2 |
| 10 | fib(2) | cache hit, returns 1 |
| 11 | fib(4) | stores 3 |
| 12 | fib(3) | cache hit, returns 2 |
| 13 | fib(5) | stores 5 |

# algorithms/sets/knapsack-problem | before Code
Worked 0/1 example with capacity 10 and four items: A (weight 1, value 1), B (weight 3, value 4), C (weight 4, value 5), D (weight 5, value 7). Cell (row, w) holds the best value using the items down to that row with room w. Each cell is the larger of "skip this item" (the cell above) and "take it" (value plus the cell above at w minus weight).

| Allowed items | w=0 | w=1 | w=2 | w=3 | w=4 | w=5 | w=6 | w=7 | w=8 | w=9 | w=10 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| none | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| item A (weight 1, value 1) | 0 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| item B (weight 3, value 4) | 0 | 1 | 1 | 4 | 5 | 5 | 5 | 5 | 5 | 5 | 5 |
| item C (weight 4, value 5) | 0 | 1 | 1 | 4 | 5 | 6 | 6 | 9 | 10 | 10 | 10 |
| item D (weight 5, value 7) | 0 | 1 | 1 | 4 | 5 | 7 | 8 | 9 | 11 | 12 | 13 |

The bottom right cell is 13. Walking back up, each row where the value changed shows an item that was taken: A, C, D. Example of one cell: item D at w=10 compares skipping (10) with taking (7 + the best at w=5 from the rows above, 6, which is 13).

The three variants on the same items and capacity 10, found by trying every combination:

| Variant | Copies of each item allowed | Best value | Items |
| --- | --- | --- | --- |
| 0/1 | at most 1 | 13 | A, C, D |
| Bounded | at most 2 (here) | 14 | D x2 |
| Unbounded | any number | 14 | D x2 |

In plain words: pick how many copies xi of each item i to take (0 or 1 for 0/1). Add up value vi times xi to get the total value, and weight wi times xi to get the total weight. Maximize the first while the second stays at or below W.

Warning: the Knapsack.js below is the upstream version. Its trace-back step fails on the example above (it reads a row that does not exist and throws) and picks wrong items on other inputs. Use it to see the idea, and rely on the table above. A version that matches the table and the demo:

```js
function knapsack01(items, W) { // items: [{ weight, value }]
  const dp = [Array(W + 1).fill(0)];
  items.forEach(({ weight, value }, k) => {
    dp.push(dp[k].map((skip, w) => (weight <= w ? Math.max(skip, value + dp[k][w - weight]) : skip)));
  });
  const taken = [];
  for (let i = items.length, w = W; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) { taken.push(items[i - 1]); w -= items[i - 1].weight; }
  }
  return { best: dp[items.length][W], taken };
}
```

The unbounded method in Knapsack.js is a greedy shortcut, not dynamic programming. It takes items by value per weight and can miss the best answer: with capacity 10, item P (weight 6, value 10) and item Q (weight 5, value 8), greedy takes one P for 10, but two Q give 16. It can also add an item that does not fit. For unbounded knapsack the dynamic programming version is best[w] = max over items of (value + best[w - weight]), with best[0] = 0.

The table has one row per item and one column per capacity from 0 to W, so time and space are O(n * W). Keeping only the previous row cuts space to O(W). W is a number, not a size, so doubling W doubles the work even though the input did not get longer to write.

# algorithms/sets/longest-common-subsequence | before Code
Table for `ABCDGH` (rows) and `AEDFHR` (columns), the first example above. (The code puts its first input along the columns, so its own table is this one turned on its side. The numbers and the answer are the same.) Cell (i, j) is the LCS length of the first i letters of one string and the first j of the other. When the two letters match, take the diagonal cell plus 1. Otherwise take the larger of the cell above and the cell to the left.

|  | (empty) | A | E | D | F | H | R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| (empty) | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **A** | 0 | **1** | 1 | 1 | 1 | 1 | 1 |
| **B** | 0 | 1 | 1 | 1 | 1 | 1 | 1 |
| **C** | 0 | 1 | 1 | 1 | 1 | 1 | 1 |
| **D** | 0 | 1 | 1 | **2** | 2 | 2 | 2 |
| **G** | 0 | 1 | 1 | 2 | 2 | 2 | 2 |
| **H** | 0 | 1 | 1 | 2 | 2 | **3** | 3 |

The bottom right cell is 3. The bold cells mark the matches found when walking back from it, and they spell ADH, as the lesson says.

Complexity: the table has (m + 1) * (n + 1) cells and each takes constant work, so time and space are both O(m * n), where m and n are the string lengths. The second code block below is the same idea written top-down. If the first letters match, they belong in the LCS, so keep that letter and solve the rest. If not, try dropping the first letter of each string in turn and keep the longer answer. The memo stores answers for pairs it has already solved, so each pair of suffixes is solved once.

# algorithms/sets/longest-increasing-subsequence | before Code
The O(n * n) dynamic programming in the code gives each element a length: the longest increasing subsequence that ends at it. It is 1 plus the best length among earlier smaller elements. On the 16-term example:

| Position | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Value | 0 | 8 | 4 | 12 | 2 | 10 | 6 | 14 | 1 | 9 | 5 | 13 | 3 | 11 | 7 | 15 |
| Length ending here | 1 | 2 | 2 | 3 | 2 | 3 | 3 | 4 | 2 | 4 | 3 | 5 | 3 | 5 | 4 | 6 |

The largest length is 6, matching the lesson. The O(n log n) method keeps a list `tails` where entry k is the smallest value that can end an increasing subsequence of length k + 1. Each new value replaces the first entry that is not smaller than it, or is appended. First 8 values:

| Step | Next value | Action | tails afterwards |
| --- | --- | --- | --- |
| 1 | 0 | append | 0 |
| 2 | 8 | append | 0, 8 |
| 3 | 4 | replace 8 | 0, 4 |
| 4 | 12 | append | 0, 4, 12 |
| 5 | 2 | replace 4 | 0, 2, 12 |
| 6 | 10 | replace 12 | 0, 2, 10 |
| 7 | 6 | replace 10 | 0, 2, 6 |
| 8 | 14 | append | 0, 2, 6, 14 |

After all 16 values `tails` has 6 entries, so the length is 6 again. The list is a length counter: its contents need not be a real subsequence.

# algorithms/string/levenshtein-distance | before Applications
The full table for `kitten` (rows) and `sitting` (columns). Cell (i, j) is the distance between the first i letters of one word and the first j of the other. The first row and column count pure deletions or insertions.

|  | (empty) | s | i | t | t | i | n | g |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| (empty) | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
| **k** | 1 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
| **i** | 2 | 2 | 1 | 2 | 3 | 4 | 5 | 6 |
| **t** | 3 | 3 | 2 | 1 | 2 | 3 | 4 | 5 |
| **t** | 4 | 4 | 3 | 2 | 1 | 2 | 3 | 4 |
| **e** | 5 | 5 | 4 | 3 | 2 | 2 | 3 | 4 |
| **n** | 6 | 6 | 5 | 4 | 3 | 3 | 2 | 3 |

Last cell, step by step: letters n and g differ. The three options are: take the cell above and add 1 (4 + 1 = 5, drop the extra letter from kitten), take the cell to the left and add 1 (2 + 1 = 3, add the missing g), or take the diagonal cell and add 1 for the swap (3 + 1 = 4, substitution). The smallest is 3, the distance given in the Example section. In the code below the word `a` runs along the columns, so there the left cell is the one called deletion. The names depend on which word is the rows, the arithmetic does not.

# algorithms/uncategorized/unique-paths | before Algorithms
Filled grid for the second example, m = 7 and n = 3 (the grid has 7 columns and 3 rows here, and swapping m and n gives the same answer; the LeetCode page uses m for rows). Each cell is the cell above plus the cell to the left, and the first row and column are all 1. The bottom right cell is 28, matching the example.

|  | col 0 | col 1 | col 2 | col 3 | col 4 | col 5 | col 6 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **row 0** | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| **row 1** | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
| **row 2** | 1 | 3 | 6 | 10 | 15 | 21 | 28 |

# algorithms/uncategorized/unique-paths | after Algorithms
Correction: the 3 x 2 table above has a typo. The column labels should be 0, 1, 2 and the top-left cell is 1, not 0. The 3 x 2 board is:

|     | 0 | 1 | 2 |
| --- | --- | --- | --- |
| **0** | 1 | 1 | 1 |
| **1** | 1 | 2 | 3 |

Correction on time: the backtracking call tree has one leaf per path, and the number of paths on an n by n board is 2, 6, 20, 70, 252, 924, 3432 for n = 2 to 8. That is much more than 2^n (256 at n = 8). A path has m + n - 2 moves with two choices each, so the safe bound is O(2^(m + n)).

Pascal's triangle starts with the row 1, then 1 1, then 1 2 1, then 1 3 3 1. Each entry is the two entries above it added, which is the same rule as our grid. Rows and positions both count from 0. For m = 7, n = 3: row 8 is 1 8 28 56 70 56 28 8 1, position 2 is 28, the answer. Why: every route has 6 rights and 2 downs, 8 moves in all, so you are choosing which 2 of the 8 moves go down: 8 choose 2 = 28.

# algorithms/uncategorized/unique-paths | before Code
```mermaid Unique paths on a square k by k grid: each extra row and column multiplies the count by 3.7 at k = 8, and the factor keeps creeping toward 4
xychart-beta
  x-axis "grid side k" [2, 3, 4, 5, 6, 7, 8]
  y-axis "unique paths" 0 --> 3432
  bar "paths" [2, 6, 20, 70, 252, 924, 3432]
```

Dividing neighbours gives the factor: 3432 / 924 = 3.7.

# algorithms/math/fibonacci | after Code
Both iterative functions above expect n of 1 or more. Called with 0 they never return, because the loop counts down from -1 and -1 is never 0. If you need fib(0) = 0, add a line at the top: if (n <= 0) return 0.

The code counts positions from 1: fibonacciNth(1) = 1, fibonacciNth(2) = 1, fibonacciNth(5) = 5, and fibonacci(5) returns [1, 1, 2, 3, 5]. The leading 0 of the sequence above is left out.

The third function uses Binet's formula: fib(n) is the nearest whole number to phi^n / sqrt(5), where phi = (1 + sqrt(5)) / 2, about 1.618. Worked example for n = 10: phi^10 is about 122.992, divided by 2.236 is about 55.004, which rounds to 55, the tenth Fibonacci number. It runs in constant time, but it uses floating point numbers, which lose exactness past 16 digits. From position 71 the answer is off by one, which is why the code refuses positions above 70.

The loop keeps only the last two values, so fibonacciNth takes O(n) time and O(1) space. It is the bottom-up version from the Memoization lesson with the table cut down to two variables. fibonacci(n) keeps the whole list, so it needs O(n) space.

# algorithms/sets/longest-increasing-subsequence | after Code
Why the tails list works: tails[k] is the smallest value that can end an increasing subsequence of length k + 1. A smaller ending is never worse, because anything that can extend a larger ending can also extend a smaller one. So a new value replaces the first entry that is not smaller than it (that entry stays the best ending for its length), and it is appended only when it beats every entry, which makes the longest length one bigger. tails is always sorted, so each step can find that entry with binary search, which gives O(n log n). The 16-term example is just a convenient test input: a sequence built by reversing the binary digits of 0 to 15 (the Van der Corput sequence).

# algorithms/string/levenshtein-distance | after Code
Cost: the table has (len(a) + 1) * (len(b) + 1) cells and each takes constant work, so time and space are both O(len(a) * len(b)). Tabulation means filling this table from the smallest sub-problems up, instead of recursing down with a cache as in the memoization lesson.
