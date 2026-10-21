# algorithms/string/palindrome | before Code
Two pointers start at the ends and move toward the middle, so only half the string is compared. A trace on `racecar`, a palindrome:

| left | right | Characters | Result |
| --- | --- | --- | --- |
| 0 | 6 | `r` and `r` | Equal, move both inward |
| 1 | 5 | `a` and `a` | Equal, move both inward |
| 2 | 4 | `c` and `c` | Equal, move both inward |
| 3 | 3 | Pointers met or crossed | Return true |

And on `polo`, which fails at the first comparison:

| left | right | Characters | Result |
| --- | --- | --- | --- |
| 0 | 3 | `p` and `o` | Different, return false |

# algorithms/sets/maximum-subarray | after Example
A trace of `dpMaximumSubarray` on the example array. The running sum is reset to 0 whenever it goes negative, because a negative prefix can only hurt any subarray that continues after it. One pass finds the answer, `4, -1, 2, 1` with sum 6, while the brute force looks at all 45 subarrays of these 9 numbers.

| i | Number | Running sum after (reset included) | Best sum so far | Best window (indexes) | Note |
| --- | --- | --- | --- | --- | --- |
| 0 | -2 | 0 | -2 | 0 to 0 | New best, then sum below 0 so reset |
| 1 | 1 | 1 | 1 | 1 to 1 | New best |
| 2 | -3 | 0 | 1 | 1 to 1 | Sum below 0, reset |
| 3 | 4 | 4 | 4 | 3 to 3 | New best |
| 4 | -1 | 3 | 4 | 3 to 3 | - |
| 5 | 2 | 5 | 5 | 3 to 5 | New best |
| 6 | 1 | 6 | 6 | 3 to 6 | New best |
| 7 | -5 | 1 | 6 | 3 to 6 | - |
| 8 | 4 | 5 | 6 | 3 to 6 | - |

