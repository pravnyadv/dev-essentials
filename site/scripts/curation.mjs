// Re-arranges the upstream repo (organised by folder) into a learning path.
// Topic ids are folder paths: "algorithms/sorting/merge-sort", or "foundations/array" for topics written in app/content/.
// Chapter and topic order below IS the recommended learning order.

export const TIERS = [
  { id: 1, title: 'Must Know', blurb: 'What every developer uses daily and what interviews ask most. Work through this in order.' },
  { id: 2, title: 'Advanced', blurb: 'Specialised structures and algorithms. Useful to know, rarely required. Pick what interests you.' },
]

export const CHAPTERS = [
  // Tier 1: must know
  { id: 'foundations', tier: 1, title: 'Foundations', blurb: 'The vocabulary and building blocks everything else uses.',
    topics: ['foundations/big-o', 'foundations/array', 'foundations/string', 'foundations/matrix-2d', 'foundations/map-set', 'foundations/recursion'] },
  { id: 'linear', tier: 1, title: 'Linked Lists, Stacks & Queues', blurb: 'Sequences you walk in order.',
    topics: ['data-structures/linked-list', 'data-structures/doubly-linked-list', 'algorithms/linked-list/traversal', 'algorithms/linked-list/reverse-traversal', 'data-structures/stack', 'algorithms/stack/valid-parentheses', 'data-structures/queue', 'data-structures/deque'] },
  { id: 'hashing', tier: 1, title: 'Hashing', blurb: 'Trade memory for O(1) lookup.',
    topics: ['data-structures/hash-table', 'data-structures/lru-cache'] },
  { id: 'search-sort', tier: 1, title: 'Searching & Sorting', blurb: 'Find an item, order a list. Binary search and merge/quick sort are interview staples.',
    topics: ['algorithms/search/linear-search', 'algorithms/search/binary-search', 'algorithms/sorting/bubble-sort', 'algorithms/sorting/selection-sort', 'algorithms/sorting/insertion-sort', 'algorithms/sorting/merge-sort', 'algorithms/sorting/quick-sort', 'algorithms/sorting/counting-sort'] },
  { id: 'classics', tier: 1, title: 'Array & String Classics', blurb: 'Frequently asked problems built on arrays and strings.',
    topics: ['algorithms/string/palindrome', 'algorithms/sets/maximum-subarray', 'algorithms/uncategorized/best-time-to-buy-sell-stocks', 'algorithms/uncategorized/jump-game', 'algorithms/uncategorized/rain-terraces', 'algorithms/uncategorized/square-matrix-rotation', 'algorithms/math/pascal-triangle'] },
  { id: 'backtracking', tier: 1, title: 'Recursion & Backtracking', blurb: 'Build all candidates, prune the bad branches.',
    topics: ['algorithms/math/factorial', 'algorithms/uncategorized/recursive-staircase', 'algorithms/uncategorized/hanoi-tower', 'algorithms/sets/power-set', 'algorithms/sets/combinations', 'algorithms/sets/permutations', 'algorithms/sets/combination-sum', 'algorithms/uncategorized/n-queens'] },
  { id: 'trees', tier: 1, title: 'Trees, Heaps & Tries', blurb: 'Hierarchies, ordered lookup and priority.',
    topics: ['data-structures/tree', 'algorithms/tree/depth-first-search', 'algorithms/tree/breadth-first-search', 'data-structures/tree/binary-search-tree', 'data-structures/heap', 'data-structures/priority-queue', 'data-structures/trie'] },
  { id: 'graphs', tier: 1, title: 'Graphs', blurb: 'Nodes and edges: traversal, cycles, ordering, shortest paths.',
    topics: ['data-structures/graph', 'algorithms/graph/breadth-first-search', 'algorithms/graph/depth-first-search', 'algorithms/graph/detect-cycle', 'algorithms/graph/topological-sorting', 'data-structures/disjoint-set', 'algorithms/graph/dijkstra'] },
  { id: 'dp', tier: 1, title: 'Dynamic Programming', blurb: 'Overlapping subproblems solved once.',
    topics: ['foundations/memoization', 'algorithms/math/fibonacci', 'algorithms/uncategorized/unique-paths', 'algorithms/sets/knapsack-problem', 'algorithms/sets/longest-increasing-subsequence', 'algorithms/sets/longest-common-subsequence', 'algorithms/string/levenshtein-distance'] },
  { id: 'math-bits', tier: 1, title: 'Math & Bits', blurb: 'Number tricks that show up in interviews.',
    topics: ['algorithms/math/bits', 'algorithms/math/is-power-of-two', 'algorithms/math/euclidean-algorithm', 'algorithms/math/primality-test', 'algorithms/math/sieve-of-eratosthenes', 'algorithms/math/fast-powering'] },

  // Tier 2: advanced
  { id: 'adv-structures', tier: 2, title: 'Advanced Data Structures', blurb: 'Self-balancing trees, range-query trees and probabilistic sets.',
    topics: ['data-structures/tree/avl-tree', 'data-structures/tree/red-black-tree', 'data-structures/tree/segment-tree', 'data-structures/tree/fenwick-tree', 'data-structures/bloom-filter', 'algorithms/cryptography/polynomial-hash'] },
  { id: 'adv-graphs', tier: 2, title: 'Advanced Graphs', blurb: 'Spanning trees, all-pairs paths, connectivity and tours.',
    topics: ['algorithms/graph/bellman-ford', 'algorithms/graph/floyd-warshall', 'algorithms/graph/kruskal', 'algorithms/graph/prim', 'algorithms/graph/strongly-connected-components', 'algorithms/graph/articulation-points', 'algorithms/graph/bridges', 'algorithms/graph/eulerian-path', 'algorithms/graph/hamiltonian-cycle', 'algorithms/graph/travelling-salesman'] },
  { id: 'adv-strings-dp', tier: 2, title: 'Advanced Strings & DP', blurb: 'Fast string matching and harder dynamic programming.',
    topics: ['algorithms/string/knuth-morris-pratt', 'algorithms/string/rabin-karp', 'algorithms/string/z-algorithm', 'algorithms/string/hamming-distance', 'algorithms/string/longest-common-substring', 'algorithms/sets/shortest-common-supersequence', 'algorithms/string/regular-expression-matching', 'algorithms/math/integer-partition'] },
  { id: 'adv-sort-search', tier: 2, title: 'More Sorting & Searching', blurb: 'Non-comparison sorts and alternative searches.',
    topics: ['algorithms/sorting/heap-sort', 'algorithms/sorting/shell-sort', 'algorithms/sorting/radix-sort', 'algorithms/sorting/bucket-sort', 'algorithms/search/jump-search', 'algorithms/search/interpolation-search'] },
  { id: 'adv-math', tier: 2, title: 'More Math', blurb: 'Number theory and numeric methods.',
    topics: ['algorithms/math/least-common-multiple', 'algorithms/math/prime-factors', 'algorithms/math/horner-method', 'algorithms/math/square-root', 'algorithms/math/matrix', 'algorithms/math/euclidean-distance', 'algorithms/math/binary-floating-point', 'algorithms/math/complex-number', 'algorithms/math/fourier-transform', 'algorithms/math/liu-hui', 'algorithms/math/radian'] },
  { id: 'applied', tier: 2, title: 'Applied & Puzzles', blurb: 'Ciphers, machine learning, images, randomness and puzzles.',
    topics: ['algorithms/uncategorized/knight-tour', 'algorithms/sets/cartesian-product', 'algorithms/sets/fisher-yates', 'algorithms/statistics/weighted-random', 'algorithms/ml/k-means', 'algorithms/ml/knn', 'algorithms/cryptography/caesar-cipher', 'algorithms/cryptography/hill-cipher', 'algorithms/cryptography/rail-fence-cipher', 'algorithms/image-processing/seam-carving'] },
]

