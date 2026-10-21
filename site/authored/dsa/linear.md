# data-structures/linked-list | before Pseudocode for Basic Operations
```mermaid Prepending is one pointer change: the new node points at the old head, and head moves to it
flowchart LR
  H[head] --> N[new]
  N --> A[1]
  A --> B[2]
  B --> C[3]
  C --> X[null]
  class N focus
```

# data-structures/linked-list | before Pseudocode for Basic Operations
How a linked list compares with an array on the operations that matter most:

| Operation | Array | Linked list |
| --- | --- | --- |
| Read item number i | O(1), direct address | O(n), walk from the head |
| Insert at the front | O(n), every item shifts | O(1), one pointer change |
| Search for a value | O(n) | O(n) |
| Memory layout | One contiguous block | Nodes can sit anywhere |

# data-structures/linked-list | before Pseudocode for Basic Operations
The O(1) insertion in the Complexity table holds when you add at the front (`prepend`) or at the end (`append`, because the list remembers its tail). Inserting at position i means walking i nodes first, so it is O(n). Removing the last node is also O(n) in this singly linked list: the tail has no link back, so you must walk from the head to find the node before it. Removing the head is O(1).

Two terms from the paragraph above. Cache locality: a CPU is fastest when it reads memory cells that sit next to each other. An array's items are neighbours, but list nodes can be scattered, so walking a list is slower in practice than O(n) suggests. In the pseudocode below, `ø` means null (no node), `yield` means hand back this value and carry on, and Pre and Post state what must be true before and after.

# data-structures/linked-list | before Code
Removing a node in the middle means stopping on the node before it and linking past it. The pseudocode treats the head and the tail as special cases. Here is `Remove(head, 3)` from the pseudocode on the list `1, 2, 3, 4`.

```mermaid Removing node 3: node 2 is pointed at node 4, so node 3 drops out of the list
flowchart LR
  H[head] --> A[1]
  A --> B[2]
  B --> C[3]
  C --> D[4]
  D --> X[null]
  B -.->|new link| D
  class C bad
```

| Step | n is | List | What happens |
| --- | --- | --- | --- |
| Start | head | `1, 2, 3, 4` | Head value is 1, not 3, so walk on |
| Check n.next | node 1 | `1, 2, 3, 4` | n.next is 2, not 3, so move n forward |
| Check n.next | node 2 | `1, 2, 3, 4` | n.next is 3, the value to remove, so stop |
| n.next = n.next.next | node 2 | `1, 2, 4` | Node 3 is no longer reachable |

The pseudocode removes the first match only. The `delete` method in the code below keeps walking and removes every node with that value.

The Traverse in Reverse pseudocode is O(n squared): for each node it walks again from the head to find the node before it. The Reversed Linked List Traversal topic later in this chapter does it in O(n) with recursion.

# data-structures/doubly-linked-list | before Pseudocode for Basic Operations
In the first paragraph, a sentinel node is a dummy node that holds no value and sits at an end so the code never has to check for an empty end. The code on this page does not use one: the first node's previous and the last node's next are simply null. You can ignore circular lists for now.

# data-structures/doubly-linked-list | before Code
Removing a middle node means fixing two links, one in each direction. Once you hold the node to remove, fixing the two neighbouring links is O(1), because the node knows its previous neighbour. Finding that node by value still means walking from the head, which is why the Remove below, and the Deletion column above, are O(n).

```mermaid Removing node 2: node 1 next skips to node 3, and node 3 prev points back to node 1
flowchart LR
  A[node 1] -->|next| B[node 2]
  B -->|prev| A
  B -->|next| C[node 3]
  C -->|prev| B
  A -.->|new next| C
  C -.->|new prev| A
  class B bad
```

|  | Singly linked list | Doubly linked list |
| --- | --- | --- |
| Links per node | 1 (next) | 2 (next and previous) |
| Walk backward | Not possible without extra work | Follow previous, O(n) for the whole list |
| Remove a node you already hold | Needs the node before it, so a walk from the head | Fix the two neighbours directly |
| Memory per node | Value and one pointer | Value and two pointers |

# algorithms/linked-list/traversal | before Reference
A trace of `traversal` on the list from the example. The loop runs while the current node exists, so the callback fires once per node and the list is visited exactly once. Extra space is O(1): the loop keeps one variable, `currentNode`, however long the list is.

| Step | currentNode value | Action | Next currentNode |
| --- | --- | --- | --- |
| 1 | `12` | Call callback(12) | `99` |
| 2 | `99` | Call callback(99) | `37` |
| 3 | `37` | Call callback(37) | `null` |
| 4 | `null` | Loop ends | - |

# algorithms/linked-list/reverse-traversal | before Reference
The recursion first walks to the end of the list, and only then does each call run its callback on the way back. That is why the last node is printed first. The call stack holds one call per node, so extra space is O(n). For a list of hundreds of thousands of nodes this can overflow the call stack. Then you would collect the values into an array in one forward pass and read it backward, which also costs O(n) space but no deep recursion.

This reads the list in reverse and leaves it unchanged. Reversing the list itself, by rewiring each `next`, is a different technique, shown in the In-Place Reversal pattern and in the `reverse()` method of Linked List.

