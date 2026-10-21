# algorithms/math/bits | top
Numbers are stored as a row of bits, each 0 or 1. A bit is "set" when it is 1 and "clear" when it is 0. Bit 0 is the rightmost one. The operators used below, shown on 5 (`0101`) and 3 (`0011`):

| Operator | Meaning | Example |
| --- | --- | --- |
| `a & b` | 1 only where both have a 1 | `0101 & 0011 = 0001` |
| `a \| b` | 1 where either has a 1 | `0101 \| 0011 = 0111` |
| `a ^ b` | 1 where they differ | `0101 ^ 0011 = 0110` |
| `~a` | flips every bit | `~5 = -6` |
| `a << n` | slides bits left n places (times 2^n) | `5 << 1 = 10` |
| `a >> n` | slides bits right n places (drops the low bits) | `5 >> 1 = 2` |

JavaScript runs these on 32-bit signed integers, so everything here is only exact for values that fit in 32 bits. Keep numbers below 2^30 in the shifting examples (Multiply, Count Bits of a Number), because larger inputs overflow or make those loops never stop.

# algorithms/math/bits | after Overview
Get, set and clear applied to 5, written in 4 bits (`0101`), so the effect of each mask can be read bit by bit:

| Operation | Expression | In binary | Result |
| --- | --- | --- | --- |
| Get bit 2 | (5 >> 2) & 1 | 0001 & 0001 | 1 |
| Get bit 1 | (5 >> 1) & 1 | 0010 & 0001 | 0 |
| Set bit 1 | 5 OR (1 << 1) | 0101 OR 0010 | 0111 = 7 |
| Clear bit 2 | 5 & ~(1 << 2) | 0101 & 1011 | 0001 = 1 |
| Clear bit 0 | 5 & ~(1 << 0) | 0101 & 1110 | 0100 = 4 |

# algorithms/math/bits | before Code
Worked with x = 3: 19 = 2^4 + 2^1 + 2^0, so 3 * 19 = (3 << 4) + (3 << 1) + 3 = 48 + 6 + 3 = 57.

# algorithms/math/is-power-of-two | before Code
Subtracting 1 turns the lowest 1 bit into 0 and turns every 0 below it into 1 (like 1000 - 1 = 0111). Everything above that bit is untouched, so `n & (n - 1)` cancels exactly the lowest set bit and keeps the rest. For 12 (`01100`), n - 1 is `01011`, and the AND leaves `01000`: one bit still set, so 12 is not a power of two. If the number had only one set bit, nothing is left. Computed for 8 numbers (5-bit binary):

| n | Binary n | Binary n - 1 | n AND n-1 | Power of two? |
| --- | --- | --- | --- | --- |
| 1 | 00001 | 00000 | 00000 | yes |
| 2 | 00010 | 00001 | 00000 | yes |
| 3 | 00011 | 00010 | 00010 | no |
| 4 | 00100 | 00011 | 00000 | yes |
| 6 | 00110 | 00101 | 00100 | no |
| 8 | 01000 | 00111 | 00000 | yes |
| 12 | 01100 | 01011 | 01000 | no |
| 16 | 10000 | 01111 | 00000 | yes |

Every power of two has exactly one bit set. The reverse is almost true: the only number with one bit set that is not a power of two is the most negative signed value (-128 in 8 bits, `10000000`). That is why the code first rejects anything below 1. Both versions also assume a whole number, and the bitwise one only sees the low 32 bits, so it is reliable only below 2^31. The division version has no such limit.

# algorithms/math/euclidean-algorithm | before Code
Trace of the recursive code on 1071 and 462, the pair from the animation above. Each call keeps the pair that has the same GCD but smaller numbers.

| Step | Call made | What happens |
| --- | --- | --- |
| 1 | euclideanAlgorithm(1071, 462) | 1071 % 462 = 147, so call (462, 147) |
| 2 | euclideanAlgorithm(462, 147) | 462 % 147 = 21, so call (147, 21) |
| 3 | euclideanAlgorithm(147, 21) | 147 % 21 = 0, so call (21, 0) |
| 4 | euclideanAlgorithm(21, 0) | b is 0, returns 21 |

`a % b` is the remainder after dividing a by b, which is what is left of a after subtracting b as many times as possible (1071 minus two 462s leaves 147). So replacing (a, b) by (b, a % b) is the same step as repeated subtraction, done at once. The modulo version takes 3 divisions here (4 calls, the last one just returns). The subtraction version (the iterative code) reaches the same answer 21 but needs 11 subtractions on this pair (2, then 3, then 6, until both numbers are 21), because one a % b does a whole run of subtractions at once.

# algorithms/math/primality-test | before Code
Trial division, as in the code, stops at the square root because any factor above it pairs with one below it. Divisors tried after the even check:

