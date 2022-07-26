export const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min

export const randomElement = arr => arr[randomInt(0, arr.length - 1)]

/**
 * Fisher-Yates. Swapping element i with an index drawn from the *whole* array
 * is the classic biased variant, so the draw is restricted to [0, i].
 */
export function shuffle(arr) {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = randomInt(0, i)
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}
