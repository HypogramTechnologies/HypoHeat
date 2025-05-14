import Header from "../components/Header";
import Footer from "../components/Footer";
import Filtro from "../components/Filtro";
import { CSSProperties, useState } from "react";
import "../index.css";
import Mapa from "../components/Mapa";
import { FiltroProvider } from "../context/FiltroContext";

export default function MapView() {
  const [isFiltroVisible, setIsFiltroVisible] = useState(true);

  const toggleFiltroVisibility = () => {
    setIsFiltroVisible(!isFiltroVisible);
  };

  return (
    <div style={styles.pageContainer}>
      <Header />
      <main style={styles.mainContent}>
        <div style={styles.iconContainer}>
          <button
            onClick={toggleFiltroVisibility}
            style={{
              ...styles.toggleButton,
              ...(isFiltroVisible
                ? styles.toggleButtonVisible
                : styles.toggleButtonHidden),
            }}
            aria-label="Alternar Filtro"
          >
            {isFiltroVisible ? (
              <i className="fa-solid fa-angles-left" style={styles.icon}></i>
            ) : (
              <i className="fa-solid fa-angles-right" style={styles.icon}></i>
            )}
          </button>
        </div>

        <FiltroProvider>
          <div style={styles.filtroStyle}>
            {isFiltroVisible && (
              <div
                style={{
                  ...styles.filtroContainer,
                  ...(isFiltroVisible
                    ? styles.filtroVisible
                    : styles.filtroHidden),
                }}
              >
                <Filtro />
              </div>
            )}
          </div>

          <div style={styles.mapaStyle}>
            <Mapa />
          </div>
        </FiltroProvider>

      </main>
      <Footer />
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    minHeight: "100vh",
    overflow: "hidden",
  },
  mainContent: {
    flex: 1,
    display: "flex",
    paddingTop: "80px",
  },
  filtroStyle: {
    color: "white",
  },
  icon: {
    color: "#f27c00",
    fontSize: "24px",
  },
  iconContainer: {
    alignContent: "center"
  },
  toggleButton: {
    backgroundColor: "transparent",
    color: "white",
    padding: "3px 3px",
    fontSize: "16px",
    borderRadius: "5px",
    cursor: "pointer",
    height: "5%",

  },
  mapaStyle: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#f5f5f5",
  }
};