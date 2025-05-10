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
  const { filtro } = useFiltro(); // Obtém o filtro do contexto
  const [chartData, setChartData] = useState<any[]>([]);

  // Função para formatar os dados do filtro para a API
  const mapFiltroToApiPayload = () => ({
    estado: filtro.state || "",
    bioma: filtro.biome || "",
    dataInicial: filtro.startDate || "",
    dataFinal: filtro.endDate || "",
  });

  useEffect(() => {
    const dados = mapFiltroToApiPayload(); // Mapeia os dados do filtro

    console.log(dados)
    // Faz a requisição para a API usando os dados do filtro
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
  }, [filtro]); // Atualiza o gráfico sempre que o filtro mudar

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
