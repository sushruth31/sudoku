import * as React from "react"
import { useReset } from "."
import Grid, { toArr, toKey } from "./grid"
import NumberDial, { cellKeyToNum } from "./numberDial"
import { getPuzzle } from "./puzzles"

export const NUM_COLS = 9
export const NUM_ROWS = 9

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
  //find keys in box
  getBoxKeys(key).forEach(k => result.add(k))
  result.delete(key)
  return result
}

function getBoxKeys(key) {
  let set = new Set()
  let [boxR, boxC] = toArr(createBoxKey(key))
  boxR *= 3
  boxC *= 3

  for (let r = boxR; r < boxR + 3; r++) {
    for (let c = boxC; c < boxC + 3; c++) {
      let boxKey = toKey([r, c])
      set.add(boxKey)
    }
  }
  return set
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

export function isValidPlacement(grid, row, col, attemptedVal) {
  //repalce 0s with nulls
  //check if attempted val is in same row.
  //check row and col
  let key = toKey([row, col])

  for (let i = 0; i < NUM_COLS; i++) {
    if (grid[row][i] === attemptedVal) {
      return false
    }
  }
  for (let i = 0; i < NUM_ROWS; i++) {
    if (grid[i][col] === attemptedVal) {
      return false
    }
  }
  //get top left corner of box

  for (let k of getBoxKeys(key)) {
    let [boxR, boxC] = toArr(k)
    if (grid[boxR][boxC] === attemptedVal) {
      return false
    }
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
  return remove0sFromMap(map)
}

function shuffle(arr) {
  for (let i = 0; i < arr.length; i++) {
    let randI = randomIntFromInterval(0, arr.length - 1)
    ;[arr[i], arr[randI]] = [arr[randI], arr[i]]
  }

  return arr
}

function rotateArrLeft(arr) {
  let target = Array.from(Array(NUM_ROWS), () => Array.from(Array(NUM_COLS)))
  //0 1 -> 7, 0
  //i, j -> 9 - 1 - j, i
  //0 0 -> 8, 0

  for (let i = 0; i < NUM_ROWS; i++) {
    for (let j = 0; j < NUM_COLS; j++) {
      target[NUM_COLS - 1 - j][i] = arr[i][j]
    }
  }
  return target
}

function pipe(...fns) {
  return initVal => {
    return fns.reduce((acc, fn) => fn(acc), initVal)
  }
}

function getNextSquare(grid) {
  for (let i = 0; i < NUM_ROWS; i++) {
    for (let j = 0; j < NUM_COLS; j++) {
      if (grid[i][j] === 0) {
        return [i, j]
      }
    }
  }
  return [-1, -1]
}

function solve(grid) {
  let [r, c] = getNextSquare(grid)
  if (r === -1) {
    return grid
  }

  for (let n = 1; n <= 9; n++) {
    if (isValidPlacement(grid, r, c, n)) {
      grid[r][c] = n
      solve(grid)
    }
  }

  if (getNextSquare(grid)[0] !== -1) {
    grid[r][c] = 0
  }

  return grid
}

function getRandomNumber(...avoidNumbers) {
  let safe = []
  for (let i = 1; i <= NUM_COLS; i++) {
    if (!avoidNumbers.includes(i)) {
      safe.push(i)
    }
  }
  return randomElFromArr(safe)
}

function remapGrid(grid) {
  //map {2 -> 4 }
  let map = {}

  for (let i = 1; i <= NUM_COLS; i++) {
    //find a number to remap i
    map[i] = getRandomNumber(i, ...Object.values(map).map(Number))
  }

  for (let i = 0; i < NUM_ROWS; i++) {
    for (let j = 0; j < NUM_COLS; j++) {
      if (grid[i][j] === 0) continue
      grid[i][j] = map[grid[i][j]]
    }
  }
  return grid
}

function shuffleGridHorizontal(grid) {
  return [
    ...shuffle(grid.slice(0, 3)),
    ...shuffle(grid.slice(3, 6)),
    ...shuffle(grid.slice(6)),
  ]
}

function rotateGridRight(grid) {
  //r7 -> c1
  let target = Array.from(Array(NUM_ROWS), () => Array.from(Array(NUM_COLS)))
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid.length; c++) {
      target[c][NUM_COLS - r - 1] = grid[r][c]
    }
  }

  return target
}

function shuffleGridVertical(grid) {
  //rotate left
  return pipe(rotateArrLeft, shuffleGridHorizontal, rotateGridRight)(grid)
}

function createFnArray() {
  let fns = [
    rotateArrLeft,
    remapGrid,
    shuffleGridHorizontal,
    rotateGridRight,
    shuffleGridHorizontal,
    shuffleGridVertical,
  ]
  let t = [],
    index = 0
  for (let i = 0; i < 50; i++, ++index) {
    if (index >= fns.length - 1) {
      index = 0
    }
    t.push(fns[index])
  }

  return shuffle(t)
}

function findCountofElInGrid(grid, val) {
  return grid
    .map(row => {
      return row.reduce((acc, cur) => {
        if (cur === val) {
          return ++acc
        }
        return acc
      }, 0)
    })
    .reduce((a, b) => a + b)
}

function generatePuzzle(level) {
  //get input grid and randomize it.
  let puzzle = getPuzzle(level)
  let numZeros = findCountofElInGrid(puzzle, 0)
  //rotate
  //remap numbers
  //shuffle
  puzzle = pipe(...createFnArray())(puzzle)
  let solved = solve(puzzle)
  solved = isFilled(solved) ? arrToMap(solved) : generatePuzzle(level)
  puzzle = recreatePuzzle(mapToGrid(solved), numZeros)
  //recreate the puzzle with the same number of zeros
  return { solved, puzzle }
}

