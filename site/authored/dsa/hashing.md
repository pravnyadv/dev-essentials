# data-structures/hash-table | before Code
The `hash` function in the code adds up the character codes of the key and takes the remainder by the table size. This trace inserts five keys into a table with 5 buckets. `melon` and `lemon` use the same letters, so the sum of their codes is identical and they must share a bucket.

| Key | Sum of character codes | Index calculation | Bucket | Collision? |
| --- | --- | --- | --- | --- |
| `melon` | 539 | 539 mod 5 = 4 | 4 | No |
| `apple` | 530 | 530 mod 5 = 0 | 0 | No |
| `lemon` | 539 | 539 mod 5 = 4 | 4 | Yes, bucket already holds melon |
| `grape` | 527 | 527 mod 5 = 2 | 2 | No |
| `mango` | 530 | 530 mod 5 = 0 | 0 | Yes, bucket already holds apple |

Buckets after all five inserts. A collision just means a bucket holds a short chain.

| Bucket | Chain of keys |
| --- | --- |
| 0 | `apple`, `mango` |
| 1 | empty |
| 2 | `grape` |
| 3 | empty |
| 4 | `melon`, `lemon` |

Looking up `lemon` hashes to bucket 4, then compares keys along that chain: `melon` does not match, then `lemon` matches. Only that short chain is searched, not the whole table.

# data-structures/lru-cache | after The problem statement
A trace for capacity 2, using the ordered Map version: the first key is the least recently used. Every `get` or `set` moves that key to the most recent end, and a `set` past capacity evicts from the other end. Note that `get(a)` saves `a`, so `b` is evicted when `c` arrives. A `get` of a missing key changes nothing, and setting an existing key only refreshes it.

| Call | Returns | Eviction | Keys, least to most recently used |
| --- | --- | --- | --- |
| set(a, 1) | - | - | `a` |
| set(b, 2) | - | - | `a b` |
| get(a) | 1 | - | `b a` |
| set(c, 3) | - | Evict `b` | `a c` |
| get(b) | undefined | - | `a c` |
| set(a, 10) | - | - | `c a` |
| get(c) | 3 | - | `a c` |
