// One example per growth rate. `n` is the input size.

const constant = arr => arr[0]; // O(1)

function logarithmic(n) { // O(log n): halve until 1
  let steps = 0;
  while (n > 1) { n = Math.floor(n / 2); steps++; }
  return steps;
}

const linear = arr => arr.reduce((sum, x) => sum + x, 0); // O(n)

function quadratic(arr) { // O(n^2): every pair
  const pairs = [];
  for (const a of arr) for (const b of arr) pairs.push([a, b]);
  return pairs;
}

function subsets(arr) { // O(2^n): each item in or out
  return arr.reduce((all, x) => all.concat(all.map(s => [...s, x])), [[]]);
}

// Two inputs means two variables: O(a + b), not O(n).
const both = (a, b) => [...a.map(x => x * 2), ...b.map(x => x + 1)];

export { constant, logarithmic, linear, quadratic, subsets, both };
