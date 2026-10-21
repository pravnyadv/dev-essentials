# algorithms/math/factorial | after Overview
Why is `0!` equal to `1`? Multiplying no numbers at all gives `1`, the same way adding no numbers gives `0`. It also keeps the pattern `n! = n * (n - 1)!` working: `1! = 1 * 0!` only holds if `0! = 1`. The code below returns `1` for `0` for the same reason.

```mermaid Factorial against doubling: n! passes 2^n at n = 4 and is more than 150 times larger by n = 8
xychart-beta
  x-axis "n" [1, 2, 3, 4, 5, 6, 7, 8]
  y-axis "value" 0 --> 40320
  line "n!" [1, 2, 6, 24, 120, 720, 5040, 40320]
  line "2^n" [2, 4, 8, 16, 32, 64, 128, 256]
```

# algorithms/math/factorial | before Code
The recursive version waits on a chain of calls, then multiplies on the way back. Trace of `factorialRecursive(4)`:

| Step | Call | What happens |
| --- | --- | --- |
| 1 | factorialRecursive(4) | 4 > 1, so it must compute 4 * factorialRecursive(3) and waits |
| 2 | factorialRecursive(3) | 3 > 1, so it must compute 3 * factorialRecursive(2) and waits |
| 3 | factorialRecursive(2) | 2 > 1, so it must compute 2 * factorialRecursive(1) and waits |
| 4 | factorialRecursive(1) | n is not above 1, so it returns 1 (base case) |
| 5 | factorialRecursive(2) | gets 1 back and returns 2 * 1 = 2 |
| 6 | factorialRecursive(3) | gets 2 back and returns 3 * 2 = 6 |
| 7 | factorialRecursive(4) | gets 6 back and returns 4 * 6 = 24 |

# algorithms/uncategorized/recursive-staircase | after The Problem
The last step is either a 1-step or a 2-step, so the ways to reach stair n are the ways to reach n - 1 plus the ways to reach n - 2.

| Stairs n | Ways | How it is built |
| --- | --- | --- |
| 1 | 1 | base case |
| 2 | 2 | base case |
| 3 | 3 | ways(2) + ways(1) = 2 + 1 |
| 4 | 5 | ways(3) + ways(2) = 3 + 2 |
| 5 | 8 | ways(4) + ways(3) = 5 + 3 |
| 6 | 13 | ways(5) + ways(4) = 8 + 5 |

These are the Fibonacci numbers, shifted by one.

Two terms come up in the list of solutions below. Memoization means saving each answer the first time you compute it, so the next request for the same stair count is a lookup instead of a repeat calculation. Dynamic programming here means filling a table from the small cases upward, so nothing is ever asked twice. The Memoization and Recursion lessons cover the full idea.

# algorithms/uncategorized/recursive-staircase | after The Solution
A note on the brute-force space figure above: it does not store a table, but every call that is still waiting for its two sub-answers stays on the call stack. The longest chain is about n calls deep, so its extra space is O(n), not O(1). Only the iterative version really uses O(1) space.

```mermaid Brute force for 5 stairs makes 9 calls, and the marked boxes repeat questions already asked (3 appears twice, 2 appears three times)
flowchart TD
  a5[5] --> a4[4]
  a5 --> a3[3]
  a4 --> b3[3]
  a4 --> b2[2]
  b3 --> c2[2]
  b3 --> c1[1]
  a3 --> d2[2]
  a3 --> d1[1]
  class a3 warn
  class b3 warn
  class b2 bad
  class c2 bad
  class d2 bad
```

```mermaid Calls made: brute force multiplies its calls by about 1.6 per extra stair, while memoization adds 2 calls per stair
xychart-beta
  x-axis "stairs n" [5, 10, 15, 20]
  y-axis "calls" 0 --> 22000
  line "brute force" [9, 109, 1219, 13529]
  line "with memo" [7, 17, 27, 37]
```

# algorithms/uncategorized/hanoi-tower | before Code
The idea: to move a stack of `n` discs from pole A to pole C, first move the top `n - 1` discs to pole B (the spare), then move the biggest disc from A to C, then move the `n - 1` discs from B onto C. Moving `n - 1` discs is the same problem, just smaller, which is why it is a recursion. If `M(n)` is the number of moves, `M(n) = M(n - 1) + 1 + M(n - 1) = 2 * M(n - 1) + 1`. Starting from `M(1) = 1` this gives 1, 3, 7, 15, and so on, which is `2^n - 1`.

Pole A holds discs 3 (largest), 2 and 1 (smallest). The big disc moves only once the two smaller ones are parked on pole B. Discs on each pole are listed bottom to top.

