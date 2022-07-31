import { cellKeyToDigit } from "./NumberDial"

describe("cellKeyToDigit", () => {
  it("maps the dial's 3x3 keys to 1..9 in reading order", () => {
    expect(cellKeyToDigit("0-0")).toBe(1)
    expect(cellKeyToDigit("1-1")).toBe(5)
    expect(cellKeyToDigit("2-2")).toBe(9)
  })

  it("covers every digit exactly once", () => {
    const keys = ["0-0", "0-1", "0-2", "1-0", "1-1", "1-2", "2-0", "2-1", "2-2"]
    expect(keys.map(cellKeyToDigit)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9])
  })
})
