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

# algorithms/string/palindrome | after Code
The reference below is about checking whether a number reads the same backwards, which is a related but different problem. For strings, the two-pointer code above is the standard approach: Wikipedia's [Palindrome](https://en.wikipedia.org/wiki/Palindrome) page covers the definition.

This version compares characters exactly. `"Madam"` returns `false` because `M` and `m` differ, and a phrase with spaces or commas such as `"never odd or even"` returns `false` too. To check phrases, lowercase the string and remove everything that is not a letter or digit first, then run the same loop.

# algorithms/sets/maximum-subarray | after Solutions
A note on the Divide and Conquer solution: despite its name, it does not cut the array in half. At each element it chooses to start or extend a subarray here, or skip the element, and it returns only the best sum (not the subarray). The textbook divide and conquer, which splits at the middle and combines the best left, right and crossing sums, takes O(n log n). The Dynamic Programming solution is the one known as Kadane's algorithm, a name worth searching for.

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

If every number is negative, such as `-2, -1`, the answer is the single largest number, `-1`. The code still finds it because it records a new best before it resets the running sum.

# algorithms/uncategorized/best-time-to-buy-sell-stocks | after Task Description
This is the version where you may trade as many times as you like. The well-known variant that allows only one buy and one sell gives 5 on the first example (buy at 1, sell at 6), not 7. Check which version a problem asks for before reusing a solution.

# algorithms/uncategorized/best-time-to-buy-sell-stocks | before Peak Valley Approach `O(n)`
One detail the shortened formulas above hide: the rest of the days is not the same problem each time. After you buy, the next action must be a sell, and after you sell, the next must be a buy. The code tracks this with a `buy` flag that flips whenever you act, and the formula is really `profit(days left, buy or sell)`.