| Move | Disc | Route | Pole A | Pole B | Pole C |
| --- | --- | --- | --- | --- | --- |
| 1 | disc 1 | A to C | 3 2 | - | 1 |
| 2 | disc 2 | A to B | 3 | 2 | 1 |
| 3 | disc 1 | C to B | 3 | 2 1 | - |
| 4 | disc 3 | A to C | - | 2 1 | 3 |
| 5 | disc 1 | B to A | 1 | 2 | 3 |
| 6 | disc 2 | B to C | 1 | - | 3 2 |
| 7 | disc 1 | A to C | - | - | 3 2 1 |

Moves needed as discs are added, from the 2^n - 1 rule:

| Discs n | Moves 2^n - 1 |
| --- | --- |
| 1 | 1 |
| 2 | 3 |
| 3 | 7 |
| 4 | 15 |
| 5 | 31 |
| 10 | 1,023 |
| 20 | 1,048,575 |

# algorithms/sets/power-set | before Code
A note on the Bitwise Solution table above: it writes the bits as `abc` with `a` on the left, so the lowest bit (the right-hand one) picks `c`. The code in `bwPowerSet.js` reads the bits the other way: the lowest bit picks the first element, because it tests `1 << setElementIndex`. So for the set {1, 2, 3} the code produces the subsets in this order: {}, {1}, {2}, {1, 2}, {3}, {1, 3}, {2, 3}, {1, 2, 3}. It is the same eight subsets, just listed in a different order. The numbers run from `0` up to `2^n - 1` (for three elements, 0 to 7), which is exactly `2^n` numbers.

# algorithms/sets/power-set | before Code
```mermaid Backtracking power set of {1, 2, 3}: every box is one recorded subset, and each edge is one element added
flowchart TD
  n0[empty] -->|1| n1[1]
  n0 -->|2| n2[2]
  n0 -->|3| n3[3]
  n1 -->|2| n12[1 2]
  n1 -->|3| n13[1 3]
  n12 -->|3| n123[1 2 3]
  n2 -->|3| n23[2 3]
```

Only larger elements are tried after the current one (`startAt` in the code), so each subset appears once. Trace of `btPowerSet([1, 2, 3])`:

| Step | Action | Current subset | Note |
| --- | --- | --- | --- |
| 0 | start | {} | record the empty set |
| 1 | add 1 | {1} | record it |
| 2 | add 2 | {1, 2} | record it |
| 3 | add 3 | {1, 2, 3} | record it |
| 4 | undo 3 | {1, 2} | back up one level |
| 5 | undo 2 | {1} | back up one level |
| 6 | add 3 | {1, 3} | record it |
| 7 | undo 3 | {1} | back up one level |
| 8 | undo 1 | {} | back up one level |
| 9 | add 2 | {2} | record it |
| 10 | add 3 | {2, 3} | record it |
| 11 | undo 3 | {2} | back up one level |
| 12 | undo 2 | {} | back up one level |
| 13 | add 3 | {3} | record it |
| 14 | undo 3 | {} | back up one level |

```mermaid Every extra element doubles the number of subsets
xychart-beta
  x-axis "elements n" [1, 2, 3, 4, 5, 6, 7, 8]
  y-axis "subsets" 0 --> 256
  bar "2^n" [2, 4, 8, 16, 32, 64, 128, 256]
```

# algorithms/sets/combinations | before Cheatsheet
Choosing 2 of 4 letters A, B, C, D. Each combination is one group, but it can be ordered 2 different ways, so there are 6 combinations and 12 permutations (4 * 3). Dividing by the orderings, 12 / 2 = 6, is the `n! / (r! (n - r)!)` formula at work.

| Combination (order ignored) | Orderings it hides (permutations) |
| --- | --- |
| {A, B} | AB, BA |
| {A, C} | AC, CA |
| {A, D} | AD, DA |
| {B, C} | BC, CB |
| {B, D} | BD, DB |
| {C, D} | CD, DC |

Ice-cream check with repetition allowed: 5 flavours, 3 scoops. The count is (n + r - 1)! / (r! (n - 1)!) = 7! / (3! * 4!) = 35 different cones, against 5 * 4 * 3 = 60 ordered picks without repetition or 5^3 = 125 ordered picks with it.

# algorithms/sets/permutations | before Cheatsheet
```mermaid Filling 3 slots from A, B, C: the choices shrink at each slot, giving 3 * 2 * 1 = 6 permutations
flowchart TD
  s1[Slot 1: 3 letters left] --> s2[Slot 2: 2 letters left]
  s2 --> s3[Slot 3: 1 letter left]
  s3 --> r[3 * 2 * 1 = 6 orders]
  class r focus
```