# algorithms/uncategorized/best-time-to-buy-sell-stocks | before Peak Valley Approach `O(n)`
The divide and conquer approach branches twice per day, so the number of calls doubles with every extra price. Calls counted by running that code (the 20-price row matches the lesson's figure of about 2 million):

| Number of prices | Recursive calls | Calls for the O(n) approach |
| --- | --- | --- |
| 5 | 63 | 5 |
| 10 | 2,047 | 10 |
| 15 | 65,535 | 15 |
| 20 | 2,097,151 | 20 |

# algorithms/uncategorized/best-time-to-buy-sell-stocks | before Code
A trace of the accumulator approach on `[7, 1, 5, 3, 6, 4]`, the first example, one step per pair of neighbouring days. Every day-to-day rise is added to the profit and every fall adds nothing, so the total is 4 + 3 = 7, the same as buying at each valley and selling at each peak.

| Step | Price change | Gain added | Profit so far |
| --- | --- | --- | --- |
| 1 | 7 to 1 | 0 | 0 |
| 2 | 1 to 5 | 4 | 4 |
| 3 | 5 to 3 | 0 | 4 |
| 4 | 3 to 6 | 3 | 7 |
| 5 | 6 to 4 | 0 | 7 |

# algorithms/uncategorized/jump-game | before Code
Why `[3, 2, 1, 0, 4]` fails: every path from index 0 lands on index 3, whose jump length is 0.

```mermaid Jump Game for [3, 2, 1, 0, 4]: every route ends at index 3 and nothing reaches the last index
flowchart TD
  I0[index 0 jump 3] --> I1[index 1 jump 2]
  I0 --> I2[index 2 jump 1]
  I0 --> I3[index 3 jump 0]
  I1 --> I2
  I1 --> I3
  I2 --> I3
  I3 -.->|no move| I4[index 4 last]
  class I3 bad
  class I4 warn
```

The greedy code scans from the right and tracks the leftmost good index, the one that can reach the last index. An index becomes the new leftmost good one when `index + jump` reaches the current one. Trace for `[2, 3, 1, 1, 4]`, which succeeds because index 0 ends up good:

| Index | Jump | Farthest reach | Reaches the leftmost good index? | Leftmost good index after |
| --- | --- | --- | --- | --- |
| start | - | - | - | 4 |
| 3 | 1 | 4 | Yes, reach 4 is at least 4 | 3 |
| 2 | 1 | 3 | Yes, reach 3 is at least 3 | 2 |
| 1 | 3 | 4 | Yes, reach 4 is at least 2 | 1 |
| 0 | 2 | 2 | Yes, reach 2 is at least 1 | 0 |

Trace for `[3, 2, 1, 0, 4]`, which fails because the leftmost good index stays at 4:

| Index | Jump | Farthest reach | Reaches the leftmost good index? | Leftmost good index after |
| --- | --- | --- | --- | --- |
| start | - | - | - | 4 |
| 3 | 0 | 3 | No, 3 falls short of 4 | 4 |
| 2 | 1 | 3 | No, 3 falls short of 4 | 4 |
| 1 | 2 | 3 | No, 3 falls short of 4 | 4 |
| 0 | 3 | 3 | No, 3 falls short of 4 | 4 |

# algorithms/uncategorized/rain-terraces | before Code
The dynamic programming approach on `[3, 0, 0, 2, 0, 4]`. Water above a bar rises to the lower of the tallest bars on its two sides (the boundary) and is that boundary minus the bar's own height. Precomputing both maximum arrays turns the two inner loops of the brute force into table lookups.

| Index | Height | Tallest from left (itself included) | Tallest from right (itself included) | Boundary (the lower one) | Water held |
| --- | --- | --- | --- | --- | --- |
| 0 | 3 | 3 | 4 | 3 | 0 |
| 1 | 0 | 3 | 4 | 3 | 3 |
| 2 | 0 | 3 | 4 | 3 | 3 |
| 3 | 2 | 3 | 4 | 3 | 1 |
| 4 | 0 | 3 | 4 | 3 | 3 |
| 5 | 4 | 4 | 4 | 4 | 0 |
| Total |  |  |  |  | 10 |

The total of 10 matches the lesson's second example.

# algorithms/uncategorized/square-matrix-rotation | before Code
The code rotates by two in-place steps, the second option the lesson names (diagonal top-left to bottom-right, then horizontal): swap each cell with its mirror across the main diagonal (a transpose), then reverse every row. Applied to the first example, the result is the rotated matrix from the lesson.

| Stage | Row 0 | Row 1 | Row 2 |
| --- | --- | --- | --- |
| Start | `1 2 3` | `4 5 6` | `7 8 9` |
| After the diagonal swaps | `1 4 7` | `2 5 8` | `3 6 9` |
| After reversing each row | `7 4 1` | `8 5 2` | `9 6 3` |

Follow the value 1: it starts at row 0, column 0, stays there through the transpose, and the row reversal moves it to row 0, column 2, the top-right corner, which is where a clockwise turn sends the top-left corner.

# algorithms/math/pascal-triangle | before Code
The O(n) method builds row 5 from left to right, each entry from the one before it using `C(n, i) = C(n, i - 1) times (n - i + 1) / i`. The row starts with 1, and the result is the row 1, 5, 10, 10, 5, 1.

| i | Previous entry | Multiplier (n - i + 1) / i | Previous times the top part | Entry C(5, i) |
| --- | --- | --- | --- | --- |
| 1 | 1 | 5 / 1 | 5 | 5 |
| 2 | 5 | 4 / 2 | 20 | 10 |
| 3 | 10 | 3 / 3 | 30 | 10 |
| 4 | 10 | 2 / 4 | 20 | 5 |
| 5 | 5 | 1 / 5 | 5 | 1 |

Row 5 is the sixth row of the triangle. Adding neighbours of row 4 (`1 4 6 4 1`) gives the same numbers, which is what the recursive version in the code tab does.
