import React, { CSSProperties } from "react";
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ChartBarProps {
  labels: string[];
  data: number[];
  label: string;
}

const ChartBar: React.FC<ChartBarProps> = ({ labels, data, label }) => {
  const chartConfig = {
    labels,
    datasets: [
      {
        label,
        data,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255, 205, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

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

 
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "white",
        },
      },
      title: {
        display: true,
        text: `Gráfico de ${label}`,
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
      <Bar data={chartConfig} options={options} style={chartStyle} />
    </div>
  );
};

export default ChartBar;
