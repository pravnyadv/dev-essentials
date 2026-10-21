# Memoization

Memoization saves the result of a function call and returns the saved result when the same input comes up again. It is the bridge from slow recursion to dynamic programming.

## When it applies

A problem has **overlapping subproblems** when plain recursion solves the same input repeatedly. Naive Fibonacci is the classic: `fib(5)` calls `fib(3)` twice, `fib(2)` three times, and the work grows as O(2ⁿ). Caching each `fib(k)` once makes it O(n).

## Top-down: recursion plus a cache

```js
function fib(n, memo = new Map()) {
  if (n < 2) return n;
  if (memo.has(n)) return memo.get(n);
  const value = fib(n - 1, memo) + fib(n - 2, memo);
  memo.set(n, value);
  return value;
}
```

## Bottom-up: fill a table (tabulation)

Fill a table from the smallest subproblem upward. No recursion, so no call stack to run out of.

```js
function fib(n) {
  const dp = [0, 1];
  for (let i = 2; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2];
  return dp[n];
}
```

If each cell only needs the previous one or two, keep just those variables and space drops from O(n) to O(1).

## What it costs

Each distinct input to the function is one **state**. fib(5) has six states, 0 to 5. Time is the number of states times the work done for one state (here one addition). Space is the number of states stored, plus the recursion depth for top-down.

## Steps to solve a DP problem

1. Define the **state**: what do the parameters of the function mean?
2. Write the **recurrence**: how does a state depend on smaller states?
3. Identify the **base cases**.
4. Pick the **order**: top-down with a cache, or bottom-up.
5. Optimise space if only the last few states matter.

Applied to fib: the state is n, the recurrence (the rule that builds a state from smaller ones) is fib(n) = fib(n - 1) + fib(n - 2), the base cases are fib(0) = 0 and fib(1) = 1, and either order works.

## Choosing a cache key

- One number: an array indexed by it is fastest.
- Two numbers: a 2D array, or a string key such as `` `${i},${j}` `` in a Map.
- Keep the key to the parameters that actually change the answer.

## Common mistakes

- Memoizing a function that is not pure, or that depends on state outside its parameters. A pure function always returns the same answer for the same arguments and reads nothing else. If it also reads a variable outside its arguments, the saved answer can go stale.
- A cache key that omits a parameter, returning wrong answers for different inputs.
- Deep recursion on large inputs hitting the stack limit: switch to bottom-up. Every recursive call keeps a frame on the call stack, which is limited, and very deep recursion (tens of thousands of calls) throws a RangeError.
