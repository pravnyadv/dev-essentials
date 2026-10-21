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

# data-structures/doubly-linked-list | before Code
Removing a middle node means fixing two links, one in each direction, and no walk to find the previous node is needed because the node knows it.

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
A trace of `traversal` on the list from the example. The loop runs while the current node exists, so the callback fires once per node and the list is visited exactly once.

| Step | currentNode value | Action | Next currentNode |
| --- | --- | --- | --- |
| 1 | `12` | Call callback(12) | `99` |
| 2 | `99` | Call callback(99) | `37` |
| 3 | `37` | Call callback(37) | `null` |
| 4 | `null` | Loop ends | - |

# algorithms/linked-list/reverse-traversal | before Reference
The recursion first walks to the end of the list, and only then does each call run its callback on the way back. That is why the last node is printed first. The call stack holds one call per node, so extra space is O(n).

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
The sliding window maximum from the use cases, traced on `[5, 3, 4, 1, 2, 6]` with a window of 3. The deque holds values in decreasing order. Each new item first lets the front leave if it fell out of the window, then removes smaller items from the back, so the front is always the window maximum. At i = 3 and i = 5 a front item leaves the window.

| i | New item | Left the window (front) | Deque after, front to back | Window max |
| --- | --- | --- | --- | --- |
| 0 | 5 | - | `5` | - |
| 1 | 3 | - | `5 3` | - |
| 2 | 4 | - | `5 4` | 5 |
| 3 | 1 | 5 | `4 1` | 4 |
| 4 | 2 | - | `4 2` | 4 |
| 5 | 6 | 4 | `6` | 6 |
