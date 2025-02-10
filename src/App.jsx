import { HashRouter, Route, Routes } from "react-router-dom"
import URLShortener from "./components/URLShortener"
import ShortURL from "./components/ShortURL";

function App() {

  return (
    <HashRouter basename="/urlshort">
     <Routes>
      <Route path="/" element={<URLShortener />} />
      <Route path="/:url" element={<ShortURL />}/>
     </Routes>
    </HashRouter>
  )
}

export default App
