// Re-arranges the upstream repo (organised by folder) into a learning path.
// Topic ids are folder paths relative to src/, e.g. "algorithms/sorting/merge-sort".

export const CHAPTERS = [
  { id: 'linear', title: 'Linear Structures', blurb: 'Sequences you walk in order: the base for everything else.',
    topics: ['data-structures/linked-list', 'data-structures/doubly-linked-list', 'data-structures/stack', 'data-structures/queue', 'data-structures/deque', 'algorithms/linked-list/traversal', 'algorithms/linked-list/reverse-traversal', 'algorithms/stack/valid-parentheses'] },
  { id: 'hashing', title: 'Hashing & Caching', blurb: 'Trade memory for O(1) lookup.',
    topics: ['data-structures/hash-table', 'data-structures/bloom-filter', 'data-structures/lru-cache', 'algorithms/cryptography/polynomial-hash'] },
  { id: 'searching', title: 'Searching', blurb: 'Find an item, or the boundary where an answer flips.',
    topics: ['algorithms/search/linear-search', 'algorithms/search/binary-search', 'algorithms/search/jump-search', 'algorithms/search/interpolation-search'] },
  { id: 'sorting', title: 'Sorting', blurb: 'From O(n²) basics to O(n log n) and non-comparison sorts.',
    topics: ['algorithms/sorting/bubble-sort', 'algorithms/sorting/selection-sort', 'algorithms/sorting/insertion-sort', 'algorithms/sorting/merge-sort', 'algorithms/sorting/quick-sort', 'algorithms/sorting/heap-sort', 'algorithms/sorting/shell-sort', 'algorithms/sorting/counting-sort', 'algorithms/sorting/radix-sort', 'algorithms/sorting/bucket-sort'] },
  { id: 'trees', title: 'Trees & Heaps', blurb: 'Hierarchies, ordered lookup and priority.',
    topics: ['data-structures/tree', 'algorithms/tree/depth-first-search', 'algorithms/tree/breadth-first-search', 'data-structures/tree/binary-search-tree', 'data-structures/heap', 'data-structures/priority-queue', 'data-structures/trie', 'data-structures/tree/avl-tree', 'data-structures/tree/red-black-tree', 'data-structures/tree/segment-tree', 'data-structures/tree/fenwick-tree', 'data-structures/disjoint-set'] },
  { id: 'graphs', title: 'Graphs', blurb: 'Nodes and edges: traversal, shortest paths, spanning trees, ordering.',
    topics: ['data-structures/graph', 'algorithms/graph/breadth-first-search', 'algorithms/graph/depth-first-search', 'algorithms/graph/detect-cycle', 'algorithms/graph/topological-sorting', 'algorithms/graph/dijkstra', 'algorithms/graph/bellman-ford', 'algorithms/graph/floyd-warshall', 'algorithms/graph/kruskal', 'algorithms/graph/prim', 'algorithms/graph/strongly-connected-components', 'algorithms/graph/articulation-points', 'algorithms/graph/bridges', 'algorithms/graph/eulerian-path', 'algorithms/graph/hamiltonian-cycle', 'algorithms/graph/travelling-salesman'] },
  { id: 'recursion', title: 'Recursion & Backtracking', blurb: 'Build all candidates, prune the bad branches.',
    topics: ['algorithms/math/factorial', 'algorithms/uncategorized/recursive-staircase', 'algorithms/uncategorized/hanoi-tower', 'algorithms/sets/power-set', 'algorithms/sets/combinations', 'algorithms/sets/permutations', 'algorithms/sets/combination-sum', 'algorithms/sets/cartesian-product', 'algorithms/uncategorized/n-queens', 'algorithms/uncategorized/knight-tour', 'algorithms/uncategorized/jump-game'] },
  { id: 'dp', title: 'Dynamic Programming', blurb: 'Overlapping subproblems solved once.',
    topics: ['algorithms/math/fibonacci', 'algorithms/uncategorized/unique-paths', 'algorithms/sets/maximum-subarray', 'algorithms/sets/longest-increasing-subsequence', 'algorithms/sets/longest-common-subsequence', 'algorithms/sets/shortest-common-supersequence', 'algorithms/sets/knapsack-problem', 'algorithms/string/levenshtein-distance', 'algorithms/string/longest-common-substring', 'algorithms/string/regular-expression-matching', 'algorithms/uncategorized/best-time-to-buy-sell-stocks', 'algorithms/uncategorized/rain-terraces', 'algorithms/math/integer-partition'] },
  { id: 'strings', title: 'Strings', blurb: 'Matching, comparing and hashing text.',
    topics: ['algorithms/string/palindrome', 'algorithms/string/hamming-distance', 'algorithms/string/knuth-morris-pratt', 'algorithms/string/rabin-karp', 'algorithms/string/z-algorithm'] },
  { id: 'math', title: 'Math & Bits', blurb: 'Number tricks that show up in interviews.',
    topics: ['algorithms/math/bits', 'algorithms/math/is-power-of-two', 'algorithms/math/euclidean-algorithm', 'algorithms/math/least-common-multiple', 'algorithms/math/primality-test', 'algorithms/math/sieve-of-eratosthenes', 'algorithms/math/prime-factors', 'algorithms/math/fast-powering', 'algorithms/math/pascal-triangle', 'algorithms/math/horner-method', 'algorithms/math/square-root', 'algorithms/math/matrix', 'algorithms/uncategorized/square-matrix-rotation', 'algorithms/math/binary-floating-point', 'algorithms/math/complex-number', 'algorithms/math/euclidean-distance', 'algorithms/math/fourier-transform', 'algorithms/math/liu-hui', 'algorithms/math/radian'] },
  { id: 'misc', title: 'Misc & Applied', blurb: 'Ciphers, ML basics, image processing, randomness.',
    topics: ['algorithms/sets/fisher-yates', 'algorithms/statistics/weighted-random', 'algorithms/ml/k-means', 'algorithms/ml/knn', 'algorithms/cryptography/caesar-cipher', 'algorithms/cryptography/hill-cipher', 'algorithms/cryptography/rail-fence-cipher', 'algorithms/image-processing/seam-carving'] },
]

