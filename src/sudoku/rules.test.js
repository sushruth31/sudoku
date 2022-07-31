import { cloneGrid, emptyGrid } from "./board"
import { allConflicts, conflictsAt, isValidPlacement } from "./rules"
import { SEED_GRIDS } from "./seeds"
import { solve } from "./solver"

const solved = solve(SEED_GRIDS[0])

describe("isValidPlacement", () => {
  const grid = emptyGrid()
  grid[0][0] = 5

  it("rejects a digit already in the row", () => {
    expect(isValidPlacement(grid, 0, 4, 5)).toBe(false)
  })

  it("rejects a digit already in the column", () => {
    expect(isValidPlacement(grid, 4, 0, 5)).toBe(false)
  })

  it("rejects a digit already in the 3x3 box but not the row or column", () => {
    expect(isValidPlacement(grid, 1, 1, 5)).toBe(false)
  })

  it("accepts a digit that shares no row, column or box", () => {
    expect(isValidPlacement(grid, 4, 4, 5)).toBe(true)
  })

  it("does not treat a cell's own value as a conflict with itself", () => {
    expect(isValidPlacement(grid, 0, 0, 5)).toBe(true)
  })

  it("holds for every cell of a solved grid", () => {
    const everyCellLegal = solved.every((row, r) =>
      row.every((value, c) => isValidPlacement(solved, r, c, value))
    )
    expect(everyCellLegal).toBe(true)
  })
})

describe("conflict detection", () => {
  it("reports no conflicts on a solved grid", () => {
    expect(allConflicts(solved).size).toBe(0)
  })

  it("flags both cells of a duplicated digit, not just the new one", () => {
    const grid = cloneGrid(solved)
    grid[0][0] = solved[0][1]
    const flagged = allConflicts(grid)
    expect(flagged.has("0-0")).toBe(true)
    expect(flagged.has("0-1")).toBe(true)
  })

  it("stops flagging a cell once the duplicate is corrected", () => {
    const grid = cloneGrid(solved)
    grid[0][0] = solved[0][1]
    grid[0][0] = solved[0][0]
    expect(allConflicts(grid).size).toBe(0)
  })

  it("returns no offenders for a legal candidate", () => {
    const grid = cloneGrid(solved)
    grid[0][0] = 0
    expect(conflictsAt(grid, "0-0", solved[0][0])).toEqual([])
  })
})
