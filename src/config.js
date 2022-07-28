import { LEVELS } from "./sudoku/generator"

/**
 * Build-time configuration. Create React App inlines `process.env` at bundle
 * time, so this runs once when the module is first imported and a bad value
 * fails the build rather than silently degrading to a default at runtime.
 */
export function readDefaultLevel(env = process.env) {
  const level = env.REACT_APP_DEFAULT_DIFFICULTY
  if (level === undefined || level === "") return "easy"
  if (!LEVELS.includes(level))
    throw new Error(
      `REACT_APP_DEFAULT_DIFFICULTY is "${level}"; expected one of ${LEVELS.join(", ")}`
    )
  return level
}

export const DEFAULT_LEVEL = readDefaultLevel()
