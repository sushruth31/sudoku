import { ALL_KEYS, BOX, SIZE, peerKeys } from "./coords"
import { valueAt } from "./board"

/**
 * Whether `value` may occupy (row, col). The cell itself is excluded from every
 * scan, so this is also a correct predicate for a cell that is already filled —
 * the caller does not have to blank it first.
 *
 * This is the readable statement of the rule, used by the UI and by the tests.
 * The solver keeps a bitmask equivalent because it runs the check hundreds of
 * thousands of times per generated board.
 */
export function isValidPlacement(grid, row, col, value) {
  const top = row - (row % BOX)
  const left = col - (col % BOX)
  for (let i = 0; i < SIZE; i++) {
    const boxRow = top + Math.floor(i / BOX)
    const boxCol = left + (i % BOX)
    if (i !== col && grid[row][i] === value) return false
    if (i !== row && grid[i][col] === value) return false
    if (grid[boxRow][boxCol] === value && (boxRow !== row || boxCol !== col))
      return false
  }
  return true
}

/** Peers of `key` that already hold `value`; empty when the move is legal. */
export const conflictsAt = (grid, key, value) =>
  [...peerKeys(key)].filter(peer => valueAt(grid, peer) === value)

/**
 * Every cell involved in a constraint violation, recomputed from the board.
 * Deriving this instead of accumulating it into state means a corrected cell
 * stops being flagged, which the accumulating approach never does.
 */
export function allConflicts(grid) {
  const filled = ALL_KEYS.filter(key => valueAt(grid, key) !== 0)
  const offenders = filled.flatMap(key => {
    const clashing = conflictsAt(grid, key, valueAt(grid, key))
    return clashing.length ? [key, ...clashing] : []
  })
  return new Set(offenders)
}
