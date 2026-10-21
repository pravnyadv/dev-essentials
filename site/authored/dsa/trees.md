# data-structures/tree | before Code
```mermaid Tree words on one tree: A is the root, B and C are its children, and the leaves have no children
flowchart TD
  A[A root] --> B[B]
  A --> C[C]
  B --> D[D leaf]
  B --> E[E leaf]
  C --> F[F leaf]
  C --> G[G leaf]
  class A focus
  class D good
  class E good
  class F good
  class G good
```

| Word | Meaning | In this tree |
| --- | --- | --- |
| Root | the one node with no parent | A |
| Parent and child | a node and the nodes directly below it | B is the parent of D and E |
| Leaf | a node with no children | D, E, F, G |
| Subtree | a node together with everything below it | the subtree at C is C, F, G |
| Depth | edges from the root down to the node | A is 0, B is 1, D is 2 |
| Height | edges on the longest path from root to a leaf | 2 |

# algorithms/tree/depth-first-search | after Overview
```mermaid Depth-first on a small tree: each box shows the node value and when enterNode reaches it, so the search dives to the leftmost leaf before it comes back up
flowchart TD
  n4[4 entered 1st] --> n2[2 entered 2nd]
  n4 --> n6[6 entered 5th]
  n2 --> n1[1 entered 3rd]
  n2 --> n3[3 entered 4th]
  n6 --> n5[5 entered 6th]
  n6 --> n7[7 entered 7th]
  class n4 focus
```

# algorithms/tree/depth-first-search | before Code
Each call to `depthFirstSearchRecursive` is on the call stack until it has finished both children. Trace on the tree above, with the stack shown from root to current node:

| Step | Callback | Stack after the step |
| --- | --- | --- |
| 1 | enterNode(4) | 4 |
| 2 | enterNode(2) | 4 > 2 |
| 3 | enterNode(1) | 4 > 2 > 1 |
| 4 | leaveNode(1) | 4 > 2 |
| 5 | enterNode(3) | 4 > 2 > 3 |
| 6 | leaveNode(3) | 4 > 2 |
| 7 | leaveNode(2) | 4 |
| 8 | enterNode(6) | 4 > 6 |
| 9 | enterNode(5) | 4 > 6 > 5 |
| 10 | leaveNode(5) | 4 > 6 |
| 11 | enterNode(7) | 4 > 6 > 7 |
| 12 | leaveNode(7) | 4 > 6 |
| 13 | leaveNode(6) | 4 |
| 14 | leaveNode(4) | empty |

The same walk gives three orders, depending on when the node is read:

| Order | When the node is read | Result on this tree |
| --- | --- | --- |
| Pre-order | on enterNode, before the children | 4, 2, 1, 3, 6, 5, 7 |
| In-order | between the left and right child | 1, 2, 3, 4, 5, 6, 7 |
| Post-order | on leaveNode, after the children | 1, 3, 2, 5, 7, 6, 4 |

The code gives enterNode and leaveNode, so pre-order and post-order come straight from it. In-order needs a read between the two recursive calls.

# algorithms/tree/breadth-first-search | after Overview
```mermaid Breadth-first on the same tree: each box shows the node value and when it is dequeued, so whole levels finish before the next one starts
flowchart TD
  n4[4 visited 1st] --> n2[2 visited 2nd]
  n4 --> n6[6 visited 3rd]
  n2 --> n1[1 visited 4th]
  n2 --> n3[3 visited 5th]
  n6 --> n5[5 visited 6th]
  n6 --> n7[7 visited 7th]
  class n4 focus
```

# algorithms/tree/breadth-first-search | before Code
The queue holds the nodes waiting to be visited, oldest first. Each step takes one from the front and adds its children to the back. Trace of `breadthFirstSearch` on the tree above:

| Visit order | Dequeued node | Children added | Queue afterwards |
| --- | --- | --- | --- |
| 1 | 4 | 2, 6 | 2, 6 |
| 2 | 2 | 1, 3 | 6, 1, 3 |
| 3 | 6 | 5, 7 | 1, 3, 5, 7 |
| 4 | 1 | none | 3, 5, 7 |
| 5 | 3 | none | 5, 7 |
| 6 | 5 | none | 7 |
| 7 | 7 | none | empty |

Because new children join the back, every node of one level leaves the queue before any node of the next level.

