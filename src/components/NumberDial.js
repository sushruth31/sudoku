import { BOX, toArr } from "../sudoku/coords"
import { Grid } from "./Grid"

/** The dial is a 3x3 board reusing the same key scheme: "0-0" is 1, "2-2" is 9. */
export const cellKeyToDigit = key => {
  const [row, col] = toArr(key)
  return row * BOX + col + 1
}

export function NumberDial({ onPick }) {
  return (
    <Grid
      cellClassName="flex items-center justify-center text-2xl border border-slate-300 bg-white hover:bg-slate-100"
      cellLabel={key => `digit ${cellKeyToDigit(key)}`}
      cellSize={48}
      cols={BOX}
      onCellClick={key => onPick(cellKeyToDigit(key))}
      renderCell={cellKeyToDigit}
      rows={BOX}
    />
  )
}
