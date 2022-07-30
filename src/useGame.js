import { useMemo, useState } from "react"
import { mapToGrid } from "./sudoku/board"
import { ALL_KEYS } from "./sudoku/coords"
import { generate } from "./sudoku/generator"
import { allConflicts } from "./sudoku/rules"

const NO_ERRORS = new Set()
const ignore = () => {}

/**
 * Cells the player got wrong: either a constraint violation, or a legal digit
 * that is not the one the unique solution demands. Derived on every render
 * rather than accumulated into state, so correcting a cell clears its flag.
 */
export function errorKeys(values, entered, solution) {
  const wrong = [...entered].filter(key => values.get(key) !== solution.get(key))
  return new Set([...allConflicts(mapToGrid(values)), ...wrong])
}

/** One puzzle, the player's entries, and everything derived from them. */
function useBoard(level) {
  const { puzzle, solution } = useMemo(() => generate(level), [level])
  const [values, setValues] = useState(puzzle)
  const [entered, setEntered] = useState(new Set())
  const [selected, select] = useState("0-0")
  const errors = useMemo(
    () => errorKeys(values, entered, solution),
    [values, entered, solution]
  )

  /** Givens are locked; the player's own entries can be overwritten. */
  const place = digit => {
    if (values.has(selected) && !entered.has(selected)) return
    setValues(prev => new Map(prev).set(selected, digit))
    setEntered(prev => new Set(prev).add(selected))
  }

  const isSolved = values.size === ALL_KEYS.length && errors.size === 0
  return { errors, givens: puzzle, isSolved, place, select, selected, solution, values }
}

/**
 * Adds the reveal toggle on top: it swaps in the solution, mutes the error
 * highlighting and freezes input, without touching what the player has entered.
 * Remount the consumer to start a new game.
 */
export function useGame(level) {
  const board = useBoard(level)
  const [revealed, setRevealed] = useState(false)
  return {
    board: revealed ? board.solution : board.values,
    errors: revealed ? NO_ERRORS : board.errors,
    givens: board.givens,
    isSolved: board.isSolved,
    place: revealed ? ignore : board.place,
    revealed,
    select: board.select,
    selected: board.selected,
    toggleReveal: () => setRevealed(prev => !prev),
  }
}
