import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "../Index.css";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import fireIconUrl from "../assets/fire.png";
import { focosCalor, riscoFogo, Foco, RiscoFogo } from "../services/ocorrenciaService";
import { FiltroConsulta, TipoBusca } from "../types/Filtros";
import { useFiltro } from "../context/FiltroContext";

const fireIcon = new L.Icon({
  iconUrl: fireIconUrl,
  iconSize: [20, 20],   
  iconAnchor: [15, 30],    
  popupAnchor: [0, -30],   
});

interface RecuperaFocoCalorIcon {
  (frp: number): L.DivIcon;
}

const recuperaFocoCalorIcon: RecuperaFocoCalorIcon = (frp) => {
  let color: string = "#FFD43B"; // Amarelo

  if (frp > 100) color = "#FF0000"; // Vermelho
  else if (frp > 50) color = "#FF7B00"; // Laranja

  const focoCalorIcon: L.DivIcon = L.divIcon({
    className: 'custom-fa-icon',
    html: `<i class="fa-solid fa-circle" style="color:${color}; font-size: 10px;"></i>`,
    iconSize: [15, 30],
    iconAnchor: [12, 24],
  });
  return focoCalorIcon;
};

const Mapa = () => {
  const { appliedFiltro } = useFiltro();
  const [focos, setFocos] = useState<Foco[]>([]); 
  const [risco, setRisco] = useState<RiscoFogo[]>([]);

  const tipoSelecionado = appliedFiltro.tipoFiltro;
  const localSelecionado = (appliedFiltro.state.trim() !== "" || appliedFiltro.biome.trim() !== "" ) && appliedFiltro.startDate && appliedFiltro.endDate;	
  const filtroPreenchido = tipoSelecionado && localSelecionado;

  useEffect(() => {
    const filtro: FiltroConsulta = {
    estado: appliedFiltro.state,
    bioma: appliedFiltro.biome,
    dataInicial: appliedFiltro.startDate,
    dataFinal: appliedFiltro.endDate,
    tipoBusca: appliedFiltro.tipoFiltro === 'heatSpots' ? TipoBusca.focosCalor : TipoBusca.riscoFogo
  };


  if (appliedFiltro.tipoFiltro === 'heatSpots') {
    focosCalor(filtro).then(setFocos).catch(console.error);
    setRisco([]);
  } else if (appliedFiltro.tipoFiltro === 'heatRisk') {
    riscoFogo(filtro).then(setRisco).catch(console.error);
    setFocos([]);
  }
}, [appliedFiltro]);

  if (!filtroPreenchido) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "#888" }}>
        <p>Preencha um estado ou bioma e selecione um tipo (ex: focos de calor, risco de fogo ou áreas queimadas), depois clique em "Aplicar".</p>
      </div>
    );
  }

  return (
    <MapContainer
      center={[-15.77972, -47.92972]}
      zoom={4}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
  attribution='&copy; <a href="https://carto.com/">CARTO</a>'
  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
  subdomains="abcd"
  maxZoom={19}
/>

{appliedFiltro.tipoFiltro === 'heatSpots' &&
  focos.map((item, index) => (
    <Marker
      key={`foco-${index}`}
      position={[item.ocorrenciaLatitude, item.ocorrenciaLongitude]}
      icon={recuperaFocoCalorIcon(item.ocorrenciafrp)}
    >
      <Popup>
        <strong>Município: {item.municipionome}</strong>
        <br />
        <strong>Estado: {item.estadonome}</strong>
        <br />
        <strong>Bioma: {item.biomanome}</strong>
        <br />
        <strong>FRP: {item.ocorrenciafrp}</strong>
        <br />
        Lat: {item.ocorrenciaLatitude}, Lng: {item.ocorrenciaLongitude}
      </Popup>
    </Marker>
  ))
}

{appliedFiltro.tipoFiltro === 'heatRisk' &&
  risco.map((item, index) => (
    <Marker
      key={`risco-${index}`}
      position={[item.ocorrenciaLatitude, item.ocorrenciaLongitude]} // ajuste conforme sua interface RiscoFogo
      icon={fireIcon}
    >
      <Popup>
        <strong>Município: {item.municipionome}</strong>
        <br />
        <strong>Estado: {item.estadonome}</strong>
        <br />
        <strong>Bioma: {item.biomanome}</strong>
        <br />
        <strong>Risco de fogo: {item.ocorrenciaRiscoFogo}</strong>
        <br />
        Lat: {item.ocorrenciaLatitude}, Lng: {item.ocorrenciaLongitude}
      </Popup>
    </Marker>
  ))
}
    </MapContainer>
  );
};

export default Mapa;