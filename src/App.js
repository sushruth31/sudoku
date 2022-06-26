import Grid, { toArr } from "./grid"

const NUM_COLS = 9
const NUM_ROWS = 9

export default function App() {
  return (
    <div className="flex items-center p-4 flex-col justify-center">
      <div className="font-bold text-3xl mb-4">Let's Play Sodoku</div>
      <Grid
        squareSize={80}
        onCellClick={(cellKey, e) => {}}
        numCols={NUM_COLS}
        renderCell={({ cellKey }) => {}}
        numRows={NUM_ROWS}
        borderClassName="border-2 border-black"
        squareClassName={key => {
          let [r, c] = toArr(key)
          return c % 3 === 0
            ? `flex items-center justify-center  border border-[#dadee6] border-l-black`
            : `flex items-center justify-center border border-[#dadee6] `
        }}
      />
    </div>
  )
}
