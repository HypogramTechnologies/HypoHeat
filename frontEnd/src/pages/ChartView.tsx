import { CSSProperties, useState } from "react";
import Chart from "../components/Chart";
import { FiltroProvider } from "../context/FiltroContext";
import Filtro from "../components/Filtro";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ChartView() {
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

          <div style={styles.chartStyle}>
            <Chart />
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
    overflowX:"hidden"
  },
  mainContent: {
    flex: 1,
    display: "flex",
    paddingTop: "80px",
  },
  chartStyle: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#f5f5f5",
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

  }
};
