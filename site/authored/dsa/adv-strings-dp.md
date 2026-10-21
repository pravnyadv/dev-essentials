# algorithms/string/knuth-morris-pratt | before Code
Step 1 builds a pattern table for the word `ABABC`. Entry k answers one question: among the first k+1 letters of the word, what is the longest piece that is both a start of the word and an end of those letters, without being the whole thing (a proper prefix)? For `ABA` that piece is `A` (it starts the word and ends `ABA`), so the entry is 1. For `ABAB` it is `AB`, so 2. Later, when a search fails after matching some letters, this number says how many of them are still a valid start of the word, so we keep them instead of starting over. `buildPatternTable` below builds it.

| Position | Suffix char | Prefix char compared | Outcome | Table value |
|---|---|---|---|---|
| 1 | B | A | no match, prefix is empty | 0 |
| 2 | A | A | match | 1 |
| 3 | B | B | match | 2 |
| 4 | C | A | no match, fall back to table[1] = 0 | - |
| 4 | C | A | no match, prefix is empty | 0 |

The finished table is [0, 0, 1, 2, 0].

Step 2 searches the text `ABABABC` for the word. A mismatch never moves the text index backwards, which is where the linear time comes from.

| Text index | Text char | Word index | What happens |
|---|---|---|---|
| 0 | A | 0 | match, advance both |
| 1 | B | 1 | match, advance both |
| 2 | A | 2 | match, advance both |
| 3 | B | 3 | match, advance both |
| 4 | A | 4 | mismatch, word index falls back to 2, text index stays |
| 4 | A | 2 | match, advance both |
| 5 | B | 3 | match, advance both |
| 6 | C | 4 | match, whole word found |

The word starts at text index 2. After the mismatch at text index 4 the word index drops from 4 to 2 using the table, so the characters AB already matched are not compared again.

Every step either advances the text index or lowers the word index, and the word index can only go up when the text index goes up. So the number of fallbacks is never more than the number of advances, which is why the whole search takes about |T| steps.

# algorithms/string/rabin-karp | after Complexity
Correction to the section above, which lost words. For a text of length n and a word of length m: the average and best case take O(n + m) time, because few windows share the word's hash and only those cost a letter-by-letter check. The worst case takes O(n * m), when a bad hash makes most windows collide. Searching for p words at once (as the first paragraph describes) needs O(p) extra space for their hashes. The code below searches one word, so that does not apply to it.

# algorithms/string/rabin-karp | before Hash Function Used
A trace searching the text `bdaabd` for the word `abd`, with letter values a = 1, b = 2, c = 3, d = 4, base 10 and every hash taken modulo 13 (small numbers chosen for the example). The word's hash is 7. Like the lesson code, the search stops at the first real match.

| Window start | Window | Window hash | Decision |
|---|---|---|---|
| 0 | bda | 7 | hash equal, compare letters: different (a collision) |
| 1 | daa | 8 | hash differs, skip |
| 2 | aab | 8 | hash differs, skip |
| 3 | abd | 7 | hash equal, compare letters: match, stop |

The window `bda` has the same hash 7 as `abd` but different letters, so the letter comparison rejects it: hashes can collide. The window at 3 is the real match. Each hash after the first comes from the previous one by dropping the old first letter and adding the new last letter, not by rehashing all 3 letters. Only windows whose hash equals 7 cost a letter-by-letter comparison.

One roll in detail, from `bda` (hash 7) to `daa`: remove the first letter b, worth 2 * 10 * 10 = 200, and 200 mod 13 = 5, so 7 - 5 = 2. Shift everything one place (multiply by 10): 20. Add the new letter a (1): 21, and 21 mod 13 = 8, which is the hash of `daa`. Base 10 and modulus 13 are chosen only to keep the numbers small; the real code uses base 37 and modulus 101.

A note on the code below: its `roll` helper recomputes the value of the dropped letter's place with a short loop each time, so it is slower than the textbook O(1) step. A fast version computes that place value once before the loop.

