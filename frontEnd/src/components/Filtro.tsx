import { useEffect, useState } from "react";
import { useFiltro } from "../context/FiltroContext";
import { CSSProperties } from "react";

const Filtro: React.FC = () => {
  const { filtro, setFiltro, aplicarFiltros, resetarFiltros } = useFiltro();
  const [biomes, setBiomes] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/estados")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const estadosFormatados = data.map((estado: any) => estado.estadonome);
          setStates(estadosFormatados);
        } else {
          console.error("Erro: Resposta da API não é um array.", data);
        }
      })
      .catch((error) => console.error("Erro ao buscar estados:", error));

    fetch("http://localhost:3000/api/biomas")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const biomasFormatados = data.map((bioma: any) => bioma.biomanome);
          setBiomes(biomasFormatados);
        } else {
          console.error("Erro: Resposta da API não é um array.", data);
        }
      })
      .catch((error) => console.error("Erro ao buscar biomas:", error));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, type, value, checked } = e.target;

    if (type === "checkbox") {
      setFiltro({
        ...filtro,
        [name]: checked,
      });
    } else {
      setFiltro({ ...filtro, [name]: value });
    }
  };

  const styles: { [key: string]: CSSProperties } = {
    filterContainer: {
      backgroundColor: "rgba(0, 0, 0, 1)",
      padding: "16px",
      width: "350px",
    },
    inputGroup: {
      display: "flex",
      flexDirection: "column",
      marginBottom: "10px",
    },
    inputGroupLabel: {
      marginBottom: "4px",
    },
    inputGroupInputSelect: {
      backgroundColor: "black",
      color: "white",
      border: "1px solid #fc6d01",
      padding: "8px",
      borderRadius: "8px",
    },
    checkboxGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      marginBottom: "10px",
    },
    buttonGroup: {
      display: "flex",
      gap: "10px",
      justifyContent: "center",
      marginTop: "10px",
    },
    button: {
      backgroundColor: "#ff5722",
      color: "white",
      border: "none",
      padding: "8px 12px",
      fontSize: "14px",
      borderRadius: "5px",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.filterContainer}>
      <div style={styles.inputGroup}>
        <label htmlFor="biome" style={styles.inputGroupLabel}>Bioma:</label>
        <select
          id="biome"
          name="biome"
          value={filtro.biome || ""}
          onChange={handleChange}
          style={styles.inputGroupInputSelect}
        >
          <option value="">Selecione</option>
          {biomes.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      <div style={styles.inputGroup}>
        <label htmlFor="state" style={styles.inputGroupLabel}>Estado:</label>
        <select
          id="state"
          name="state"
          value={filtro.state || ""}
          onChange={handleChange}
          style={styles.inputGroupInputSelect}
        >
          <option value="">Selecione</option>
          {states.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div style={styles.inputGroup}>
        <label htmlFor="startDate" style={styles.inputGroupLabel}>Data inicial:</label>
        <input
          id="startDate"
          type="date"
          name="startDate"
          value={filtro.startDate}
          onChange={handleChange}
          style={styles.inputGroupInputSelect}
        />
      </div>

      <div style={styles.inputGroup}>
        <label htmlFor="endDate" style={styles.inputGroupLabel}>Data final:</label>
        <input
          id="endDate"
          type="date"
          name="endDate"
          value={filtro.endDate}
          onChange={handleChange}
          style={styles.inputGroupInputSelect}
        />
      </div>

      <div style={styles.checkboxGroup}>
        <label>
          <input
            type="checkbox"
            name="burnedAreas"
            checked={filtro.burnedAreas || false}
            onChange={handleChange}
          /> Áreas queimadas
        </label>
        <label>
          <input
            type="checkbox"
            name="heatSpots"
            checked={filtro.heatSpots || false}
            onChange={handleChange}
          /> Focos de calor
        </label>
        <label>
          <input
            type="checkbox"
            name="heatRisk"
            checked={filtro.heatRisk || false}
            onChange={handleChange}
          /> Risco de fogo
        </label>
      </div>

      <div style={styles.buttonGroup}>
        <button onClick={resetarFiltros} style={styles.button}>Resetar</button>
        <button onClick={aplicarFiltros} style={styles.button}>Aplicar</button>
      </div>
    </div>
  );
};

export default Filtro;
