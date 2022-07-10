import {
  arrToMap,
  isValidPlacement,
  randomElFromArr,
  randomIntFromInterval,
} from "./App"
import Grid, { toKey } from "./grid"

const puzzles = {
  easy: [
    [
      ["2", "3", "0", "9", "4", "0", "6", "7", "0"],
      ["8", "0", "0", "3", "2", "5", "9", "1", "4"],
      ["9", "0", "0", "7", "6", "0", "3", "2", "0"],
      ["1", "0", "0", "0", "0", "0", "7", "9", "2"],
      ["5", "0", "3", "2", "1", "0", "4", "8", "6"],
      ["4", "0", "0", "6", "8", "0", "5", "3", "1"],
      ["7", "0", "0", "1", "0", "0", "0", "0", "9"],
      ["6", "5", "9", "8", "7", "2", "1", "4", "3"],
      ["3", "0", "0", "0", "9", "0", "0", "0", "7"],
    ],

    [
      [3, 1, 6, 5, 7, 8, 4, 9, 2],
      [5, 2, 9, 1, 3, 4, 7, 6, 8],
      [4, 8, 7, 6, 2, 9, 5, 3, 1],
      [2, 6, 3, 0, 1, 5, 9, 8, 7],
      [9, 7, 4, 8, 6, 0, 1, 2, 5],
      [8, 5, 1, 7, 9, 2, 6, 4, 3],
      [1, 3, 8, 0, 4, 7, 2, 0, 6],
      [6, 9, 2, 3, 5, 1, 8, 7, 4],
      [7, 4, 5, 0, 8, 6, 3, 1, 0],
    ],

    [
      [0, 0, 0, 4, 1, 6, 0, 2, 7],
      [2, 0, 6, 8, 5, 7, 0, 3, 1],
      [0, 1, 7, 0, 9, 3, 0, 5, 8],
      [5, 6, 9, 1, 3, 4, 7, 0, 2],
      [0, 0, 3, 0, 0, 8, 5, 4, 9],
      [0, 0, 8, 5, 2, 9, 1, 6, 3],
      [6, 0, 2, 7, 8, 0, 0, 9, 0],
      [9, 8, 1, 0, 4, 5, 0, 7, 6],
      [3, 7, 4, 9, 6, 2, 8, 1, 0],
    ],
  ],
}
export function getPuzzle(level) {
  level = level.toLowerCase()
  let gridAttempt = randomElFromArr(puzzles[level]).map(row => row.map(Number))
  let map = arrToMap(gridAttempt)
  map.forEach((v, k) => {
    if (!v) {
      map.delete(k)
    }
  })
  for (let i = 0; i < gridAttempt.length; i++) {
    let row = gridAttempt[i]
    for (let j = 0; j < row.length; j++) {
      let key = toKey([i, j])
      let val = row[j]
      if (!val) continue
      if (!isValidPlacement(map, key, val)) {
        throw Error(`bad data ${key}`)
      }
    }
  }
  return gridAttempt
}
