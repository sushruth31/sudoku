import { ALL_KEYS, SIZE, toArr } from "./coords"

/**
 * Two representations, each used where it is cheapest:
 *  - grid: number[9][9] with 0 for a blank. Used by the solver (index maths).
 *  - map:  Map<cellKey, 1..9> holding only filled cells. Used by React, where
 *          structural sharing on a Map is a one-line immutable update.
 */
export const emptyGrid = () =>
  Array.from({ length: SIZE }, () => Array(SIZE).fill(0))

export const cloneGrid = grid => grid.map(row => [...row])

export const valueAt = (grid, key) => {
  const [row, col] = toArr(key)
  return grid[row][col]
}

export const gridToMap = grid =>
  new Map(
    ALL_KEYS.map(key => [key, valueAt(grid, key)]).filter(([, v]) => v !== 0)
  )

export function mapToGrid(map) {
  const grid = emptyGrid()
  map.forEach((value, key) => {
    const [row, col] = toArr(key)
    grid[row][col] = value
  })
  return grid
}

export const blankCount = grid => grid.flat().filter(v => v === 0).length