Arranging all n items (r = n) without repetition gives n!. With repetition every slot has all n options, so n^n. Computed values:

| n | Without repetition (n!) | With repetition (n^n) |
| --- | --- | --- |
| 1 | 1 | 1 |
| 2 | 2 | 4 |
| 3 | 6 | 27 |
| 4 | 24 | 256 |
| 5 | 120 | 3,125 |
| 6 | 720 | 46,656 |

A 3-digit lock with digits 0 to 9 (r = 3, n = 10) has 10 * 9 * 8 = 720 orders when digits cannot repeat and 10^3 = 1,000 when they can.

# algorithms/sets/combination-sum | before Code
Trace for `candidates = [2, 3, 5]`, `target = 8`: each row is a call that ends right away, in the order the code reaches them. Calls that still have a positive remainder keep adding candidates, so they are not listed. The same call order gives all 3 answers shown in the Examples section.

| Path so far | Remaining | Outcome |
| --- | --- | --- |
| [2, 2, 2, 2] | 0 | save as answer |
| [2, 2, 2, 3] | -1 | too far, undo last |
| [2, 2, 2, 5] | -3 | too far, undo last |
| [2, 2, 3, 3] | -2 | too far, undo last |
| [2, 2, 3, 5] | -4 | too far, undo last |
| [2, 2, 5] | -1 | too far, undo last |
| [2, 3, 3] | 0 | save as answer |
| [2, 3, 5] | -2 | too far, undo last |
| [2, 5, 5] | -4 | too far, undo last |
| [3, 3, 3] | -1 | too far, undo last |
| [3, 3, 5] | -3 | too far, undo last |
| [3, 5] | 0 | save as answer |
| [5, 5] | -2 | too far, undo last |

# algorithms/uncategorized/n-queens | after Backtracking Algorithm
Rows are numbered from 0 at the top. The trace shows the row of the queen in each column so far, searching a 4 by 4 board column by column until the first solution is found. Dead ends ("backtrack") remove the latest queen and retry.

| Step | What happens | Rows of queens in columns 0, 1, ... afterwards |
| --- | --- | --- |
| 1 | column 0 row 0 is safe, place | 0 |
| 2 | column 1 row 2 is safe, place | 0, 2 |
| 3 | column 2 has no safe row, backtrack and remove the queen in column 1 | 0 |
| 4 | column 1 row 3 is safe, place | 0, 3 |
| 5 | column 2 row 1 is safe, place | 0, 3, 1 |
| 6 | column 3 has no safe row, backtrack and remove the queen in column 2 | 0, 3 |
| 7 | column 2 has no other safe row, backtrack and remove the queen in column 1 | 0 |
| 8 | column 1 has no other safe row, backtrack and remove the queen in column 0 | none |
| 9 | column 0 row 1 is safe, place | 1 |
| 10 | column 1 row 3 is safe, place | 1, 3 |
| 11 | column 2 row 0 is safe, place | 1, 3, 0 |
| 12 | column 3 row 2 is safe, place, all 4 queens placed | 1, 3, 0, 2 |

# algorithms/uncategorized/n-queens | after Naive Algorithm
Searching every board (naive) against backtracking, which stops extending a board the moment two queens clash. "Safe placements" counts the partial boards the backtracking search builds while finding all solutions. Computed by running both searches.

| n | Boards of n queens on n x n squares | Safe placements tried by backtracking | Solutions |
| --- | --- | --- | --- |
| 4 | 1,820 | 16 | 2 |
| 5 | 53,130 | 53 | 10 |
| 6 | 1,947,792 | 152 | 4 |
| 7 | 85,900,584 | 551 | 40 |
| 8 | 4,426,165,368 | 2,056 | 92 |


# algorithms/sets/combination-sum | after Explanations
The tree above is a rough sketch and does not match the code. This is the exact tree the code walks for `candidates = [2, 3]` and `target = 6`. Each line shows the numbers chosen so far and how much is left.

```
[]
+2 (4 left)
  +2 (2 left)
    +2 = [2,2,2], 0 left: answer
    +3 = [2,2,3], -1 left: too far, stop
  +3 (1 left)
    +3 = [2,3,3], -2 left: too far, stop
+3 (3 left)
  +3 = [3,3], 0 left: answer
```

Answers: [2,2,2] and [3,3]. A call that reaches exactly 0 saves the answer and adds nothing more. After choosing 3, only 3 is tried again, never 2, because the code never goes back to an earlier candidate.

