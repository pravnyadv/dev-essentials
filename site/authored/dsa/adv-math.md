# algorithms/math/least-common-multiple | before Code
The formula lcm(a, b) = |a * b| / gcd(a, b) replaces a search through lists of multiples. Each row below is computed exactly. The last column counts how many multiples of the larger number you would list before hitting the answer.

| a | b | gcd | a * b | lcm = a * b / gcd | Multiples of the larger number to list |
| :-- | :-- | :-- | :-- | :-- | :-- |
| 4 | 6 | 2 | 24 | 12 | 2 |
| 14 | 15 | 1 | 210 | 210 | 14 |
| 84 | 90 | 6 | 7560 | 1260 | 14 |
| 221 | 247 | 13 | 54587 | 4199 | 17 |
| 1001 | 1547 | 91 | 1548547 | 17017 | 11 |

# algorithms/math/prime-factors | before Hardy-Ramanujan formula for approximate calculation of prime-factor count
The code of this page on `n = 84`. The loop only runs while the factor is at most the square root of what is left, and a leftover above 1 is itself prime.

| Factor tried | Divides? | n after dividing | Factors so far |
| :-- | :-- | :-- | :-- |
| start | none | 84 | none |
| 2 | yes | 42 | 2 |
| 2 | yes | 21 | 2, 2 |
| 2 | no more | 21 | 2, 2 |
| 3 | yes | 7 | 2, 2, 3 |
| 4 | loop stops: 4 is above the square root of 7 | 7 | 2, 2, 3 |
| leftover | 7 is not 1, so it is prime | 1 | 2, 2, 3, 7 |

The square-root limit is what makes primes cheap to confirm. These counts are exact for the loop in the code.

| n (a prime) | Candidates if the loop ran up to n | Candidates with the square-root limit |
| :-- | :-- | :-- |
| 7919 | 7918 | 87 |
| 104729 | 104728 | 322 |
| 1299709 | 1299708 | 1139 |

# algorithms/math/prime-factors | after Hardy-Ramanujan formula for approximate calculation of prime-factor count
```mermaid Average number of distinct prime factors for all numbers up to n, counted by a sieve, next to log(log(n)): both climb slowly and stay close
xychart-beta
  x-axis "n" [100, 1000, 10000, 100000, 1000000]
  y-axis "distinct prime factors" 1 --> 3
  line "average over 1 to n" [1.71, 2.13, 2.43, 2.66, 2.85]
  line "log(log(n))" [1.53, 1.93, 2.22, 2.44, 2.63]
```
Values are rounded to two decimals, and log is the natural logarithm, as in the code. Numbers up to a million have about three distinct prime factors on average.

# algorithms/math/horner-method | before Code
Horner's rule on the lesson's polynomial `4x^4 + 2x^3 + 3x^2 + x + 3` at `x = 2`, using the coefficients `[4, 2, 3, 1, 3]`. Each step is one multiplication and one addition, which is the loop of `hornerMethod`.

| Coefficient read | Accumulator before | Accumulator * 2 + coefficient |
| :-- | :-- | :-- |
| 4 | 0 | 4 |
| 2 | 4 | 10 |
| 3 | 10 | 23 |
| 1 | 23 | 47 |
| 3 | 47 | 97 |

The answer 97 matches 4 * 16 + 2 * 8 + 3 * 4 + 2 + 3. The chart compares multiplications for a polynomial of degree n.

```mermaid Multiplications for degree n: Horner needs n, while building each power from scratch by repeated multiplication needs n * (n + 1) / 2
xychart-beta
  x-axis "degree n" [2, 4, 8, 16, 32]
  y-axis "multiplications" 0 --> 550
  line "from-scratch powers" [3, 10, 36, 136, 528]
  line "Horner" [2, 4, 8, 16, 32]
```

# algorithms/math/square-root | before Code
Newton's update `x = x - (x * x - S) / (2 * x)` applied again and again from the guess 1, the same update line as in the code. The error is the distance from the true root. Watch the number of correct digits roughly double once the guess is close. The code itself stops earlier, as soon as x squared is within the tolerance of S, so this table keeps going only to show the convergence.