The divide and conquer approach branches twice per day, so the number of calls doubles with every extra price. Calls counted by running that code (the 20-price row matches the lesson's figure of about 2 million):

| Number of prices | Recursive calls | Steps for the one-pass approaches (peak valley, accumulator) |
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

The dynamic programming code (`dpBestTimeToBuySellStocks.js`) keeps two numbers after each day. `lastBuy` is the most money you can have while holding a share (so it starts negative, the price you paid). `lastSold` is the most money you can have while holding nothing. Each new price updates both: to hold, either keep holding or buy with the money you had (`lastSold - price`); to be empty, either stay empty or sell the share you held (`lastBuy + price`). Trace on `[7, 1, 5, 3, 6, 4]`:

| Day | Price | lastBuy | lastSold |
| --- | --- | --- | --- |
| 0 | 7 | -7 | 0 |
| 1 | 1 | -1 | 0 |
| 2 | 5 | -1 | 4 |
| 3 | 3 | 1 | 4 |
| 4 | 6 | 1 | 7 |
| 5 | 4 | 3 | 7 |

The answer is the final `lastSold`, 7, the same as the other approaches.

# algorithms/uncategorized/jump-game | after Code
A small note on `dpTopDownJumpGame.js`: the line that is meant to mark the last cell good uses `cellsGoodness.length - 1`, which is -1 at that point because the table is still empty. It does not mark the last cell. The function is still correct because reaching the last index returns `true` before the table is read. In your own version, write `currentCellsGoodness[numbers.length - 1] = true`.

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

# algorithms/uncategorized/rain-terraces | before Examples
The picture for this problem, drawn as text. Each `#` is a bar and each `~` is water. For `[3, 0, 0, 2, 0, 4]`, rain fills every gap up to level 3, the lower of the tallest bars on either side, and the bar of height 4 on the right keeps it in:

```
level 4:  . . . . . #
level 3:  # ~ ~ ~ ~ #
level 2:  # ~ ~ # ~ #
level 1:  # ~ ~ # ~ #
index:    0 1 2 3 4 5
```

Counting the `~` cells gives 4 + 3 + 3 = 10 units of water.

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

In the code, `leftMaxLevels[i]` is the `left_max` array and `rightMaxLevels[i]` is the `right_max` array. The formula above writes the same two arrays as `max_left[i]` and `max_right[i]`, and the table calls them the tallest bar from the left and from the right.

# algorithms/uncategorized/square-matrix-rotation | after Algorithm
The picture above is a transpose, not a top-right/bottom-left reflection. A transpose swaps each cell with its mirror across the diagonal that runs from the top-left corner to the bottom-right corner, so the top row `A B C` becomes the left column, with A at the top. A true top-right/bottom-left reflection would put the row in the right column in reverse order (C on top), which is not what the picture shows. The code does the same thing as the picture: transpose, then reverse each row (flip it left to right), which sends the left column to the right column, A still on top. That is a clockwise quarter turn. The comment in the code below calls the first step a "top-right/bottom-left" reflection, but its swaps are across the top-left to bottom-right diagonal. Trust the swaps, not the comment.

There are two recipes, and both use the same "flip each row left to right" move (reverse every row). Recipe A: transpose, then flip each row left to right. Recipe B: flip each row left to right, then reflect across the anti-diagonal (the line from the top-right corner to the bottom-left corner). Flipping top to bottom instead gives a counter-clockwise turn, so the direction of the flip matters. In the list above, read "vertically" and "horizontally" as this left-to-right flip.

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

Each function returns just one row: `pascalTriangle(5)` gives `[1, 5, 10, 10, 5, 1]`. The O(n) method needs no earlier rows, while the recursive method builds every row above it, so it costs about `n * n / 2` additions for row `n`.

# algorithms/uncategorized/rain-terraces | after Examples
In Example #2 the water does not stop at height 2. The tallest bar on the left is 3 and the tallest on the right is 4, so every gap fills to level 3, the lower of the two. That gives 3 units over each of the two zero bars at indexes 1 and 2 (6 in all), 1 unit above the bar of height 2 (it is 2 tall and the water is 3 high), and 3 units over the zero bar at index 4. The bar of height 4 is what holds the water in on the right. So read "3*2 units" below as depth 3 times width 2.

# algorithms/uncategorized/rain-terraces | after Code
### Approach 3: two pointers, O(1) extra space
Put one pointer at each end and track the tallest bar seen so far from each side. Always move the pointer on the shorter end: that side's water level is fixed by its own tallest bar, because the other side is guaranteed to have something at least as tall. For `[3, 0, 0, 2, 0, 4]` the left pointer walks index 0 to 4 against a left max of 3 and adds 0 + 3 + 3 + 1 + 3 = 10 while the right pointer stays on the 4. Time is `O(n)` and extra space is `O(1)`. A stack version walks left to right and pops a bar whenever a taller one arrives, adding the water above the popped bar.

# algorithms/uncategorized/square-matrix-rotation | after Code
Both loops visit each cell once, so the time is `O(n^2)` for an `n x n` matrix, and only a couple of temporary values are used, so the extra space is `O(1)`. The `slice()` at the top copies just the list of rows, not the rows themselves, so the input matrix's rows really are rotated in place.

# algorithms/math/pascal-triangle | after Formula
In words: `C(n, k)` is the entry in row `n` at position `k` (both counted from 0), and it counts the ways to pick `k` items out of `n`. The formula is `C(n, k) = n! / (k! * (n - k)!)`, where `n!` ("n factorial") means `n * (n - 1) * ... * 1`. For example `C(4, 2) = 4! / (2! * 2!) = 24 / 4 = 6`, the middle entry of the row `1 4 6 4 1`. Below, `lineNumber` is the row number `n` and `i` is the position `k`.

# algorithms/math/pascal-triangle | after Code
In the recursive version, ignore the comment that says the first and last entries are skipped. The loop does compute them: the first entry is `0 + previous[0]` and the last is `previous[last] + 0`, which is the "blank entries count as 0" rule from the top of the page.
