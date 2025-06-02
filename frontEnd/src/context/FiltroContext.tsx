import React, { createContext, useContext, useState } from "react";

interface FiltroState {
  biome: string;
  state: string;
  startDate: string;
  endDate: string;
  tipoFiltro: string;
}

interface FiltroContextProps {
  filtro: FiltroState;
  setFiltro: React.Dispatch<React.SetStateAction<FiltroState>>;
  appliedFiltro: FiltroState;
  aplicarFiltros: () => void;
  resetarFiltros: () => void;
}

const endDate = new Date();
const startDate = new Date(endDate);
startDate.setDate(endDate.getDate() - 31);

const defaultFiltro: FiltroState = {
  biome: "",
  state: "DISTRITO FEDERAL",
  startDate: startDate.toISOString().split("T")[0], 
  endDate: endDate.toISOString().split("T")[0], 
  tipoFiltro: "heatRisk"
  
};

const FiltroContext = createContext<FiltroContextProps | undefined>(undefined);

export const FiltroProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filtro, setFiltro] = useState<FiltroState>(defaultFiltro);
  const [appliedFiltro, setAppliedFiltro] = useState<FiltroState>(defaultFiltro);

  const aplicarFiltros = () => {
    setAppliedFiltro(filtro); // 
  };

  const resetarFiltros = () => {
    setFiltro(defaultFiltro); // 
    setAppliedFiltro(defaultFiltro); // 
  };

  return (
    <FiltroContext.Provider value={{ filtro, setFiltro, appliedFiltro, aplicarFiltros, resetarFiltros }}>
      {children}
    </FiltroContext.Provider>
  );
};

export const useFiltro = () => {
  const context = useContext(FiltroContext);
  if (!context) {
    throw new Error("useFiltro deve ser usado dentro de um FiltroProvider");
  }
  return context;
};
