import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useFiltro } from "../context/FiltroContext";
import { filtroOcorrenciaAgrupado } from "../services/ocorrenciaService";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Chart: React.FC = () => {
  const { appliedFiltro } = useFiltro();
  const [chartData, setChartData] = useState<any[]>([]);

  const tipoSelecionado = appliedFiltro.tipoFiltro;
  const localSelecionado = (appliedFiltro.state.trim() !== "" || appliedFiltro.biome.trim() !== "") && appliedFiltro.startDate && appliedFiltro.endDate;
  const filtroPreenchido = tipoSelecionado && localSelecionado;

   useEffect(() => {
    // Verifica se os filtros estão preenchidos
    const filtroPreenchido =
      appliedFiltro.startDate &&
      appliedFiltro.endDate &&
      (appliedFiltro.state.trim() !== "" || appliedFiltro.biome.trim() !== "") &&
      appliedFiltro.tipoFiltro;

    if (!filtroPreenchido) {
      setChartData([]);
      return;
    }

    // Monta o filtro para a requisição
    const filtro = {
      estado: appliedFiltro.state,
      bioma: appliedFiltro.biome,
      dataInicial: appliedFiltro.startDate,
      dataFinal: appliedFiltro.endDate,
      tipoBusca:
        appliedFiltro.tipoFiltro === "heatSpots"
          ? "focosCalor"
          : appliedFiltro.tipoFiltro === "heatRisk"
          ? "riscoFogo"
          : "areaQueimada",
    };

    // Requisição utilizando filtroOcorrenciaAgrupado
    filtroOcorrenciaAgrupado(filtro)
      .then(setChartData)
      .catch((error) =>
        console.error("Erro ao buscar dados para o gráfico:", error)
      );
  }, [appliedFiltro]);
  

  const riscoFogoChartData = {
    labels: chartData.map((item) =>
      new Date(item.ocorrenciadatahora).toLocaleDateString("pt-BR")
    ),
    datasets: [
      {
        label: "Risco de Fogo",
        data: chartData.map((item) => item.ocorrenciariscofogo),
         backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(201, 203, 207, 0.2)'
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
          'rgb(201, 203, 207)'
        ],
        borderWidth: 1,
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
      <Bar data={riscoFogoChartData} />
    </div>
  );
};

export default Chart;
