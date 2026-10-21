# data-structures/hash-table | before Code
The `hash` function in the code adds up the character codes of the key and takes the remainder by the table size. This trace inserts five keys into a table with 5 buckets, as if you wrote `new HashTable(5)` (the code's default is 32 buckets). `melon` and `lemon` use the same letters, so the sum of their codes is identical and they must share a bucket. `apple` and `mango` are not anagrams: their sums just happen to both be 530, which is a plain collision by coincidence.

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

# data-structures/hash-table | after Code
Average cost: `set`, `get` and `delete` hash the key (a fixed amount of work for short keys) and then walk one chain, so they take O(1) on average when chains are short. If you put many more keys than buckets into this table, chains grow and lookups drift toward O(n). Real hash tables avoid this by resizing and re-hashing when they fill up. The code on this page never resizes, which is why the hashing demo lets you shrink the bucket count and watch the chains grow.

# data-structures/lru-cache | after The problem statement
The `int` types come from LeetCode's version of the problem. The JavaScript code below accepts any key and value, and `get` returns `undefined` for a missing key (LeetCode returns -1).


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

# data-structures/lru-cache | after Implementation
One limit of Version 1: it stores nodes in a plain `{}`, so a key such as `constructor` or `toString` is mistaken for an existing node and the code throws. Version 2 (`Map`) has no such problem. If you copy Version 1, create the object with `Object.create(null)` or use a `Map`.