function mapToGrid(map) {
  let t = Array.from(Array(NUM_COLS), () => Array.from(Array(NUM_COLS)))
  for (let i = 0; i < NUM_COLS; i++) {
    for (let j = 0; j < NUM_ROWS; j++) {
      let key = toKey([i, j])
      t[i][j] = map.get(key) ?? 0
    }
  }
  return t
}

function isKeyInGrid(grid, key) {
  let [r, c] = toArr(key)
  return grid[r][c] !== 0
}

function recreatePuzzle(grid, numZeros) {
  let gridOrig = [...grid]

  function getRandomIndexFromGrid() {
    let int1 = randomIntFromInterval(0, NUM_ROWS - 1),
      int2 = randomIntFromInterval(0, NUM_COLS - 1)
    let attempt = toKey([int1, int2])
    if (isKeyInGrid(grid, attempt)) {
      //remove from grid
      grid[int1][int2] = 0
      return attempt
    }
    return getRandomIndexFromGrid()
  }

  let randomKeysForRemoval = Array.from(Array(numZeros), () =>
    getRandomIndexFromGrid()
  )

  for (let key of randomKeysForRemoval) {
    let [r, c] = toArr(key)
    gridOrig[r][c] = 0
  }

  return arrToMap(gridOrig)
}

function isFilled(grid) {
  return grid.every(r => r.every(c => c))
}

function remove0sFromMap(map) {
  map.forEach((v, k) => {
    if (k && !v) {
      map.delete(k)
    }
  })
  return map
}

function gen(level) {
  //bruh
  let attempt
  while (!attempt) {
    try {
      attempt = generatePuzzle(level)
    } catch {
      continue
    }
  }
  return attempt
}

function addToSetImmutable(...vals) {
  return p => {
    let t = new Set(p)
    for (let v of vals) {
      t.add(v)
    }
    return t
  }
}

function findErrorKeys(grid, key, val) {
  let [r, c] = toArr(key)
  let target = new Set()
  for (let i = 0; i < NUM_ROWS; i++) {
    if (grid[r][i] === val) {
      target.add(toKey([r, i]))
    }
  }
  for (let i = 0; i < NUM_ROWS; i++) {
    if (grid[i][c] === val) {
      target.add(toKey([i, c]))
    }
  }

  for (let boxKey of getBoxKeys(key)) {
    let [boxR, boxC] = toArr(boxKey)
    if (grid[boxR][boxC] === val) {
      target.add(toKey(boxR, boxC))
    }
  }
  //add self to target
  target.add(key)
  return target
}

export default function App() {
  let [level, setLevel] = React.useState("easy")
  //todo call async
  let { puzzle, solved } = React.useMemo(() => gen(level), [])
  let [gridValues, setGridValues] = React.useState(puzzle)
  let [selectedSquare, setSelectedSquare] = React.useState("0-0")
  let [highlightedSquares, setHighlightedSquares] = React.useState(new Map()) //key -> color
  let resetApp = useReset()
  let [errorVals, setErrorVals] = React.useState(new Set())
  let [userEnteredVals, setUserEnteredVals] = React.useState(new Set())

  function triggerHighlightSquares(val, map = new Map(highlightedSquares)) {
    gridValues.forEach((v, k) => {
      if (v === val) {
        map.set(k, "#bbd1e7")
      }
    })
    setHighlightedSquares(map)
  }

  return (
    <div className="flex items-center p-4 flex-col justify-center">
      <div className="font-bold text-3xl mb-4">Let's Play Sodoku</div>
      <div className="flex items-center">
        <button
          onClick={() => setGridValues(p => (p === puzzle ? solved : puzzle))}
          className="p-2 rounded bg-blue-400 text-white m-2"
        >
          Show Solution
        </button>
        <button
          onClick={resetApp}
          className="p-2 rounded bg-blue-400 text-white m-2"
        >
          New Game
        </button>
      </div>
      <div className="flex w-full items-end justify-center">
        <Grid
          squareSize={80}
          onCellClick={(key, e) => {
            let map = new Map()
            setSelectedSquare(key)
            for (let k of calcuateHighlightedSquares(key)) {
              map.set(k, "#dee8f1")
            }
            //deterimine which keys of same value to highlight
            triggerHighlightSquares(gridValues.get(key), map)
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
                      : errorVals.has(cellKey)
                      ? "red"
                      : highlightedSquares.get(cellKey),
                }}
                className="text-5xl w-full h-full flex items-center justify-center"
              >
                <div
                  style={{
                    color: userEnteredVals.has(cellKey) ? "blue" : "black",
                  }}
                >
                  {val}
                </div>
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
        <NumberDial
          onCellClick={numDialCellKey => {
            if (!selectedSquare || gridValues.get(selectedSquare)) {
              return
            }
            //set grid values
            let num = cellKeyToNum(numDialCellKey)
            let [r, c] = toArr(selectedSquare)
            let grid = mapToGrid(gridValues)
            //highlight red if not a valid placement
            if (
              solved.get(selectedSquare) !== num ||
              !isValidPlacement(grid, r, c, num)
            ) {
              //set error vals
              setErrorVals(
                addToSetImmutable(...findErrorKeys(grid, selectedSquare, num))
              )
            }
            setGridValues(p => {
              return new Map(p).set(selectedSquare, num)
            })
            setUserEnteredVals(addToSetImmutable(selectedSquare))
            //highlight all the same numbers
            triggerHighlightSquares(num)
          }}
        />
      </div>
    </div>
  )
}
