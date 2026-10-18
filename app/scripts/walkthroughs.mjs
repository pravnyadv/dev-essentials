// Step-by-step scenes per pattern. Each step: { text, scene }. Rendered by src/Diagram.jsx.
// Row options: hl (solid cells), win ([from, to] tinted range), dim, marks ({index: label}), groups (sizes), accent (tint all).
// null cells are invisible spacers.
const R = (label, cells, o = {}) => ({ label, cells, ...o })
const A = (...rows) => ({ kind: 'array', rows })
const S = (text, scene) => ({ text, scene })
const TREE = [7, 9, 11, 5, 2]
const tree = (o = {}) => ({ kind: 'tree', nodes: TREE, ...o })
const GRID = [[0, 0, 0, 0, 0], [0, 0, 1, 0, 0], [0, 1, 1, 1, 0], [0, 0, 1, 0, 0]]
const grid = hl => ({ kind: 'grid', cells: GRID, hl })

const nums = [3, 1, 4, 2, 5]
const sorted = [1, 2, 4, 6, 8, 11]
const letters = ['a', 'b', 'c', 'a', 'd']
const jump = [2, 3, 1, 1, 4]
const bsArr = [1, 3, 5, 7, 9, 11, 13]
const st = [2, 1, 5, 3, 6]
const ways = i => Array.from({ length: 6 }, (_, k) => [1, 1, 2, 3, 5, 8][k]).map((v, k) => (k <= i ? v : '·'))

