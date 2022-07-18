import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"

const root = ReactDOM.createRoot(document.getElementById("root"))
const AppContext = React.createContext()

function AppProvider({ children }) {
  const [key, setKey] = React.useState(0)
  const resetApp = () => setKey((p) => p + 1)
  return (
    <AppContext.Provider value={{ resetApp }}>
      <React.Fragment key={key}>{children}</React.Fragment>
    </AppContext.Provider>
  )
}
export function useReset() {
  return React.useContext(AppContext).resetApp
}

root.render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
)
