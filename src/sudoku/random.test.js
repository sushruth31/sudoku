import { randomInt, shuffle } from "./random"

describe("shuffle", () => {
  const source = Array.from({ length: 20 }, (_, i) => i)

  it("returns a permutation of the input", () => {
    expect([...shuffle(source)].sort((a, b) => a - b)).toEqual(source)
  })

  it("leaves the caller's array untouched", () => {
    const copy = [...source]
    shuffle(source)
    expect(source).toEqual(copy)
  })

  it("handles empty and single-element arrays", () => {
    expect(shuffle([])).toEqual([])
    expect(shuffle([7])).toEqual([7])
  })

  it("can move the last element, which a biased loop over-fixes", () => {
    const moved = Array.from({ length: 50 }, () => shuffle(source)[19] !== 19)
    expect(moved.some(Boolean)).toBe(true)
  })
})

describe("randomInt", () => {
  it("stays within the inclusive range", () => {
    const draws = Array.from({ length: 500 }, () => randomInt(3, 6))
    expect(Math.min(...draws)).toBeGreaterThanOrEqual(3)
    expect(Math.max(...draws)).toBeLessThanOrEqual(6)
  })

  it("can return both endpoints", () => {
    const draws = new Set(Array.from({ length: 500 }, () => randomInt(0, 1)))
    expect(draws).toEqual(new Set([0, 1]))
  })
})
