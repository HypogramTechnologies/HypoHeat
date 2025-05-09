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

  useEffect(() => {
    fetch("http://localhost:3000/api/focos-calor")
      .then((res) => res.json())
      .then(setFocoCalorData);

    fetch("http://localhost:3000/api/risco-fogo")
      .then((res) => res.json())
      .then(setRiscoFogoData);

    fetch("http://localhost:3000/api/area-queimada")
      .then((res) => res.json())
      .then(setAreaQueimadaData);
  }, [filtro]);

  const focoCalorChartData = {
    labels: focoCalorData.map((item) => item.date),
    datasets: [
      {
        label: "Focos de Calor",
        data: focoCalorData.map((item) => item.value),
        borderColor: "#ff8c00",  
        backgroundColor: "rgba(255, 140, 0, 0.2)",  
      },
    ],
  };

  const riscoFogoChartData = {
    labels: riscoFogoData.map((item) => item.date),
    datasets: [
      {
        label: "Risco de Fogo",
        data: riscoFogoData.map((item) => item.value),
        borderColor: "#F51427",
        backgroundColor: "rgba(255, 30, 30, 0.2)",
        fill: true,
      },
    ],
  };

  const areaQueimadaChartData = {
    labels: areaQueimadaData.map((item) => item.date),
    datasets: [
      {
        label: "Área Queimada",
        data: areaQueimadaData.map((item) => item.value),
        borderColor: "#F7C114",
        backgroundColor: "rgba(255, 217, 0, 0.2)",
        fill: true,
      },
    ],
  };

  return (
    <div style={{ padding: "2rem", backgroundColor: "#121212", color: "#f0f0f0", borderRadius: "12px" }}>
      <h2 style={{ color: "#ff8c00", marginTop: "2rem" }}>Gráfico de Foco de Calor</h2>
      <Line data={focoCalorChartData} />

      <h2 style={{ color: "#F51427", marginTop: "2rem" }}>Gráfico de Risco de Fogo</h2>
      <Line data={riscoFogoChartData} />

      <h2 style={{ color: "#F7C114", marginTop: "2rem" }}>Gráfico de Área Queimada</h2>
      <Line data={areaQueimadaChartData} />
    </div>
  );
};

export default Chart;
