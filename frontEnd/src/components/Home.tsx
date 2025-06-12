import { CSSProperties } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Card from "../components/Card";
import "../Index.css";

export default function Home() {
  return (
    <div style={styles.pageContainer}>
      <Header />
      <main style={styles.mainContent}>
        <div style={styles.gridContainer}>
          <div style={styles.gridItem}>
            <h2>Bem-vindo à HypoHeat</h2>
            <p>
              A Hypogram é uma equipe inovadora dedicada ao desenvolvimento de soluções tecnológicas para monitoramento ambiental. Nossa missão
              é facilitar o acesso a informações críticas que apoiem a preservação ambiental e a tomada de decisões estratégicas, utilizando
              tecnologia de ponta para transformar dados complexos em insights intuitivos.
            </p>
          </div>

          <div style={styles.gridItem}>
            <h2>Nossa Aplicação</h2>
            <p>
              A aplicação web desenvolvida pela Hypogram tem como objetivo principal oferecer uma plataforma interativa para consulta e
              visualização dos dados de área queimada, risco de fogo e focos de calor, obtidos diretamente da base de dados BDQueimadas, do
              Programa Queimadas do INPE.
            </p>
          </div>

          
        </div>

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
          {/* <Card
            src="src/assets/analyticsicon2.png"
            title="Análises"
            alt="Análises"
            redirectTo="/analytics"
          /> */}
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
    overflowX: "hidden",
  },
  mainContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: "80px 30px 30px",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
    width: "100%",
    maxWidth: "1200px",
  },
  gridItem: {
   
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  cardContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    flexDirection: "row",
    gap: "10px",
    marginTop: "40px",
  },
};
