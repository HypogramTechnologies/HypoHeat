import React, { CSSProperties } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

interface ChartLineProps {
  labels: string[];
  data: number[];
  originalData: any[]; // Dados originais para tooltip
}

const formatPopupInfo = (item: any) => {
  const dataFormatada = new Date(item.dataOcorrencia).toLocaleDateString("pt-BR");

  const areaQueimada = Number(item.areaQueimadaKm2);
  const percentual = Number(item.areaqueimadaPercentual);
  const areaTotal = Number(item.areaTotalKm2);

  return [
    `Área queimada: ${!isNaN(areaQueimada) ? areaQueimada.toFixed(2) : "N/A"} km²`,
    `Percentual: ${!isNaN(percentual) ? percentual.toFixed(2) : "N/A"}%`,
    `Área total: ${!isNaN(areaTotal) ? areaTotal.toFixed(2) : "N/A"} km²`,
  ];
};

// Estilos tipados com CSSProperties
const containerStyle: CSSProperties = {
  backgroundColor: "#000000",
  height: "100%",
  width: "100%",
  padding: "1rem",
  boxSizing: "border-box",
};

const chartStyle: CSSProperties = {
  height: "100%",
  width: "100%",
};

const ChartLine: React.FC<ChartLineProps> = ({ labels, data, originalData }) => {
  const chartConfig = {
    labels,
    datasets: [
      {
        label: "Área queimada (km²)",
        data,
        backgroundColor: "#f27c00",
        borderColor: "#f27c00",
        borderWidth: 1,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "white",
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const index = context.dataIndex;
            const item = originalData[index];
            if (!item) return "";
            return formatPopupInfo(item);
          },
        },
      },
      title: {
        display: true,
        text: "Gráfico de Área queimada",
        color: "white",
        font: {
          size: 18,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "white",
        },
        grid: {
          color: "rgba(255,255,255,0.1)",
        },
      },
      y: {
        ticks: {
          color: "white",
        },
        grid: {
          color: "rgba(255,255,255,0.1)",
        },
      },
    },
  };

  return (
    <div style={containerStyle}>
      <Line data={chartConfig} options={options} style={chartStyle} />
    </div>
  );
};

export default ChartLine;
