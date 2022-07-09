import { useState } from "react"
import Grid, { toArr, toKey } from "./grid"

const NUM_COLS = 9
const NUM_ROWS = 9

function isInBox(key, boxKey) {
  let [boxR1, boxC1] = toArr(boxKey)
  let [boxR, boxC] = toArr(createBoxKey(key))
  return boxR1 === boxR && boxC1 === boxC
}

function isInGrid(key) {
  let [r, c] = toArr(key)
  return r >= 0 && r < NUM_ROWS && c >= 0 && c < NUM_COLS
}

function findKeysInBox(key, boxKey, set = new Set()) {
  if (!isInBox(key, boxKey) || !isInGrid(key) || set.has(key)) {
    return set
  }
  let [r, c] = toArr(key)
  set.add(key)

  return new Set([
    ...findKeysInBox(toKey([r - 1, c]), boxKey, set),
    ...findKeysInBox(toKey([r + 1, c]), boxKey, set),
    ...findKeysInBox(toKey([r, c + 1]), boxKey, set),
    ...findKeysInBox(toKey([r, c - 1]), boxKey, set),
  ])

  //find box key
  //go left right up down recursively until key is not in box
}

function calcuateHighlightedSquares(key) {
  //return arr of highlighted row keys highluighted column keys and highlughted box keys
  let result = new Set()
  let [r, c] = toArr(key)
  let boxR = Math.floor(r / 3)
  let colR = Math.floor(c / 3)
  let boxKey = toKey([boxR, colR])
  //1-5 -> 1-0, 1-1, 1-2...
  for (let i = 0; i < NUM_COLS; ++i) {
    //add row keys
    result.add(toKey([r, i]))
    //add col keys
    result.add(toKey([i, c]))
    //find keys in box
    //3-2
    //box 2-0 -> find keys
  }
  for (let boxKeys of findKeysInBox(key, boxKey)) {
    result.add(boxKeys)
  }
  result.delete(key)
  return result
}

function coinToss() {
  return Math.random() >= 0.5
}

function createBoxKey(key) {
  let [r, c] = toArr(key)
  let boxR = Math.floor(r / 3)
  let boxC = Math.floor(c / 3)
  return toKey([boxR, boxC])
}

function isValidPlacement(grid, key, attemptedVal) {
  //check if attempted val is in same row.
  let [row, col] = toArr(key)
  if (
    [...grid].some(([k, v]) => {
      let [r] = toArr(k)
      if (r === row) {
        return v === attemptedVal
      }
    })
  ) {
    return false
  }

  //column check
  if (
    [...grid].some(([k, v]) => {
      let [_, c] = toArr(k)
      if (c === col) {
        return v === attemptedVal
      }
    })
  ) {
    return false
  }

  //same box check
  for (let boxKey of findKeysInBox(key, createBoxKey(key))) {
    if (grid.get(boxKey) === attemptedVal) return false
  }

  return true
}

function initGrid() {
  //return map '0-0' -> 5 (val)
  let grid = new Map()
  for (let i = 0; i < NUM_ROWS; i++) {
    for (let j = 0; j < NUM_COLS; j++) {
      let key = toKey([i, j])
      let attemptedVal = Math.floor(Math.random() * 10)
      if (coinToss() && isValidPlacement(grid, key, attemptedVal)) {
        grid.set(key, attemptedVal)
      }
    }
  }
  return grid
}

export default function App() {
  let [gridValues, setGridValues] = useState(initGrid)
  let [selectedSquare, setSelectedSquare] = useState("0-0")
  let [highlightedSquares, setHighlightedSquares] = useState(new Map()) //key -> color

  return (
    <div className="flex items-center p-4 flex-col justify-center">
      <div className="font-bold text-3xl mb-4">Let's Play Sodoku</div>
      <Grid
        squareSize={80}
        onCellClick={(key, e) => {
          let map = new Map()
          setSelectedSquare(key)
          for (let k of calcuateHighlightedSquares(key)) {
            map.set(k, "#dee8f1")
          }
          //deterimine which keys of same value to highlight
          gridValues.forEach((v, k) => {
            if (v === gridValues.get(key)) {
              map.set(k, "#bb81e7")
            }
          })

          setHighlightedSquares(map)
        }}
        numCols={NUM_COLS}
        renderCell={({ cellKey }) => {
          return (
            <div
              style={{
                backgroundColor:
                  selectedSquare === cellKey
                    ? "#b3d9fa"
                    : highlightedSquares.get(cellKey),
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
