import { CSSProperties } from "react";
import Chart from "../components/Chart";
import { FiltroProvider } from "../context/FiltroContext";
import Filtro from "../components/Filtro";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ChartView() {
  return (
    <div style={styles.pageContainer}>
      <Header />
      <main style={styles.mainContent}>
        <FiltroProvider>  {/* Aqui está o FiltroProvider */}
          <Filtro />
          <div style={styles.chartStyle}>
            <Chart />
          </div>
        </FiltroProvider>  {/* FiltroProvider envolve Filtro e Chart */}
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
};
