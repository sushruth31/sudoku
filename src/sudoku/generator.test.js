import { blankCount, mapToGrid } from "./board"
import {
  DIFFICULTY,
  carve,
  generate,
  relabel,
  rotate,
  scramble,
  shuffleBands,
} from "./generator"
import { allConflicts } from "./rules"
import { SEED_GRIDS } from "./seeds"
import { countSolutions, solve } from "./solver"

const solved = solve(SEED_GRIDS[0])

describe("symmetry transforms", () => {
  it("rotate is order four: four turns return the original grid", () => {
    expect(rotate(rotate(rotate(rotate(solved))))).toEqual(solved)
  })

  it("rotate sends (row, col) to (col, 8 - row)", () => {
    expect(rotate(solved)[0][8]).toBe(solved[0][0])
  })

  it("relabel leaves blanks blank", () => {
    const withBlanks = relabel(SEED_GRIDS[0])
    expect(blankCount(withBlanks)).toBe(blankCount(SEED_GRIDS[0]))
  })

  it("relabel is a bijection on digits, so validity survives", () => {
    const relabelled = relabel(solved)
    expect(new Set(relabelled.flat()).size).toBe(9)
    expect(allConflicts(relabelled).size).toBe(0)
  })

  it("shuffleBands only moves rows within their own band of three", () => {
    const band = new Set(solved.slice(0, 3).map(row => row.join("")))
    const shuffled = shuffleBands(solved).slice(0, 3)
    expect(new Set(shuffled.map(row => row.join("")))).toEqual(band)
  })

  it("scramble preserves completeness and validity", () => {
    const scrambled = scramble(solved)
    expect(blankCount(scrambled)).toBe(0)
    expect(allConflicts(scrambled).size).toBe(0)
  })
})

describe("carve", () => {
  it("reaches the requested number of blanks on an easy board", () => {
    expect(blankCount(carve(solved, DIFFICULTY.easy))).toBe(DIFFICULTY.easy)
  })

  it("leaves exactly one solution — the guarantee the whole design rests on", () => {
    expect(countSolutions(carve(solved, DIFFICULTY.easy), 2)).toBe(1)
  })

  it("only ever removes givens, never alters them", () => {
    const puzzle = carve(solved, DIFFICULTY.easy)
    const onlyRemovals = puzzle.every((row, r) =>
      row.every((value, c) => value === 0 || value === solved[r][c])
    )
    expect(onlyRemovals).toBe(true)
  })

  it("never exceeds the target even when asked for zero", () => {
    expect(blankCount(carve(solved, 0))).toBe(0)
  })
})

describe("generate", () => {
  it.each(Object.keys(DIFFICULTY))("produces a solvable %s board", level => {
    const { puzzle, solution } = generate(level)
    expect(solution.size).toBe(81)
    expect(puzzle.size).toBe(81 - DIFFICULTY[level])
    expect(countSolutions(mapToGrid(puzzle), 2)).toBe(1)
  })

  it("returns a puzzle whose givens all agree with the solution", () => {
    const { puzzle, solution } = generate("easy")
    const agree = [...puzzle].every(([key, v]) => solution.get(key) === v)
    expect(agree).toBe(true)
  })

  it("does not return the same board twice", () => {
    const first = [...generate("medium").solution.values()].join("")
    const second = [...generate("medium").solution.values()].join("")
    expect(first).not.toBe(second)
  })
})