export const STEPS = {
  'prefix-sum': [
    S('We have nums and will be asked for many range sums. Adding a range up each time costs O(n) per query.', A(R('nums', nums))),
    S('Build a prefix array once. prefix[i] is the sum of nums[0..i]. The first cell is just nums[0] = 3.', A(R('nums', nums, { hl: [0] }), R('prefix', [3, '·', '·', '·', '·'], { hl: [0] }))),
    S('Each next cell is the previous prefix plus the current number: 3 + 1 = 4, then 4 + 4 = 8, and so on.', A(R('nums', nums, { hl: [1] }), R('prefix', [3, 4, '·', '·', '·'], { hl: [1] }))),
    S('One pass, O(n), and the prefix array is done. Now every range sum is a subtraction.', A(R('nums', nums), R('prefix', [3, 4, 8, 10, 15], { accent: true }))),
    S('sum(nums[1..3]) = prefix[3] - prefix[0] = 10 - 3 = 7. Two lookups, O(1), however long the range is.', A(R('nums', nums, { win: [1, 3] }), R('prefix', [3, 4, 8, 10, 15], { hl: [0, 3] }))),
  ],
  'two-pointers': [
    S('The array is sorted and we want two numbers that add up to 10. Put one pointer at each end.', A(R('a', sorted, { marks: { 0: 'left', 5: 'right' } }))),
    S('1 + 11 = 12, too big. Only the right value can shrink the sum, so move right inwards.', A(R('a', sorted, { marks: { 0: 'left', 5: 'right' }, hl: [0, 5] }))),
    S('1 + 8 = 9, too small. Move left inwards to get a bigger sum.', A(R('a', sorted, { marks: { 0: 'left', 4: 'right' }, hl: [0, 4], dim: [5] }))),
    S('2 + 8 = 10. Found. Every step discarded one value for good, so the whole scan is O(n).', A(R('a', sorted, { marks: { 1: 'left', 4: 'right' }, hl: [1, 4], dim: [0, 5] }))),
  ],
  'sliding-window': [
    S('Find the longest stretch with no repeated letter. Keep a window from left to right that is always valid.', A(R('s', letters, { win: [0, 0], marks: { 0: 'L, R' } }))),
    S('Grow the window to the right while letters are new. "abc" is valid, length 3.', A(R('s', letters, { win: [0, 2], marks: { 0: 'L', 2: 'R' } }))),
    S('The next letter is "a", already in the window. The window is now invalid.', A(R('s', letters, { win: [0, 3], marks: { 0: 'L', 3: 'R' }, hl: [3] }))),
    S('Shrink from the left until the duplicate is gone. Dropping the first "a" leaves "bca", length 3.', A(R('s', letters, { win: [1, 3], marks: { 1: 'L', 3: 'R' }, dim: [0] }))),
    S('Add "d": "bcad" is valid and is the best so far (4). Each index enters and leaves the window once, so O(n).', A(R('s', letters, { win: [1, 4], marks: { 1: 'L', 4: 'R' }, dim: [0] }))),
  ],
  'fast-slow': [
    S('A list whose tail points back to node 3, so walking it never ends. Start both pointers at the head.', { kind: 'list', nodes: [1, 2, 3, 4, 5], marks: { 0: 'slow, fast' }, loopTo: 2 }),
    S('slow moves 1 node per step, fast moves 2.', { kind: 'list', nodes: [1, 2, 3, 4, 5], marks: { 1: 'slow', 2: 'fast' }, loopTo: 2 }),
    S('Again. fast is now at the tail, about to loop back.', { kind: 'list', nodes: [1, 2, 3, 4, 5], marks: { 2: 'slow', 4: 'fast' }, loopTo: 2 }),
    S('slow steps to 4. fast goes 5, then back to 3, then 4. They meet, so there is a cycle. With no cycle, fast would hit null first.', { kind: 'list', nodes: [1, 2, 3, 4, 5], marks: { 3: 'slow, fast' }, loopTo: 2 }),
  ],
  'in-place-reversal': [
    S('Reverse 1 → 2 → 3 → 4 by flipping each link, using only two extra pointers: prev and cur.', { kind: 'list', nodes: [1, 2, 3, 4], marks: { 0: 'cur' } }),
    S('Point node 1 at null (prev), then move both pointers forward.', { kind: 'list', nodes: [1, 2, 3, 4], nullLeft: true, marks: { 0: 'prev', 1: 'cur' } }),
    S('Flip the link between 2 and 1 so 2 points back. Move forward.', { kind: 'list', nodes: [1, 2, 3, 4], nullLeft: true, rev: 1, marks: { 1: 'prev', 2: 'cur' } }),
    S('Flip 3 to point at 2. Move forward.', { kind: 'list', nodes: [1, 2, 3, 4], nullLeft: true, rev: 2, marks: { 2: 'prev', 3: 'cur' } }),
    S('Flip 4 to point at 3. cur falls off the end, so prev (4) is the new head: 4 → 3 → 2 → 1. O(n) time, O(1) space.', { kind: 'list', nodes: [1, 2, 3, 4], nullLeft: true, rev: 3, marks: { 3: 'new head' } }),
  ],
  'monotonic-stack': [
    S('For each number, find the next greater number to its right. The stack holds numbers still waiting for an answer.', { kind: 'stack', rows: [R('nums', st, { hl: [0] }), R('answer', ['?', '?', '?', '?', '?'])], stack: [2] }),
    S('1 is smaller than the top (2), nothing is resolved. Push it. The stack is always decreasing from bottom to top.', { kind: 'stack', rows: [R('nums', st, { hl: [1] }), R('answer', ['?', '?', '?', '?', '?'])], stack: [2, 1] }),
    S('5 beats the top (1): pop it, its answer is 5. 5 also beats 2: pop it, answer 5. Then push 5.', { kind: 'stack', rows: [R('nums', st, { hl: [2] }), R('answer', [5, 5, '?', '?', '?'], { hl: [0, 1] })], stack: [5] }),
    S('3 is smaller than 5, so it waits on the stack.', { kind: 'stack', rows: [R('nums', st, { hl: [3] }), R('answer', [5, 5, '?', '?', '?'])], stack: [5, 3] }),
    S('6 beats 3 and 5: both get answer 6. Whatever is left on the stack (6) has no greater element. Each number is pushed and popped once, so O(n).', { kind: 'stack', rows: [R('nums', st, { hl: [4] }), R('answer', [5, 5, 6, 6, '-'], { hl: [2, 3] })], stack: [6] }),
  ],
  'top-k': [
    S('Find the 3 largest numbers. Keep a min-heap of size 3: its root is the smallest of the current best 3, the first to be kicked out.', A(R('nums', [5, 1, 9, 3, 7, 2]), R('heap', ['·', '·', '·']))),
    S('Add 5, 1 and 9. The heap is full: [1, 5, 9], root 1.', A(R('nums', [5, 1, 9, 3, 7, 2], { win: [0, 2] }), R('heap', [1, 5, 9], { accent: true }))),
    S('3 is bigger than the root 1, so it belongs in the top 3. Remove 1, insert 3: [3, 5, 9].', A(R('nums', [5, 1, 9, 3, 7, 2], { hl: [3] }), R('heap', [3, 5, 9], { hl: [0] }))),
    S('7 beats the root 3: swap it in. Heap [5, 7, 9].', A(R('nums', [5, 1, 9, 3, 7, 2], { hl: [4] }), R('heap', [5, 7, 9], { hl: [0] }))),
    S('2 is smaller than the root 5, so ignore it. The heap holds the 3 largest. Each element costs O(log k), so O(n log k) overall.', A(R('nums', [5, 1, 9, 3, 7, 2], { hl: [5] }), R('heap', [5, 7, 9], { accent: true })))],
  intervals: [
    S('Merge overlapping intervals. Sort by start, then sweep, comparing each interval with the last merged one.', { kind: 'intervals', rows: [{ label: 'input', items: [[1, 3], [2, 6], [8, 10], [9, 12]] }] }),
    S('[2,6] starts at 2, before the last merged end (3), so they overlap. Extend the end to max(3, 6) = 6.', { kind: 'intervals', rows: [{ label: 'input', items: [[1, 3], [2, 6], [8, 10], [9, 12]], hl: [1] }, { label: 'merged', items: [[1, 6]] }] }),
    S('[8,10] starts after 6: no overlap. Start a new merged interval.', { kind: 'intervals', rows: [{ label: 'input', items: [[1, 3], [2, 6], [8, 10], [9, 12]], hl: [2] }, { label: 'merged', items: [[1, 6], [8, 10]] }] }),
    S('[9,12] starts before 10: overlap, the end becomes 12. Result: [1,6] and [8,12]. Sorting dominates, so O(n log n).', { kind: 'intervals', rows: [{ label: 'input', items: [[1, 3], [2, 6], [8, 10], [9, 12]], hl: [3] }, { label: 'merged', items: [[1, 6], [8, 12]] }] }),
  ],
  'binary-search': [
    S('Sorted array, find 11. Look at the middle: every check throws away half of what is left.', A(R('a', bsArr, { marks: { 0: 'left', 3: 'mid', 6: 'right' }, hl: [3] }))),
    S('a[3] = 7 is less than 11, so 11 can only be on the right. Discard the left half: left = mid + 1.', A(R('a', bsArr, { marks: { 0: 'left', 3: 'mid', 6: 'right' }, hl: [3], dim: [0, 1, 2, 3] }))),
    S('New middle is a[5] = 11. Found after 2 checks. In general log2(n) checks. "Binary search on the answer" is the same loop where the array is the range of candidate answers and a[mid] becomes a yes/no test.', A(R('a', bsArr, { marks: { 4: 'left', 5: 'mid', 6: 'right' }, hl: [5], dim: [0, 1, 2, 3] }))),
  ],
  'tree-traversal': [
    S('Same tree, three orders. The only difference is when the node is visited: before, between or after its children.', tree()),
    S('PreOrder: node, left, right. Order 7, 9, 5, 2, 11. Used to copy or serialise a tree.', tree({ order: [0, 1, 3, 4, 2] })),
    S('InOrder: left, node, right. Order 5, 9, 2, 7, 11. On a binary search tree this visits values in sorted order.', tree({ order: [3, 1, 4, 0, 2] })),
    S('PostOrder: left, right, node. Order 5, 2, 9, 11, 7. Children come before their parent, so use it to delete a tree or compute heights and sizes.', tree({ order: [3, 4, 1, 2, 0] })),
  ],
  dfs: [
    S('Depth-first search goes as deep as it can before backing up. Start at the root.', tree({ order: [0] })),
    S('Go down the left side first: 7 → 9.', tree({ order: [0, 1] })),
    S('Keep going: 9 → 5. 5 is a leaf, a dead end.', tree({ order: [0, 1, 3] })),
    S('Back up to 9 and take its other child, 2. Another dead end.', tree({ order: [0, 1, 3, 4] })),
    S('Back up to the root and finish with 11. Recursion (or an explicit stack) remembers where to return. On a graph, also keep a visited set.', tree({ order: [0, 1, 3, 4, 2] })),
  ],
  bfs: [
    S('Breadth-first search visits level by level, using a queue. Queue the root: [7].', tree({ order: [0], levels: ['Level 1', 'Level 2', 'Level 3'] })),
    S('Take 7 out and queue its children: queue is [9, 11]. Everything one step from the start is visited before anything two steps away.', tree({ order: [0, 1, 2], levels: ['Level 1', 'Level 2', 'Level 3'] })),
    S('Take 9, queue 5 and 2. Take 11, nothing to add. The first time you reach a node is via the fewest edges, which is why BFS finds shortest paths in unweighted graphs.', tree({ order: [0, 1, 2, 3, 4], levels: ['Level 1', 'Level 2', 'Level 3'] })),
  ],
  matrix: [
    S('Count islands of 1s in a grid. Scan cell by cell. The first 1 we meet, (row 1, col 2), starts an island.', grid([[1, 2]])),
    S('Look at its four neighbours: up, down, left, right. The one below it, (2,2), is land too.', grid([[1, 2], [2, 2]])),
    S('Spread from each new land cell the same way (DFS or BFS). (2,1) and (2,3) join.', grid([[1, 2], [2, 2], [2, 1], [2, 3]])),
    S('The whole island is found. Mark its cells visited so they are never counted again. Count = 1. Every cell is visited a constant number of times: O(rows × cols).', grid([[1, 2], [2, 1], [2, 2], [2, 3], [3, 2]])),
  ],
  backtracking: [
    S('List all subsets of [1, 2]. At each number we choose: take it or skip it. That is a tree of decisions. Start with the empty set.', { kind: 'tree', nodes: ['[ ]', '[1]', '[ ]', '[1,2]', '[1]', '[2]', '[ ]'], r: 20, order: [0] }),
    S('Take 1: now we hold [1].', { kind: 'tree', nodes: ['[ ]', '[1]', '[ ]', '[1,2]', '[1]', '[2]', '[ ]'], r: 20, order: [0, 1] }),
    S('Take 2: [1,2]. We are at the end, so record it.', { kind: 'tree', nodes: ['[ ]', '[1]', '[ ]', '[1,2]', '[1]', '[2]', '[ ]'], r: 20, order: [0, 1, 3] }),
    S('Undo (backtrack): remove 2 again, then try skipping it. Record [1].', { kind: 'tree', nodes: ['[ ]', '[1]', '[ ]', '[1,2]', '[1]', '[2]', '[ ]'], r: 20, order: [0, 1, 3, 4] }),
    S('Undo choosing 1 and try skipping it instead.', { kind: 'tree', nodes: ['[ ]', '[1]', '[ ]', '[1,2]', '[1]', '[2]', '[ ]'], r: 20, order: [0, 1, 3, 4, 2] }),
    S('The same take or skip on 2 gives [2] and [ ]. The four leaves are all the subsets. The recipe is choose, explore, undo. Constraints let you prune a branch early.', { kind: 'tree', nodes: ['[ ]', '[1]', '[ ]', '[1,2]', '[1]', '[2]', '[ ]'], r: 20, order: [0, 1, 3, 4, 2, 5, 6] }),
  ],
  dp: [
    S('How many ways to climb 5 stairs taking 1 or 2 steps? ways[i] = ways[i-1] + ways[i-2]. Plain recursion recomputes the same values again and again. DP stores each one once.', A(R('stairs', [0, 1, 2, 3, 4, 5]), R('ways', ways(-1)))),
    S('Base cases: there is 1 way to be on stair 0 and 1 way to reach stair 1.', A(R('stairs', [0, 1, 2, 3, 4, 5], { hl: [0, 1] }), R('ways', ways(1), { hl: [0, 1] }))),
    S('ways[2] = ways[1] + ways[0] = 1 + 1 = 2.', A(R('stairs', [0, 1, 2, 3, 4, 5], { hl: [2] }), R('ways', ways(2), { win: [0, 1], hl: [2] }))),
    S('ways[3] = ways[2] + ways[1] = 2 + 1 = 3.', A(R('stairs', [0, 1, 2, 3, 4, 5], { hl: [3] }), R('ways', ways(3), { win: [1, 2], hl: [3] }))),
    S('ways[4] = 5 and ways[5] = 3 + 5 = 8. Each cell costs O(1), so O(n) total instead of exponential.', A(R('stairs', [0, 1, 2, 3, 4, 5], { hl: [5] }), R('ways', ways(5), { win: [3, 4], hl: [5] }))),
  ],
  'hash-map': [
    S('Find two numbers that add to 9. For each x ask: have I already seen 9 - x? A hash map answers in O(1).', A(R('nums', [2, 7, 11, 15]), R('map', ['·']))),
    S('x = 2. We need 7. The map is empty, so remember 2 → index 0.', A(R('nums', [2, 7, 11, 15], { hl: [0] }), R('map', ['2→0'], { accent: true }))),
    S('x = 7. We need 2. The map has it at index 0. Answer: indices 0 and 1.', A(R('nums', [2, 7, 11, 15], { hl: [0, 1] }), R('map', ['2→0'], { hl: [0] }))),
    S('One pass, O(n), instead of checking every pair in O(n squared).', A(R('nums', [2, 7, 11, 15], { accent: true }))),
  ],
  topological: [
    S('Tasks with dependencies: A→B, A→C, B→D, C→D (A must come before B and C, and so on). Count each task\'s incoming edges, its indegree.', A(R('task', ['A', 'B', 'C', 'D']), R('indegree', [0, 1, 1, 2]), R('queue', ['·']))),
    S('A has indegree 0: nothing must come before it. Put it in the queue.', A(R('task', ['A', 'B', 'C', 'D'], { hl: [0] }), R('indegree', [0, 1, 1, 2], { hl: [0] }), R('queue', ['A'], { accent: true }))),
    S('Take A out and add it to the order. Removing its edges drops B and C to 0, so queue them.', A(R('task', ['A', 'B', 'C', 'D']), R('indegree', [0, 0, 0, 2], { hl: [1, 2] }), R('queue', ['B', 'C'], { accent: true }), R('order', ['A']))),
    S('Take B (D drops to 1), then C (D drops to 0 and is queued).', A(R('task', ['A', 'B', 'C', 'D']), R('indegree', [0, 0, 0, 0], { hl: [3] }), R('queue', ['D'], { accent: true }), R('order', ['A', 'B', 'C']))),
    S('Order: A, B, C, D. If some tasks never reach indegree 0, the graph has a cycle and no valid order exists.', A(R('order', ['A', 'B', 'C', 'D'], { accent: true }))),
  ],
  'shortest-path': [
    S('Weighted graph: A→B 4, A→C 1, C→B 2, B→D 1. dist holds the best known distance from A.', A(R('node', ['A', 'B', 'C', 'D']), R('dist', [0, '∞', '∞', '∞']))),
    S('Take the closest unvisited node, A (0), and relax its edges: B = 4, C = 1.', A(R('node', ['A', 'B', 'C', 'D'], { hl: [0] }), R('dist', [0, 4, 1, '∞'], { hl: [1, 2] }))),
    S('Closest unvisited is C (1). Going C→B costs 1 + 2 = 3, better than 4, so B = 3.', A(R('node', ['A', 'B', 'C', 'D'], { hl: [2] }), R('dist', [0, 3, 1, '∞'], { hl: [1] }))),
    S('Closest unvisited is B (3). B→D gives D = 4.', A(R('node', ['A', 'B', 'C', 'D'], { hl: [1] }), R('dist', [0, 3, 1, 4], { hl: [3] }))),
    S('Shortest A to D is 4, via A, C, B, D. A priority queue picks "closest unvisited" in O(log n). Dijkstra needs non-negative weights; Bellman-Ford handles negatives.', A(R('node', ['A', 'B', 'C', 'D']), R('dist', [0, 3, 1, 4], { accent: true }))),
  ],
  'union-find': [
    S('Five separate groups. parent[i] = i means node i is the root of its own group.', A(R('node', [0, 1, 2, 3, 4]), R('parent', [0, 1, 2, 3, 4]))),
    S('union(0, 1): make 0 the parent of 1.', A(R('node', [0, 1, 2, 3, 4], { hl: [1] }), R('parent', [0, 0, 2, 3, 4], { hl: [1] }))),
    S('union(2, 3): make 2 the parent of 3.', A(R('node', [0, 1, 2, 3, 4], { hl: [3] }), R('parent', [0, 0, 2, 2, 4], { hl: [3] }))),
    S('union(1, 3): find(1) = 0 and find(3) = 2 are different roots, so attach root 0 under 2.', A(R('node', [0, 1, 2, 3, 4], { hl: [0] }), R('parent', [2, 0, 2, 2, 4], { hl: [0] }))),
    S('Are 0 and 3 connected? find(0) = 2 and find(3) = 2. Same root, so yes. Path compression flattens chains, making find close to O(1).', A(R('node', [0, 1, 2, 3, 4], { hl: [0, 3] }), R('parent', [2, 0, 2, 2, 4], { accent: true }))),
  ],
  greedy: [
    S('Jump game: each value is the longest jump from that cell. Track reach, the farthest index we can get to so far.', A(R('nums', jump, { marks: { 0: 'start' } }))),
    S('At i = 0, reach = max(0, 0 + 2) = 2.', A(R('nums', jump, { win: [0, 2], marks: { 0: 'i', 2: 'reach' } }))),
    S('i = 1 is within reach. reach = max(2, 1 + 3) = 4, which is the last index.', A(R('nums', jump, { win: [0, 4], marks: { 1: 'i', 4: 'reach' } }))),
    S('The end is reachable. We never explored individual jump paths: always keeping the farthest reach is safe. O(n).', A(R('nums', jump, { accent: true, hl: [4] }))),
  ],
  trie: [
    S('A trie stores words letter by letter along a path. Insert "cat", starting at the root.', { kind: 'tree', nodes: ['·', 'c', 'a', 't', 'r'], order: [0], layout: 'trie' }),
    S('c, a, t: each letter is a child of the previous one.', { kind: 'tree', nodes: ['·', 'c', 'a', 't', 'r'], order: [0, 1, 2, 3], layout: 'trie' }),
    S('Insert "car". c and a already exist, so only r is new. Shared prefixes are stored once.', { kind: 'tree', nodes: ['·', 'c', 'a', 't', 'r'], order: [0, 1, 2, 4], layout: 'trie' }),
    S('startsWith("ca") walks c then a and succeeds in 2 steps, no matter how many words are stored. Cost is the length of the word, not the number of words.', { kind: 'tree', nodes: ['·', 'c', 'a', 't', 'r'], order: [0, 1, 2], layout: 'trie' }),
  ],
  bits: [
    S('Every number appears twice except one. XOR of a number with itself is 0 and with 0 is itself, so XOR-ing everything cancels the pairs.', A(R('nums', [4, 1, 2, 1, 2]), R('xor', [0, '·', '·', '·', '·', '·']))),
    S('0 ^ 4 = 4.', A(R('nums', [4, 1, 2, 1, 2], { hl: [0] }), R('xor', [0, 4, '·', '·', '·', '·'], { hl: [1] }))),
    S('4 ^ 1 = 5, then 5 ^ 2 = 7.', A(R('nums', [4, 1, 2, 1, 2], { win: [1, 2] }), R('xor', [0, 4, 5, 7, '·', '·'], { hl: [3] }))),
    S('7 ^ 1 = 6, then 6 ^ 2 = 4. The 1s and 2s cancelled. The answer is 4, in O(n) time and O(1) space.', A(R('nums', [4, 1, 2, 1, 2], { win: [3, 4] }), R('xor', [0, 4, 5, 7, 6, 4], { hl: [5] }))),
  ],
  'sort-first': [
    S('Does the array contain a duplicate? Comparing every pair is O(n squared).', A(R('nums', [5, 2, 9, 2, 7]))),
    S('Sort first, O(n log n). Equal values now sit next to each other.', A(R('sorted', [2, 2, 5, 7, 9], { accent: true }))),
    S('One pass comparing neighbours: a[0] = a[1], duplicate found. Sorting often turns a search problem into a neighbour scan, and unlocks two pointers, intervals and greedy.', A(R('sorted', [2, 2, 5, 7, 9], { hl: [0, 1] }))),
  ],
  'divide-conquer': [
    S('Merge sort: divide the problem, solve the halves, combine the answers.', A(R('array', [6, 3, 8, 2], { groups: [4] }))),
    S('Divide: split in half.', A(R('array', [6, 3, 8, 2], { groups: [2, 2] }))),
    S('Keep dividing until each piece is one element. One element is already sorted.', A(R('array', [6, 3, 8, 2], { groups: [1, 1, 1, 1] }))),
    S('Combine: merge neighbouring pieces in order. [6, 3] becomes [3, 6] and [8, 2] becomes [2, 8].', A(R('array', [3, 6, 2, 8], { groups: [2, 2], accent: true }))),
    S('Merge the two sorted halves by repeatedly taking the smaller front value: [2, 3, 6, 8]. There are log n levels of O(n) work each, so O(n log n).', A(R('array', [2, 3, 6, 8], { groups: [4], accent: true }))),
  ],
  'string-matching': [
    S('Find "abc" in "ababcab". Slide the pattern along the text and compare letter by letter.', A(R('text', ['a', 'b', 'a', 'b', 'c', 'a', 'b']), R('pattern', ['a', 'b', 'c']))),
    S('At offset 0: a matches a, b matches b, then c does not match a. Mismatch.', A(R('text', ['a', 'b', 'a', 'b', 'c', 'a', 'b'], { hl: [0, 1], marks: { 2: 'no' } }), R('pattern', ['a', 'b', 'c'], { hl: [0, 1], marks: { 2: 'no' } }))),
    S('The naive approach shifts by one and restarts. KMP and the Z-algorithm remember how much of the pattern already matched, so they shift further and never re-read text.', A(R('text', ['a', 'b', 'a', 'b', 'c', 'a', 'b'], { dim: [0, 1] }), R('pattern', [null, null, 'a', 'b', 'c']))),
    S('Match found at index 2. Rabin-Karp compares rolling hashes instead of letters. These algorithms run in O(n + m) instead of O(n × m).', A(R('text', ['a', 'b', 'a', 'b', 'c', 'a', 'b'], { hl: [2, 3, 4] }), R('pattern', [null, null, 'a', 'b', 'c'], { hl: [2, 3, 4] }))),
  ],
  'number-theory': [
    S('Greatest common divisor of 48 and 18. Key fact: gcd(a, b) = gcd(b, a mod b).', A(R('a, b', [48, 18], { hl: [0, 1] }))),
    S('48 mod 18 = 12, so gcd(48, 18) = gcd(18, 12).', A(R('a, b', [48, 18], { dim: [0, 1] }), R('next', [18, 12], { hl: [0, 1] }))),
    S('18 mod 12 = 6, so gcd(18, 12) = gcd(12, 6).', A(R('a, b', [48, 18], { dim: [0, 1] }), R('next', [18, 12], { dim: [0, 1] }), R('next', [12, 6], { hl: [0, 1] }))),
    S('12 mod 6 = 0. When b reaches 0, a is the answer: 6. The numbers shrink fast, so O(log n). lcm(a, b) = a × b / gcd(a, b). The same shrink-fast idea shows up in the sieve, primality tests and fast powering.', A(R('a, b', [48, 18], { dim: [0, 1] }), R('next', [18, 12], { dim: [0, 1] }), R('next', [12, 6], { dim: [0, 1] }), R('end', [6, 0], { accent: true, hl: [0] }))),
  ],
}