If the question asked only how many ways there are, or the fewest numbers needed, dynamic programming would be the usual tool. Here we must list every combination, so we walk through them one by one with backtracking.

# algorithms/uncategorized/n-queens | after Bitwise Solution
Correction: in `leftDiagonal`, `column` and `rightDiagonal`, a 1 bit means that square on the current row is blocked (a queen is in that column, or a queen attacks it along a diagonal). A 0 bit means the square is still free. The code combines the three with OR and flips the result (`~`) to get the free squares. For N = 4 at row 1, after a queen in the rightmost column: column = 0001, rightDiagonal = 0010, leftDiagonal = 0000, so the blocked squares are 0011 and the free squares are 1100.

The picture that belongs above is gone, so here is the trace for N = 4 (the leftmost bit is the leftmost column). Each row shows the blocked bits and the free squares.

| Row | leftDiagonal | column | rightDiagonal | Free squares | The code picks |
| --- | --- | --- | --- | --- | --- |
| 0 | 0000 | 0000 | 0000 | 1111 | rightmost free (0001) |
| 1 | 0000 | 0001 | 0010 | 1100 | rightmost free (0100) |
| 2 | 0010 | 0101 | 1100 | 0000 | none: dead end, go back to row 1 |

Moving to the next row shifts the masks. A queen's diagonal that points down and to the left moves one square left each row (`rightDiagonal << 1`), and the one pointing down and to the right moves one square right (`leftDiagonal >> 1`). For row 1 above: (0000 | 0001) >> 1 = 0000 and (0000 | 0001) << 1 = 0010.

# algorithms/uncategorized/n-queens | before Code
How the code below differs from the steps above. The steps place queens column by column and stop at the first solution. The JavaScript places one queen per row, keeps going after a solution, and collects every one (for 4 queens, 2 solutions). It is the same search turned sideways, because rows and columns are interchangeable on a square board. `nQueens` returns a list of boards, each a list of queen positions (row and column), not a 0/1 matrix. `nQueensBitwise` only counts solutions and returns that number (2 for N = 4, 92 for N = 8). Its helper takes five parameters, not three: `boardSize` and `solutionsCount` are bookkeeping, and the three bit masks are the ones described above.

# algorithms/sets/combinations | after Combinations with repetitions
The two formulas in words. `n!` (n factorial) means n * (n - 1) * ... * 1, so 4! = 24.

Without repetition: n! / (r! * (n - r)!). Choosing 2 of 4 gives 24 / (2 * 2) = 6.

With repetition: (n + r - 1)! / (r! * (n - 1)!). Choosing 3 scoops from 5 flavours gives 7! / (3! * 4!) = 5040 / (6 * 24) = 35.

# algorithms/sets/combinations | before Code
How the code works for A, B, C, D and length 2. Take A, then combine A with every 1-letter combination from the letters after it (B, C, D): AB, AC, AD. Take B and the letters after it (C, D): BC, BD. Take C and D: CD. D has nothing after it, so it adds nothing. Total 6. Passing only the letters after the current one (`slice(optionIndex + 1)`) is what stops repeats and mirrored pairs such as BA. The with-repetitions version passes `slice(optionIndex)`, so a letter can be picked again: AA is allowed too.

# algorithms/sets/permutations | after Permutations without repetitions
When you fill only r slots out of n items, you stop multiplying after r factors: n * (n - 1) * ... * (n - r + 1) = n! / (n - r)!. The first three places in a race of 8 runners: 8 * 7 * 6 = 336. Arranging all items is the special case r = n, which gives n!.

# algorithms/sets/permutations | after Permutations with repetitions
Read both "Number of combinations" labels above as "number of permutations". They count ordered arrangements. A "combination lock" is a permutation by our definition, because 472 and 724 are different codes. The name is everyday English, not the maths term.

# algorithms/sets/permutations | before Code
How the without-repetition code works for A, B, C. It sets A aside and finds all permutations of B, C (BC and CB). Then it puts A into every position of each: ABC, BAC, BCA from BC, and ACB, CAB, CBA from CB. Same six permutations as above, in a different order. The with-repetition code needs r of at least 1; it has no case for r = 0.

# algorithms/sets/combination-sum | after Code
Why `startFrom` matters. Each call loops from `startFrom` and passes its own index down. Passing the same index (not index + 1) lets a number repeat: after choosing 2 you may choose 2 again. Never looking at earlier candidates means a set is built in only one order: once 3 is chosen, 2 is never added after it, so [2,2,3] is found but [2,3,2] and [3,2,2] are not. That is how the answers stay unique without any de-duplication step.
