import React, { CSSProperties } from "react";
import { TipoBusca } from "../types/Filtros";
import fireHighIconUrl from "../assets/firehigh.png";
import fireMediumIconUrl from "../assets/firemedium.png";
import fireLowIconUrl from "../assets/firelow.png";

interface LegendProps {
  tipoBusca: TipoBusca; // Tipo de busca
}

const Legend: React.FC<LegendProps> = ({ tipoBusca }) => {
  return (
    <div style={styles.legend}>
      {(() => {
        switch (tipoBusca) {
          case TipoBusca.areaqueimada:
             return (
              <>
                <div style={styles.legendItem}>
                  <span style={{ ...styles.colorBox, backgroundColor: "#FF0000" }}></span>
                  Intenso
                </div>
                <div style={styles.legendItem}>
                  <span style={{ ...styles.colorBox, backgroundColor: "#FF7B00" }}></span>
                  Moderado
                </div>
                <div style={styles.legendItem}>
                  <span style={{ ...styles.colorBox, backgroundColor: "#FFD43B" }}></span>
                  Leve
                </div>
              </>
            );
          case TipoBusca.riscoFogo:
            return (
              <>
                <div style={styles.legendItem}>
                  <img src={fireHighIconUrl} alt="Alto risco de fogo" style={styles.icon} />
                  0.66 a 1
                </div>
                <div style={styles.legendItem}>
                  <img src={fireMediumIconUrl} alt="Médio risco de fogo" style={styles.icon} />
                  0.33 a 0.66
                </div>
                <div style={styles.legendItem}>
                  <img src={fireLowIconUrl} alt="Baixo risco de fogo" style={styles.icon} />
                  0 a 0.33
                </div>
              </>
            );
          case TipoBusca.focosCalor:
            return (
              <>
                <div style={styles.legendItem}>
                  <span style={{ ...styles.colorBox, backgroundColor: "#FF0000" }}></span>
                  Intenso
                </div>
                <div style={styles.legendItem}>
                  <span style={{ ...styles.colorBox, backgroundColor: "#FF7B00" }}></span>
                  Moderado
                </div>
                <div style={styles.legendItem}>
                  <span style={{ ...styles.colorBox, backgroundColor: "#FFD43B" }}></span>
                  Leve
                </div>
              </>
            );
          default:
            return null;
        }
      })()}
    </div>
  );
};

const styles: { [key: string]: CSSProperties } = {
  legend: {
    position: "absolute",
    bottom: "10px",
    right: "10px",
    padding: "10px",
    borderRadius: "5px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
    backgroundColor: "black",
    zIndex: 1000,
    fontFamily: "Roboto, sans-serif",
    fontSize: "14px",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    marginBottom: "5px",
  },
  colorBox: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    marginRight: "10px",
  },
  icon: {
    width: "20px",
    height: "20px",
    marginRight: "10px",
  },
};

export default Legend;
