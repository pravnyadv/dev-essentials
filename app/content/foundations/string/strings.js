export const isPalindrome = s => {
  const t = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  for (let l = 0, r = t.length - 1; l < r; l++, r--) if (t[l] !== t[r]) return false;
  return true;
}; // O(n) time

export const isAnagram = (a, b) => {
  if (a.length !== b.length) return false;
  const counts = Array(26).fill(0);
  for (let i = 0; i < a.length; i++) {
    counts[a.charCodeAt(i) - 97]++;
    counts[b.charCodeAt(i) - 97]--;
  }
  return counts.every(c => c === 0);
}; // O(n) time, O(1) space

export const reverseWords = s => s.trim().split(/\s+/).reverse().join(' ');

export const firstUniqueChar = s => {
  const freq = new Map();
  for (const ch of s) freq.set(ch, (freq.get(ch) ?? 0) + 1);
  return [...s].findIndex(ch => freq.get(ch) === 1);
};

export const compress = s => { // "aaabb" -> "a3b2"
  const out = [];
  for (let i = 0, j = 0; i < s.length; i = j) {
    while (j < s.length && s[j] === s[i]) j++;
    out.push(s[i], j - i);
  }
  return out.join('');
};
