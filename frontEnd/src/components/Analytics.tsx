import { CSSProperties } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Card from "../components/Card";
import "../Index.css";

export default function Analytics() {
  return (
    <div style={styles.pageContainer}>
      <Header />
      <main style={styles.mainContent}>

        <div style={styles.cardContainer}>

        <Card
          src="src/assets/graphicicon2.png"
          title="Gráfico"
          alt="Gráfico"
          redirectTo="/chart" 
        />
        <Card
          src="src/assets/mapicon2.png"
          title="Mapa"
          alt="Mapa"
          redirectTo="/map" 
        />
        <Card
          src="src/assets/analyticsicon2.png"
          title="Análises"
          alt="Análises"
          redirectTo="/analytics" 
        />
        </div>
      </main>
      <Footer></Footer>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    minHeight: "100vh",
    overflowX: "hidden"
  },
  mainContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: "80px 30px 30px"
  },
  cardContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    flexDirection: "row",
    gap: "10px"
  },
};
