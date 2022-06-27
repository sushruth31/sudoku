import { useState } from "react"
import Grid, { toArr, toKey } from "./grid"

const NUM_COLS = 9
const NUM_ROWS = 9

function calcuateHighlightedSquares(key) {
  //return arr of highlighted row keys highluighted column keys and highlughted box keys
  let result = new Set()
  let [r, c] = toArr(key)
  //1-5 -> 1-0, 1-1, 1-2...
  for (let i = 0; i < NUM_COLS; ++i) {
    //add row keys
    result.add(toKey([r, i]))
    //add col keys
    result.add(toKey([i, c]))
  }
  return result
}

export default function App() {
  let [gridValues, setGridValues] = useState(new Map([["0-0", 5]]))
  let [selectedSquare, setSelectedSquare] = useState("0-0")
  console.log(gridValues)
  let [highlightedSquares, setHighlightedSquares] = useState(new Set())

  return (
    <div className="flex items-center p-4 flex-col justify-center">
      <div className="font-bold text-3xl mb-4">Let's Play Sodoku</div>
      <Grid
        squareSize={80}
        onCellClick={(key, e) => {
          setSelectedSquare(key)
          setHighlightedSquares(calcuateHighlightedSquares(key))
        }}
        numCols={NUM_COLS}
        renderCell={({ cellKey }) => {
          return (
            <div
              style={{
                backgroundColor:
                  selectedSquare === cellKey
                    ? "#b3d9fa"
                    : highlightedSquares.has(cellKey)
                    ? "#dee8f1"
                    : "transparent",
              }}
              className="text-5xl w-full h-full flex items-center justify-center"
            >
              {gridValues.get(cellKey)}
            </div>
          )
        }}
        numRows={NUM_ROWS}
        borderClassName="border-2 border-black"
        squareClassName={key => {
          let [r, c] = toArr(key)
          return c % 3 === 0 && r % 3 === 0
            ? `flex items-center justify-center border-t-black border-2 border-[#dadee6] border-l-black`
            : c % 3 === 0
            ? `flex items-center justify-center  border-2 border-[#dadee6] border-l-black`
            : r % 3 === 0
            ? `flex items-center justify-center  border-2 border-[#dadee6] border-t-black`
            : `flex items-center justify-center border border-[#dadee6] `
        }}
      />
    </div>
  )
}
