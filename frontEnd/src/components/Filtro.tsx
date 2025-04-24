import { useEffect, useState } from "react";
import { useFiltro } from "../context/FiltroContext";
import "./Filtro.css";

const Filtro: React.FC = () => {
  const { filtro, setFiltro, aplicarFiltros, resetarFiltros } = useFiltro();

  // Estados locais para armazenar biomas e estados
  const [biomes, setBiomes] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);

  // useEffect para buscar os dados da API
  useEffect(() => {
    // Busca os estados
    fetch("http://localhost:3000/api/estados")
      .then((response) => response.json())
      .then((data) => {
        const estados = data.map((estado: any) => estado.estadonome);
        setStates(estados);
      })
      .catch((error) => console.error("Erro ao buscar estados:", error));

    // Busca os biomas
    fetch("http://localhost:3000/api/biomas")
      .then((response) => response.json())
      .then((data) => {
        const biomas = data.map((bioma: any) => bioma.biomanome);
        setBiomes(biomas);
      })
      .catch((error) => console.error("Erro ao buscar biomas:", error));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, type, value } = e.target;

    if (type === "checkbox") {
      setFiltro({
        ...filtro,
        burnedAreas: name === "burnedAreas",
        heatSpots: name === "heatSpots",
        heatRisk: name === "heatRisk",
      });
    } else {
      setFiltro({ ...filtro, [name]: value });
    }
  };

  return (
    <div className="filter-container">
      <div className="input-group">
        <label htmlFor="biome">Bioma:</label>
        <select
          id="biome"
          name="biome"
          value={filtro.biome || ""}
          onChange={handleChange}
          className="select-scroll"
        >
          <option value="">Selecione o Bioma</option>
          {biomes.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <label htmlFor="state">Estado:</label>
        <select
          id="state"
          name="state"
          value={filtro.state || ""}
          onChange={handleChange}
          className="select-scroll"
        >
          <option value="">Selecione um Estado</option>
          {states.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <label htmlFor="startDate">Data Inicial:</label>
        <input
          id="startDate"
          type="date"
          name="startDate"
          value={filtro.startDate}
          onChange={handleChange}
        />
      </div>

      <div className="input-group">
        <label htmlFor="endDate">Data Final:</label>
        <input
          id="endDate"
          type="date"
          name="endDate"
          value={filtro.endDate}
          onChange={handleChange}
        />
      </div>

      <div className="checkbox-group">
        <label>
          <input
            type="checkbox"
            name="burnedAreas"
            checked={filtro.burnedAreas || false}
            onChange={handleChange}
          />{" "}
          Áreas Queimadas
        </label>
        <label>
          <input
            type="checkbox"
            name="heatSpots"
            checked={filtro.heatSpots || false}
            onChange={handleChange}
          />{" "}
          Focos de Calor
        </label>
        <label>
          <input
            type="checkbox"
            name="heatRisk"
            checked={filtro.heatRisk || false}
            onChange={handleChange}
          />{" "}
          Risco de Calor
        </label>
      </div>

      <div className="button-group">
        <button onClick={aplicarFiltros} className="apply-button">
          Aplicar
        </button>
        <button onClick={resetarFiltros} className="reset-button">
          Resetar
        </button>
      </div>
    </div>
  );
};

export default Filtro;
