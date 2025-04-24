import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
//import App from "./App.tsx";
import Filtro from "./components/Filtro";
import Mapa from "./components/Mapa"
import { FiltroProvider } from "./context/FiltroContext";
import { CSSProperties } from "react";

const biomes = [
  "Amazônia",
  "Cerrado",
  "Caatinga",
  "Mata Atlântica",
  "Pampa",
  "Pantanal",
];
const states = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];


const containerStyle: CSSProperties = {
  display: 'flex',
  height: '100vh',
};

const filtroStyle: CSSProperties = {
  width: '300px',
  backgroundColor: '#1e1e1e',
  padding: '16px',
  overflowY: 'auto',
  color: 'white',
};

const mapaWrapperStyle: CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
};

const mapaStyle: CSSProperties = {
  flex: 1,
  width: '100%',
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FiltroProvider>
      <div style={containerStyle}>
        <div style={filtroStyle}>
          <Filtro biomes={biomes} states={states} />
        </div>
          <Mapa />
      </div>
    </FiltroProvider>
  </StrictMode>
);

