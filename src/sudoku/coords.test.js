import { ALL_KEYS, boxKeys, peerKeys, toArr, toKey } from "./coords"

describe("cell keys", () => {
  it("round-trips a coordinate pair through the string form", () => {
    expect(toArr(toKey([3, 7]))).toEqual([3, 7])
  })

  it("enumerates all 81 cells exactly once", () => {
    expect(ALL_KEYS).toHaveLength(81)
    expect(new Set(ALL_KEYS).size).toBe(81)
  })
})

describe("boxKeys", () => {
  it("returns the nine cells of the box, including the cell itself", () => {
    expect(new Set(boxKeys("4-4"))).toEqual(
      new Set(["3-3", "3-4", "3-5", "4-3", "4-4", "4-5", "5-3", "5-4", "5-5"])
    )
  })

  it("snaps a cell that is not on a box boundary to its own box", () => {
    expect(boxKeys("8-2")).toEqual(boxKeys("6-0"))
  })
})

describe("peerKeys", () => {
  it("returns 20 peers: 8 row + 8 column + 4 remaining box cells", () => {
    expect(peerKeys("0-0").size).toBe(20)
  })

  it("excludes the cell itself", () => {
    expect(peerKeys("5-5").has("5-5")).toBe(false)
  })

  it("includes the far end of the row and column and the rest of the box", () => {
    const peers = peerKeys("0-0")
    expect(peers.has("0-8")).toBe(true)
    expect(peers.has("8-0")).toBe(true)
    expect(peers.has("1-1")).toBe(true)
  })

  it("excludes a cell sharing neither row, column nor box", () => {
    expect(peerKeys("0-0").has("4-4")).toBe(false)
  })
})
