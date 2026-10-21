# Hash Map & Set (JS Map and Set)

A hash map stores key-value pairs and finds a value from its key in O(1) on average. A set stores unique values and answers "is this in here?" in O(1). In JavaScript these are `Map` and `Set`. The theory (hash functions, collisions) is in the Hash Table topic.

## Operations and complexity

| Operation | Map | Set | Time |
| --- | --- | --- | --- |
| Add or update | `set(k, v)` | `add(v)` | O(1) average |
| Lookup | `get(k)` | `has(v)` | O(1) average |
| Remove | `delete(k)` | `delete(v)` | O(1) average |
| Size | `size` | `size` | O(1) |
| Iterate | `for...of` | `for...of` | O(n) |

Space is O(n).

## Map or plain object

| | `Map` | Object |
| --- | --- | --- |
| Key types | Anything | Strings and symbols |
| Order | Insertion order, always | Mostly, but integer-like keys come first |
| Size | `map.size` | `Object.keys(o).length` |
| Inherited keys | None | `'toString' in {}` is true |
| Best for | Frequency counts, caches, lookups | Fixed records of known fields |

## Key equality

`Map` and `Set` compare keys the way `===` does, with one difference: `NaN` equals `NaN`. (The spec calls this rule SameValueZero; it also treats `0` and `-0` as the same key.) Primitives compare by value, objects and arrays compare by **reference**.

```js
new Set([[1, 2], [1, 2]]).size; // 2, two different arrays
new Set([NaN, NaN]).size;       // 1, NaN equals NaN here
```

To key by a pair, build a string key: `` `${r},${c}` ``.

## Patterns it unlocks

- **Frequency count**: `map.set(x, (map.get(x) ?? 0) + 1)`.
- **Seen set**: detect duplicates or visited nodes in one pass.
- **Complement lookup**: Two Sum.
- **Group by key**: anagrams (sorted word as key), buckets.
- **Cache**: memoization, LRU (a Map keeps insertion order).
- **Index**: value to position for O(1) jumps.

## Common mistakes

- Using an array `includes` in a loop when a Set would make it O(n) instead of O(n²).
- Using an object as a map with user-supplied keys such as `__proto__`.
- Expecting two equal-looking arrays to be the same key.
- Adding entries to a Map or Set while iterating over it. The loop also visits the new entries, so it can run much longer than you expect or never stop. Deleting the entry you are on is safe.
