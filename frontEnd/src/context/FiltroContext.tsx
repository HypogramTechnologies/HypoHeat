import React, { createContext, useContext, useState } from "react";

interface FiltroState {
  biome: string;
  state: string;
  startDate: string;
  endDate: string;
  burnedAreas: boolean;
  heatSpots: boolean;
  heatRisk: boolean;
}

interface FiltroContextProps {
  filtro: FiltroState;
  setFiltro: React.Dispatch<React.SetStateAction<FiltroState>>;
  appliedFiltro: FiltroState;
  aplicarFiltros: () => void;
  resetarFiltros: () => void;
}

const defaultFiltro: FiltroState = {
  biome: "",
  state: "",
  startDate: "",
  endDate: "",
  burnedAreas: false,
  heatSpots: false,
  heatRisk: false,
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