# data-structures/tree/binary-search-tree | after Pseudocode for Basic Operations
Searches in the tree of the picture above, built by inserting 8, 3, 10, 1, 6, 14, 4, 7, 13 in that order. Each comparison discards one whole side.

| Search for | Comparisons along the way | Result |
| --- | --- | --- |
| 7 | 8: less, go left; 3: greater, go right; 6: greater, go right; 7 equals 7 | found |
| 5 | 8: less, go left; 3: greater, go right; 6: less, go left; 4: greater, go right; nothing there | not found |

Deleting a node depends on how many children it has, as in the `remove` pseudocode:

| Node to remove | What remove does |
| --- | --- |
| No children (a leaf) | cut it off from its parent |
| One child | link its parent straight to that child |
| Two children | copy the smallest value of its right subtree into it, then remove that smaller node |

# data-structures/tree/binary-search-tree | before Pseudocode for Basic Operations
```mermaid The O(log n) cost assumes a balanced shape: inserting already sorted keys builds a chain, and then a search can take n comparisons
xychart-beta
  x-axis "keys stored n" [7, 15, 31, 63, 127]
  y-axis "worst comparisons" 0 --> 127
  line "sorted insertion (chain)" [7, 15, 31, 63, 127]
  line "balanced tree" [3, 4, 5, 6, 7]
```

# data-structures/heap | before Implementation
A min-heap stored as an array, starting from `2, 4, 5, 9, 7, 8`. To add 1, put it at the end and swap it upward while its parent is larger ("bubble up"):

| Step | What happens | Array afterwards |
| --- | --- | --- |
| 1 | add 1 at the end | 2, 4, 5, 9, 7, 8, 1 |
| 2 | parent 5 is larger than 1, swap | 2, 4, 1, 9, 7, 8, 5 |
| 3 | parent 2 is larger than 1, swap | 1, 4, 2, 9, 7, 8, 5 |

Removing the smallest item (poll) then works from the top. The last item takes the root's place and swaps downward with its smaller child ("sift down"). The root removed here is 1.

| Step | What happens | Array afterwards |
| --- | --- | --- |
| 1 | remove root 1, move last item 5 to the root | 5, 4, 2, 9, 7, 8 |
| 2 | 5 is larger than its smaller child 2, swap | 2, 4, 5, 9, 7, 8 |
| 3 | 5 is not larger than its smaller child 8, stop | 2, 4, 5, 9, 7, 8 |

Each swap moves one level, and a heap of n items has about log2(n) levels, which is where the O(log n) cost of insert and delete comes from.

# data-structures/priority-queue | before Code
The code below is a min-heap that compares priorities, so the smallest priority number is served first. Four tasks are added in this order and then removed one by one:

| Order added | Task | Priority |
| --- | --- | --- |
| 1 | send email | 3 |
| 2 | fix crash | 1 |
| 3 | write report | 2 |
| 4 | back up disk | 5 |

| Order served | Task | Priority |
| --- | --- | --- |
| 1 | fix crash | 1 |
| 2 | write report | 2 |
| 3 | send email | 3 |
| 4 | back up disk | 5 |

The same abstract queue can sit on different structures. With n = 1,000,000 waiting items, the cost of one add and one remove-top:

| Structure | Add | Remove top | Steps for remove top at n = 1,000,000 |
| --- | --- | --- | --- |
| Unsorted array | O(1) | O(n), scan for the best | about 1,000,000 |
| Sorted array | O(n), shift to make room | O(1) | about 1 |
| Binary heap | O(log n) | O(log n) | about 20 |

A heap avoids paying a full price on either operation.

# data-structures/trie | before Code
```mermaid A trie holding cat, car, cart and cow: words share their first letters, and the marked boxes are where a stored word ends
flowchart TD
  root[start] --> c[c]
  c --> a[a]
  c --> o[o]
  a --> t1[t]
  a --> r[r]
  r --> t2[t]
  o --> w[w]
  class t1 good
  class r good
  class t2 good
  class w good
```

Looking up a word means following one letter per step. Using the trie above:

| Look up | Steps taken | Outcome |
| --- | --- | --- |
| "car" | 3 | a stored word |
| "ca" | 2 | a prefix only |
| "cart" | 4 | a stored word |
| "cab" | 2 | no child "b", stop |
| "dog" | 0 | no child "d", stop |

The number of steps is at most the length of the word asked for, however many words are stored.