| Step | Guess for S = 2 | Error | Guess for S = 144 | Error |
| :-- | :-- | :-- | :-- | :-- |
| 0 | 1 | 0.414 | 1 | 11 |
| 1 | 1.5 | 0.086 | 72.5 | 60.5 |
| 2 | 1.416667 | 0.0025 | 37.243 | 25.2 |
| 3 | 1.414216 | 0.0000021 | 20.555 | 8.55 |
| 4 | 1.414214 | 0.0000000000016 | 13.780 | 1.78 |
| 5 | 1.414214 | 0 | 12.115 | 0.115 |
| 6 | 1.414214 | 0 | 12.000546 | 0.00055 |
| 7 | 1.414214 | 0 | 12.00000001 | 0.000000012 |

A far-off start costs several steps of halving the guess (72.5, 37.2, 20.6), after which the digits double each step.

# algorithms/math/matrix | before Code
Two matrices multiply only when the columns of the first match the rows of the second, and the result takes the outer sizes.

```mermaid The size check for multiplying a 2 by 3 matrix with a 3 by 2 matrix
flowchart LR
  A[A is 2 by 3] --> C{Cols of A = rows of B?}
  B[B is 3 by 2] --> C
  C -->|3 equals 3| R[Result is 2 by 2]
  C -->|no| E[Cannot multiply]
  class R good
  class E bad
```
Each of the n * n result cells takes n multiplications, so multiplying two n by n matrices costs n * n * n. Doubling n makes the work 8 times bigger.

```mermaid Multiplications needed to multiply two n by n matrices: the work grows with n cubed
xychart-beta
  x-axis "n" [2, 4, 8, 16, 32]
  y-axis "multiplications" 0 --> 33000
  bar "n cubed" [8, 64, 512, 4096, 32768]
```

# algorithms/math/euclidean-distance | before Code
The lesson's 3D example, with points `(8, 2, 6)` and `(3, 5, 7)`. The code subtracts cell by cell, squares, adds, and takes one square root at the end, rounded to 2 decimals.

| Axis | First point | Second point | Difference | Squared |
| :-- | :-- | :-- | :-- | :-- |
| x | 8 | 3 | -5 | 25 |
| y | 2 | 5 | 3 | 9 |
| z | 6 | 7 | 1 | 1 |
| Total | | | | 35 |

The distance is the square root of 35, which is 5.9161 and prints as 5.92. The same steps work for any number of axes: only the number of rows changes.

# algorithms/math/binary-floating-point | before Code examples
Storing `-27.15625` as a half-precision number (1 sign bit, 5 exponent bits, 10 fraction bits, bias 15).

| Step | Work | Result |
| :-- | :-- | :-- |
| 1. Sign | the number is negative | 1 |
| 2. To binary | 27 is 11011, and .15625 is .00101 | 11011.00101 |
| 3. Shift to one leading 1 | move the point 4 places left | 1.101100101 x 2^4 |
| 4. Exponent | 4 + bias 15 = 19 | 10011 |
| 5. Fraction | drop the leading 1, pad with 0 to 10 bits | 1011001010 |
| Stored bits | sign, exponent, fraction | 1 10011 1011001010 |

To check, decode it: -1 x 2^(19 - 15) x (1 + 714 / 1024) = -16 x 1.697265625 = -27.15625. The 10 fraction bits give 1024 evenly spaced values inside every power-of-two range, so the gap between neighbours doubles with each range.

| Range | Gap between neighbouring half-precision numbers |
| :-- | :-- |
| 1 to 2 | 0.0009765625 |
| 16 to 32 | 0.015625 |
| 256 to 512 | 0.25 |
| 4096 to 8192 | 4 |
| 32768 to 65504 (the largest value) | 32 |

