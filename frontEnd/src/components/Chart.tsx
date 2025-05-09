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
  const { filtro } = useFiltro();
  const [focoCalorData, setFocoCalorData] = useState<any[]>([]);
  const [riscoFogoData, setRiscoFogoData] = useState<any[]>([]);
  const [areaQueimadaData, setAreaQueimadaData] = useState<any[]>([]);

  // Defina o estado para armazenar os dados da API
  const [chartData, setChartData] = useState<any[]>([]);

  // useEffect para buscar os dados da API
  useEffect(() => {
    //simulando filtro
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



  const focoCalorChartData = {
    labels: chartData.map((item) =>
      new Date(item.ocorrenciadatahora).toLocaleDateString("pt-BR")
    ),
    datasets: [
      {
        label: "Focos de Calor",
        data: chartData.map((item) => item.ocorrenciariscofogo),
        borderColor: "#ff8c00",
        backgroundColor: "rgba(255, 140, 0, 0.2)",
        fill: true,
      },
    ],
  };

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


  const areaQueimadaChartData = {
    labels: chartData.map((item) =>
      new Date(item.ocorrenciadatahora).toLocaleDateString("pt-BR")
    ),
    datasets: [
      {
        label: "Ocorrencia de Fogo",
        data: chartData.map((item) => item.ocorrenciariscofogo),
        borderColor: "#F7C114",
        backgroundColor: "rgba(255, 217, 0, 0.2)",
        fill: true,
      },
    ],
  };

  return (
    <div style={{ padding: "2rem", backgroundColor: "#121212", color: "#f0f0f0", borderRadius: "12px" }}>

      {/* <h2 style={{ color: "#ff8c00", marginTop: "2rem" }}>Gráfico de Focos de Calor</h2>
      <Line data={focoCalorChartData} /> */}

      <h2 style={{ color: "#F51427", marginTop: "2rem" }}>Gráfico de Risco de Fogo</h2>
      <Line data={riscoFogoChartData} />

      {/* <h2 style={{ color: "#F7C114", marginTop: "2rem" }}>Gráfico de Area Queimada</h2>
      <Line data={areaQueimadaChartData} /> */}

    </div>
  );
};

export default Chart;
