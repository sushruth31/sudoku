import { BOX, SIZE } from "./coords"
import { cloneGrid } from "./board"

/**
 * The search carries three arrays of 9-bit masks — one per row, column and box
 * — recording which digits are already used. A cell's candidate set is then a
 * single `~(row | col | box)`, and placing or retracting a digit is three XORs.
 * `isValidPlacement` in rules.js is the same predicate written for readability
 * and used by the UI; the solver keeps its own because it evaluates this
 * hundreds of thousands of times per generated board.
 */
const ALL_DIGITS = 0b1111111110

const boxOf = (row, col) => Math.floor(row / BOX) * BOX + Math.floor(col / BOX)

const bitCount = mask => {
  let count = 0
  for (let bits = mask; bits; bits &= bits - 1) count++
  return count
}

function toggle({ rows, cols, boxes }, row, col, value) {
  const bit = 1 << value
  rows[row] ^= bit
  cols[col] ^= bit
  boxes[boxOf(row, col)] ^= bit
}

function maskState(grid) {
  const state = {
    rows: Array(SIZE).fill(0),
    cols: Array(SIZE).fill(0),
    boxes: Array(SIZE).fill(0),
  }
  grid.forEach((row, r) =>
    row.forEach((value, c) => value && toggle(state, r, c, value))
  )
  return state
}

const freeAt = ({ rows, cols, boxes }, row, col) =>
  ALL_DIGITS & ~(rows[row] | cols[col] | boxes[boxOf(row, col)])

const put = (grid, state, { row, col }, value) => {
  grid[row][col] = value
  toggle(state, row, col, value)
}

const undo = (grid, state, { row, col }, value) => {
  grid[row][col] = 0
  toggle(state, row, col, value)
}

/**
 * Minimum-remaining-values: branch on the blank with the fewest candidates.
 * Returning at the first single-candidate cell doubles as naked-single
 * propagation, and a zero-candidate cell aborts the branch one level early.
 */
function mostConstrained(grid, state) {
  let best = null
  for (let i = 0; i < SIZE * SIZE; i++) {
    const row = Math.floor(i / SIZE)
    const col = i % SIZE
    if (grid[row][col] !== 0) continue
    const free = freeAt(state, row, col)
    const count = bitCount(free)
    if (!best || count < best.count) best = { row, col, free, count }
    if (best.count <= 1) return best
  }
  return best
}

function search(grid, state) {
  const cell = mostConstrained(grid, state)
  if (!cell) return true
  for (let value = 1; value <= SIZE; value++) {
    if (!(cell.free & (1 << value))) continue
    put(grid, state, cell, value)
    if (search(grid, state)) return true
    undo(grid, state, cell, value)
  }
  return false
}

/** Depth-first backtracking. Returns a solved copy, or null if unsolvable. */
export function solve(grid) {
  const work = cloneGrid(grid)
  return search(work, maskState(work)) ? work : null
}

function count(grid, state, limit) {
  const cell = mostConstrained(grid, state)
  if (!cell) return 1
  let total = 0
  for (let value = 1; value <= SIZE && total < limit; value++) {
    if (!(cell.free & (1 << value))) continue
    put(grid, state, cell, value)
    total += count(grid, state, limit - total)
    undo(grid, state, cell, value)
  }
  return total
}

/**
 * Number of distinct solutions, abandoning the search once `limit` is reached.
 * Uniqueness is `countSolutions(grid, 2) === 1`; the cap is what keeps the
 * generator's per-cell check affordable.
 */
export function countSolutions(grid, limit = 2) {
  const work = cloneGrid(grid)
  return count(work, maskState(work), limit)
}
