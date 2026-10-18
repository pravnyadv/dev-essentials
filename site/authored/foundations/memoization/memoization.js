// Wrap any pure function of one argument.
export const memoize = fn => {
  const cache = new Map();
  return arg => {
    if (!cache.has(arg)) cache.set(arg, fn(arg));
    return cache.get(arg);
  };
};

export const climbStairs = (() => {
  const climb = memoize(n => (n <= 1 ? 1 : climb(n - 1) + climb(n - 2)));
  return climb;
})();

// Unique paths in a rows x cols grid moving only right or down.
export function uniquePaths(rows, cols) {
  const memo = new Map();
  const go = (r, c) => {
    if (r === rows - 1 || c === cols - 1) return 1;
    const key = `${r},${c}`;
    if (!memo.has(key)) memo.set(key, go(r + 1, c) + go(r, c + 1));
    return memo.get(key);
  };
  return go(0, 0);
}

// The same problem bottom-up with O(cols) space.
export function uniquePathsTable(rows, cols) {
  const row = Array(cols).fill(1);
  for (let r = 1; r < rows; r++) for (let c = 1; c < cols; c++) row[c] += row[c - 1];
  return row[cols - 1];
}

export function coinChange(coins, amount) { // fewest coins, -1 if impossible
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) for (const c of coins) if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);
  return dp[amount] === Infinity ? -1 : dp[amount];
}