export const DIFFICULTY = {
  1: 'algorithms/search/linear-search algorithms/sorting/bubble-sort algorithms/sorting/selection-sort algorithms/sorting/insertion-sort data-structures/stack data-structures/queue data-structures/linked-list data-structures/deque algorithms/math/factorial algorithms/math/fibonacci algorithms/string/palindrome algorithms/string/hamming-distance algorithms/stack/valid-parentheses algorithms/math/is-power-of-two algorithms/linked-list/traversal algorithms/linked-list/reverse-traversal algorithms/cryptography/caesar-cipher algorithms/math/euclidean-algorithm',
  3: 'data-structures/tree/red-black-tree data-structures/tree/segment-tree data-structures/tree/fenwick-tree algorithms/graph/articulation-points algorithms/graph/bridges algorithms/graph/strongly-connected-components algorithms/graph/travelling-salesman algorithms/graph/hamiltonian-cycle algorithms/graph/eulerian-path algorithms/string/regular-expression-matching algorithms/string/z-algorithm algorithms/uncategorized/knight-tour algorithms/uncategorized/rain-terraces algorithms/math/fourier-transform algorithms/graph/bellman-ford algorithms/graph/floyd-warshall data-structures/bloom-filter algorithms/sets/shortest-common-supersequence algorithms/image-processing/seam-carving',
}

