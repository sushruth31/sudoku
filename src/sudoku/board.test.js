import { blankCount, cloneGrid, emptyGrid, gridToMap, mapToGrid } from "./board"

const grid = emptyGrid()
grid[0][0] = 5
grid[8][8] = 9

describe("grid and map representations", () => {
  it("omits blank cells from the map so `has` means `filled`", () => {
    const map = gridToMap(grid)
    expect(map.size).toBe(2)
    expect(map.get("0-0")).toBe(5)
    expect(map.has("4-4")).toBe(false)
  })

  it("round-trips grid -> map -> grid", () => {
    expect(mapToGrid(gridToMap(grid))).toEqual(grid)
  })

  it("counts blanks", () => {
    expect(blankCount(grid)).toBe(79)
    expect(blankCount(emptyGrid())).toBe(81)
  })

  it("clones rows rather than sharing them", () => {
    const copy = cloneGrid(grid)
    copy[0][0] = 1
    expect(grid[0][0]).toBe(5)
  })
})
