import { toKey } from "../sudoku/coords"

const resolve = (value, key) => (typeof value === "function" ? value(key) : value)

function Cell({ cellKey, cellSize, cellClassName, cellStyle, cellLabel, onCellClick, renderCell }) {
  return (
    <button
      aria-label={cellLabel(cellKey)}
      className={resolve(cellClassName, cellKey)}
      onClick={() => onCellClick(cellKey)}
      style={{ width: cellSize, height: cellSize, ...resolve(cellStyle, cellKey) }}
      type="button"
    >
      {renderCell(cellKey)}
    </button>
  )
}

function Row({ row, cols, ...cell }) {
  const keys = Array.from({ length: cols }, (_, col) => toKey([row, col]))
  return (
    <div className="flex">
      {keys.map(key => (
        <Cell cellKey={key} key={key} {...cell} />
      ))}
    </div>
  )
}

/**
 * A generic rows x cols board of keyed cells, shared by the sudoku grid and the
 * number dial. Cells are real buttons rather than clickable divs, so they are
 * reachable by keyboard and carry an accessible name.
 */
export function Grid({ rows, className, ...cell }) {
  return (
    <div className={className}>
      {Array.from({ length: rows }, (_, row) => (
        <Row key={row} row={row} {...cell} />
      ))}
    </div>
  )
}
