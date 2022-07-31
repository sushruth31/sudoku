import { readDefaultLevel } from "./config"

describe("readDefaultLevel", () => {
  it("falls back to easy when the variable is absent or blank", () => {
    expect(readDefaultLevel({})).toBe("easy")
    expect(readDefaultLevel({ REACT_APP_DEFAULT_DIFFICULTY: "" })).toBe("easy")
  })

  it.each(["easy", "medium", "hard"])("accepts %s", level => {
    expect(readDefaultLevel({ REACT_APP_DEFAULT_DIFFICULTY: level })).toBe(level)
  })

  it("throws and names the variable rather than defaulting silently", () => {
    expect(() =>
      readDefaultLevel({ REACT_APP_DEFAULT_DIFFICULTY: "expert" })
    ).toThrow(/REACT_APP_DEFAULT_DIFFICULTY is "expert"/)
  })
})
