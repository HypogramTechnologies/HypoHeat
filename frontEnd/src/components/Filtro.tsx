// Filtro.tsx
import { useEffect, useState } from "react";
import { useFiltro } from "../context/FiltroContext";
import { CSSProperties } from "react";
import AutoCompleteInput from "./AutoCompleteInput"; 

const Filtro: React.FC = () => {
  const { filtro, setFiltro, aplicarFiltros, resetarFiltros } = useFiltro();
  const [allBiomes, setAllBiomes] = useState<string[]>([]);
  const [allStates, setAllStates] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetch("http://localhost:3000/api/estados")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const estadosFormatados = data.map((estado: any) => estado.estadonome);
          setAllStates(estadosFormatados);
        } else {
          console.error("Erro: Resposta da API de estados não é um array.", data);
        }
      })
      .catch((error) => console.error("Erro ao buscar estados:", error));

    fetch("http://localhost:3000/api/biomas")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const biomasFormatados = data.map((bioma: any) => bioma.biomanome);
          setAllBiomes(biomasFormatados);
        } else {
          console.error("Erro: Resposta da API de biomas não é um array.", data);
        }
      })
      .catch((error) => console.error("Erro ao buscar biomas:", error));
  }, []);

  const handleRadioChange = (value: string) => {
    setFiltro({ ...filtro, tipoFiltro: value });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFiltro({ ...filtro, [name]: value });
  };

  const handleValidation = () => {
    const validationErrors: { [key: string]: string } = {};
    if (!filtro.biome && !filtro.state) {
      validationErrors.biomeState = "Preencha o Bioma ou o Estado.";
    }
    if (!filtro.startDate) {
      validationErrors.startDate = "Data de início é obrigatória.";
    }
    if (!filtro.endDate) {
      validationErrors.endDate = "Data final é obrigatória.";
    }
    if (filtro.startDate && filtro.endDate) {
      if (filtro.startDate > filtro.endDate) {
        validationErrors.dateRange = "Data de início não pode ser maior que a data final.";
      }
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (handleValidation()) {
      aplicarFiltros();
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
    inputGroupInput: {
      backgroundColor: "black",
      color: "white",
      border: "1px solid #f27c00",
      padding: "8px",
      borderRadius: "8px",
    },
    autocompleteInput: {
        backgroundColor: "black",
        color: "white",
        border: "1px solid #f27c00",
        padding: "8px",
        borderRadius: "8px",
        width: 'calc(100% - 18px)',
    },
    suggestionsList: {
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        backgroundColor: "black",
        border: "1px solid #f27c00",
        borderTop: "none",
        borderRadius: "0 0 8px 8px",
        maxHeight: "150px",
        overflowY: "auto",
        zIndex: 10,
        listStyle: "none",
        padding: 0,
        margin: 0,
    },
    suggestionItem: {
      padding: "8px",
      cursor: "pointer",
      color: "white",
      fontSize: "13px",
    },
    suggestionItemHover: {
      backgroundColor: "#f27c00", 
    },
    suggestionItemFocused: {
        backgroundColor: "#f27c00", 
    },
    buttonGroup: {
      display: "flex",
      gap: "10px",
      justifyContent: "center",
      marginTop: "10px",
    },
    button: {
      backgroundColor: "#f27c00",
      color: "white",
      border: "none",
      padding: "8px 12px",
      fontSize: "14px",
      borderRadius: "5px",
      cursor: "pointer",
    },
    options: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },
    option: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    radioButton: {
      width: "50px",
      height: "25px",
      backgroundColor: "#ccc",
      borderRadius: "15px",
      position: "relative",
      cursor: "pointer",
    },
    radioCircle: {
      position: "absolute",
      top: "3px",
      left: "3px",
      width: "20px",
      height: "20px",
      backgroundColor: "white",
      borderRadius: "50%",
      transition: "left 0.2s",
    },
    errorText: {
      color: "red",
      fontSize: "12px",
      marginTop: "2px",
    },
  };

  return (
    <div style={styles.filterContainer}>
      <form onSubmit={handleSubmit}>
        <AutoCompleteInput
          label="Bioma"
          value={filtro.biome}
          options={allBiomes}
          onChange={(value) => setFiltro({ ...filtro, biome: value })}
          onSelect={(value) => setFiltro({ ...filtro, biome: value })}
          inputStyle={styles.autocompleteInput}
          listStyle={styles.suggestionsList}
          itemStyle={styles.suggestionItem}
          itemHoverStyle={styles.suggestionItemHover}
          itemFocusedStyle={styles.suggestionItemFocused} 
        />

        <AutoCompleteInput
          label="Estado"
          value={filtro.state}
          options={allStates}
          onChange={(value) => setFiltro({ ...filtro, state: value })}
          onSelect={(value) => setFiltro({ ...filtro, state: value })}
          inputStyle={styles.autocompleteInput}
          listStyle={styles.suggestionsList}
          itemStyle={styles.suggestionItem}
          itemHoverStyle={styles.suggestionItemHover}
          itemFocusedStyle={styles.suggestionItemFocused} 
        />
        {errors.biomeState && <p style={styles.errorText}>{errors.biomeState}</p>}

        <div style={styles.inputGroup}>
          <label htmlFor="startDate" style={styles.inputGroupLabel}>
            Data inicial:
          </label>
          <input
            id="startDate"
            type="date"
            name="startDate"
            value={filtro.startDate}
            onChange={handleChange}
            style={styles.inputGroupInput}
          />
          {errors.startDate && <p style={styles.errorText}>{errors.startDate}</p>}
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="endDate" style={styles.inputGroupLabel}>
            Data final:
          </label>
          <input
            id="endDate"
            type="date"
            name="endDate"
            value={filtro.endDate}
            onChange={handleChange}
            style={styles.inputGroupInput}
          />
          {errors.endDate && <p style={styles.errorText}>{errors.endDate}</p>}
        </div>
        {errors.dateRange && <p style={styles.errorText}>{errors.dateRange}</p>}

        <div style={styles.options}>
          {["burnedAreas", "heatSpots", "heatRisk"].map((filter) => (
            <label key={filter} style={styles.option}>
              <input
                type="radio"
                name="filterType"
                value={filter}
                checked={filtro.tipoFiltro === filter}
                onChange={() => handleRadioChange(filter)}
                style={{ display: "none" }}
              />
              <span
                style={{
                  ...styles.radioButton,
                  backgroundColor: filtro.tipoFiltro === filter ? "#067ab2" : "#ccc",
                }}
                onClick={() => handleRadioChange(filter)}
              >
                <span
                  style={{
                    ...styles.radioCircle,
                    left: filtro.tipoFiltro === filter ? "26px" : "3px",
                  }}
                ></span>
              </span>
              {filter === "burnedAreas" && "Áreas queimadas"}
              {filter === "heatSpots" && "Focos de calor"}
              {filter === "heatRisk" && "Risco de fogo"}
            </label>
          ))}
        </div>

        <div style={styles.buttonGroup}>
          <button onClick={resetarFiltros} style={styles.button}>
            Resetar
          </button>
          <button type="submit" style={styles.button}>
            Aplicar
          </button>
        </div>
      </form>
    </div>
  );
};

export default Filtro;