# algorithms/math/complex-number | before Polar Form
```mermaid Multiplying by i turns a point a quarter turn each time, so the powers of i repeat every four steps
flowchart LR
  A[i to the 0 is 1] --> B[i to the 1 is i]
  B --> C[i squared is -1]
  C --> D[i cubed is -i]
  D --> A
  class C focus
```
Each multiplication by i is a quarter turn: 1, i, -1 and -i are the four directions on the complex plane.

# algorithms/math/complex-number | before Code
In polar form, multiplying two complex numbers multiplies their moduli and adds their angles. Check with `3 + 4i` and `1 + i`, using the rectangular rule `(a * c - b * d) + (a * d + b * c)i`.

| | Rectangular form | Modulus | Angle |
| :-- | :-- | :-- | :-- |
| z1 | 3 + 4i | 5 | 53.13 degrees |
| z2 | 1 + i | 1.4142 | 45 degrees |
| z1 * z2 | -1 + 7i | 7.0711 (5 x 1.4142) | 98.13 degrees (53.13 + 45) |

# algorithms/math/fourier-transform | after Definitions
```mermaid Steps for n samples: the plain DFT grows with n squared, the FFT with n log2 n
xychart-beta
  x-axis "n" [8, 16, 32, 64, 128]
  y-axis "steps" 0 --> 17000
  line "DFT, n squared" [64, 256, 1024, 4096, 16384]
  line "FFT, n log2 n" [24, 64, 160, 384, 896]
```

# algorithms/math/fourier-transform | before Code
The `dft` function of this page applied to 8 samples of `cos(2 * pi * n / 8) + 0.5 * cos(2 * pi * 3 * n / 8)`, which mixes a strong wave of 1 cycle and a weaker wave of 3 cycles. The samples, rounded to 4 decimals, are 1.5, 0.3536, 0, -0.3536, -1.5, -0.3536, 0, 0.3536. The chart shows the size of each output value (the code divides by N).

```mermaid Size of each DFT output for the 8 samples: spikes at 1 and 3, mirrored at 7 and 5, nothing elsewhere
xychart-beta
  x-axis "frequency k" [0, 1, 2, 3, 4, 5, 6, 7]
  y-axis "size" 0 --> 0.6
  bar "amplitude" [0, 0.5, 0, 0.25, 0, 0.25, 0, 0.5]
```
The recipe is recovered exactly: the two ingredients appear at k = 1 and k = 3 with sizes 0.5 and 0.25, which are half of their original amplitudes 1 and 0.5. The other half shows up at the mirror positions 7 and 5.

# algorithms/math/liu-hui | after Iterative algorithm
Results of the `liuHui` function on this page for 1 to 8 splits (each split doubles the number of sides). The error is how far the estimate is below 3.141593.

| Splits | Polygon sides | Estimate of pi | Error |
| :-- | :-- | :-- | :-- |
| 1 | 6 | 3.000000 | 0.141593 |
| 2 | 12 | 3.105829 | 0.035764 |
| 3 | 24 | 3.132629 | 0.008964 |
| 4 | 48 | 3.139350 | 0.002243 |
| 5 | 96 | 3.141032 | 0.000561 |
| 6 | 192 | 3.141452 | 0.000141 |
| 7 | 384 | 3.141558 | 0.000035 |
| 8 | 768 | 3.141584 | 0.000009 |

Each split cuts the error to about a quarter, so every two splits add roughly one correct digit.

```mermaid How far each liuHui estimate is from pi, in thousandths: every doubling of the sides cuts the gap to about a quarter
xychart-beta
  x-axis "polygon sides" [6, 12, 24, 48, 96]
  y-axis "gap to pi, in thousandths" 0 --> 150
  bar [141.59, 35.76, 8.96, 2.24, 0.56]
```

# algorithms/math/radian | before Code
Worked examples with the two functions on this page (`Math.PI` is pi):

| Start | Calculation | Result |
| :-- | :-- | :-- |
| 45 degrees | 45 x (pi / 180) | 0.7854 radians |
| 2 radians | 2 x (180 / pi) | 114.59 degrees |
| 1 radian | 1 x (180 / pi) | 57.30 degrees |