```mermaid Reverse traversal: calls go down to null, callbacks run on the way back as 37, 99, 12
sequenceDiagram
  participant A as visit node 12
  participant B as visit node 99
  participant C as visit node 37
  participant D as visit null
  A->>B: recurse on next
  B->>C: recurse on next
  C->>D: recurse on next
  D-->>C: null, return
  Note over C: callback 37
  C-->>B: return
  Note over B: callback 99
  B-->>A: return
  Note over A: callback 12
```

# data-structures/stack | after Code
Push, pop and peek each touch only the top of the stack, so each takes O(1) time. Stacks show up wherever the last thing started must be finished first: the undo button, the browser call stack when functions call functions, and matching brackets (the next lesson).

# data-structures/stack | before Code
A run of push, pop and peek on an empty stack. The last item pushed is always the first to come off, and popping an empty stack returns `null` in the code below.

| Operation | Returns | Stack after, bottom to top (top is right) |
| --- | --- | --- |
| push(1) | - | `1` |
| push(2) | - | `1 2` |
| push(3) | - | `1 2 3` |
| pop() | 3 | `1 2` |
| peek() | 2 | `1 2` |
| push(4) | - | `1 2 4` |
| pop() | 4 | `1 2` |
| pop() | 2 | `1` |
| pop() | 1 | empty |
| pop() | null (empty) | empty |

# algorithms/stack/valid-parentheses | top
Three rules make a string valid: (1) each opening bracket is closed by the same type, (2) brackets close in the right order, so the most recently opened one closes first, (3) every closing bracket has an opening one. Rule 2 is the hint to use a stack.

# algorithms/stack/valid-parentheses | before Code
A clearer brute force than the one described above: repeatedly scan the string and delete any adjacent pair `()`, `[]` or `{}`. Stop when nothing can be deleted. The string is valid only if it is now empty. Each scan is O(n) and there can be up to n/2 scans, so this is O(n^2).

# algorithms/stack/valid-parentheses | before Code
The code pushes the closing partner of every opening bracket, so a closing bracket only has to equal the top of the stack. Two traces: a valid string and the failing nested case.

String `{[()]}`:

| Character | What happens | Stack after (top on the right) |
| --- | --- | --- |
| `{` | Opening, push its closing partner | `}` |
| `[` | Opening, push its closing partner | `} ]` |
| `(` | Opening, push its closing partner | `} ] )` |
| `)` | Popped `)`, matches | `} ]` |
| `]` | Popped `]`, matches | `}` |
| `}` | Popped `}`, matches | empty |
| end | Nothing left over | Return true |

String `([)]`:

| Character | What happens | Stack after (top on the right) |
| --- | --- | --- |
| `(` | Opening, push its closing partner | `)` |
| `[` | Opening, push its closing partner | `) ]` |
| `)` | Popped `]`, which does not match | Return false |

Two edge cases in the code: a closing bracket with an empty stack (for example `)`) is invalid straight away because there is nothing to match, and this version returns false for an empty string, since the problem guarantees at least one character.

# data-structures/queue | after Code
Enqueue adds at the tail and dequeue removes from the head. The linked list remembers both ends, so neither one walks the list, and both are O(1).

# data-structures/queue | before Code
A run of enqueue, dequeue and peek. Items leave in the order they arrived: A, B, C, D. Compare with the stack trace, where the order is reversed.

| Operation | Returns | Queue after, front to back (front is left) |
| --- | --- | --- |
| enqueue(A) | - | `A` |
| enqueue(B) | - | `A B` |
| enqueue(C) | - | `A B C` |
| dequeue() | A | `B C` |
| peek() | B | `B C` |
| enqueue(D) | - | `B C D` |
| dequeue() | B | `C D` |
| dequeue() | C | `D` |
| dequeue() | D | empty |
| dequeue() | null (empty) | empty |

# data-structures/deque | after Use Cases
Two of the use cases above are only loose fits. For undo and redo, undo takes the newest action from the back, but redo should bring back the action undone most recently, and the front holds the oldest one. Redo is normally a separate stack that receives each undone action. A deque helps with undo when the history is capped at, say, 50 actions: add new actions at the back and drop the oldest from the front when it is full. Browser history works the same way. Real back and forward buttons use two stacks, and a deque only fits the detail of keeping the last N pages by dropping the oldest from the front.

The sliding window maximum from the use cases, traced on `[5, 3, 4, 1, 2, 6]` with a window of 3. The deque holds the positions (indices) of items, ordered so that their values decrease; the table shows the values at those positions. Position i leaves the window when it is less than the current index minus 2 (window size 3). Each new item first lets the front leave if it fell out of the window, then removes smaller items from the back, so the front is always the window maximum. At i = 3 and i = 5 a front item leaves the window.

| i | New item | Left the window (front) | Deque after, front to back | Window max |
| --- | --- | --- | --- | --- |
| 0 | 5 | - | `5` | - |
| 1 | 3 | - | `5 3` | - |
| 2 | 4 | - | `5 4` | 5 |
| 3 | 1 | 5 | `4 1` | 4 |
| 4 | 2 | - | `4 2` | 4 |
| 5 | 6 | 4 | `6` | 6 |
