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
        <h2>Bem-vindo à HypoHeat</h2>
        <p>
          A HypoHeat é uma equipe inovadora dedicada ao desenvolvimento de soluções tecnológicas para monitoramento ambiental. Nossa missão é
          facilitar o acesso a informações críticas que apoiem a preservação ambiental e a tomada de decisões estratégicas, utilizando
          tecnologia de ponta para transformar dados complexos em insights intuitivos.
        </p>

        <h2>Nossa Aplicação</h2>
        <p>
          A aplicação web desenvolvida pela HypoHeat tem como objetivo principal oferecer uma plataforma interativa para consulta e visualização
          dos dados de área queimada, risco de fogo e focos de calor, obtidos diretamente da base de dados BDQueimadas, do Programa Queimadas do
          INPE.
        </p>

        <h2>Por que criamos esta solução?</h2>
        <p>
          Acreditamos que informações claras e acessíveis são essenciais para promover a conscientização e a ação diante de eventos como
          queimadas e incêndios florestais. Nossa aplicação foi projetada para:
        </p>
        <ul>
          <li>Facilitar o acesso a dados ambientais importantes.</li>
          <li>Auxiliar gestores, pesquisadores e a sociedade em geral na compreensão e análise de riscos.</li>
          <li>Promover decisões mais ágeis e fundamentadas em dados confiáveis.</li>
        </ul>

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
