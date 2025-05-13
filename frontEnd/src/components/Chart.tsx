import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useFiltro } from "../context/FiltroContext";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Chart: React.FC = () => {
  const { appliedFiltro } = useFiltro();
  const [chartData, setChartData] = useState<any[]>([]);

  // Verifica se pelo menos um campo do filtro está preenchido
  const filtroPreenchido = Object.values({
    state: appliedFiltro.state,
    biome: appliedFiltro.biome,
    startDate: appliedFiltro.startDate,
    endDate: appliedFiltro.endDate,
  }).some((value) => value && value.trim() !== "");

  useEffect(() => {
    if (!filtroPreenchido) {
      setChartData([]);
      return;
    }

    const dados = {
      estado: appliedFiltro.state,
      bioma: appliedFiltro.biome,
      dataInicial: appliedFiltro.startDate,
      dataFinal: appliedFiltro.endDate,
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
  }, [appliedFiltro]);

  if (!filtroPreenchido) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "#888" }}>
        <p>Preencha pelo menos um filtro e clique em "Aplicar" para visualizar o gráfico.</p>
      </div>
    );
  }

  const riscoFogoChartData = {
    labels: chartData.map((item) =>
      new Date(item.ocorrenciadatahora).toLocaleDateString("pt-BR")
    ),
    datasets: [
      {
        label: "Risco de Fogo",
        data: chartData.map((item) => item.ocorrenciariscofogo),
        borderColor: "#F51427",
        backgroundColor: "rgba(255, 30, 30, 0.2)",
        fill: true,
      },
    ],
  };

  return (
    <div
      style={{
        padding: "2rem",
        backgroundColor: "#121212",
        color: "#f0f0f0",
        borderRadius: "12px",
      }}
    >
      <h2 style={{ color: "#F51427", marginTop: "2rem" }}>Gráfico de Risco de Fogo</h2>
      <Line data={riscoFogoChartData} />
    </div>
  );
};

export default Chart;
