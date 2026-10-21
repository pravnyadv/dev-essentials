// Step-by-step scenes per pattern. Each step: { text, scene, calc?, quiz? }. Rendered by Diagram.jsx and Walkthrough.jsx.
// text is plain language and names the pattern only after the idea has landed; calc is the working shown under the scene.
// Row options: hl (solid cells), win ([from, to] tinted range), dim, marks ({index: label}), groups (sizes), accent (tint all).
// null cells are invisible spacers.
const R = (label, cells, o = {}) => ({ label, cells, ...o })
const A = (...rows) => ({ kind: 'array', rows })
const S = (text, scene, calc, quiz) => ({ text, scene, ...(calc && { calc }), ...(quiz && { quiz }) })
// Multi-choice check at the end of a walkthrough: options, index of the right one, and why.
const Q = (q, options, answer, why) => ({ q, options, answer, why })
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

const L = (marks, extra = {}) => ({ kind: 'list', nodes: [1, 2, 3, 4, 5], marks, loopTo: 2, ...extra })
const L4 = (marks, extra = {}) => ({ kind: 'list', nodes: [1, 2, 3, 4], marks, ...extra })
const stack = (nums, answer, hl, stk) => ({ kind: 'stack', rows: [R('nums', nums, { hl }), R('answer', answer)], stack: stk })
const iv = (items, hl, merged) => ({ kind: 'intervals', rows: [{ label: 'input', items, hl }, ...(merged ? [{ label: 'merged', items: merged }] : [])] })
const IV = [[1, 3], [2, 6], [8, 10], [9, 12]]
const IV_UNSORTED = [[8, 10], [1, 3], [9, 12], [2, 6]]
const subsets = ['[ ]', '[1]', '[ ]', '[1,2]', '[1]', '[2]', '[ ]']
const sub = order => ({ kind: 'tree', nodes: subsets, r: 20, order })
const levels = ['Level 1', 'Level 2', 'Level 3']
const trie = order => ({ kind: 'tree', nodes: ['·', 'c', 'a', 't', 'r'], order, layout: 'trie' })
const texts = ['a', 'b', 'a', 'b', 'c', 'a', 'b']
const stairs = [0, 1, 2, 3, 4, 5]

