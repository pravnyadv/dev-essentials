# 2D Arrays (Matrices)

A matrix is an array of rows, `grid[row][col]`. Grids model boards, maps, images and dynamic programming tables, so grid traversal is one of the most reused skills.

## Basics

```js
const rows = grid.length;
const cols = grid[0].length;
const value = grid[r][c];
```

Create one correctly. `Array(rows).fill(Array(cols).fill(0))` reuses the same row for every index.

```js
const grid = Array.from({ length: rows }, () => Array(cols).fill(0));
```

## Complexity

| Operation | Time |
| --- | --- |
| Read or write a cell | O(1) |
| Visit every cell | O(rows × cols) |
| Transpose or rotate | O(rows × cols) |
| Search in a sorted matrix | O(rows + cols) with the staircase method |

## Moving around

Store the four directions once and loop over them. Check bounds before reading.

```js
const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
for (const [dr, dc] of DIRS) {
  const nr = r + dr, nc = c + dc;
  if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
  // use grid[nr][nc]
}
```

Add the four diagonals for 8-direction movement.

## Handy facts

- Cells on the same **diagonal** share `r - c`. Cells on the same **anti-diagonal** share `r + c`.
- A flat index and a cell convert with `i = r * cols + c`, `r = Math.floor(i / cols)`, `c = i % cols`.
- Transpose swaps `grid[r][c]` with `grid[c][r]`. Rotating 90 degrees clockwise is a transpose then reversing each row.

## Common patterns

- **Flood fill, islands, regions**: DFS or BFS from a cell (see Matrix Traversal pattern).
- **Shortest path in a maze**: BFS.
- **Spiral and rotation**: track four boundaries and shrink them.
- **Grid DP**: `dp[r][c]` from `dp[r-1][c]` and `dp[r][c-1]` (unique paths, minimum path sum).

## Common mistakes

- Shared rows from `fill` (see above).
- Mixing up `rows` and `cols`, or `grid[x][y]` against `grid[y][x]`.
- Mutating the grid to mark visited and then needing the original.
