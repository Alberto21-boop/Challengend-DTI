import { BrowserRouter } from "react-router-dom";

import "./global.css";
import { Router } from "./components/Router";

export function App() {

  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  )
}

