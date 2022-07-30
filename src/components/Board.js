import { SIZE, peerKeys, toArr } from "../sudoku/coords"
import { Grid } from "./Grid"

const CELL_SIZE = 56
const HEAVY = "2px solid #0f172a"
const LIGHT = "1px solid #cbd5e1"

/** Box edges get the thick rule; the outer frame closes the last row/column. */
const borderStyle = key => {
  const [row, col] = toArr(key)
  return {
    borderTop: row % 3 === 0 ? HEAVY : LIGHT,
    borderLeft: col % 3 === 0 ? HEAVY : LIGHT,
    borderBottom: row === SIZE - 1 ? HEAVY : LIGHT,
    borderRight: col === SIZE - 1 ? HEAVY : LIGHT,
  }
}

/** First match wins, so an error is never masked by a highlight. */
const background = ({ selected, error, sameDigit, peer }) => {
  if (selected) return "#b3d9fa"
  if (error) return "#f7a8a8"
  if (sameDigit) return "#bbd1e7"
  if (peer) return "#dee8f1"
  return "#ffffff"
}

const cellStyleFor = ({ values, selected, errors }) => {
  const peers = peerKeys(selected)
  const active = values.get(selected)
  return key => ({
    backgroundColor: background({
      selected: key === selected,
      error: errors.has(key),
      sameDigit: Boolean(active) && values.get(key) === active,
      peer: peers.has(key),
    }),
    ...borderStyle(key),
  })
}

const digitFor = (values, givens) => key => (
  <span className={givens.has(key) ? "text-slate-900" : "text-blue-600"}>
    {values.get(key) ?? ""}
  </span>
)

export function Board({ values, givens, selected, errors, onSelect }) {
  return (
    <Grid
      cellClassName="flex items-center justify-center text-3xl"
      cellLabel={key => `cell ${key}`}
      cellSize={CELL_SIZE}
      cellStyle={cellStyleFor({ values, selected, errors })}
      cols={SIZE}
      onCellClick={onSelect}
      renderCell={digitFor(values, givens)}
      rows={SIZE}
    />
  )
}
