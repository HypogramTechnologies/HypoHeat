import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter} from "react-router-dom";
import { CSSProperties } from "react";
import Rotas from './routes/Rotas';
import "./index.css";
const containerStyle: CSSProperties = {
  display: "flex",
  height: "100vh",
  width: "100vw",
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div style={containerStyle}>
      <BrowserRouter>
        <Rotas />
      </BrowserRouter>
    </div>
      
  </StrictMode>
);