| Number | Square root | Divisors tried | Verdict |
| --- | --- | --- | --- |
| 97 | 9.85 | 3, 5, 7, 9 | prime: no divisor found |
| 91 | 9.54 | 3 (remainder 1), 5 (remainder 1), 7 (divides evenly) | composite: 91 = 7 * 13 |
| 25 | 5.00 | 3 (remainder 1), 5 (divides evenly) | composite: 25 = 5 * 5, the limit is included because a square's own root can be the divisor |

Why the square root limit matters, with prime inputs (the worst case, since nothing stops the loop early). Divisions counted by running the loop:

| n (prime) | Divisors to test one by one (2 to n - 1) | Divisors the code tests |
| --- | --- | --- |
| 97 | 95 | 4 |
| 7,919 | 7,917 | 43 |
| 1,000,003 | 1,000,001 | 499 |

Trial division is simple but slow on big inputs: its work grows with the square root of n, which is exponential in the number of digits. The "polynomial" tests mentioned above (AKS, Miller-Rabin) are different algorithms, and real cryptography uses those, not trial division.

# algorithms/math/sieve-of-eratosthenes | before Code
Sieve up to 30, starting each pass at p * p as in the code. After each pass, the numbers still unmarked:

| Pass | Still unmarked | Newly crossed out |
| --- | --- | --- |
| start | 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 | none |
| p = 2 | 2 3 5 7 9 11 13 15 17 19 21 23 25 27 29 | 4 6 8 10 12 14 16 18 20 22 24 26 28 30 |
| p = 3 | 2 3 5 7 11 13 17 19 23 25 29 | 9 15 21 27 |
| p = 5 | 2 3 5 7 11 13 17 19 23 29 | 25 |

Next candidate is 7, and 7 * 7 = 49 is already above 30, so no further numbers get crossed out. The 10 survivors are the primes up to 30: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29.

# algorithms/math/fast-powering | before Code
Trace for 2^13. Calls go down by halving the power, and the answers are multiplied on the way back up. The table lists calls in the order they finish:

| Order finished | Call | Result |
| --- | --- | --- |
| 1 | fastPowering(2, 0) | returns 1 |
| 2 | fastPowering(2, 1) | odd: 1 * 1 * 2 = 2 |
| 3 | fastPowering(2, 3) | odd: 2 * 2 * 2 = 8 |
| 4 | fastPowering(2, 6) | even: 8 * 8 = 64 |
| 5 | fastPowering(2, 13) | odd: 64 * 64 * 2 = 8192 |

Multiplications done, counted from the code (an odd power costs 2, an even power costs 1), against multiplying the base by itself one factor at a time (power - 1):

| Power | One factor at a time | fastPowering |
| --- | --- | --- |
| 10 | 9 | 6 |
| 100 | 99 | 10 |
| 1,000 | 999 | 16 |
| 1,000,000 | 999,999 | 27 |


# algorithms/math/bits | before Code
Note on the Is Power of Two section above: the trick has one hole: `0 & (0 - 1)` is `0 & -1`, which is `0`, so the code above also says `0` is a power of two. Real code checks `number > 0` first, as the Is a power of two lesson does: `number > 0 && (number & (number - 1)) === 0`.

# algorithms/math/bits | before Code
Background on the circuit: [Adder (electronics) on Wikipedia](https://en.wikipedia.org/wiki/Adder_(electronics)).

# algorithms/math/bits | before Code
Notes on the sections above.

On isPositive: negative numbers are stored in two's complement (explained under Switch Sign), so -1 in 4 bits is `1111` and its leftmost bit is 1. For real 32-bit numbers the code reads bit 31 with `(number >> 31) & 1`.

On Switch Sign, worked in 4 bits: 3 is `0011`. Invert every bit to get `1100`, add 1 to get `1101`, which is -3 in the table. Doing it again on `1101`: invert to `0010`, add 1 to get `0011`, back to 3.

On Count Bits to Flip One Number to Another: `0101 ^ 0001 = 0100`. XOR puts a 1 wherever the two numbers differ, and counting those 1s (see Count Set Bits) gives the answer, 1.

On Count Bits of a Number, the trace for 5: `1 << 0` = 1, `1 << 1` = 2 and `1 << 2` = 4 are all at most 5, so the counter reaches 3. `1 << 3` = 8 is bigger than 5, so the loop stops and returns 3. (The "four times" in the text above counts the shift to 16 that never happens.)

# algorithms/math/sieve-of-eratosthenes | after How it works
Note: the array runs from 0 to `n`, so the survivors are the primes up to and including `n`. Sieving up to 7 returns 2, 3, 5 and 7.

# algorithms/math/fast-powering | after Complexity
A note on the letters. The page calls the power `b`, `n`, `Y` and `power` in different places. They all mean the same number: the exponent. The size of the base does not matter here. The cost is counted in multiplications, and it depends only on the exponent: about `power - 1` for the one-at-a-time method, and about `log2(power)` to `2 * log2(power)` for fast powering.

# algorithms/math/fast-powering | after Fast Power Algorithm
The code works for whole-number powers of 0 or more. A negative power never reaches 0 and recurses until the stack overflows. For a negative power, compute `1 / fastPowering(base, -power)` instead.
