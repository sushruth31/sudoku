import { useMemo, useState } from "react"
import Grid, { toArr, toKey } from "./grid"
import { getPuzzle } from "./puzzles"

export const NUM_COLS = 9
export const NUM_ROWS = 9

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

export function isValidPlacement(grid, key, attemptedVal) {
  //repalce 0s with nulls
  //check if attempted val is in same row.
  let [row, col] = toArr(key)
  grid.delete(key)
  //check row
  if (
    [...grid]
      .filter(([k, v]) => {
        let [r] = toArr(k)
        return r === row
      })
      .some(([k, v]) => v === attemptedVal)
  ) {
    return false
  }

  if (
    [...grid]
      .filter(([k, v]) => {
        let [_, c] = toArr(k)
        return c === col
      })
      .some(([k, v]) => v === attemptedVal)
  ) {
    return false
  }

  //  same box check
  for (let boxKey of findKeysInBox(key, createBoxKey(key))) {
    if (grid.get(boxKey) === attemptedVal) return false
  }

  return true
}

export function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function randomElFromArr(arr) {
  return arr[randomIntFromInterval(0, arr.length - 1)]
}

export function arrToMap(a) {
  let map = new Map()
  for (let i = 0; i < NUM_ROWS; i++) {
    let row = a[i]
    for (let j = 0; j < NUM_COLS; j++) {
      let val = row[j]
      let key = toKey([i, j])
      map.set(key, val)
    }
  }
  return map
}

function shuffle(arr) {
  for (let i = 0; i < arr.length; i++) {
    let randI = randomIntFromInterval(0, arr.length - 1)
    ;[arr[i], arr[randI]] = [arr[randI], arr[i]]
  }

  return arr
}

function rotateArr(arr) {}

function generateGrid(level) {
  //get input grid and randomize it.
  let grid = arrToMap(getPuzzle(level))
  //rotate
  //remap numbers
  //shuffle
  function solve() {
    for (let i = 0; i < NUM_ROWS; i++) {
      for (let j = 0; j < NUM_COLS; j++) {
        let key = toKey([i, j])
        if (grid.get(key) > 0) continue
        for (let n = 1; n < 10; n++) {
          if (isValidPlacement(grid, key, n)) {
            console.log(grid)
            grid.set(key, n)
            solve()
            grid.set(key, 0)
          }
        }
        return
      }
    }
  }

  solve()
  console.log(grid)
  //remove values at random and do a check if valid before returning

  return grid
}

export default function App() {
  let [level, setLevel] = useState("easy")
  let [gridValues, setGridValues] = useState(() => generateGrid(level))
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
            if (v && v === gridValues.get(key)) {
              map.set(k, "#bb81e7")
            }
          })

          setHighlightedSquares(map)
        }}
        numCols={NUM_COLS}
        renderCell={({ cellKey }) => {
          let val = gridValues.get(cellKey)
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
              {!!val && val}
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
