// Problem-pattern layer: how to recognise a problem, which topic to open, what to practise.
// `core: true` marks the 15 patterns from the AlgoMaster cheat sheet; the rest are extras.
// Problems link to https://leetcode.com/problems/<slug>/. d = E(asy) | M(edium) | H(ard).
import { EXPLAIN } from './explain.mjs'
import { STEPS } from './walkthroughs.mjs'

const P = (d, slug, name) => ({ d, slug, name })

const PATTERN_LIST = [
  { id: 'prefix-sum', core: true, name: 'Prefix Sum', signals: ['Many range-sum queries on a static array', 'Subarray sum equals k', 'Product or count of everything except self'],
    topics: ['foundations/array', 'algorithms/sets/maximum-subarray', 'data-structures/tree/fenwick-tree', 'data-structures/tree/segment-tree'],
    code: `// Running totals: prefix[i] = nums[0] + ... + nums[i - 1], with prefix[0] = 0.
// (the walkthrough drops the leading 0, so its indexes sit one lower)
const prefix = [0];
for (const n of nums) prefix.push(prefix.at(-1) + n);
const rangeSum = (start, end) => prefix[end + 1] - prefix[start]; // nums[start..end]

// Variant: count subarrays that add up to k, using a Map of running totals seen so far.
function subarraySum(nums, k) {
  const count = new Map([[0, 1]]);
  let sum = 0, hits = 0;
  for (const n of nums) {
    sum += n;
    hits += count.get(sum - k) ?? 0;
    count.set(sum, (count.get(sum) ?? 0) + 1);
  }
  return hits;
}`,
    problems: [P('E', 'running-sum-of-1d-array', 'Running Sum of 1d Array'), P('E', 'range-sum-query-immutable', 'Range Sum Query - Immutable'), P('E', 'find-pivot-index', 'Find Pivot Index'), P('E', 'find-the-highest-altitude', 'Find the Highest Altitude'),
      P('M', 'subarray-sum-equals-k', 'Subarray Sum Equals K'), P('M', 'product-of-array-except-self', 'Product of Array Except Self'), P('M', 'continuous-subarray-sum', 'Continuous Subarray Sum'), P('M', 'contiguous-array', 'Contiguous Array'),
      P('M', 'range-sum-query-2d-immutable', 'Range Sum Query 2D - Immutable'), P('M', 'subarray-sums-divisible-by-k', 'Subarray Sums Divisible by K'), P('M', 'maximum-size-subarray-sum-equals-k', 'Maximum Size Subarray Sum Equals k'), P('M', 'corporate-flight-bookings', 'Corporate Flight Bookings'),
      P('M', 'car-pooling', 'Car Pooling'), P('H', 'count-of-range-sum', 'Count of Range Sum')] },

  { id: 'two-pointers', core: true, name: 'Two Pointers', signals: ['Sorted array or string', 'Pair or triplet with a target sum', 'Palindrome check', 'Remove duplicates in place'],
    topics: ['foundations/array', 'foundations/string', 'algorithms/string/palindrome'],
    code: `function twoSumSorted(a, target) {
  let l = 0, r = a.length - 1;
  while (l < r) {
    const s = a[l] + a[r];
    if (s === target) return [l, r];
    s < target ? l++ : r--;
  }
  return null;
}`,
    problems: [P('E', 'valid-palindrome', 'Valid Palindrome'), P('E', 'two-sum-ii-input-array-is-sorted', 'Two Sum II - Input Array Is Sorted'), P('E', 'remove-duplicates-from-sorted-array', 'Remove Duplicates from Sorted Array'), P('E', 'move-zeroes', 'Move Zeroes'),
      P('E', 'squares-of-a-sorted-array', 'Squares of a Sorted Array'), P('E', 'reverse-string', 'Reverse String'), P('E', 'merge-sorted-array', 'Merge Sorted Array'), P('E', 'remove-element', 'Remove Element'),
      P('M', '3sum', '3Sum'), P('M', '3sum-closest', '3Sum Closest'), P('M', 'container-with-most-water', 'Container With Most Water'), P('M', 'sort-colors', 'Sort Colors'),
      P('M', 'remove-duplicates-from-sorted-array-ii', 'Remove Duplicates from Sorted Array II'), P('M', 'valid-palindrome-ii', 'Valid Palindrome II'), P('M', 'boats-to-save-people', 'Boats to Save People'),
      P('M', '4sum', '4Sum'), P('M', '3sum-smaller', '3Sum Smaller'), P('H', 'trapping-rain-water', 'Trapping Rain Water')] },

  { id: 'sliding-window', core: true, name: 'Sliding Window', signals: ['Longest or shortest contiguous subarray or substring', 'Constraint on the window (at most k distinct, or sum >= s when all numbers are positive)', 'Fixed size k window'],
    topics: ['foundations/array', 'foundations/string', 'data-structures/hash-table', 'data-structures/deque'],
    code: `function longestUnique(s) {
  const inWindow = new Set();
  let best = 0, left = 0;
  for (let right = 0; right < s.length; right++) {
    while (inWindow.has(s[right])) inWindow.delete(s[left++]); // shrink until the repeat is gone
    inWindow.add(s[right]);
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
    problems: [P('E', 'best-time-to-buy-and-sell-stock', 'Best Time to Buy and Sell Stock'), P('E', 'maximum-average-subarray-i', 'Maximum Average Subarray I'), P('E', 'contains-duplicate-ii', 'Contains Duplicate II'), P('M', 'longest-nice-subarray', 'Longest Nice Subarray'),
      P('M', 'longest-substring-without-repeating-characters', 'Longest Substring Without Repeating Characters'), P('M', 'longest-repeating-character-replacement', 'Longest Repeating Character Replacement'), P('M', 'permutation-in-string', 'Permutation in String'), P('M', 'find-all-anagrams-in-a-string', 'Find All Anagrams in a String'),
      P('M', 'minimum-size-subarray-sum', 'Minimum Size Subarray Sum'), P('M', 'max-consecutive-ones-iii', 'Max Consecutive Ones III'), P('M', 'fruit-into-baskets', 'Fruit Into Baskets'), P('M', 'longest-substring-with-at-most-k-distinct-characters', 'Longest Substring with At Most K Distinct Characters'),
      P('M', 'subarray-product-less-than-k', 'Subarray Product Less Than K'), P('M', 'maximum-points-you-can-obtain-from-cards', 'Maximum Points You Can Obtain from Cards'), P('M', 'count-number-of-nice-subarrays', 'Count Number of Nice Subarrays'),
      P('H', 'minimum-window-substring', 'Minimum Window Substring'), P('H', 'sliding-window-maximum', 'Sliding Window Maximum'), P('H', 'substring-with-concatenation-of-all-words', 'Substring with Concatenation of All Words')] },

  { id: 'fast-slow', core: true, name: 'Fast & Slow Pointers', signals: ['Cycle in a linked list or number sequence', 'Middle of a list', 'Nth node from the end'],
    topics: ['algorithms/linked-list/traversal', 'data-structures/doubly-linked-list', 'data-structures/linked-list', 'algorithms/graph/detect-cycle'],
    code: `function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next; fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
    problems: [P('E', 'linked-list-cycle', 'Linked List Cycle'), P('E', 'middle-of-the-linked-list', 'Middle of the Linked List'), P('E', 'palindrome-linked-list', 'Palindrome Linked List'), P('E', 'happy-number', 'Happy Number'),
      P('M', 'linked-list-cycle-ii', 'Linked List Cycle II'), P('M', 'find-the-duplicate-number', 'Find the Duplicate Number'), P('M', 'remove-nth-node-from-end-of-list', 'Remove Nth Node From End of List'), P('M', 'reorder-list', 'Reorder List'),
      P('M', 'sort-list', 'Sort List'), P('M', 'circular-array-loop', 'Circular Array Loop'), P('M', 'delete-the-middle-node-of-a-linked-list', 'Delete the Middle Node of a Linked List'), P('M', 'rotate-list', 'Rotate List')] },

  { id: 'in-place-reversal', core: true, name: 'In-Place Reversal', signals: ['Reverse a linked list or part of it', 'Reverse in groups of k or in pairs'],
    topics: ['algorithms/linked-list/reverse-traversal', 'data-structures/linked-list'],
    code: `function reverseList(head) {
  let prev = null, cur = head;
  while (cur) {
    const next = cur.next; // save the way forward first
    cur.next = prev;       // flip the arrow
    prev = cur;
    cur = next;
  }
  return prev;
}`,
    problems: [P('E', 'reverse-linked-list', 'Reverse Linked List'), P('E', 'palindrome-linked-list', 'Palindrome Linked List'),
      P('M', 'reverse-linked-list-ii', 'Reverse Linked List II'), P('M', 'swap-nodes-in-pairs', 'Swap Nodes in Pairs'), P('M', 'rotate-list', 'Rotate List'),
      P('H', 'reverse-nodes-in-k-group', 'Reverse Nodes in k-Group')] },

  { id: 'monotonic-stack', core: true, name: 'Monotonic Stack', signals: ['Next greater or smaller element to the left or right', 'Each item waits until something bigger or smaller arrives', 'Largest rectangle, stock span or "how many days until" problems'],
    topics: ['data-structures/stack', 'algorithms/uncategorized/rain-terraces'],
    code: `function nextGreater(a) {
  const out = Array(a.length).fill(-1), st = [];
  for (let i = 0; i < a.length; i++) {
    while (st.length && a[st.at(-1)] < a[i]) out[st.pop()] = a[i];
    st.push(i);
  }
  return out;
}`,
    problems: [P('E', 'next-greater-element-i', 'Next Greater Element I'), 
      P('M', 'daily-temperatures', 'Daily Temperatures'), P('M', 'next-greater-element-ii', 'Next Greater Element II'), 
      P('M', 'remove-k-digits', 'Remove K Digits'), P('M', 'online-stock-span', 'Online Stock Span'), P('M', 'car-fleet', 'Car Fleet'),
      P('M', 'asteroid-collision', 'Asteroid Collision'), P('M', '132-pattern', '132 Pattern'), P('M', 'sum-of-subarray-minimums', 'Sum of Subarray Minimums'),
      P('H', 'largest-rectangle-in-histogram', 'Largest Rectangle in Histogram'), P('H', 'maximal-rectangle', 'Maximal Rectangle'), P('H', 'trapping-rain-water', 'Trapping Rain Water'), ] },

  { id: 'top-k', core: true, name: 'Top K Elements', signals: ['K largest, smallest or most frequent', 'Merge k sorted inputs', 'Running median', 'You repeatedly need the current min or max'],
    topics: ['algorithms/ml/knn', 'data-structures/heap', 'data-structures/priority-queue', 'algorithms/sorting/heap-sort'],
    code: `// Keep a min-heap of size k: its root is the kth largest.
// JS has no built-in heap, so use MinHeap from the Heap topic.
function kthLargest(nums, k, MinHeap) {
  const h = new MinHeap();
  for (const n of nums) { h.add(n); if (h.heapContainer.length > k) h.poll(); }
  return h.peek();
}`,
    problems: [P('E', 'kth-largest-element-in-a-stream', 'Kth Largest Element in a Stream'), P('E', 'last-stone-weight', 'Last Stone Weight'), P('M', 'kth-largest-element-in-an-array', 'Kth Largest Element in an Array'), P('M', 'top-k-frequent-elements', 'Top K Frequent Elements'),
      P('M', 'top-k-frequent-words', 'Top K Frequent Words'), P('M', 'k-closest-points-to-origin', 'K Closest Points to Origin'), P('M', 'sort-characters-by-frequency', 'Sort Characters By Frequency'), P('M', 'task-scheduler', 'Task Scheduler'),
      P('M', 'reorganize-string', 'Reorganize String'), P('M', 'find-k-pairs-with-smallest-sums', 'Find K Pairs with Smallest Sums'), P('M', 'kth-smallest-element-in-a-sorted-matrix', 'Kth Smallest Element in a Sorted Matrix'), P('M', 'meeting-rooms-ii', 'Meeting Rooms II'),
      P('M', 'furthest-building-you-can-reach', 'Furthest Building You Can Reach'), P('H', 'merge-k-sorted-lists', 'Merge k Sorted Lists'), P('H', 'find-median-from-data-stream', 'Find Median from Data Stream'), P('H', 'smallest-range-covering-elements-from-k-lists', 'Smallest Range Covering Elements from K Lists')] },

  { id: 'intervals', core: true, name: 'Overlapping Intervals', signals: ['Ranges with a start and end', 'Merge, insert or schedule', 'Minimum rooms or removals'],
    topics: ['algorithms/uncategorized/jump-game'],
    code: `function mergeIntervals(iv) {
  iv.sort((a, b) => a[0] - b[0]);
  if (!iv.length) return [];
  const out = [iv[0]];
  for (const [s, e] of iv.slice(1)) {
    const last = out.at(-1);
    s <= last[1] ? (last[1] = Math.max(last[1], e)) : out.push([s, e]);
  }
  return out;
}`,
    problems: [P('E', 'meeting-rooms', 'Meeting Rooms'), P('E', 'summary-ranges', 'Summary Ranges'), P('M', 'merge-intervals', 'Merge Intervals'), P('M', 'insert-interval', 'Insert Interval'),
      P('M', 'non-overlapping-intervals', 'Non-overlapping Intervals'), P('M', 'meeting-rooms-ii', 'Meeting Rooms II'), P('M', 'minimum-number-of-arrows-to-burst-balloons', 'Minimum Number of Arrows to Burst Balloons'), P('M', 'interval-list-intersections', 'Interval List Intersections'),
      P('M', 'my-calendar-i', 'My Calendar I'), P('M', 'car-pooling', 'Car Pooling'), P('M', 'remove-covered-intervals', 'Remove Covered Intervals'), P('H', 'employee-free-time', 'Employee Free Time'),
      P('M', 'partition-labels', 'Partition Labels'), P('H', 'data-stream-as-disjoint-intervals', 'Data Stream as Disjoint Intervals'), P('H', 'the-skyline-problem', 'The Skyline Problem')] },

  { id: 'binary-search', core: true, name: 'Modified Binary Search', signals: ['Sorted or rotated input', 'Minimise the maximum or maximise the minimum', 'A yes/no check that flips once over a range'],
    topics: ['algorithms/search/linear-search', 'algorithms/search/jump-search', 'algorithms/search/interpolation-search', 'algorithms/search/binary-search', 'algorithms/math/square-root'],
    code: `function firstTrue(lo, hi, ok) { // smallest x in [lo, hi] with ok(x); assumes ok(hi) is true, otherwise it returns hi
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    ok(mid) ? (hi = mid) : (lo = mid + 1);
  }
  return lo;
}`,
    problems: [P('E', 'binary-search', 'Binary Search'), P('E', 'search-insert-position', 'Search Insert Position'), P('E', 'sqrtx', 'Sqrt(x)'), P('E', 'first-bad-version', 'First Bad Version'),
      P('E', 'valid-perfect-square', 'Valid Perfect Square'), P('E', 'arranging-coins', 'Arranging Coins'), P('M', 'search-in-rotated-sorted-array', 'Search in Rotated Sorted Array'), P('M', 'find-minimum-in-rotated-sorted-array', 'Find Minimum in Rotated Sorted Array'),
      P('M', 'find-first-and-last-position-of-element-in-sorted-array', 'Find First and Last Position of Element in Sorted Array'), P('M', 'find-peak-element', 'Find Peak Element'), P('M', 'search-a-2d-matrix', 'Search a 2D Matrix'), P('M', 'koko-eating-bananas', 'Koko Eating Bananas'),
      P('M', 'capacity-to-ship-packages-within-d-days', 'Capacity To Ship Packages Within D Days'), P('M', 'time-based-key-value-store', 'Time Based Key-Value Store'), P('M', 'single-element-in-a-sorted-array', 'Single Element in a Sorted Array'), P('M', 'minimum-number-of-days-to-make-m-bouquets', 'Minimum Number of Days to Make m Bouquets'),
      P('H', 'median-of-two-sorted-arrays', 'Median of Two Sorted Arrays'), P('H', 'split-array-largest-sum', 'Split Array Largest Sum'), P('H', 'find-minimum-in-rotated-sorted-array-ii', 'Find Minimum in Rotated Sorted Array II')] },

  { id: 'tree-traversal', core: true, name: 'Binary Tree Traversal', signals: ['Visit every node in a given order', 'Build or serialise a tree', 'Properties like depth, symmetry or equality'],
    topics: ['data-structures/tree', 'algorithms/tree/depth-first-search', 'algorithms/tree/breadth-first-search', 'data-structures/tree/binary-search-tree'],
    code: `function inorder(node, visit) {
  if (!node) return;
  inorder(node.left, visit);
  visit(node.val);
  inorder(node.right, visit);
}`,
    problems: [P('E', 'binary-tree-inorder-traversal', 'Binary Tree Inorder Traversal'), P('E', 'binary-tree-preorder-traversal', 'Binary Tree Preorder Traversal'), P('E', 'binary-tree-postorder-traversal', 'Binary Tree Postorder Traversal'), P('E', 'same-tree', 'Same Tree'),
      P('E', 'symmetric-tree', 'Symmetric Tree'), P('E', 'invert-binary-tree', 'Invert Binary Tree'), P('E', 'subtree-of-another-tree', 'Subtree of Another Tree'), P('E', 'merge-two-binary-trees', 'Merge Two Binary Trees'),
      P('M', 'construct-binary-tree-from-preorder-and-inorder-traversal', 'Construct Binary Tree from Preorder and Inorder Traversal'), P('M', 'construct-binary-tree-from-inorder-and-postorder-traversal', 'Construct Binary Tree from Inorder and Postorder Traversal'), P('M', 'validate-binary-search-tree', 'Validate Binary Search Tree'), P('M', 'kth-smallest-element-in-a-bst', 'Kth Smallest Element in a BST'),
      P('M', 'flatten-binary-tree-to-linked-list', 'Flatten Binary Tree to Linked List'), P('M', 'lowest-common-ancestor-of-a-binary-tree', 'Lowest Common Ancestor of a Binary Tree'), P('M', 'binary-search-tree-iterator', 'Binary Search Tree Iterator'), P('M', 'recover-binary-search-tree', 'Recover Binary Search Tree'),
      P('H', 'serialize-and-deserialize-binary-tree', 'Serialize and Deserialize Binary Tree'), P('H', 'binary-tree-maximum-path-sum', 'Binary Tree Maximum Path Sum')] },

  { id: 'dfs', core: true, name: 'Depth-First Search', signals: ['Explore a path fully before backing up', 'Paths, depth, connected components', 'Visit every node of a tree or graph, or follow one path to its end before trying another'],
    topics: ['algorithms/graph/articulation-points', 'algorithms/graph/bridges', 'algorithms/graph/strongly-connected-components', 'algorithms/graph/eulerian-path', 'algorithms/graph/depth-first-search', 'algorithms/tree/depth-first-search', 'data-structures/graph'],
    code: `function dfs(node, seen = new Set()) {
  if (!node || seen.has(node)) return;
  seen.add(node);
  for (const next of node.neighbors) dfs(next, seen);
  return seen;
}`,
    problems: [P('E', 'maximum-depth-of-binary-tree', 'Maximum Depth of Binary Tree'), P('E', 'path-sum', 'Path Sum'), P('E', 'diameter-of-binary-tree', 'Diameter of Binary Tree'), P('E', 'balanced-binary-tree', 'Balanced Binary Tree'),
      P('E', 'find-if-path-exists-in-graph', 'Find if Path Exists in Graph'), P('M', 'path-sum-ii', 'Path Sum II'), P('M', 'path-sum-iii', 'Path Sum III'), P('M', 'clone-graph', 'Clone Graph'),
      P('M', 'number-of-provinces', 'Number of Provinces'), P('M', 'all-paths-from-source-to-target', 'All Paths From Source to Target'), P('M', 'course-schedule', 'Course Schedule'), P('M', 'pacific-atlantic-water-flow', 'Pacific Atlantic Water Flow'),
      P('M', 'count-good-nodes-in-binary-tree', 'Count Good Nodes in Binary Tree'), P('M', 'sum-root-to-leaf-numbers', 'Sum Root to Leaf Numbers'), P('H', 'reconstruct-itinerary', 'Reconstruct Itinerary'), P('M', 'is-graph-bipartite', 'Is Graph Bipartite?'),
      P('H', 'binary-tree-maximum-path-sum', 'Binary Tree Maximum Path Sum'), P('H', 'longest-increasing-path-in-a-matrix', 'Longest Increasing Path in a Matrix')] },

  { id: 'bfs', core: true, name: 'Breadth-First Search', signals: ['Shortest path in an unweighted graph or grid', 'Level-by-level processing', 'Minimum number of steps or moves'],
    topics: ['data-structures/queue', 'algorithms/graph/breadth-first-search', 'algorithms/tree/breadth-first-search'],
    code: `function levelOrder(root) {
  // On a graph or grid, add a seen Set and skip neighbours already in it.
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
}`,
    problems: [P('E', 'minimum-depth-of-binary-tree', 'Minimum Depth of Binary Tree'), P('E', 'average-of-levels-in-binary-tree', 'Average of Levels in Binary Tree'), P('M', 'binary-tree-level-order-traversal', 'Binary Tree Level Order Traversal'), P('M', 'binary-tree-zigzag-level-order-traversal', 'Binary Tree Zigzag Level Order Traversal'),
      P('M', 'binary-tree-right-side-view', 'Binary Tree Right Side View'), P('M', 'populating-next-right-pointers-in-each-node', 'Populating Next Right Pointers in Each Node'), P('M', 'rotting-oranges', 'Rotting Oranges'), P('M', 'shortest-path-in-binary-matrix', 'Shortest Path in Binary Matrix'),
      P('M', 'open-the-lock', 'Open the Lock'), P('M', 'walls-and-gates', 'Walls and Gates'), P('M', '01-matrix', '01 Matrix'), P('M', 'perfect-squares', 'Perfect Squares'),
      P('H', 'word-ladder', 'Word Ladder'), P('M', 'jump-game-iii', 'Jump Game III'), P('M', 'nearest-exit-from-entrance-in-maze', 'Nearest Exit from Entrance in Maze'), P('M', 'snakes-and-ladders', 'Snakes and Ladders'),
      P('H', 'word-ladder-ii', 'Word Ladder II'), P('H', 'shortest-path-visiting-all-nodes', 'Shortest Path Visiting All Nodes')] },

  { id: 'matrix', core: true, name: 'Matrix Traversal', signals: ['2D grid of cells', 'Islands, regions, flood fill', 'Spiral, diagonal or rotation walks'],
    topics: ['foundations/matrix-2d', 'algorithms/uncategorized/unique-paths', 'algorithms/uncategorized/square-matrix-rotation', 'algorithms/math/matrix'],
    code: `function islands(grid) {
  let count = 0;
  const sink = (r, c) => {
    if (grid[r]?.[c] !== '1') return;
    grid[r][c] = '0';
    sink(r + 1, c); sink(r - 1, c); sink(r, c + 1); sink(r, c - 1);
  };
  grid.forEach((row, r) => row.forEach((v, c) => { if (v === '1') { count++; sink(r, c); } }));
  return count;
}`,
    problems: [P('E', 'flood-fill', 'Flood Fill'), P('E', 'island-perimeter', 'Island Perimeter'), P('E', 'transpose-matrix', 'Transpose Matrix'), P('E', 'toeplitz-matrix', 'Toeplitz Matrix'),
      P('M', 'number-of-islands', 'Number of Islands'), P('M', 'max-area-of-island', 'Max Area of Island'), P('M', 'surrounded-regions', 'Surrounded Regions'), P('M', 'spiral-matrix', 'Spiral Matrix'),
      P('M', 'rotate-image', 'Rotate Image'), P('M', 'set-matrix-zeroes', 'Set Matrix Zeroes'), P('M', 'game-of-life', 'Game of Life'), P('M', 'word-search', 'Word Search'),
      P('M', 'number-of-enclaves', 'Number of Enclaves'), P('M', 'spiral-matrix-ii', 'Spiral Matrix II'), P('M', 'diagonal-traverse', 'Diagonal Traverse'), P('M', 'search-a-2d-matrix-ii', 'Search a 2D Matrix II'),
      P('H', 'longest-increasing-path-in-a-matrix', 'Longest Increasing Path in a Matrix'), P('H', 'word-search-ii', 'Word Search II')] },

  { id: 'backtracking', core: true, name: 'Backtracking', signals: ['Generate all subsets, permutations or combinations', 'Place items under constraints', '"Return all possible ..."'],
    topics: ['foundations/recursion', 'algorithms/uncategorized/knight-tour', 'algorithms/graph/hamiltonian-cycle', 'algorithms/sets/cartesian-product', 'algorithms/sets/combinations', 'algorithms/sets/power-set', 'algorithms/sets/permutations', 'algorithms/sets/combination-sum', 'algorithms/uncategorized/n-queens'],
    code: `function subsets(nums) {
  const out = [], path = [];
  (function go(i) {
    if (i === nums.length) return out.push([...path]);
    path.push(nums[i]); go(i + 1); path.pop();  // take, then undo
    go(i + 1);                                  // skip
  })(0);
  return out;
}`,
    problems: [P('E', 'binary-tree-paths', 'Binary Tree Paths'), P('M', 'subsets', 'Subsets'), P('M', 'subsets-ii', 'Subsets II'), P('M', 'permutations', 'Permutations'),
      P('M', 'permutations-ii', 'Permutations II'), P('M', 'combinations', 'Combinations'), P('M', 'combination-sum', 'Combination Sum'), P('M', 'combination-sum-ii', 'Combination Sum II'),
      P('M', 'combination-sum-iii', 'Combination Sum III'), P('M', 'letter-combinations-of-a-phone-number', 'Letter Combinations of a Phone Number'), P('M', 'generate-parentheses', 'Generate Parentheses'), P('M', 'palindrome-partitioning', 'Palindrome Partitioning'),
      P('M', 'word-search', 'Word Search'), P('M', 'restore-ip-addresses', 'Restore IP Addresses'), P('M', 'letter-case-permutation', 'Letter Case Permutation'), P('M', 'partition-to-k-equal-sum-subsets', 'Partition to K Equal Sum Subsets'),
      P('H', 'n-queens', 'N-Queens'), P('H', 'sudoku-solver', 'Sudoku Solver'), P('H', 'word-break-ii', 'Word Break II'), P('H', 'expression-add-operators', 'Expression Add Operators')] },

  { id: 'dp', core: true, name: 'Dynamic Programming', signals: ['Count the ways, min cost or max value', 'Choices at each step with overlapping subproblems', 'Brute-force recursion repeats the same inputs'],
    topics: ['foundations/memoization', 'foundations/recursion', 'algorithms/graph/travelling-salesman', 'algorithms/sets/maximum-subarray', 'algorithms/uncategorized/unique-paths', 'algorithms/uncategorized/best-time-to-buy-sell-stocks', 'algorithms/sets/longest-increasing-subsequence', 'algorithms/sets/shortest-common-supersequence', 'algorithms/math/fibonacci', 'algorithms/math/integer-partition', 'algorithms/string/longest-common-substring', 'algorithms/string/regular-expression-matching', 'algorithms/uncategorized/recursive-staircase', 'algorithms/sets/knapsack-problem', 'algorithms/sets/longest-common-subsequence', 'algorithms/string/levenshtein-distance'],
    code: `function coinChange(coins, amount) {
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++)
    for (const c of coins) if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
    problems: [P('E', 'climbing-stairs', 'Climbing Stairs'), P('E', 'fibonacci-number', 'Fibonacci Number'), P('E', 'min-cost-climbing-stairs', 'Min Cost Climbing Stairs'), P('E', 'pascals-triangle', "Pascal's Triangle"),
      P('M', 'house-robber', 'House Robber'), P('M', 'house-robber-ii', 'House Robber II'), P('M', 'coin-change', 'Coin Change'), P('M', 'coin-change-ii', 'Coin Change II'),
      P('M', 'longest-increasing-subsequence', 'Longest Increasing Subsequence'), P('M', 'longest-common-subsequence', 'Longest Common Subsequence'), P('M', 'word-break', 'Word Break'), P('M', 'unique-paths', 'Unique Paths'),
      P('M', 'unique-paths-ii', 'Unique Paths II'), P('M', 'minimum-path-sum', 'Minimum Path Sum'), P('M', 'perfect-squares', 'Perfect Squares'), P('M', 'partition-equal-subset-sum', 'Partition Equal Subset Sum'),
      P('M', 'target-sum', 'Target Sum'), P('M', 'decode-ways', 'Decode Ways'), P('M', 'maximum-product-subarray', 'Maximum Product Subarray'), P('M', 'longest-palindromic-substring', 'Longest Palindromic Substring'),
      P('M', 'palindromic-substrings', 'Palindromic Substrings'), P('M', 'best-time-to-buy-and-sell-stock-with-cooldown', 'Best Time to Buy and Sell Stock with Cooldown'), P('M', 'triangle', 'Triangle'), P('M', 'maximal-square', 'Maximal Square'),
      P('M', 'edit-distance', 'Edit Distance'), P('H', 'regular-expression-matching', 'Regular Expression Matching'), P('H', 'burst-balloons', 'Burst Balloons'), P('H', 'distinct-subsequences', 'Distinct Subsequences'),
      P('H', 'longest-valid-parentheses', 'Longest Valid Parentheses'), P('H', 'best-time-to-buy-and-sell-stock-iv', 'Best Time to Buy and Sell Stock IV')] },

  // Extras beyond the 15.
  { id: 'hash-map', name: 'Hash Map / Set Lookup', signals: ['Need "have I seen this?" in O(1)', 'Group by key (anagrams)', 'Count frequencies', 'Find a complement'],
    topics: ['foundations/map-set', 'algorithms/cryptography/polynomial-hash', 'data-structures/hash-table', 'data-structures/lru-cache', 'data-structures/bloom-filter'],
    code: `function twoSum(nums, target) {
  const idx = new Map();
  for (let i = 0; i < nums.length; i++) {
    if (idx.has(target - nums[i])) return [idx.get(target - nums[i]), i];
    idx.set(nums[i], i);
  }
}`,
    problems: [P('E', 'two-sum', 'Two Sum'), P('E', 'contains-duplicate', 'Contains Duplicate'), P('E', 'valid-anagram', 'Valid Anagram'), P('E', 'ransom-note', 'Ransom Note'),
      P('E', 'isomorphic-strings', 'Isomorphic Strings'), P('E', 'intersection-of-two-arrays', 'Intersection of Two Arrays'), P('E', 'majority-element', 'Majority Element'), P('E', 'single-number', 'Single Number'),
      P('M', 'group-anagrams', 'Group Anagrams'), P('M', 'longest-consecutive-sequence', 'Longest Consecutive Sequence'), P('M', 'lru-cache', 'LRU Cache'), P('M', 'insert-delete-getrandom-o1', 'Insert Delete GetRandom O(1)'),
      P('M', 'encode-and-decode-tinyurl', 'Encode and Decode TinyURL'), P('M', '4sum-ii', '4Sum II'), P('M', 'brick-wall', 'Brick Wall'), P('M', 'custom-sort-string', 'Custom Sort String'),
      P('H', 'lfu-cache', 'LFU Cache'), P('H', 'all-oone-data-structure', 'All O`one Data Structure')] },

  { id: 'topological', name: 'Topological Sort', signals: ['Prerequisites or dependencies', 'Build or task ordering', 'Detect an impossible ordering (cycle)'],
    topics: ['algorithms/graph/topological-sorting', 'algorithms/graph/detect-cycle'],
    code: `function order(n, edges) { // Kahn's algorithm. edge [a, b] means a must come before b. LeetCode's Course Schedule gives [course, prereq], so swap them.
  const adj = Array.from({ length: n }, () => []), indeg = Array(n).fill(0);
  for (const [a, b] of edges) { adj[a].push(b); indeg[b]++; }
  const q = [...indeg.keys()].filter(i => !indeg[i]), out = [];
  while (q.length) {
    const u = q.shift(); out.push(u);
    for (const v of adj[u]) if (--indeg[v] === 0) q.push(v);
  }
  return out.length === n ? out : []; // [] means a cycle
}`,
    problems: [P('M', 'course-schedule', 'Course Schedule'), P('M', 'course-schedule-ii', 'Course Schedule II'), P('M', 'find-eventual-safe-states', 'Find Eventual Safe States'), P('M', 'minimum-height-trees', 'Minimum Height Trees'),
      P('M', 'sequence-reconstruction', 'Sequence Reconstruction'), P('M', 'parallel-courses', 'Parallel Courses'), P('M', 'all-ancestors-of-a-node-in-a-directed-acyclic-graph', 'All Ancestors of a Node in a DAG'), P('M', 'course-schedule-iv', 'Course Schedule IV'),
      P('H', 'alien-dictionary', 'Alien Dictionary'), P('H', 'sort-items-by-groups-respecting-dependencies', 'Sort Items by Groups Respecting Dependencies')] },

  { id: 'shortest-path', name: 'Weighted Shortest Path', signals: ['Cheapest route with edge weights', 'Network delay or cheapest flights', 'Negative edges (Bellman-Ford)'],
    topics: ['algorithms/graph/dijkstra', 'algorithms/graph/bellman-ford', 'algorithms/graph/floyd-warshall'],
    code: `function dijkstra(n, edges, src) { // no negative costs; edges are [from, to, cost]
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v, w] of edges) adj[u].push([v, w]);
  const dist = Array(n).fill(Infinity), done = Array(n).fill(false);
  dist[src] = 0;
  for (let round = 0; round < n; round++) {
    let u = -1; // the closest unfinished node (a priority queue finds it faster)
    for (let i = 0; i < n; i++) if (!done[i] && (u < 0 || dist[i] < dist[u])) u = i;
    if (dist[u] === Infinity) break;
    done[u] = true;
    for (const [v, w] of adj[u]) dist[v] = Math.min(dist[v], dist[u] + w);
  }
  return dist;
}`,
    problems: [P('M', 'network-delay-time', 'Network Delay Time'), P('M', 'cheapest-flights-within-k-stops', 'Cheapest Flights Within K Stops'), P('M', 'path-with-minimum-effort', 'Path With Minimum Effort'), P('M', 'path-with-maximum-probability', 'Path with Maximum Probability'),
      P('M', 'find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance', 'Find the City With the Smallest Number of Neighbors'), P('H', 'minimum-cost-to-reach-destination-in-time', 'Minimum Cost to Reach Destination in Time'), P('H', 'swim-in-rising-water', 'Swim in Rising Water'), P('H', 'minimum-cost-to-make-at-least-one-valid-path-in-a-grid', 'Minimum Cost to Make at Least One Valid Path in a Grid')] },

  { id: 'union-find', name: 'Union-Find', signals: ['Dynamic connectivity', 'Merging groups', 'Detect a cycle in an undirected graph', 'Minimum spanning tree'],
    topics: ['data-structures/disjoint-set', 'algorithms/graph/kruskal'],
    code: `const parent = [], size = [];
const find = x => { if (parent[x] === undefined) { parent[x] = x; size[x] = 1; } while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; };
const union = (a, b) => { a = find(a); b = find(b); if (a === b) return false; if (size[a] < size[b]) [a, b] = [b, a]; parent[b] = a; size[a] += size[b]; return true; };`,
    problems: [P('E', 'find-if-path-exists-in-graph', 'Find if Path Exists in Graph'), P('M', 'number-of-provinces', 'Number of Provinces'), P('M', 'redundant-connection', 'Redundant Connection'), P('M', 'accounts-merge', 'Accounts Merge'),
      P('M', 'graph-valid-tree', 'Graph Valid Tree'), P('M', 'number-of-connected-components-in-an-undirected-graph', 'Number of Connected Components in an Undirected Graph'), P('M', 'satisfiability-of-equality-equations', 'Satisfiability of Equality Equations'), P('M', 'most-stones-removed-with-same-row-or-column', 'Most Stones Removed with Same Row or Column'),
      P('M', 'evaluate-division', 'Evaluate Division'), P('M', 'min-cost-to-connect-all-points', 'Min Cost to Connect All Points'), P('H', 'number-of-islands-ii', 'Number of Islands II'), P('H', 'swim-in-rising-water', 'Swim in Rising Water')] },

  { id: 'greedy', name: 'Greedy', signals: ['A locally best choice is globally safe', 'Reach, schedule or cover problems', 'Sorting first makes the choice obvious'],
    topics: ['algorithms/uncategorized/jump-game', 'algorithms/graph/kruskal', 'algorithms/graph/prim'],
    code: `function canJump(nums) {
  let reach = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > reach) return false;
    reach = Math.max(reach, i + nums[i]);
  }
  return true;
}`,
    problems: [P('E', 'assign-cookies', 'Assign Cookies'), P('E', 'lemonade-change', 'Lemonade Change'), P('E', 'can-place-flowers', 'Can Place Flowers'),
      P('M', 'best-time-to-buy-and-sell-stock-ii', 'Best Time to Buy and Sell Stock II'), P('M', 'jump-game', 'Jump Game'), P('M', 'jump-game-ii', 'Jump Game II'), P('M', 'gas-station', 'Gas Station'), P('M', 'hand-of-straights', 'Hand of Straights'),
      P('M', 'task-scheduler', 'Task Scheduler'), P('M', 'queue-reconstruction-by-height', 'Queue Reconstruction by Height'), P('M', 'partition-labels', 'Partition Labels'), P('M', 'maximum-subarray', 'Maximum Subarray'),
      P('H', 'candy', 'Candy'), P('H', 'minimum-number-of-taps-to-open-to-water-a-garden', 'Minimum Number of Taps to Open to Water a Garden')] },

  { id: 'trie', name: 'Trie / Prefix Search', signals: ['Prefix lookup or autocomplete', 'Many words searched on a grid', 'Longest common prefix'],
    topics: ['data-structures/trie'],
    code: `class Trie {
  root = {};
  insert(w) { let n = this.root; for (const c of w) n = n[c] ??= {}; n.end = true; }
  startsWith(p) { let n = this.root; for (const c of p) if (!(n = n[c])) return false; return true; }
  search(w) { let n = this.root; for (const c of w) if (!(n = n[c])) return false; return n.end === true; } // end marks a complete word, not just a prefix
}`,
    problems: [P('E', 'longest-common-prefix', 'Longest Common Prefix'), P('M', 'implement-trie-prefix-tree', 'Implement Trie (Prefix Tree)'), P('M', 'design-add-and-search-words-data-structure', 'Design Add and Search Words Data Structure'), P('M', 'replace-words', 'Replace Words'),
      P('M', 'map-sum-pairs', 'Map Sum Pairs'), P('M', 'search-suggestions-system', 'Search Suggestions System'), P('M', 'maximum-xor-of-two-numbers-in-an-array', 'Maximum XOR of Two Numbers in an Array'), P('H', 'word-search-ii', 'Word Search II'),
      P('H', 'concatenated-words', 'Concatenated Words'), P('H', 'palindrome-pairs', 'Palindrome Pairs')] },

  { id: 'bits', name: 'Bit Manipulation', signals: ['Find the single or odd one out', 'Powers of two', 'Subset enumeration via masks', 'Constant-space tricks'],
    topics: ['algorithms/math/binary-floating-point', 'algorithms/math/bits', 'algorithms/math/is-power-of-two'],
    code: `const single = nums => nums.reduce((a, b) => a ^ b, 0); // pairs cancel under XOR
const isPowerOfTwo = n => n > 0 && (n & (n - 1)) === 0; // a power of two has one 1-bit; n - 1 flips it and all lower bits
// Subsets of an n-item list: for (let mask = 0; mask < 1 << n; mask++), bit i of mask says whether item i is in.`,
    problems: [P('E', 'single-number', 'Single Number'), P('E', 'number-of-1-bits', 'Number of 1 Bits'), P('E', 'power-of-two', 'Power of Two'), P('E', 'counting-bits', 'Counting Bits'),
      P('E', 'reverse-bits', 'Reverse Bits'), P('E', 'missing-number', 'Missing Number'), P('E', 'hamming-distance', 'Hamming Distance'), P('M', 'single-number-ii', 'Single Number II'),
      P('M', 'single-number-iii', 'Single Number III'), P('M', 'sum-of-two-integers', 'Sum of Two Integers'), P('M', 'bitwise-and-of-numbers-range', 'Bitwise AND of Numbers Range'), P('M', 'subsets', 'Subsets'),
      P('M', 'maximum-product-of-word-lengths', 'Maximum Product of Word Lengths'), P('M', 'maximum-xor-of-two-numbers-in-an-array', 'Maximum XOR of Two Numbers in an Array')] },

  { id: 'sort-first', name: 'Sort First', signals: ['Duplicates, closeness or ordering questions', 'Pairs of neighbours matter', 'Brute force compares every pair'],
    topics: ['foundations/array', 'algorithms/sorting/bubble-sort', 'algorithms/sorting/selection-sort', 'algorithms/sorting/insertion-sort', 'algorithms/sorting/shell-sort', 'algorithms/sorting/heap-sort', 'algorithms/sorting/counting-sort', 'algorithms/sorting/radix-sort', 'algorithms/sorting/bucket-sort'],
    code: `// Sorting turns "compare every pair" into "compare neighbours".
const hasDuplicate = nums => {
  const s = [...nums].sort((a, b) => a - b);
  return s.some((v, i) => i > 0 && v === s[i - 1]);
};`,
    problems: [P('E', 'contains-duplicate', 'Contains Duplicate'), P('E', 'valid-anagram', 'Valid Anagram'), P('E', 'minimum-absolute-difference', 'Minimum Absolute Difference'), P('E', 'array-partition', 'Array Partition'), P('E', 'meeting-rooms', 'Meeting Rooms'),
      P('M', '3sum', '3Sum'), P('M', 'k-diff-pairs-in-an-array', 'K-diff Pairs in an Array'), P('M', 'largest-number', 'Largest Number'), P('M', 'h-index', 'H-Index'), P('M', 'wiggle-sort-ii', 'Wiggle Sort II'), P('M', 'custom-sort-string', 'Custom Sort String')] },

  { id: 'divide-conquer', name: 'Divide & Conquer', signals: ['Problem splits into independent halves', 'Solved pieces can be combined in one pass', 'You can write the cost as: time for two halves plus the cost of combining, e.g. 2 halves + n steps to merge'],
    topics: ['foundations/recursion', 'algorithms/sorting/merge-sort', 'algorithms/sorting/quick-sort', 'algorithms/math/fast-powering', 'algorithms/uncategorized/hanoi-tower', 'algorithms/search/binary-search'],
    code: `function mergeSort(a) {
  if (a.length < 2) return a;
  const mid = a.length >> 1, l = mergeSort(a.slice(0, mid)), r = mergeSort(a.slice(mid));
  const out = [];
  let i = 0, j = 0;
  while (i < l.length && j < r.length) out.push(l[i] <= r[j] ? l[i++] : r[j++]);
  return out.concat(l.slice(i), r.slice(j));
}`,
    problems: [P('E', 'majority-element', 'Majority Element'), P('E', 'convert-sorted-array-to-binary-search-tree', 'Convert Sorted Array to Binary Search Tree'), P('M', 'powx-n', 'Pow(x, n)'), P('M', 'sort-list', 'Sort List'),
      P('M', 'maximum-subarray', 'Maximum Subarray'), P('M', 'different-ways-to-add-parentheses', 'Different Ways to Add Parentheses'), P('M', 'construct-quad-tree', 'Construct Quad Tree'), P('M', 'kth-largest-element-in-an-array', 'Kth Largest Element in an Array'),
      P('H', 'merge-k-sorted-lists', 'Merge k Sorted Lists'), P('H', 'reverse-pairs', 'Reverse Pairs'), P('H', 'the-skyline-problem', 'The Skyline Problem'), P('H', 'median-of-two-sorted-arrays', 'Median of Two Sorted Arrays')] },

  { id: 'string-matching', name: 'String Matching', signals: ['Find a pattern inside a text', 'Compare or transform two strings', 'Palindromes and repeated substrings'],
    topics: ['foundations/string', 'algorithms/string/knuth-morris-pratt', 'algorithms/string/rabin-karp', 'algorithms/string/z-algorithm', 'algorithms/string/palindrome', 'algorithms/string/hamming-distance', 'algorithms/string/levenshtein-distance'],
    code: `// Naive O(n * m). KMP, Rabin-Karp and Z do it in O(n + m): see their topics.
const indexOf = (text, pat) => {
  for (let i = 0; i + pat.length <= text.length; i++)
  {
    let j = 0;
    while (j < pat.length && text[i + j] === pat[j]) j++; // up to m comparisons per start
    if (j === pat.length) return i;
  }
  return -1;
};`,
    problems: [P('E', 'find-the-index-of-the-first-occurrence-in-a-string', 'Find the Index of the First Occurrence in a String'), P('E', 'repeated-substring-pattern', 'Repeated Substring Pattern'), P('E', 'is-subsequence', 'Is Subsequence'), P('E', 'rotate-string', 'Rotate String'),
      P('M', 'longest-palindromic-substring', 'Longest Palindromic Substring'), P('M', 'palindromic-substrings', 'Palindromic Substrings'), P('M', 'repeated-string-match', 'Repeated String Match'), P('M', 'one-edit-distance', 'One Edit Distance'), P('M', 'edit-distance', 'Edit Distance'),
      P('H', 'shortest-palindrome', 'Shortest Palindrome'), P('H', 'longest-happy-prefix', 'Longest Happy Prefix'), P('H', 'longest-duplicate-substring', 'Longest Duplicate Substring'), P('H', 'wildcard-matching', 'Wildcard Matching')] },

  { id: 'number-theory', name: 'Number Theory', signals: ['GCD, LCM, divisibility, primes', 'Huge exponents or modular arithmetic', 'Digits and arithmetic without built-ins'],
    topics: ['algorithms/math/euclidean-algorithm', 'algorithms/math/least-common-multiple', 'algorithms/math/primality-test', 'algorithms/math/sieve-of-eratosthenes', 'algorithms/math/prime-factors', 'algorithms/math/fast-powering', 'algorithms/math/factorial', 'algorithms/math/horner-method', 'algorithms/math/square-root'],
    code: `const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
const lcm = (a, b) => (a / gcd(a, b)) * b;
const modPow = (b, e, m) => {
  let r = 1n % m
  b %= m
  while (e > 0n) {
    if (e & 1n) r = (r * b) % m
    b = (b * b) % m
    e >>= 1n
  }
  return r
}`,
    problems: [P('E', 'greatest-common-divisor-of-strings', 'Greatest Common Divisor of Strings'), P('E', 'ugly-number', 'Ugly Number'), P('E', 'happy-number', 'Happy Number'), P('E', 'plus-one', 'Plus One'),
      P('E', 'add-binary', 'Add Binary'), P('E', 'excel-sheet-column-number', 'Excel Sheet Column Number'), P('M', 'count-primes', 'Count Primes'), P('M', 'powx-n', 'Pow(x, n)'),
      P('M', 'factorial-trailing-zeroes', 'Factorial Trailing Zeroes'), P('M', 'ugly-number-ii', 'Ugly Number II'), P('M', 'multiply-strings', 'Multiply Strings'), P('M', 'divide-two-integers', 'Divide Two Integers'),
      P('M', 'water-and-jug-problem', 'Water and Jug Problem'), P('M', 'super-pow', 'Super Pow'), P('H', 'largest-component-size-by-common-factor', 'Largest Component Size by Common Factor')] },
]

// Roadmap layout on the Patterns page. Order within a group is the learning order.
export const GROUPS = [
  { title: 'Arrays & Strings', ids: ['hash-map', 'two-pointers', 'sliding-window', 'prefix-sum', 'binary-search', 'sort-first', 'intervals', 'string-matching'] },
  { title: 'Linked Lists', ids: ['fast-slow', 'in-place-reversal'] },
  { title: 'Stacks, Heaps & Tries', ids: ['monotonic-stack', 'top-k', 'trie'] },
  { title: 'Trees & Graphs', ids: ['tree-traversal', 'dfs', 'bfs', 'matrix', 'topological', 'union-find', 'shortest-path'] },
  { title: 'Recursion & Optimisation', ids: ['divide-conquer', 'backtracking', 'greedy', 'dp'] },
  { title: 'Math & Bits', ids: ['bits', 'number-theory'] },
]

export const PATTERNS = PATTERN_LIST.map(p => ({ ...p, what: EXPLAIN[p.id]?.[0], usedFor: EXPLAIN[p.id]?.[1], steps: STEPS[p.id] }))
const missing = PATTERNS.filter(p => !p.steps || !p.what).map(p => p.id)
if (missing.length) throw new Error('no walkthrough or explanation for: ' + missing.join(', '))
