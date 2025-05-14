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

  const tipoSelecionado = appliedFiltro.tipoFiltro;
  const localSelecionado = appliedFiltro.state.trim() !== "" && appliedFiltro.biome.trim() !== "" && appliedFiltro.startDate && appliedFiltro.endDate;	
  const filtroPreenchido = tipoSelecionado && localSelecionado;

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

    // Define URL com base no tipo selecionado
    let url: string | undefined;
   
    if (appliedFiltro.tipoFiltro == 'burnedAreas') {
      url = "http://localhost:3000/api/areas-queimadas";
      console.log("URL para áreas queimadas:", url);
    } else if (appliedFiltro.tipoFiltro == 'heatSpots') {
      url = "http://localhost:3000/api/focos-calor";
      console.log("URL para focos de calor:", url);
    } else if (appliedFiltro.tipoFiltro  == 'heatRisk') {
      url = "http://localhost:3000/api/risco-fogo";
      console.log("URL para risco de fogo:", url);
    }

    if (!url) return; // Se por algum motivo não houver URL, evita o fetch

    fetch(url, {
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
        <p>Preencha um estado ou bioma e selecione um tipo (ex: focos de calor, risco de fogo ou áreas queimadas), depois clique em "Aplicar".</p>
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