const MORE = {
  'fast-slow': [
    S('Question: does this chain of nodes loop back on itself? Walking it one node at a time never answers that, because inside a loop you just keep going. Instead send two walkers from the start: a slow one moving 1 node per step and a fast one moving 2.', L({ 0: 'slow, fast' }), 'both start at node 1'),
    S('After one step the slow walker is on node 2 and the fast one on node 3.', L({ 1: 'slow', 2: 'fast' }), 'slow + 1, fast + 2'),
    S('Again: slow on 3, fast on 5, the last node.', L({ 2: 'slow', 4: 'fast' })),
    S('The last node points back to 3, so fast carries on 5 → 3 → 4 while slow steps to 4. They land on the same node.', L({ 3: 'slow, fast' }), 'same node: there is a loop'),
    S('Why they must meet: inside a loop the fast walker gains one node on the slow one every step, so it catches up. Without a loop, fast would simply fall off the end (null) first. Two walkers at different speeds is called fast and slow pointers.', L({ 3: 'slow, fast' })),
    S('Your turn.', { kind: 'list', nodes: [1, 2, 3, 4, 5], marks: { 4: 'fast', 2: 'slow' } }, undefined, Q('This list has no loop. What does the fast walker reach first?', ['It meets the slow walker', 'The end (null)', 'It loops forever'], 1, 'With no loop there is nothing to catch it, so fast reaches the end first. That also tells you the list has no cycle.')),
  ],
  'in-place-reversal': [
    S('Goal: reverse 1 → 2 → 3 → 4 so it reads 4 → 3 → 2 → 1, without building a new list. We only flip each arrow. We keep track of prev (the node behind, nothing yet, so null) and cur (the node we are looking at). Careful: once an arrow is flipped, cur loses its way forward, so we also note the next node before flipping.', L4({ 0: 'cur' })),
    S('Flip the arrow of node 1 so it points at nothing (null). Then move both helpers one node forward.', L4({ 0: 'prev', 1: 'cur' }, { nullLeft: true }), 'cur = 1: now points to null'),
    S('Node 2: note node 3 first (next = cur.next), then flip its arrow to point back at 1, then move forward.', L4({ 1: 'prev', 2: 'cur' }, { nullLeft: true, rev: 1 }), '2 now points to 1'),
    S('Node 3: flip its arrow to point back at 2.', L4({ 2: 'prev', 3: 'cur' }, { nullLeft: true, rev: 2 }), '3 now points to 2'),
    S('Node 4: flip it to point at 3. cur steps off the end, so prev (4) is the new first node: 4 → 3 → 2 → 1. One pass and no extra list: this is in-place reversal.', L4({ 3: 'new head' }, { nullLeft: true, rev: 3 })),
    S('Your turn.', L4({ 0: 'prev', 1: 'cur' }, { nullLeft: true }), undefined, Q('Before you flip node 2 to point backwards, what must you remember first?', ['Node 3, the next node', 'How many nodes there are', 'Nothing'], 0, 'Once node 2 points backwards, nothing points at node 3 any more. Save it first (next = cur.next) or the rest of the list is lost.')),
  ],
  'monotonic-stack': [
    S('Goal: for each number, find the next bigger number to its right. Comparing every number with everything after it is slow. Instead keep a stack of numbers that are still waiting for a bigger one.', stack(st, ['?', '?', '?', '?', '?'], [0], [])),
    S('Take 2. Nothing to compare yet, so it waits on the stack.', stack(st, ['?', '?', '?', '?', '?'], [0], [2]), 'stack: 2'),
    S('Take 1. It is smaller than the waiting 2, so it cannot be anyone\'s answer. It waits too, on top.', stack(st, ['?', '?', '?', '?', '?'], [1], [2, 1]), 'stack: 2, 1'),
    S('Take 5. It is bigger than 1, so 5 is the answer for 1. Pop 1. It is bigger than 2 as well, so pop 2 too. Then 5 waits.', stack(st, [5, 5, '?', '?', '?'], [2], [5]), '5 > 1 and 5 > 2'),
    S('Take 3. Smaller than 5, so it waits on top.', stack(st, [5, 5, '?', '?', '?'], [3], [5, 3]), 'stack: 5, 3'),
    S('Take 6. It beats 3 and 5, so both get answer 6. Whatever is left never found a bigger number. Each number is pushed once and popped once, so it is one pass. The stack stays in decreasing order, which is why this is called a monotonic stack.', stack(st, [5, 5, 6, 6, '-'], [4], [6]), '6 > 3 and 6 > 5'),
    S('Your turn.', stack([8, 4, 6], ['?', '?', '?'], [2], [8, 4]), undefined, Q('The stack holds 8, 4 and the next number is 6. What happens?', ['Pop 4 (6 is its answer), then 6 waits on top of 8', 'Pop both', 'Push 6 on top of 4'], 0, '6 is bigger than 4, so 4 is answered and popped. 6 is smaller than 8, so 8 keeps waiting and 6 is pushed above it.')),
  ],
  'top-k': [
    S('Goal: find the 3 biggest numbers. Sorting everything works but does more than needed. Instead keep a small club of the best 3 so far and always know its weakest member, the first to be kicked out. (A min-heap gives you the weakest in one step.)', A(R('nums', [5, 1, 9, 3, 7, 2]), R('club', ['·', '·', '·']))),
    S('Take in 5, 1 and 9. The club is full: 1, 5, 9. The weakest member is 1.', A(R('nums', [5, 1, 9, 3, 7, 2], { win: [0, 2] }), R('club', [1, 5, 9], { accent: true })), 'weakest = 1'),
    S('Next is 3. It beats the weakest (1), so 1 leaves and 3 joins: 3, 5, 9.', A(R('nums', [5, 1, 9, 3, 7, 2], { hl: [3] }), R('club', [3, 5, 9], { hl: [0] })), '3 > 1: replace'),
    S('7 beats the new weakest (3). Club: 5, 7, 9.', A(R('nums', [5, 1, 9, 3, 7, 2], { hl: [4] }), R('club', [5, 7, 9], { hl: [0] })), '7 > 3: replace'),
    S('2 is smaller than the weakest (5), so ignore it. The club is the answer: 5, 7, 9. Each number costs one quick heap update, about n log k steps in all. This is the Top K pattern.', A(R('nums', [5, 1, 9, 3, 7, 2], { hl: [5] }), R('club', [5, 7, 9], { accent: true })), '2 < 5: skip'),
    S('Your turn.', A(R('club', [5, 7, 9], { accent: true }), R('next', [8])), undefined, Q('The club is 5, 7, 9 and the next number is 8. What happens?', ['8 is ignored', '5 leaves and 8 joins', '9 leaves'], 1, '8 beats the weakest member (5), so 5 is replaced. The club becomes 7, 8, 9.')),
  ],
  intervals: [
    S('Goal: merge overlapping time ranges, like meetings. The ranges arrive in any order, so sorting by start time comes first.', iv(IV_UNSORTED, undefined, undefined)),
    S('Sorted by start. Now you only ever compare the next range with the merged range you are building, because anything that starts later than that range\'s end cannot touch it.', iv(IV, undefined, undefined)),
    S('Start with the first range, [1,3], as the current merged range.', iv(IV, [0], [[1, 3]]), 'current = [1,3]'),
    S('[2,6] starts at 2, before the current range ends (3), so they overlap. Stretch the end to the bigger of the two ends.', iv(IV, [1], [[1, 6]]), 'start 2 <= end 3: end = max(3, 6) = 6'),
    S('[8,10] starts at 8, after the current end (6). There is a gap, so begin a new merged range.', iv(IV, [2], [[1, 6], [8, 10]]), 'start 8 > end 6: new range'),
    S('[9,12] starts at 9, before the current end (10): overlap. The end becomes 12. Result: [1,6] and [8,12]. Sorting is the slowest part, so O(n log n). This is the overlapping intervals pattern.', iv(IV, [3], [[1, 6], [8, 12]]), 'start 9 <= end 10: end = max(10, 12) = 12'),
    S('Your turn.', iv([[1, 6], [4, 5]], [1]), undefined, Q('The current range is [1,6] and the next one is [4,5]. What happens?', ['A new range [4,5]', 'Merged range stays [1,6]', 'End becomes 5'], 1, '[4,5] starts inside [1,6], so it overlaps, but max(6, 5) is still 6. The merged range stays [1,6].')),
  ],
  'tree-traversal': [
    S('A tree has no single first-to-last order, so we pick one. The three common orders differ only in when a node is visited compared with its children.', tree()),
    S('Pre-order: the node first, then left, then right. Good for copying a tree.', tree({ order: [0, 1, 3, 4, 2] }), '7, 9, 5, 2, 11'),
    S('In-order: left, then the node, then right. This tree is not a search tree, so the result is not sorted. On a binary search tree (smaller values left, bigger right) the same walk gives the values in sorted order.', tree({ order: [3, 1, 4, 0, 2] }), '5, 9, 2, 7, 11'),
    S('Post-order: left, right, then the node. Children come before their parent, so it is the order for deleting a tree or adding up sizes. All three orders are the same recursive walk. Only the position of the "visit" line changes: before the two calls (pre), between them (in), after them (post). Level by level (breadth-first) is a fourth order. This is tree traversal.', tree({ order: [3, 4, 1, 2, 0] }), '5, 2, 9, 11, 7'),
    S('Your turn.', tree(), undefined, Q('Which order visits the root, 7, last?', ['Pre-order', 'In-order', 'Post-order'], 2, 'Post-order visits a node after both of its children, so the root comes last.')),
  ],
  dfs: [
    S('Goal: visit every node. Pick a direction and go as deep as you can before turning back, like exploring a maze by always taking the next corridor.', tree({ order: [0] }), 'start at 7'),
    S('From the root, 7, go down the left side to 9.', tree({ order: [0, 1] })),
    S('Keep going down to 5. It has no children: a dead end.', tree({ order: [0, 1, 3] })),
    S('Back up to 9 and try its other child, 2. Another dead end.', tree({ order: [0, 1, 3, 4] })),
    S('Back up to the root and take the last branch: 11. Recursion remembers where to return to (a stack does the same). On a graph also keep a visited list so you never loop. This is depth-first search.', tree({ order: [0, 1, 3, 4, 2] })),
    S('Your turn.', tree({ order: [0, 1, 3] }), undefined, Q('DFS just reached the dead end 5. What does it do next?', ['Jump to 11', 'Go back to 9 and try its other child', 'Stop'], 1, 'DFS backs up to the nearest node that still has an unvisited child. That is 9, whose other child is 2.')),
  ],
  bfs: [
    S('Goal: find the fewest steps from the start to everything else. Explore in rings: everything one step away, then everything two steps away. It uses a queue, a line where the first one in is the first one out.', tree({ order: [0], levels }), 'queue: 7'),
    S('Take 7 out and add its children to the back of the line. Both are one step from the start.', tree({ order: [0, 1, 2], levels }), 'queue: 9, 11'),
    S('Take 9 out and add its children. Take 11 out: nothing to add. 5 and 2 are two steps away.', tree({ order: [0, 1, 2, 3, 4], levels }), 'queue: 5, 2'),
    S('Nodes are visited ring by ring, so the first time you reach a node is by the shortest route. That is why breadth-first search finds shortest paths when every step costs the same. On a graph or grid, mark a cell as visited when you add it to the queue, otherwise a cell reachable by two routes is queued twice.', tree({ order: [0, 1, 2, 3, 4], levels })),
    S('Your turn.', tree({ order: [0, 1, 2], levels }), undefined, Q('The queue is [9, 11]. Which node is visited next?', ['9', '11', '5'], 0, 'A queue serves the oldest entry first. 9 was added before 11. (A stack would give 11 first, which is what depth-first search does.)')),
  ],
  matrix: [
    S('Goal: count the islands of 1s in this grid (0 is water). Treat the grid as a map where each cell touches its neighbours above, below, left and right. Scan the cells one by one.', grid([]), 'islands = 0'),
    S('The first land cell we meet is row 1, column 2. A new island starts here.', grid([[1, 2]]), 'islands = 1'),
    S('Spread out: look at its four neighbours. The cell below, row 2 column 2, is land too.', grid([[1, 2], [2, 2]])),
    S('Keep spreading from each new land cell: row 2 columns 1 and 3 join, then row 3 column 2.', grid([[1, 2], [2, 1], [2, 2], [2, 3], [3, 2]])),
    S('The whole island is found. Mark its cells as visited (the code does it by turning each land cell into water) so the scan never counts them again. Answer: 1 island. Each cell is looked at a few times, so the work is rows × columns. This is matrix traversal.', grid([[1, 2], [2, 1], [2, 2], [2, 3], [3, 2]]), 'islands = 1'),
    S('Your turn.', grid([[1, 2], [2, 2]]), undefined, Q('Cell (1,2) is land. Is the cell diagonally below-right of it, (2,3), a direct neighbour?', ['Yes, diagonals count', 'No, only up, down, left and right count'], 1, 'Island problems connect cells that share an edge. (2,3) is reached through (2,2) instead.')),
  ],
  backtracking: [
    S('Goal: list every subset of [1, 2]. At each number we choose: take it or skip it. All the choices form a tree of decisions. Start with nothing chosen.', sub([0]), 'holding [ ]'),
    S('Choose to take 1.', sub([0, 1]), 'holding [1]'),
    S('Take 2 as well. No numbers are left, so write this subset down.', sub([0, 1, 3]), 'found [1,2]'),
    S('Undo that last choice (the "back" in backtracking) and skip 2 instead. Write [1] down.', sub([0, 1, 3, 4]), 'found [1]'),
    S('Undo taking 1 and skip it instead: holding [ ] again.', sub([0, 1, 3, 4, 2])),
    S('From [ ], take or skip 2 the same way: [2] and [ ]. The four leaves are every subset. The recipe is choose, explore, undo. If a choice breaks a rule, stop that branch early (pruning).', sub([0, 1, 3, 4, 2, 5, 6]), 'found [2] and [ ]'),
    S('Your turn.', sub([0, 1, 3]), undefined, Q('You hold [1,2] and no numbers are left. What is the next move?', ['Record it, then undo the last choice', 'Keep going forward', 'Stop everything'], 0, 'At a leaf you record the answer, then step back to the latest decision that still has an untried option.')),
  ],
  dp: [
    S('Goal: how many ways can you climb 5 stairs taking 1 or 2 steps at a time? You reach stair 5 from stair 4 or stair 3, so ways(5) = ways(4) + ways(3). Working that out naively repeats the same sub-questions many times. Instead write each answer down once.', A(R('stairs', stairs), R('ways', ways(-1)))),
    S('Base cases: there is 1 way to be on stair 0 (do nothing) and 1 way to reach stair 1.', A(R('stairs', stairs, { hl: [0, 1] }), R('ways', ways(1), { hl: [0, 1] })), 'ways[0] = 1, ways[1] = 1'),
    S('Stair 2 is reached from stair 1 or stair 0.', A(R('stairs', stairs, { hl: [2] }), R('ways', ways(2), { win: [0, 1], hl: [2] })), '1 + 1 = 2'),
    S('Stair 3 comes from stairs 2 and 1.', A(R('stairs', stairs, { hl: [3] }), R('ways', ways(3), { win: [1, 2], hl: [3] })), '2 + 1 = 3'),
    S('Stair 4: 3 + 2 = 5. Stair 5: 5 + 3 = 8. Each answer reuses two stored answers, so n stairs take n steps instead of exponential time. Storing sub-answers like this is dynamic programming.', A(R('stairs', stairs, { hl: [5] }), R('ways', ways(5), { win: [3, 4], hl: [5] })), '5 + 3 = 8'),
    S('Your turn.', A(R('stairs', stairs), R('ways', ways(5), { accent: true })), undefined, Q('Following the same rule, what is ways[6]?', ['11', '13', '16'], 1, 'ways[6] = ways[5] + ways[4] = 8 + 5 = 13.')),
  ],
  'hash-map': [
    S('Goal: find two numbers in [2, 7, 11, 15] that add up to 9. Checking every pair is slow. Trick: for a number x, the partner we need is 9 - x. If we remember every number seen so far, "have I seen the partner?" is answered instantly.', A(R('nums', [2, 7, 11, 15]), R('seen', ['·']))),
    S('First number: 2. Its partner would be 7. Nothing is remembered yet, so write down 2 (at position 0).', A(R('nums', [2, 7, 11, 15], { hl: [0] }), R('seen', ['2→0'], { accent: true })), 'need 9 - 2 = 7: not seen'),
    S('Next number: 7. Its partner would be 2, and 2 is written down at position 0. Found: positions 0 and 1.', A(R('nums', [2, 7, 11, 15], { hl: [0, 1] }), R('seen', ['2→0'], { hl: [0] })), 'need 9 - 7 = 2: seen at 0'),
    S('Each lookup in the remembered list (a hash map) takes one step, so the whole search is a single pass instead of checking every pair. Trading a little memory for speed is the hash map pattern.', A(R('nums', [2, 7, 11, 15], { accent: true }))),
    S('Your turn.', A(R('nums', [3, 5, 4], { hl: [2] }), R('seen', ['3→0', '5→1'], { accent: true })), undefined, Q('Target 9. You are on 4, with 3 and 5 remembered. Is there a match?', ['Yes: 5 + 4', 'No match yet', 'Yes: 3 + 4'], 0, 'The partner needed is 9 - 4 = 5, and 5 was already seen. So 5 + 4 = 9.')),
  ],
  topological: [
    S('Goal: put tasks in an order where each comes after the ones it depends on. A→B, A→C, B→D, C→D means A before B and C, and both before D. Count how many things each task is still waiting for: its in-degree.', A(R('task', ['A', 'B', 'C', 'D']), R('waiting for', [0, 1, 1, 2]), R('queue', ['·']))),
    S('A is waiting for nothing (0), so it can go first. Put it in the queue.', A(R('task', ['A', 'B', 'C', 'D'], { hl: [0] }), R('waiting for', [0, 1, 1, 2], { hl: [0] }), R('queue', ['A'], { accent: true })), 'A: 0 left'),
    S('Do A and tick it off. B and C were only waiting for A, so both drop to 0 and join the queue.', A(R('task', ['A', 'B', 'C', 'D']), R('waiting for', [0, 0, 0, 2], { hl: [1, 2] }), R('queue', ['B', 'C'], { accent: true }), R('order', ['A'])), 'B: 0, C: 0'),
    S('Do B: D now waits for 1 thing. Do C: D waits for 0 things and joins the queue.', A(R('task', ['A', 'B', 'C', 'D']), R('waiting for', [0, 0, 0, 0], { hl: [3] }), R('queue', ['D'], { accent: true }), R('order', ['A', 'B', 'C'])), 'D: 0'),
    S('Do D. The order is A, B, C, D. If some tasks never reach 0, they are waiting on each other in a circle and no valid order exists. This is topological sort.', A(R('order', ['A', 'B', 'C', 'D'], { accent: true }))),
    S('Your turn.', A(R('task', ['X', 'Y']), R('waiting for', [1, 1])), undefined, Q('X needs Y first, and Y needs X first. What happens?', ['Order X, Y', 'Order Y, X', 'No task ever reaches 0, so there is no valid order'], 2, 'Each waits for the other, so nothing can start. Noticing that nothing can start is how topological sort spots a cycle.')),
  ],
  'shortest-path': [
    S('Goal: the cheapest route from A to every place when roads have different costs: A→B 4, A→C 1, C→B 2, B→D 1. Keep a table of the best known cost to each place: 0 for A, unknown for the rest.', A(R('node', ['A', 'B', 'C', 'D']), R('cost', [0, '∞', '∞', '∞'])), 'roads: A-B 4, A-C 1, C-B 2, B-D 1'),
    S('Always finish the closest unfinished place first: A (cost 0). Try its roads: B costs 0 + 4 = 4 and C costs 0 + 1 = 1.', A(R('node', ['A', 'B', 'C', 'D'], { hl: [0] }), R('cost', [0, 4, 1, '∞'], { hl: [1, 2] })), 'roads: A-B 4, A-C 1, C-B 2, B-D 1; B = 4, C = 1'),
    S('The closest unfinished place is now C (1). The road C→B gives B a cost of 1 + 2 = 3, cheaper than 4, so update B.', A(R('node', ['A', 'B', 'C', 'D'], { hl: [2] }), R('cost', [0, 3, 1, '∞'], { hl: [1] })), 'roads: A-B 4, A-C 1, C-B 2, B-D 1; 1 + 2 = 3 < 4'),
    S('Closest unfinished: B (3). The road B→D gives D a cost of 3 + 1 = 4.', A(R('node', ['A', 'B', 'C', 'D'], { hl: [1] }), R('cost', [0, 3, 1, 4], { hl: [3] })), 'roads: A-B 4, A-C 1, C-B 2, B-D 1; 3 + 1 = 4'),
    S('The cheapest A to D is 4, via A, C, B, D. Finishing the closest place first guarantees no later road can beat it, as long as no cost is negative. A priority queue finds the closest place quickly. This is Dijkstra\'s algorithm.', A(R('node', ['A', 'B', 'C', 'D']), R('cost', [0, 3, 1, 4], { accent: true }))),
    S('Your turn.', A(R('node', ['A', 'B', 'C', 'D'], { hl: [1] }), R('cost', [0, 3, 1, '∞'], { hl: [1] })), undefined, Q('Why did B\'s cost change from 4 to 3?', ['A cheaper route through C was found', 'B was visited twice', 'The road got shorter'], 0, 'Going A→C→B costs 1 + 2 = 3, which beats the direct road A→B at 4.')),
  ],
  'union-find': [
    S('Goal: keep track of which items belong to the same group, and merge groups quickly. Start with 5 separate groups. Each item points to a parent; an item that points to itself is the leader of its group.', A(R('item', [0, 1, 2, 3, 4]), R('parent', [0, 1, 2, 3, 4]))),
    S('Join 0 and 1: make 1 point at 0 (the larger group, or the first item when equal, stays the leader).', A(R('item', [0, 1, 2, 3, 4], { hl: [1] }), R('parent', [0, 0, 2, 3, 4], { hl: [1] })), 'parent[1] = 0'),
    S('Join 2 and 3: make 2 the leader of 3.', A(R('item', [0, 1, 2, 3, 4], { hl: [3] }), R('parent', [0, 0, 2, 2, 4], { hl: [3] })), 'parent[3] = 2'),
    S('Join 1 and 3: follow the parents to find each leader. 1 leads to 0, and 3 leads to 2. Different leaders, so hang leader 0 under 2.', A(R('item', [0, 1, 2, 3, 4], { hl: [0] }), R('parent', [2, 0, 2, 2, 4], { hl: [0] })), 'leader(1) = 0, leader(3) = 2'),
    S('Are 0 and 3 in the same group? Follow parents from each: both end at 2. Yes. Shortcuts that point items straight at their leader (path compression) keep these walks very short. This is union-find.', A(R('item', [0, 1, 2, 3, 4], { hl: [0, 3] }), R('parent', [2, 0, 2, 2, 4], { accent: true })), 'leader(0) = 2 = leader(3)'),
    S('Your turn.', A(R('item', [0, 1, 2, 3, 4], { hl: [0, 4] }), R('parent', [2, 0, 2, 2, 4])), undefined, Q('Are 4 and 0 in the same group?', ['Yes', 'No: their leaders are 4 and 2'], 1, 'Item 4 was never joined to anything, so it leads itself (4). The leader of 0 is 2. Different leaders mean different groups.')),
  ],
  greedy: [
    S('Goal: can you reach the last cell if each number is the farthest you may jump from that cell? Idea: only track the farthest cell you could possibly reach so far. Never try individual routes.', A(R('jump', jump, { marks: { 0: 'start' } }))),
    S('At cell 0 you can jump up to 2, so the farthest reach is cell 2.', A(R('jump', jump, { win: [0, 2], marks: { 0: 'i', 2: 'reach' } })), 'reach = max(0, 0 + 2) = 2'),
    S('Cell 1 is within reach. From there you can jump 3 cells: 1 + 3 = 4. The reach grows to the last cell.', A(R('jump', jump, { win: [0, 4], marks: { 1: 'i', 4: 'reach' } })), 'reach = max(2, 1 + 3) = 4'),
    S('The last cell is reachable, so the answer is yes. We never followed a path: taking the best choice at each step (the farthest reach) is enough here, in one pass. Taking the locally best option like this is a greedy approach. Greedy is not always safe. With coins 1, 3 and 4 and a target of 6, taking the biggest coin first gives 4+1+1 (3 coins), but 3+3 needs only 2. Check that the local choice cannot hurt before you trust it.', A(R('jump', jump, { accent: true, hl: [4] }))),
    S('Your turn.', A(R('jump', [1, 0, 2], { marks: { 0: 'start' } })), undefined, Q('Jumps are [1, 0, 2]. Can you reach the last cell?', ['Yes', 'No, you get stuck at cell 1'], 1, 'From cell 0 you reach cell 1. Cell 1 allows a jump of 0, so you can never get to cell 2.')),
  ],
  trie: [
    S('Goal: store many words so we can quickly ask "does any word start with these letters?" A trie is a tree where each step down is one letter, so words that share a beginning share a path. Add "cat", starting from an empty root. The faded letters are only places the tree will grow later.', trie([0])),
    S('c, a, t: each letter hangs below the previous one. We also mark t as the end of a word, so we can tell the stored word "cat" from the mere prefix "ca".', trie([0, 1, 2, 3]), 'c → a → t'),
    S('Add "car". c and a already exist, so only r is new. Shared beginnings are stored once.', trie([0, 1, 2, 4]), 'c → a → r'),
    S('Does anything start with "ca"? Walk c, then a. The path exists: yes, in 2 steps, however many words are stored. The cost depends on the length of the word, not the number of words. This is a trie.', trie([0, 1, 2]), '2 steps'),
    S('Your turn.', trie([0, 1]), undefined, Q('Does any stored word start with "cb"?', ['Yes', 'No: there is no b under c'], 1, 'Under c there is only a. With no b, no stored word starts with cb.')),
  ],
  bits: [
    S('Goal: every number appears twice except one. Find the odd one out without extra memory. Trick: XOR (^) compares two numbers bit by bit and gives 1 where the bits differ and 0 where they match. So a number XOR itself is 0 (6 is 110 in binary, and 110 ^ 110 = 000), and anything XOR 0 stays itself. XOR also does not care about order, so we can XOR the whole list in one pass and every pair cancels, wherever it sits.', A(R('nums', [4, 1, 2, 1, 2]), R('running xor', [0, '·', '·', '·', '·', '·']))),
    S('Start with 0. Then 0 ^ 4 = 4.', A(R('nums', [4, 1, 2, 1, 2], { hl: [0] }), R('running xor', [0, 4, '·', '·', '·', '·'], { hl: [1] })), '0 ^ 4 = 4'),
    S('4 ^ 1 = 5, then 5 ^ 2 = 7.', A(R('nums', [4, 1, 2, 1, 2], { win: [1, 2] }), R('running xor', [0, 4, 5, 7, '·', '·'], { hl: [3] })), '4 ^ 1 = 5, 5 ^ 2 = 7'),
    S('7 ^ 1 = 6, then 6 ^ 2 = 4. The 1s and 2s cancelled each other out. The answer is 4, in one pass with no extra memory. Working directly on the bits of numbers is bit manipulation.', A(R('nums', [4, 1, 2, 1, 2], { win: [3, 4] }), R('running xor', [0, 4, 5, 7, 6, 4], { hl: [5] })), '7 ^ 1 = 6, 6 ^ 2 = 4'),
    S('Your turn.', A(R('nums', [6, 6])), undefined, Q('What is 6 ^ 6?', ['12', '0', '6'], 1, 'XOR gives 0 whenever the bits match, so any number XOR itself is 0. That is why pairs cancel.')),
  ],
  'sort-first': [
    S('Goal: does the list contain a duplicate? Checking every pair takes about n x n steps. Idea: sort first (n log n), so equal numbers end up side by side. (A hash set can do this one in O(n) too, but sorting needs no extra memory and also unlocks the harder problems below.)', A(R('nums', [5, 2, 9, 2, 7]))),
    S('After sorting: 2, 2, 5, 7, 9. Equal numbers are now neighbours.', A(R('sorted', [2, 2, 5, 7, 9], { accent: true })), 'sorting costs n log n'),
    S('Now one pass comparing each number with the next: 2 and 2 match. Duplicate found. Sorting often turns a hard search into a simple neighbour check, and makes tricks like two pointers and interval merging possible.', A(R('sorted', [2, 2, 5, 7, 9], { hl: [0, 1] })), '2 = 2: duplicate'),
    S('Your turn.', A(R('sorted', [1, 3, 4, 4], { accent: true })), undefined, Q('Sort [7, 3, 9, 3, 1]. Which neighbours show the duplicate?', ['7 and 9', '3 and 3', '1 and 3'], 1, 'Sorted it is 1, 3, 3, 7, 9. Equal numbers are adjacent after sorting, so the duplicate shows as the neighbours 3 and 3.')),
  ],
  'divide-conquer': [
    S('Goal: sort [6, 3, 8, 2]. Big problems are hard and tiny ones are easy. Split in half until every piece is a single number (already sorted), then join the pieces back together in order.', A(R('array', [6, 3, 8, 2], { groups: [4] }))),
    S('Split into [6, 3] and [8, 2].', A(R('array', [6, 3, 8, 2], { groups: [2, 2] }))),
    S('Split again until each piece is one number. One number is always sorted.', A(R('array', [6, 3, 8, 2], { groups: [1, 1, 1, 1] }))),
    S('Join neighbours by taking the smaller front number each time: 3 before 6, and 2 before 8. [6, 3] becomes [3, 6] and [8, 2] becomes [2, 8].', A(R('array', [3, 6, 2, 8], { groups: [2, 2], accent: true })), '[3, 6] and [2, 8]'),
    S('Join the two sorted halves by repeatedly taking the smaller front number: 2, 3, 6, 8. There are about log n levels of splitting and each level handles every number once, so n log n. This is merge sort, and solving halves then combining the answers is divide and conquer. The same shape works beyond sorting: to compute x to the power 8, find x to the power 4 and square it.', A(R('array', [2, 3, 6, 8], { groups: [4], accent: true })), '2 < 3, then 3 < 8, ...'),
    S('Your turn.', A(R('left', [3, 6]), R('right', [2, 8])), undefined, Q('Merging [3, 6] and [2, 8]. Which number goes first?', ['3', '2'], 1, 'Compare the two front numbers: 2 is smaller than 3, so 2 goes first.')),
  ],
  'string-matching': [
    S('Goal: find "abc" inside "ababcab". Slide the pattern along the text and compare letter by letter.', A(R('text', texts), R('pattern', ['a', 'b', 'c']))),
    S('At position 0: a matches, b matches, then c meets a. Mismatch.', A(R('text', texts, { hl: [0, 1], marks: { 2: 'no' } }), R('pattern', ['a', 'b', 'c'], { hl: [0, 1], marks: { 2: 'no' } })), 'a, b match; c ≠ a'),
    S('The slow way restarts at position 1, but we already know the text there is b, and the pattern starts with a, so position 1 cannot match. Clever methods (KMP and friends) use what "ab" already told them to jump straight to position 2 and never re-read the text.', A(R('text', texts, { dim: [0, 1] }), R('pattern', [null, null, 'a', 'b', 'c']))),
    S('Match found at position 2. The work is about n + m instead of n × m. This family is string matching.', A(R('text', texts, { hl: [2, 3, 4] }), R('pattern', [null, null, 'a', 'b', 'c'], { hl: [2, 3, 4] })), 'a b c matches at 2'),
    S('Your turn.', A(R('text', ['a', 'a', 'b']), R('pattern', ['a', 'b'])), undefined, Q('Pattern "ab" in text "aab". Where does the match start?', ['Position 0', 'Position 1', 'No match'], 1, 'At position 0, a matches but b meets a. At position 1 the letters a, b match.')),
  ],
  'number-theory': [
    S('Goal: the greatest common divisor (gcd) of 48 and 18, meaning the biggest number that divides both with nothing left over. Key fact: the answer stays the same if you replace (a, b) with (b, the remainder of a ÷ b). The numbers shrink quickly.', A(R('a, b', [48, 18], { hl: [0, 1] }))),
    S('48 ÷ 18 leaves remainder 12, because 48 = 2 × 18 + 12. Anything that divides both 48 and 18 must also divide 12 (the leftover), so (18, 12) has the same common divisors as (48, 18). Carry on with (18, 12).', A(R('a, b', [48, 18], { dim: [0, 1] }), R('next', [18, 12], { hl: [0, 1] })), '48 mod 18 = 12'),
    S('18 ÷ 12 leaves 6: carry on with (12, 6).', A(R('a, b', [48, 18], { dim: [0, 1] }), R('next', [18, 12], { dim: [0, 1] }), R('next', [12, 6], { hl: [0, 1] })), '18 mod 12 = 6'),
    S('12 ÷ 6 leaves 0, so stop: the answer is 6, and indeed 48 = 8 × 6 and 18 = 3 × 6. Remainders shrink fast, so only a few steps (O(log n)). The least common multiple (lcm, the smallest number both divide into) follows: lcm = a × b ÷ gcd = 48 × 18 ÷ 6 = 144. These are number theory tools.', A(R('a, b', [48, 18], { dim: [0, 1] }), R('next', [18, 12], { dim: [0, 1] }), R('next', [12, 6], { dim: [0, 1] }), R('end', [6, 0], { accent: true, hl: [0] })), '12 mod 6 = 0: gcd = 6'),
    S('Your turn.', A(R('a, b', [20, 8], { hl: [0, 1] })), undefined, Q('What is gcd(20, 8)?', ['2', '4', '8'], 1, '20 mod 8 = 4, then 8 mod 4 = 0, so the answer is 4.')),
  ],
}

