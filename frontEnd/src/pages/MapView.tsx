import Header from "../components/Header";
import Footer from "../components/Footer";
import Filtro from "../components/Filtro";
import { CSSProperties } from "react";
import "../index.css";
import Mapa from "../components/Mapa";
import { FiltroProvider } from "../context/FiltroContext";

export default function MapView() {
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
        <div style={styles.mapaStyle}>
          <Mapa />
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
  mapaStyle: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#f5f5f5", 
  },
};
