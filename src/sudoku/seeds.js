/**
 * Starting grids, covered by solver.test.js. They are only ever input to the
 * solver:
 * the generator completes one, scrambles the result and carves a fresh puzzle
 * out of it, so two seeds are enough to reach a large space of boards.
 */
export const SEED_GRIDS = [
  [
    [2, 3, 0, 9, 4, 0, 6, 7, 0],
    [8, 0, 0, 3, 2, 5, 9, 1, 4],
    [9, 0, 0, 7, 6, 0, 3, 2, 0],
    [1, 0, 0, 0, 0, 0, 7, 9, 2],
    [5, 0, 3, 2, 1, 0, 4, 8, 6],
    [4, 0, 0, 6, 8, 0, 5, 3, 1],
    [7, 0, 0, 1, 0, 0, 0, 0, 9],
    [6, 5, 9, 8, 7, 2, 1, 4, 3],
    [3, 0, 0, 0, 9, 0, 0, 0, 7],
  ],
  [
    [0, 0, 0, 4, 1, 6, 0, 2, 7],
    [2, 0, 6, 8, 5, 7, 0, 3, 1],
    [0, 1, 7, 0, 9, 3, 0, 5, 8],
    [5, 6, 9, 1, 3, 4, 7, 0, 2],
    [0, 0, 3, 0, 0, 8, 5, 4, 9],
    [0, 0, 8, 5, 2, 9, 1, 6, 3],
    [6, 0, 2, 7, 8, 0, 0, 9, 0],
    [9, 8, 1, 0, 4, 5, 0, 7, 6],
    [3, 7, 4, 9, 6, 2, 8, 1, 0],
  ],
]