export const STEPS = {
  'prefix-sum': [
    S('We have nums and will be asked for many range sums. Adding a range up each time costs O(n) per query.', A(R('nums', nums))),
    S('Build a prefix array once. prefix[i] is the sum of nums[0..i]. The first cell is just nums[0] = 3.', A(R('nums', nums, { hl: [0] }), R('prefix', [3, '·', '·', '·', '·'], { hl: [0] }))),
    S('Each next cell is the previous prefix plus the current number: 3 + 1 = 4, then 4 + 4 = 8, and so on.', A(R('nums', nums, { hl: [1] }), R('prefix', [3, 4, '·', '·', '·'], { hl: [1] }))),
    S('One pass, O(n), and the prefix array is done. Now every range sum is a subtraction.', A(R('nums', nums), R('prefix', [3, 4, 8, 10, 15], { accent: true }))),
    S('sum(nums[1..3]) = prefix[3] - prefix[0] = 10 - 3 = 7. Two lookups, O(1), however long the range is. For a range that starts at index 0 there is nothing to subtract, which is why the code version puts an extra 0 at the front of the prefix array and uses prefix[end + 1] - prefix[start].', A(R('nums', nums, { win: [1, 3] }), R('prefix', [3, 4, 8, 10, 15], { hl: [0, 3] }))),
  ],
  'two-pointers': [
    S('The array is sorted and we want two numbers that add up to 10. Put one pointer at each end.', A(R('a', sorted, { marks: { 0: 'left', 5: 'right' } }))),
    S('1 + 11 = 12, too big. Even the smallest number in the list (1) added to 11 gives 12, and every other partner is bigger, so 11 can never be part of the answer. Cross it out and move the right marker in.', A(R('a', sorted, { marks: { 0: 'left', 5: 'right' }, hl: [0, 5] }))),
    S('1 + 8 = 9, too small. 8 is the biggest number still in play, so 1 can never reach 10 with any partner. Cross out 1 and move the left marker in.', A(R('a', sorted, { marks: { 0: 'left', 4: 'right' }, hl: [0, 4], dim: [5] }))),
    S('2 + 8 = 10. Found. Every step discarded one value for good, so the whole scan is O(n).', A(R('a', sorted, { marks: { 1: 'left', 4: 'right' }, hl: [1, 4], dim: [0, 5] }))),
  ],
  'sliding-window': [
    S('Find the longest stretch with no repeated letter. Keep a window from left to right that is always valid.', A(R('s', letters, { win: [0, 0], marks: { 0: 'L, R' } }))),
    S('Grow the window to the right while letters are new. "abc" is valid, length 3.', A(R('s', letters, { win: [0, 2], marks: { 0: 'L', 2: 'R' } }))),
    S('The next letter is "a", already in the window. The window is now invalid.', A(R('s', letters, { win: [0, 3], marks: { 0: 'L', 3: 'R' }, hl: [3] }))),
    S('Shrink from the left until the duplicate is gone. Dropping the first "a" leaves "bca", length 3.', A(R('s', letters, { win: [1, 3], marks: { 1: 'L', 3: 'R' }, dim: [0] }))),
    S('Add "d": "bcad" is valid and is the best so far (4). Each index enters and leaves the window once, so O(n).', A(R('s', letters, { win: [1, 4], marks: { 1: 'L', 4: 'R' }, dim: [0] }))),
  ],
  'binary-search': [
    S('Sorted array, find 11. Look at the middle: every check throws away half of what is left.', A(R('a', bsArr, { marks: { 0: 'left', 3: 'mid', 6: 'right' }, hl: [3] }))),
    S('a[3] = 7 is less than 11, so 11 can only be on the right. Discard the left half: left = mid + 1.', A(R('a', bsArr, { marks: { 0: 'left', 3: 'mid', 6: 'right' }, hl: [3], dim: [0, 1, 2, 3] }))),
    S('New middle is a[5] = 11. Found after 2 checks. In general log2(n) checks. "Binary search on the answer" is the same loop where the array is the range of candidate answers and a[mid] becomes a yes/no test.', A(R('a', bsArr, { marks: { 4: 'left', 5: 'mid', 6: 'right' }, hl: [5], dim: [0, 1, 2, 3] }))),
  ],
  ...MORE,
}
