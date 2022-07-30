import { LEVELS } from "../sudoku/generator"

const BUTTON = "rounded bg-blue-500 px-3 py-2 text-white hover:bg-blue-600"

export const RevealButton = ({ revealed, onToggle }) => (
  <button className={BUTTON} onClick={onToggle} type="button">
    {revealed ? "Hide solution" : "Show solution"}
  </button>
)

function DifficultySelect({ level, onLevelChange }) {
  return (
    <select
      aria-label="Difficulty"
      className="rounded border border-slate-300 px-3 py-2"
      onChange={event => onLevelChange(event.target.value)}
      value={level}
    >
      {LEVELS.map(name => (
        <option key={name} value={name}>
          {name}
        </option>
      ))}
    </select>
  )
}

export function Controls({ level, onLevelChange, onNewGame }) {
  return (
    <div className="flex items-center gap-2">
      <DifficultySelect level={level} onLevelChange={onLevelChange} />
      <button className={BUTTON} onClick={onNewGame} type="button">
        New game
      </button>
    </div>
  )
}
