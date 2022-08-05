# Sudoku — a playable board whose generator proves every puzzle has one answer

A React sudoku game, written to get the generator right rather than the graphics.
The interesting part is not the UI: it is that every board is carved out of a
solved grid one cell at a time, and a removal is only kept while a bounded solution
count still returns exactly one. That guarantee is what lets the game mark a cell wrong
the moment you enter it, instead of waiting for the board to fill up.

[![CI](https://github.com/sushruth31/sudoku/actions/workflows/ci.yml/badge.svg)](https://github.com/sushruth31/sudoku/actions/workflows/ci.yml)

## Stack

- **React 18** — function components and hooks; no state library, the game state is one
  custom hook.
- **Create React App 5** — zero config for a project this size. It detects
  `tailwind.config.js` and wires Tailwind into its PostCSS chain automatically, so there
  is no `postcss.config.js` and no CRACO.
- **Tailwind CSS 3** for layout. Cell borders and highlight colours are inline styles,
  not utilities — they are computed per cell from the board state, and inline styles
  avoid relying on Tailwind's utility ordering for the thick box rules.
- **Jest**, via `react-scripts test`, with **React Testing Library** for the handful of
  tests that mount the app.

## Running it

```bash
npm install
npm start                     # http://localhost:3000
npm test                      # 64 tests, one pass, no watcher
npm run lint
npm run build                 # production bundle in build/
```

Configuration is optional. To change the difficulty the board opens on:

```bash
cp .env.example .env.local    # .env.local is git-ignored
# REACT_APP_DEFAULT_DIFFICULTY=easy | medium | hard
```

An unrecognised value throws at startup naming the variable, rather than quietly
falling back — see `src/config.js`.

## Architecture

Pure rules live under `src/sudoku/` and know nothing about React. The components read
state and render; they contain no sudoku logic.

```
seeds.js ─▶ solver.solve ─▶ generator.scramble ─▶ generator.carve ─▶ { puzzle, solution }
                                                        │
                                                        └─▶ solver.countSolutions(g, 2)

App ──key={level}-{round}──▶ Game ──▶ useGame(level) ──▶ { board, errors, place, … }
                                                            │
                                                            ├─▶ Board      (9×9 Grid)
                                                            └─▶ NumberDial (3×3 Grid)
```

| Module | Responsibility |
| --- | --- |
| `src/sudoku/coords.js` | Cell-key encoding, box membership, the 20 peers of a cell |
| `src/sudoku/board.js` | Conversions between the array grid and the sparse map |
| `src/sudoku/rules.js` | Placement legality and conflict detection |
| `src/sudoku/solver.js` | Backtracking search and bounded solution counting |
| `src/sudoku/generator.js` | Symmetry transforms and uniqueness-checked carving |
| `src/sudoku/seeds.js` | Two starting grids, asserted solvable by the suite |
| `src/config.js` | Environment validation, run once at import |
| `src/useGame.js` | All state for one board, as a hook |
| `src/components/` | Rendering only: a generic `Grid`, the `Board`, the dial, controls |

## Design notes

- **Uniqueness is enforced, not hoped for.** `carve` walks the 81 cells in random order,
  blanks one, and keeps the blank only if `countSolutions(grid, 2) === 1`, otherwise it
  puts the digit back. Blanking N random cells — the obvious approach — routinely yields
  boards with several valid answers, which makes "that digit is wrong" a lie. The cost is
  81 searches per board, each abandoned as soon as a second solution appears.

- **Two solver changes, and the numbers that justified them.** Generating a 54-blank
  *hard* board, measured over 60 boards on Node 20:

  | Search | mean | p95 | max |
  | --- | --- | --- | --- |
  | First blank in scan order | ~1740 ms | — | — |
  | Minimum-remaining-values, rules re-checked per node | 232 ms | 619 ms | 1533 ms |
  | Minimum-remaining-values, incremental bitmasks | **37 ms** | **73 ms** | **129 ms** |

  Branching on the blank with the fewest candidates instead of the first one collapses
  the tree, but scoring all 81 cells at every node re-derived the same row/column/box
  information over and over — around 310,000 candidate evaluations per hard board. The
  fix is to carry three arrays of 9-bit masks down the search: a candidate set becomes
  `~(row | col | box)`, and placing or retracting a digit is three XORs. The mean matters
  less than the tail here — a 1.5-second worst case is a visible freeze on a click.
  Worst case is still O(9^b) in the blank count b; the heuristic and the masks only move
  the constant and the practical branching factor.

- **Two board representations, each where it is cheapest.** The solver uses
  `number[9][9]` plus those masks, because index arithmetic beats allocating twenty
  peer-key strings per check. React uses a `Map<"r-c", digit>` holding only filled cells,
  because an immutable update is then `new Map(prev).set(key, digit)` and `map.has(key)`
  already means "this cell is filled". `board.js` owns the conversion, and `rules.js`
  keeps the readable form of the constraint for the UI and the tests.

- **Error highlighting is derived, never accumulated.** The natural implementation adds
  offending cells to a `Set` in state as they are entered — and then a cell you have
  since corrected stays red forever, because nothing ever removes it. `errorKeys` instead
  recomputes the whole set from the board on each render, so the flag disappears the
  moment the mistake does. Same reasoning removed the stored highlight map.

- **Resetting by remount, not by effect.** `<Game>` is keyed on `${level}-${round}`, so
  a new game or a difficulty change throws the component away and rebuilds it. The
  alternative — a `useEffect` that notices the puzzle changed and clears four pieces of
  state — is where stale-entry bugs live. The previous version reset by re-keying a
  provider from a React context, which worked but coupled `App` and `index.js` in a
  circular import.

- **Two silent generator bugs, fixed.** The shuffle swapped element *i* with an index
  drawn from the whole array, the classic biased variant; it is now Fisher-Yates over
  `[0, i]`. And digit relabelling used to pick a derangement one digit at a time, which
  can reach a state with no legal digit left — the old code hid this behind a
  `while (!attempt) { try … catch { continue } }` retry loop. Relabelling through a
  single random permutation of 1–9 cannot fail, and the retry loop is gone.

## Tests

`npm test` — 64 tests across 9 suites, a few seconds. The suite targets the rules, not
the pixels:

- **Constraints** — a digit is rejected for its row, its column, and for its box alone;
  a filled cell's own value is not counted as a conflict with itself.
- **Conflicts** — both members of a duplicated pair are flagged, not just the newer one,
  and the flag clears when the duplicate is corrected.
- **Solver** — every seed solves to a complete, conflict-free grid with its givens
  intact; the input grid is not mutated; a blank with no legal candidate returns `null`.
- **Solution counting** — a completed grid counts 1, a grid with one blank counts 1
  because the digit is forced, an empty grid reaches the cap of 2, and the cap is
  actually honoured.
- **Transforms** — rotation is order four, band shuffling never moves a row out of its
  band of three, relabelling preserves blanks and remains conflict-free.
- **Carving** — hits the requested blank count, only ever removes givens, and the result
  always has exactly one solution.
- **Shuffle** — a permutation of the input, non-mutating, and able to move the final
  element (which the biased variant under-shuffles).
- **Config** — each valid level is accepted, a bad one throws with the variable named.
- **UI** — 81 cells render, a dial digit lands in the selected cell, a given refuses to
  be overwritten, and revealing the solution fills the board and then restores it.
