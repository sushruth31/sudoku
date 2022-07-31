import { fireEvent, render, screen } from "@testing-library/react"
import App from "./App"
import { ALL_KEYS } from "./sudoku/coords"

const cells = () => ALL_KEYS.map(key => screen.getByLabelText(`cell ${key}`))
const find = predicate => cells().find(predicate)

describe("<App />", () => {
  it("renders one button per cell of the board", () => {
    render(<App />)
    expect(cells()).toHaveLength(81)
  })

  it("writes the digit picked on the dial into the selected cell", () => {
    render(<App />)
    const blank = find(cell => cell.textContent === "")
    fireEvent.click(blank)
    fireEvent.click(screen.getByLabelText("digit 7"))
    expect(blank).toHaveTextContent("7")
  })

  it("refuses to overwrite a given", () => {
    render(<App />)
    const given = find(cell => cell.textContent !== "")
    const digit = Number(given.textContent) === 7 ? 4 : 7
    fireEvent.click(given)
    fireEvent.click(screen.getByLabelText(`digit ${digit}`))
    expect(given).not.toHaveTextContent(String(digit))
  })

  it("fills every cell when the solution is revealed", () => {
    render(<App />)
    fireEvent.click(screen.getByText("Show solution"))
    expect(find(cell => cell.textContent === "")).toBeUndefined()
  })

  it("hides the solution again and restores the player's board", () => {
    render(<App />)
    fireEvent.click(screen.getByText("Show solution"))
    fireEvent.click(screen.getByText("Hide solution"))
    expect(find(cell => cell.textContent === "")).toBeDefined()
  })
})