# algorithms/string/z-algorithm | before Code
The Z box is the stretch of the string, from L to R, that the algorithm last found to be a copy of the start of the string. When the next index i lies inside the box, we already know the answer for it from the start of the string: i sits at the same offset (i - L) as a position near the start, so Z[i] can be copied from Z[i - L], unless the copy would reach past R. Outside the box, we compare letters one by one and make a new box.

Z array for `aab$xaabaab`: the word `aab`, the separator `$`, then the text `xaabaab`. The box column shows the interval [L, R] the code holds after each index, and a dash means the box is empty.

| Index i | Char | Z[i] | Box L..R | How it was found |
|---|---|---|---|---|
| 1 | a | 1 | 1..1 | outside the box: compare letters |
| 2 | b | 0 | - | outside the box: compare letters |
| 3 | $ | 0 | - | outside the box: compare letters |
| 4 | x | 0 | - | outside the box: compare letters |
| 5 | a | 3 | 5..7 | outside the box: compare letters |
| 6 | a | 1 | 5..7 | inside the box: copy Z[1] |
| 7 | b | 0 | 5..7 | inside the box: copy Z[2] |
| 8 | a | 3 | 8..10 | outside the box: compare letters |
| 9 | a | 1 | 8..10 | inside the box: copy Z[1] |
| 10 | b | 0 | 8..10 | inside the box: copy Z[2] |

Z values equal to the word length 3 mark a match. They appear at string indexes 5 and 8, which are text positions 1 and 4 after removing the 4 characters of `aab$`. Indexes inside a box mostly copy an earlier answer, so letters are rarely compared twice.

If the copied value reaches the end of the box, the answer might be longer, so the code keeps comparing letters from the box edge. In `aaaaa`, after index 1 the box covers indexes 1 to 4 and Z[1] = 4. At index 2 the copy would be Z[1] = 4, but only 3 letters remain in the box, so the code cannot just copy and compares on.

# algorithms/string/z-algorithm | after Code
The separator `$` must be a character that appears in neither the word nor the text. If it does, a Z value can run across the separator and matches are missed or misplaced: searching for `b` in `ab$ab` with this code returns only position 4 and misses position 1. For arbitrary text, pick a character that is absent from both.

# algorithms/string/hamming-distance | before Examples
In plain words: line the two strings up letter over letter and count the places where they differ. It is used to count flipped bits in data that was sent or stored (error detection), and to compare fixed-length codes such as hashes. It only counts swapped letters, so it is undefined for strings of different length. Edit distance (see the Levenshtein distance lesson) also allows inserting and deleting letters.

# algorithms/string/hamming-distance | before Code
For binary strings the distance is the number of 1 bits in the XOR of the two strings, using the third example above. Each column where the bits differ gives a 1.

| Position | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|---|
| First string | 1 | 0 | 1 | 1 | 1 | 0 | 1 |
| Second string | 1 | 0 | 0 | 1 | 0 | 0 | 1 |
| XOR | 0 | 0 | 1 | 0 | 1 | 0 | 0 |

The XOR row has two 1s, so the distance is 2.

# algorithms/string/longest-common-substring | after Example
The table and the code below work on two strings at a time. For three or more strings you would repeat the idea (or use a suffix tree). Two strings can have a longer answer than three: `ABABC` and `BABCA` alone share `BABC`. If several substrings tie for longest, the code returns the first one it meets. In the code comment, "LCS" means longest common substring, not subsequence.

A dynamic programming table for the two strings `ABABC` (rows) and `ABCBA` (columns). Each cell holds the length of the common substring that ends at those two letters: one more than the cell diagonally up and left when the letters match, and 0 when they do not.

|  | A | B | C | B | A |
|---|---|---|---|---|---|
| A | 1 | 0 | 0 | 0 | 1 |
| B | 0 | 2 | 0 | 1 | 0 |
| A | 1 | 0 | 0 | 0 | 2 |
| B | 0 | 2 | 0 | 1 | 0 |
| C | 0 | 0 | **3** | 0 | 0 |

