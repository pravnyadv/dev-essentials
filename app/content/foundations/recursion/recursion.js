export const sum = (arr, i = 0) => (i === arr.length ? 0 : arr[i] + sum(arr, i + 1));

export const power = (x, n) => { // O(log n): halve the exponent
  if (n === 0) return 1;
  const half = power(x, Math.floor(n / 2));
  return n % 2 ? half * half * x : half * half;
};

export const reverse = s => (s.length <= 1 ? s : reverse(s.slice(1)) + s[0]);

export const flatten = arr => arr.reduce((out, x) => out.concat(Array.isArray(x) ? flatten(x) : x), []);

export const fibSlow = n => (n < 2 ? n : fibSlow(n - 1) + fibSlow(n - 2)); // O(2^n)

export const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

export const permutations = (items, path = []) => {
  if (!items.length) return [path];
  return items.flatMap((x, i) => permutations([...items.slice(0, i), ...items.slice(i + 1)], [...path, x]));
};
