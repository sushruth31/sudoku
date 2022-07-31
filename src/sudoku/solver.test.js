import { cloneGrid, emptyGrid } from "./board"
import { allConflicts } from "./rules"
import { SEED_GRIDS } from "./seeds"
import { countSolutions, solve } from "./solver"

describe("solve", () => {
  it.each(SEED_GRIDS.map((grid, i) => [i, grid]))(
    "fills seed %i completely and without conflicts",
    (_, seed) => {
      const solved = solve(seed)
      expect(solved.flat().filter(v => v === 0)).toHaveLength(0)
      expect(allConflicts(solved).size).toBe(0)
    }
  )

  it("keeps every given from the seed in place", () => {
    const solved = solve(SEED_GRIDS[0])
    const givensPreserved = SEED_GRIDS[0].every((row, r) =>
      row.every((value, c) => value === 0 || solved[r][c] === value)
    )
    expect(givensPreserved).toBe(true)
  })

  it("does not mutate the grid it was given", () => {
    const seed = cloneGrid(SEED_GRIDS[0])
    solve(seed)
    expect(seed).toEqual(SEED_GRIDS[0])
  })

  it("returns null when a blank cell has no legal candidate", () => {
    const grid = emptyGrid()
    grid[0] = [1, 2, 3, 4, 5, 6, 7, 8, 0]
    grid[1][8] = 9
    expect(solve(grid)).toBeNull()
  })
})

describe("countSolutions", () => {
  const solved = solve(SEED_GRIDS[0])

  it("counts a completed grid as exactly one solution", () => {
    expect(countSolutions(solved, 2)).toBe(1)
  })

  it("stays at one when a single cell is blanked, since it is forced", () => {
    const grid = cloneGrid(solved)
    grid[4][4] = 0
    expect(countSolutions(grid, 2)).toBe(1)
  })

  it("detects ambiguity: an empty grid reaches the cap of two", () => {
    expect(countSolutions(emptyGrid(), 2)).toBe(2)
  })

  it("short-circuits at the requested limit instead of enumerating", () => {
    expect(countSolutions(emptyGrid(), 1)).toBe(1)
  })
})