The largest value is 3 (in bold), reached at the last C of `ABABC`. Reading 3 letters back from there gives `ABC`. Resetting to 0 on a mismatch is what separates this from the longest common subsequence, where a mismatch keeps the best earlier value.

# algorithms/sets/shortest-common-supersequence | after Example
A table for the first example, `geek` and `eke`. Cell (i, j) is the length of the shortest string that holds the first i letters of `geek` and the first j letters of `eke` as subsequences. Matching letters share one position (diagonal cell plus 1), otherwise take the cheaper neighbor plus 1.

|  | (empty) | e | k | e |
|---|---|---|---|---|
|  | 0 | 1 | 2 | 3 |
| g | 1 | 2 | 3 | 4 |
| e | 2 | 2 | 3 | 4 |
| e | 3 | 3 | 4 | 4 |
| k | 4 | 4 | 4 | 5 |

The bottom right cell is 5, so the shortest supersequence has 5 letters. Walking back from that cell, a diagonal step emits the shared letter once and any other step emits the letter it came from. When both neighbors tie, either step is fine. Stepping left gives `geeke`, stepping up gives `gekek`. Both are correct, because both have 5 letters and contain `geek` and `eke`. The code below builds its answer from a longest common subsequence instead of from this table, so your run may print a different valid answer than the samples above (for `geek` and `eke` it gives `gekek`). Give the code arrays of items such as `['g','e','e','k']`, not strings. The size also follows from 4 + 3 - 2 = 5, where 2 is the length of the longest common subsequence `ek`.

# algorithms/string/regular-expression-matching | after Examples
A note on counting. In examples 2 and 4 the explanations say "repeated once", meaning one extra copy. In plain counts: in example 2, `a*` matches two `a` letters. In example 4, `c*` matches zero letters, `a*` matches two (`aa`) and the final `b` matches `b`.

A table for example 4, `s = aab` and `p = c*a*b`. T in cell (row, column) means the string prefix in that row matches the pattern prefix in that column. The first column is the empty pattern, then one column per pattern character.

| String prefix | empty | c | c* | c*a | c*a* | c*a*b |
|---|---|---|---|---|---|---|
| (empty) | T | F | T | F | T | F |
| a | F | F | F | T | T | F |
| aa | F | F | F | F | T | F |
| aab | F | F | F | F | F | T |

Two rules fill it. A plain letter or `.` needs the diagonal cell to be T and the letters to agree. A star can either drop its letter and the star (look two cells left) or use the letter once more (look one row up, if the letter matches). The bottom right cell is T, so the whole string matches, as the lesson says.

# algorithms/math/integer-partition | before Code
You can skip the picture above. It shows each partition as rows of boxes (a Young diagram), which matters for number theory but not for the code. A composition is a sum where order counts, so `1 + 3` and `3 + 1` are two compositions but one partition. All we count here is partitions: for 4 that is 5, and for 5 it is 7, which the table below confirms.

The lesson code fills this table for n = 5. Row s counts the ways to write the column's number using parts of size at most s. Each cell is the cell above (no part of size s) plus the cell s places to the left in the same row (one more part of size s).

| Largest part allowed | to make 0 | to make 1 | to make 2 | to make 3 | to make 4 | to make 5 |
|---|---|---|---|---|---|---|
| 0 | 1 | 0 | 0 | 0 | 0 | 0 |
| 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| 2 | 1 | 1 | 2 | 2 | 3 | 3 |
| 3 | 1 | 1 | 2 | 3 | 4 | 5 |
| 4 | 1 | 1 | 2 | 3 | 5 | 6 |
| 5 | 1 | 1 | 2 | 3 | 5 | 7 |

The bottom right cell is 7, the number of partitions of 5. For example, the cell for row 2, column 5 is 3 (the ways using parts 1 and 2: 2+2+1, 2+1+1+1, 1+1+1+1+1) and it is built from row 1, column 5 (1 way) plus row 2, column 3 (2 ways).
