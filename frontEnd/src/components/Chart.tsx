import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../Index.css";

const Chart: React.FC = () => {
  // Defina o estado para armazenar os dados da API
  const [chartData, setChartData] = useState<any[]>([]);

  // useEffect para buscar os dados da API
  useEffect(() => {
    const dados = {
      estado: "SÃO PAULO",
      bioma: "Mata Atlântica",
      dataInicial: "2025-01-01",
      dataFinal: "2025-12-31",
    };
  
    fetch("http://localhost:3000/api/focos-calor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setChartData(data);
        } else {
          console.error("Erro: Resposta da API não é um array.", data);
        }
      })
      .catch((error) =>
        console.error("Erro ao buscar dados para o gráfico:", error)
      );
  }, []);
  

  return (
    <div style={styles.pageContainer}>
      <Header />
      <main style={styles.mainContent}>
        <h1>CHART</h1>
        <div style={styles.cardContainer}>
          <pre>{JSON.stringify(chartData, null, 2)}</pre>
        </div>
      </main>
      <Footer />
    </div>
  );
};

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
    color: "#000",
  },
  cardContainer: {
    display: "flex",
    height: "50vh",
    flexWrap: "wrap",
    justifyContent: "center",
    flexDirection: "row",
    gap: "10px",
    color: "#000",
    backgroundColor: "#fff",
  },
};

export default Chart;