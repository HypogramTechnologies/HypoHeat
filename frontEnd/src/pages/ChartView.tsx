import Header from "../components/Header";
import Footer from "../components/Footer";
import Filtro from "../components/Filtro";
import { CSSProperties } from "react";
import "../index.css";
import Chart from "../components/Chart";
import { FiltroProvider } from "../context/FiltroContext";

export default function ChartView() {
  return (
    <div style={styles.pageContainer}>
      <Header />
      <main style={styles.mainContent}>
        {/* <div style={styles.filtroStyle}> */}
          <FiltroProvider>
            <Filtro />
          </FiltroProvider>
        {/* </div> */}

        {/* Mapa ocupando o restante do espaço */}
        <div style={styles.chartStyle}>
          <Chart />
        </div>
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
    width: "20%", 
    padding: "16px",
    color: "white",
  },
  chartStyle: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#f5f5f5", 
  },
};
