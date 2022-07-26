/**
 * Cell addressing. A cell key is the string "<row>-<col>", which lets the board
 * live in a plain Map and be compared with ===, unlike a [row, col] tuple.
 */
export const SIZE = 9
export const BOX = 3

export const toKey = ([row, col]) => `${row}-${col}`

export const toArr = key => key.split("-").map(Number)

export const ALL_KEYS = Array.from({ length: SIZE * SIZE }, (_, i) =>
  toKey([Math.floor(i / SIZE), i % SIZE])
)

/** The nine keys of the 3x3 box containing `key`, including `key` itself. */
export function boxKeys(key) {
  const [row, col] = toArr(key)
  const top = row - (row % BOX)
  const left = col - (col % BOX)
  return Array.from({ length: SIZE }, (_, i) =>
    toKey([top + Math.floor(i / BOX), left + (i % BOX)])
  )
}

/** The 20 cells that constrain `key`: its row, its column and its box. */
export function peerKeys(key) {
  const [row, col] = toArr(key)
  const lines = Array.from({ length: SIZE }, (_, i) => [
    toKey([row, i]),
    toKey([i, col]),
  ])
  const peers = new Set([...lines.flat(), ...boxKeys(key)])
  peers.delete(key)
  return peers
}
