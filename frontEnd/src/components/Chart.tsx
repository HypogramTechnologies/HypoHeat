import React, { useEffect, useState } from "react";
import { useFiltro } from "../context/FiltroContext";
import {
  filtroOcorrenciaAgrupado,
  areaQueimadaPercentual,
} from "../services/ocorrenciaService";
import { FiltroConsulta, TipoBusca } from "../types/Filtros";
import ChartLine from "./ChartLine";
import ChartBar from "./ChartBar";

const Chart: React.FC = () => {
  const { appliedFiltro } = useFiltro();
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const { biome, state, startDate, endDate, tipoFiltro } = appliedFiltro;

    if (!biome && !state) {
      setChartData([]);
      return;
    }

    const filtro: FiltroConsulta = {
      estado: state,
      bioma: biome,
      dataInicial: startDate,
      dataFinal: endDate,
      tipoBusca:
        tipoFiltro === "heatSpots"
          ? TipoBusca.focosCalor
          : tipoFiltro === "heatRisk"
          ? TipoBusca.riscoFogo
          : TipoBusca.areaQueimadaPercentual,
    };

    const fetchData =
      tipoFiltro === "burnedAreas"
        ? areaQueimadaPercentual(filtro)
        : filtroOcorrenciaAgrupado(filtro);

    fetchData
      .then((data) => setChartData(data))
      .catch((error) =>
        console.error("Erro ao buscar dados para o gráfico:", error)
      );
  }, [appliedFiltro]);

  const isOnlyBiome = appliedFiltro.biome && !appliedFiltro.state;
  const labels = isOnlyBiome
    ? chartData.map((item) => item.estadonome)
    : chartData.map((item) =>
        new Date(
          appliedFiltro.tipoFiltro === "burnedAreas"
            ? item.dataOcorrencia
            : item.ocorrenciadatahora
        ).toLocaleDateString("pt-BR")
      );
      
  if (appliedFiltro.tipoFiltro === "burnedAreas") {
    const data = chartData.map((item) => item.areaQueimadaKm2);
    return <ChartLine labels={labels} data={data} originalData={chartData} />;
  }

  const data = chartData.map((item) =>
    appliedFiltro.tipoFiltro === "heatSpots"
      ? item.ocorrenciafrp
      : item.ocorrenciariscofogo
  );
  const label =
    appliedFiltro.tipoFiltro === "heatSpots"
      ? "Focos de calor"
      : "Risco de fogo";

  return <ChartBar labels={labels} data={data} label={label} />;
};

export default Chart;
