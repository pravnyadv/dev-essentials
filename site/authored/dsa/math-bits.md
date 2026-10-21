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
`n & (n - 1)` erases the lowest set bit. If that leaves 0, the number had only one set bit. Computed for 8 numbers (5-bit binary):

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

# algorithms/math/euclidean-algorithm | before Code
Trace of the recursive code on 1071 and 462, the pair from the animation above. Each call keeps the pair that has the same GCD but smaller numbers.

| Step | Call made | What happens |
| --- | --- | --- |
| 1 | euclideanAlgorithm(1071, 462) | 1071 % 462 = 147, so call (462, 147) |
| 2 | euclideanAlgorithm(462, 147) | 462 % 147 = 21, so call (147, 21) |
| 3 | euclideanAlgorithm(147, 21) | 147 % 21 = 0, so call (21, 0) |
| 4 | euclideanAlgorithm(21, 0) | b is 0, returns 21 |

The modulo version takes 3 steps. The subtraction version (the iterative code) reaches the same answer 21 but needs 11 subtractions on this pair (2, then 3, then 6, until both numbers are 21), because one a % b does a whole run of subtractions at once.

# algorithms/math/primality-test | before Code
Trial division, as in the code, stops at the square root because any factor above it pairs with one below it. Divisors tried after the even check:

| Number | Square root | Divisors tried | Verdict |
| --- | --- | --- | --- |
| 97 | 9.85 | 3, 5, 7, 9 | prime: no divisor found |
| 91 | 9.54 | 3 (remainder 1), 5 (remainder 1), 7 (divides evenly) | composite: 91 = 7 * 13 |

Why the square root limit matters, with prime inputs (the worst case, since nothing stops the loop early). Divisions counted by running the loop:

| n (prime) | Divisors to test one by one (2 to n - 1) | Divisors the code tests |
| --- | --- | --- |
| 97 | 95 | 4 |
| 7,919 | 7,917 | 43 |
| 1,000,003 | 1,000,001 | 499 |

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