// Problem-pattern layer: how to recognise a problem and which topic to open.
export const PATTERNS = [
  { id: 'two-pointers', name: 'Two Pointers', signals: ['Sorted array or string', 'Pair/triplet with a target sum', 'Palindrome check', 'Remove duplicates in place'],
    examples: ['Two Sum II (sorted)', '3Sum', 'Container With Most Water', 'Valid Palindrome'], topics: ['algorithms/string/palindrome', 'algorithms/search/binary-search'],
    code: `function twoSumSorted(a, target) {
  let l = 0, r = a.length - 1;
  while (l < r) {
    const s = a[l] + a[r];
    if (s === target) return [l, r];
    s < target ? l++ : r--;
  }
  return null;
}` },
  { id: 'sliding-window', name: 'Sliding Window', signals: ['Longest/shortest contiguous subarray or substring', 'Constraint on the window (at most k distinct, sum >= s)', 'Fixed size k window'],
    examples: ['Longest Substring Without Repeating Characters', 'Minimum Size Subarray Sum', 'Max Sum of Subarray of Size K'], topics: ['data-structures/hash-table', 'data-structures/deque'],
    code: `function longestUnique(s) {
  const seen = new Map();
  let best = 0, left = 0;
  for (let right = 0; right < s.length; right++) {
    if (seen.has(s[right]) && seen.get(s[right]) >= left) left = seen.get(s[right]) + 1;
    seen.set(s[right], right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}` },
  { id: 'prefix-sum', name: 'Prefix Sum / Kadane', signals: ['Many range-sum queries', 'Subarray sum equals k', 'Best contiguous subarray'],
    examples: ['Subarray Sum Equals K', 'Range Sum Query', 'Maximum Subarray'], topics: ['algorithms/sets/maximum-subarray', 'data-structures/tree/fenwick-tree', 'data-structures/tree/segment-tree'],
    code: `function subarraySum(nums, k) {
  const count = new Map([[0, 1]]);
  let sum = 0, hits = 0;
  for (const n of nums) {
    sum += n;
    hits += count.get(sum - k) ?? 0;
    count.set(sum, (count.get(sum) ?? 0) + 1);
  }
  return hits;
}` },
  { id: 'binary-search', name: 'Binary Search (incl. on answer)', signals: ['Sorted input', 'Minimise the maximum / maximise the minimum', 'Monotonic yes/no check over a range'],
    examples: ['Search in Rotated Array', 'Koko Eating Bananas', 'Capacity to Ship Packages', 'Sqrt(x)'], topics: ['algorithms/search/binary-search', 'algorithms/math/square-root'],
    code: `function firstTrue(lo, hi, ok) { // smallest x in [lo, hi] with ok(x)
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    ok(mid) ? (hi = mid) : (lo = mid + 1);
  }
  return lo;
}` },
  { id: 'hash-map', name: 'Hash Map / Set Lookup', signals: ['Need "have I seen this?" in O(1)', 'Group by key (anagrams)', 'Count frequencies', 'Find complement'],
    examples: ['Two Sum', 'Group Anagrams', 'Top K Frequent', 'Longest Consecutive Sequence'], topics: ['data-structures/hash-table', 'data-structures/lru-cache', 'data-structures/bloom-filter'],
    code: `function twoSum(nums, target) {
  const idx = new Map();
  for (let i = 0; i < nums.length; i++) {
    if (idx.has(target - nums[i])) return [idx.get(target - nums[i]), i];
    idx.set(nums[i], i);
  }
}` },
  { id: 'stack', name: 'Stack / Monotonic Stack', signals: ['Matching brackets or nesting', 'Next greater/smaller element', 'Undo or evaluate expressions'],
    examples: ['Valid Parentheses', 'Daily Temperatures', 'Largest Rectangle in Histogram', 'Evaluate RPN'], topics: ['data-structures/stack', 'algorithms/stack/valid-parentheses', 'algorithms/uncategorized/rain-terraces'],
    code: `function nextGreater(a) {
  const out = Array(a.length).fill(-1), st = [];
  for (let i = 0; i < a.length; i++) {
    while (st.length && a[st.at(-1)] < a[i]) out[st.pop()] = a[i];
    st.push(i);
  }
  return out;
}` },
  { id: 'linked-list', name: 'Fast & Slow Pointers', signals: ['Cycle in a linked list', 'Middle of a list', 'Nth from the end', 'In-place list reversal'],
    examples: ['Linked List Cycle', 'Reverse Linked List', 'Middle of the Linked List', 'Happy Number'], topics: ['data-structures/linked-list', 'algorithms/linked-list/reverse-traversal', 'algorithms/graph/detect-cycle'],
    code: `function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next; fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}` },
  { id: 'tree-traversal', name: 'Tree DFS / BFS', signals: ['Binary tree depth, path, or validity', 'Level-by-level output', 'Lowest common ancestor'],
    examples: ['Maximum Depth', 'Level Order Traversal', 'Validate BST', 'Lowest Common Ancestor'], topics: ['algorithms/tree/depth-first-search', 'algorithms/tree/breadth-first-search', 'data-structures/tree/binary-search-tree'],
    code: `function levelOrder(root) {
  const out = [], q = root ? [root] : [];
  while (q.length) {
    const level = [];
    for (let n = q.length; n > 0; n--) {
      const node = q.shift();
      level.push(node.val);
      node.left && q.push(node.left);
      node.right && q.push(node.right);
    }
    out.push(level);
  }
  return out;
}` },
  { id: 'heap', name: 'Heap / Top-K', signals: ['K largest/smallest/most frequent', 'Merge k sorted lists', 'Running median', 'Always need the current min or max'],
    examples: ['Kth Largest Element', 'Merge K Sorted Lists', 'Find Median from Data Stream', 'Task Scheduler'], topics: ['data-structures/heap', 'data-structures/priority-queue', 'algorithms/sorting/heap-sort'],
    code: `// Keep a min-heap of size k: the root is the kth largest.
// (JS has no built-in heap: use the MinHeap from the Heap topic.)
function kthLargest(nums, k, MinHeap) {
  const h = new MinHeap();
  for (const n of nums) { h.add(n); if (h.heapContainer.length > k) h.poll(); }
  return h.peek();
}` },
  { id: 'graph-traversal', name: 'Graph / Grid BFS & DFS', signals: ['Connected components or islands', 'Shortest path in an unweighted graph or grid', 'Flood fill', 'Word ladder style state search'],
    examples: ['Number of Islands', 'Rotting Oranges', 'Word Ladder', 'Clone Graph'], topics: ['data-structures/graph', 'algorithms/graph/breadth-first-search', 'algorithms/graph/depth-first-search'],
    code: `function islands(grid) {
  let count = 0;
  const sink = (r, c) => {
    if (grid[r]?.[c] !== '1') return;
    grid[r][c] = '0';
    sink(r + 1, c); sink(r - 1, c); sink(r, c + 1); sink(r, c - 1);
  };
  grid.forEach((row, r) => row.forEach((v, c) => { if (v === '1') { count++; sink(r, c); } }));
  return count;
}` },
  { id: 'topological', name: 'Topological Sort', signals: ['Prerequisites or dependencies', 'Build/task ordering', 'Detect impossible ordering (cycle)'],
    examples: ['Course Schedule I/II', 'Alien Dictionary', 'Parallel Courses'], topics: ['algorithms/graph/topological-sorting', 'algorithms/graph/detect-cycle'],
    code: `function order(n, edges) { // Kahn's algorithm
  const adj = Array.from({ length: n }, () => []), indeg = Array(n).fill(0);
  for (const [a, b] of edges) { adj[a].push(b); indeg[b]++; }
  const q = [...indeg.keys()].filter(i => !indeg[i]), out = [];
  while (q.length) {
    const u = q.shift(); out.push(u);
    for (const v of adj[u]) if (--indeg[v] === 0) q.push(v);
  }
  return out.length === n ? out : []; // [] means a cycle
}` },
  { id: 'shortest-path', name: 'Weighted Shortest Path', signals: ['Cheapest route with edge weights', 'Network delay / cheapest flights', 'Negative edges (Bellman-Ford)'],
    examples: ['Network Delay Time', 'Cheapest Flights Within K Stops', 'Path With Minimum Effort'], topics: ['algorithms/graph/dijkstra', 'algorithms/graph/bellman-ford', 'algorithms/graph/floyd-warshall'],
    code: `// Dijkstra: always expand the closest unvisited node (use a priority queue).
// See the Dijkstra topic for the full implementation on top of PriorityQueue.` },
  { id: 'union-find', name: 'Union-Find', signals: ['Dynamic connectivity', 'Group merging', 'Detect a cycle in an undirected graph', 'Minimum spanning tree'],
    examples: ['Number of Provinces', 'Redundant Connection', 'Accounts Merge'], topics: ['data-structures/disjoint-set', 'algorithms/graph/kruskal'],
    code: `const parent = [];
const find = x => (parent[x] === undefined || parent[x] === x ? (parent[x] = x) : (parent[x] = find(parent[x])));
const union = (a, b) => { parent[find(a)] = find(b); };` },
  { id: 'backtracking', name: 'Backtracking', signals: ['Generate all subsets / permutations / combinations', 'Place items under constraints', '"Return all possible ..."'],
    examples: ['Subsets', 'Permutations', 'Combination Sum', 'N-Queens', 'Word Search'], topics: ['algorithms/sets/power-set', 'algorithms/sets/permutations', 'algorithms/sets/combination-sum', 'algorithms/uncategorized/n-queens'],
    code: `function subsets(nums) {
  const out = [], path = [];
  (function go(i) {
    if (i === nums.length) return out.push([...path]);
    go(i + 1);              // skip
    path.push(nums[i]); go(i + 1); path.pop(); // take, then undo
  })(0);
  return out;
}` },
  { id: 'dp', name: 'Dynamic Programming', signals: ['"Count the ways" / min cost / max value', 'Choices at each step with overlapping subproblems', 'Brute force recursion repeats the same inputs'],
    examples: ['Climbing Stairs', 'House Robber', 'Coin Change', 'Longest Increasing Subsequence', 'Edit Distance', '0/1 Knapsack'], topics: ['algorithms/uncategorized/recursive-staircase', 'algorithms/sets/knapsack-problem', 'algorithms/sets/longest-common-subsequence', 'algorithms/string/levenshtein-distance'],
    code: `function coinChange(coins, amount) {
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++)
    for (const c of coins) if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);
  return dp[amount] === Infinity ? -1 : dp[amount];
}` },
  { id: 'greedy', name: 'Greedy / Intervals', signals: ['Local best choice is globally safe', 'Merge or schedule intervals', 'Jump / reach problems'],
    examples: ['Jump Game', 'Merge Intervals', 'Meeting Rooms', 'Gas Station'], topics: ['algorithms/uncategorized/jump-game', 'algorithms/graph/kruskal', 'algorithms/graph/prim'],
    code: `function mergeIntervals(iv) {
  iv.sort((a, b) => a[0] - b[0]);
  const out = [iv[0]];
  for (const [s, e] of iv.slice(1)) {
    const last = out.at(-1);
    s <= last[1] ? (last[1] = Math.max(last[1], e)) : out.push([s, e]);
  }
  return out;
}` },
  { id: 'trie', name: 'Trie / Prefix Search', signals: ['Prefix lookup or autocomplete', 'Many words searched in a grid', 'Longest common prefix'],
    examples: ['Implement Trie', 'Word Search II', 'Design Add and Search Words'], topics: ['data-structures/trie'],
    code: `class Trie {
  root = {};
  insert(w) { let n = this.root; for (const c of w) n = n[c] ??= {}; n.end = true; }
  startsWith(p) { let n = this.root; for (const c of p) if (!(n = n[c])) return false; return true; }
}` },
  { id: 'bits', name: 'Bit Manipulation', signals: ['Find the single/odd one out', 'Powers of two', 'Subset enumeration via masks', 'Constant-space tricks'],
    examples: ['Single Number', 'Number of 1 Bits', 'Power of Two', 'Counting Bits'], topics: ['algorithms/math/bits', 'algorithms/math/is-power-of-two'],
    code: `const single = nums => nums.reduce((a, b) => a ^ b, 0); // pairs cancel under XOR` },
]
