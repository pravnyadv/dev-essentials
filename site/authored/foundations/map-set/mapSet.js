export const frequencies = items => {
  const freq = new Map();
  for (const x of items) freq.set(x, (freq.get(x) ?? 0) + 1);
  return freq;
};

export const hasDuplicate = nums => new Set(nums).size !== nums.length;

export const twoSum = (nums, target) => {
  const index = new Map(); // value -> position
  for (let i = 0; i < nums.length; i++) {
    if (index.has(target - nums[i])) return [index.get(target - nums[i]), i];
    index.set(nums[i], i);
  }
  return null;
};

export const groupAnagrams = words => {
  const groups = new Map();
  for (const w of words) {
    const key = [...w].sort().join('');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(w);
  }
  return [...groups.values()];
};

export const intersection = (a, b) => {
  const inA = new Set(a);
  return [...new Set(b.filter(x => inA.has(x)))];
};
