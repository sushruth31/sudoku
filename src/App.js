import { useState } from "react"
import { Board } from "./components/Board"
import { Controls, RevealButton } from "./components/Controls"
import { NumberDial } from "./components/NumberDial"
import { DEFAULT_LEVEL } from "./config"
import { useGame } from "./useGame"

function Game({ level }) {
  const game = useGame(level)
  return (
    <>
      <RevealButton onToggle={game.toggleReveal} revealed={game.revealed} />
      <div className="flex items-end gap-6">
        <Board
          errors={game.errors}
          givens={game.givens}
          onSelect={game.select}
          selected={game.selected}
          values={game.board}
        />
        <NumberDial onPick={game.place} />
      </div>
      <p className="h-6 text-lg text-green-700">{game.isSolved ? "Solved." : ""}</p>
    </>
  )
}

/**
 * `level` and `round` form the key of <Game>, so changing difficulty or asking
 * for a new game remounts it. That is the whole reset mechanism: no effect has
 * to reconcile a fresh puzzle with stale entries, because there is no stale
 * state left to reconcile.
 */
export default function App() {
  const [level, setLevel] = useState(DEFAULT_LEVEL)
  const [round, setRound] = useState(0)
  return (
    <main className="flex flex-col items-center gap-4 p-6">
      <h1 className="text-3xl font-bold">Sudoku</h1>
      <Controls
        level={level}
        onLevelChange={setLevel}
        onNewGame={() => setRound(n => n + 1)}
      />
      <Game key={`${level}-${round}`} level={level} />
    </main>
  )
}
