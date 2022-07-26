import { ALL_KEYS, BOX, toArr } from "./coords"
import { cloneGrid, gridToMap } from "./board"
import { randomElement, shuffle } from "./random"
import { countSolutions, solve } from "./solver"
import { SEED_GRIDS } from "./seeds"

/** Blanks to aim for. 81 - blanks givens; 17 is the theoretical minimum. */
export const DIFFICULTY = { easy: 40, medium: 48, hard: 54 }

export const LEVELS = Object.keys(DIFFICULTY)

/** Rotate 90 degrees clockwise; sudoku validity is invariant under rotation. */
export const rotate = grid =>
  grid[0].map((_, col) => grid.map(row => row[col]).reverse())

const rotateBack = grid => rotate(rotate(rotate(grid)))

/**
 * Relabel digits through a random permutation of 1..9. The original code drew a
 * derangement one digit at a time and could paint itself into a corner with no
 * legal digit left; a whole permutation cannot fail, and validity does not
 * require that any digit actually move.
 */
export function relabel(grid) {
  const permutation = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])
  return grid.map(row => row.map(v => (v === 0 ? 0 : permutation[v - 1])))
}

/** Reorder rows within each horizontal band of three. */
export const shuffleBands = grid =>
  [0, BOX, 2 * BOX].flatMap(start => shuffle(grid.slice(start, start + BOX)))

/** The column-wise equivalent: rotate, shuffle rows, rotate back. */
export const shuffleStacks = grid => rotateBack(shuffleBands(rotate(grid)))

const TRANSFORMS = [rotate, relabel, shuffleBands, shuffleStacks]

/** Applies each symmetry twice in random order — enough to decorrelate seeds. */
export const scramble = grid =>
  shuffle([...TRANSFORMS, ...TRANSFORMS]).reduce((acc, fn) => fn(acc), grid)

/**
 * Removes cells one at a time, keeping a removal only while exactly one
 * solution survives. Best effort: stops at `target` blanks or when every cell
 * has been tried, so an unreachable target yields an easier board, never a
 * board with two answers.
 */
export function carve(solution, target) {
  const puzzle = cloneGrid(solution)
  let blanks = 0
  for (const key of shuffle(ALL_KEYS)) {
    if (blanks === target) break
    const [row, col] = toArr(key)
    const value = puzzle[row][col]
    puzzle[row][col] = 0
    if (countSolutions(puzzle, 2) === 1) blanks++
    else puzzle[row][col] = value
  }
  return puzzle
}

/** A puzzle and its unique answer, both as sparse maps of filled cells. */
export function generate(level) {
  const solution = solve(randomElement(SEED_GRIDS))
  if (!solution) throw new Error(`seed grid has no solution for level ${level}`)
  const scrambled = scramble(solution)
  return {
    puzzle: gridToMap(carve(scrambled, DIFFICULTY[level])),
    solution: gridToMap(scrambled),
  }
}
