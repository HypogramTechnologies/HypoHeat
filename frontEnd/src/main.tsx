import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
//import App from "./App.tsx";
import Filtro from "./components/Filtro";
import { FiltroProvider } from "./context/FiltroContext";

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

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FiltroProvider>
      <Filtro biomes={biomes} states={states} />
    </FiltroProvider>
  </StrictMode>
);
