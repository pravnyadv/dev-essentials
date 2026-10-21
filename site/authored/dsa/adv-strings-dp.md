# algorithms/string/knuth-morris-pratt | before Code
Step 1 is the pattern table for the word `ABABC`: for each position, the length of the longest proper prefix of the word that is also a suffix ending there. Built with the `buildPatternTable` code below.

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

# algorithms/string/rabin-karp | before Hash Function Used
A trace searching the text `bdaabd` for the word `abd`, with letter values a = 1, b = 2, c = 3, d = 4, base 10 and every hash taken modulo 13 (small numbers chosen for the example). The word's hash is 7. Like the lesson code, the search stops at the first real match.

| Window start | Window | Window hash | Decision |
|---|---|---|---|
| 0 | bda | 7 | hash equal, compare letters: different (a collision) |
| 1 | daa | 8 | hash differs, skip |
| 2 | aab | 8 | hash differs, skip |
| 3 | abd | 7 | hash equal, compare letters: match, stop |

The window `bda` has the same hash 7 as `abd` but different letters, so the letter comparison rejects it: hashes can collide. The window at 3 is the real match. Each hash after the first comes from the previous one by dropping the old first letter and adding the new last letter, not by rehashing all 3 letters. Only windows whose hash equals 7 cost a letter-by-letter comparison.

# algorithms/string/z-algorithm | before Code
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

# algorithms/string/hamming-distance | before Code
For binary strings the distance is the number of 1 bits in the XOR of the two strings, using the third example above. Each column where the bits differ gives a 1.

| Position | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|---|
| First string | 1 | 0 | 1 | 1 | 1 | 0 | 1 |
| Second string | 1 | 0 | 0 | 1 | 0 | 0 | 1 |
| XOR | 0 | 0 | 1 | 0 | 1 | 0 | 0 |

The XOR row has two 1s, so the distance is 2.

# algorithms/string/longest-common-substring | after Example
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

The bottom right cell is 5, so the shortest supersequence has 5 letters. Walking back from that cell, a diagonal step emits the shared letter once and any other step emits the letter it came from. When both neighbors tie, stepping left here gives `geeke`, which matches the lesson's answer (the lesson code builds it from the longest common subsequence instead of from this table). The size also follows from 4 + 3 - 2 = 5, where 2 is the length of the longest common subsequence `ek`.

# algorithms/string/regular-expression-matching | after Examples
A table for example 4, `s = aab` and `p = c*a*b`. T in cell (row, column) means the string prefix in that row matches the pattern prefix in that column. The first column is the empty pattern, then one column per pattern character.

| String prefix | empty | c | c* | c*a | c*a* | c*a*b |
|---|---|---|---|---|---|---|
| (empty) | T | F | T | F | T | F |
| a | F | F | F | T | T | F |
| aa | F | F | F | F | T | F |
| aab | F | F | F | F | F | T |

Two rules fill it. A plain letter or `.` needs the diagonal cell to be T and the letters to agree. A star can either drop its letter and the star (look two cells left) or use the letter once more (look one row up, if the letter matches). The bottom right cell is T, so the whole string matches, as the lesson says.

# algorithms/math/integer-partition | before Code
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