// Beginner-friendly topics in tier 1. Everything else in tier 1 is "Core", all of tier 2 is "Advanced".
export const DIFFICULTY = {
  1: 'foundations/big-o foundations/array foundations/string foundations/map-set algorithms/search/linear-search algorithms/sorting/bubble-sort algorithms/sorting/selection-sort algorithms/sorting/insertion-sort data-structures/stack data-structures/queue data-structures/linked-list data-structures/deque algorithms/math/factorial algorithms/math/fibonacci algorithms/string/palindrome algorithms/stack/valid-parentheses algorithms/math/is-power-of-two algorithms/linked-list/traversal algorithms/linked-list/reverse-traversal algorithms/math/euclidean-algorithm',
}

export { GROUPS, PATTERNS } from './patterns.mjs'

// Upstream images that return 404 (checked 2026-10-21). The build drops them; authored/dsa draws our own versions.
export const DEAD_IMAGES = [
  'http://gregtrowbridge.com/content/images/2014/Jul/Screenshot-from-2014-06-17-19-46-20.png',
  'https://ivanyu.me/wp-content/uploads/2014/09/zalg1.png',
  'https://www.geeksforgeeks.org/wp-content/uploads/ArticulationPoints.png',
  'https://www.geeksforgeeks.org/wp-content/uploads/ArticulationPoints1.png',
  'https://www.geeksforgeeks.org/wp-content/uploads/ArticulationPoints21.png',
  'https://www.geeksforgeeks.org/wp-content/uploads/Bridge1.png',
  'https://www.geeksforgeeks.org/wp-content/uploads/Bridge2.png',
  'https://www.geeksforgeeks.org/wp-content/uploads/Bridge3.png',
  'https://www.geeksforgeeks.org/wp-content/uploads/RangeMinimumQuery.png',
  'https://www.geeksforgeeks.org/wp-content/uploads/cycleGraph.png',
  'https://www.geeksforgeeks.org/wp-content/uploads/kadane-Algorithm.png',
  'https://www.geeksforgeeks.org/wp-content/uploads/redBlackCase2.png',
  'https://www.geeksforgeeks.org/wp-content/uploads/redBlackCase3a1.png',
  'https://www.geeksforgeeks.org/wp-content/uploads/redBlackCase3b.png',
  'https://www.geeksforgeeks.org/wp-content/uploads/redBlackCase3c.png',
  'https://www.geeksforgeeks.org/wp-content/uploads/redBlackCase3d.png',
]

// Topic id -> interactive demo shown above the lesson (components/dsa/Explainers.jsx).
export const DEMOS = {
  'foundations/big-o': 'growth',
  'data-structures/hash-table': 'hashing',
  'algorithms/sets/knapsack-problem': 'knapsack',
}
