// import { useFiltro } from "../context/FiltroContext";

// const Resultados: React.FC = () => {
//   const { appliedFiltro } = useFiltro();

//   return (
//     <div className="result-container">
//       <h2>Filtros Aplicados</h2>
//       <p><strong>Bioma:</strong> {appliedFiltro.biome || "Nenhum selecionado"}</p>
//       <p><strong>Estado:</strong> {appliedFiltro.state || "Nenhum selecionado"}</p>
//       <p><strong>Data Inicial:</strong> {appliedFiltro.startDate || "Nenhuma selecionada"}</p>
//       <p><strong>Data Final:</strong> {appliedFiltro.endDate || "Nenhuma selecionada"}</p>
//       <p><strong>Áreas Queimadas:</strong> {appliedFiltro.burnedAreas ? "Sim" : "Não"}</p>
//       <p><strong>Focos de Calor:</strong> {appliedFiltro.heatSpots ? "Sim" : "Não"}</p>
//       <p><strong>Risco de Calor:</strong> {appliedFiltro.heatRisk ? "Sim" : "Não"}</p>
//     </div>
//   );
// };

// export default Resultados;