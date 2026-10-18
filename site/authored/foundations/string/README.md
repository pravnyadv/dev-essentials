# Strings

A string is a sequence of characters. In JavaScript it is **immutable**: you never change a string, you build a new one. That single fact explains most performance questions about strings.

## Operations and complexity

| Operation | Time | Note |
| --- | --- | --- |
| `s[i]`, `s.at(i)`, `s.charAt(i)` | O(1) | |
| `s.length` | O(1) | |
| `s + t`, `s.concat(t)` | O(n) | Creates a new string |
| `s.slice(a, b)`, `s.substring(a, b)` | O(n) | Copy of the range |
| `s.indexOf(t)`, `s.includes(t)` | O(n × m) worst | n text, m pattern |
| `s.split('')`, `[...s]` | O(n) | |
| `a === b` | O(n) | Compares characters |

## Building strings

Appending in a loop with `+=` is fine for small inputs, but for large ones collect pieces in an array and join once.

```js
const parts = [];
for (const word of words) parts.push(word.toUpperCase());
const result = parts.join(' ');
```

## Characters as numbers

`'a'.charCodeAt(0)` is 97. Subtracting it maps letters to 0 to 25, which lets you count letters in a fixed array of 26 instead of a Map.

```js
const counts = Array(26).fill(0);
for (const ch of word) counts[ch.charCodeAt(0) - 97]++;
```

## JavaScript specifics

- Strings are UTF-16. `'😀'.length` is 2. Use `[...s]` or `for...of` to walk by code point.
- `slice` accepts negative indexes, `substring` does not.
- `localeCompare` for locale-aware ordering. The default `<` compares code units.
- `s.split(' ')` on text with repeated spaces produces empty strings.
- Strings compare by value (`'a' === 'a'`), unlike objects.

## Techniques

- **Two pointers** from both ends: palindromes, reversing.
- **Sliding window**: longest substring with a property.
- **Frequency count**: anagrams, permutations in a string.
- **Hash map or set**: duplicates, first unique character.
- **Stack**: matching brackets, decoding nested patterns.
- **String matching** (KMP, Rabin-Karp, Z) for pattern search, in the advanced section.

## Common mistakes

- Comparing with `==` or forgetting strings are immutable (`s[0] = 'x'` silently does nothing).
- Using `+=` in a hot loop over a huge input.
- Forgetting case or whitespace rules in the problem statement.
