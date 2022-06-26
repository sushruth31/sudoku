import { forwardRef, useReducer, useRef } from "react"

export function toKey(arr) {
  return arr[0] + "-" + arr[1]
}

export function toArr(key) {
  return key.split("-").map(Number)
}

export default function Grid({
  onCellClick = () => {},
  squareClassName,
  numRows,
  numCols,
  squareSize,
  borderClassName,
  renderCell: RenderCell = () => null,
  ...props
}) {
  return (
    <div {...props} className={borderClassName}>
      {Array.from(Array(numRows)).map((_, rowI) => {
        return (
          <div className="flex" key={rowI}>
            {Array.from(Array(numCols)).map((_, colI) => {
              let cellKey = toKey([rowI, colI])
              return (
                <div
                  onClick={e => onCellClick(cellKey, e)}
                  style={{ width: squareSize, height: squareSize }}
                  className={
                    typeof squareClassName === "function"
                      ? squareClassName(cellKey)
                      : squareClassName
                  }
                  key={colI}
                >
                  <RenderCell cellKey={cellKey} colI={colI} rowI={rowI} />
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
