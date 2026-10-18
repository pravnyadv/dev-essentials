export const createGrid = (rows, cols, fill = 0) => Array.from({ length: rows }, () => Array(cols).fill(fill));

export const transpose = m => m[0].map((_, c) => m.map(row => row[c]));

export const rotateClockwise = m => transpose(m).map(row => row.reverse());

export function spiral(m) {
  const out = [];
  let top = 0, bottom = m.length - 1, left = 0, right = m[0].length - 1;
  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) out.push(m[top][c]);
    top++;
    for (let r = top; r <= bottom; r++) out.push(m[r][right]);
    right--;
    if (top <= bottom) { for (let c = right; c >= left; c--) out.push(m[bottom][c]); bottom--; }
    if (left <= right) { for (let r = bottom; r >= top; r--) out.push(m[r][left]); left++; }
  }
  return out;
}

const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

export function countIslands(grid) { // grid of '1' (land) and '0'
  let count = 0;
  const sink = (r, c) => {
    if (grid[r]?.[c] !== '1') return;
    grid[r][c] = '0';
    for (const [dr, dc] of DIRS) sink(r + dr, c + dc);
  };
  grid.forEach((row, r) => row.forEach((v, c) => { if (v === '1') { count++; sink(r, c); } }));
  return count;
}
