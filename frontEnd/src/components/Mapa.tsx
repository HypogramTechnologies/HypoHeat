import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import "../Index.css";
import "leaflet/dist/leaflet.css";
import { getFireIcon } from "./HeatRiskIcon"
import L from "leaflet";

import { focosCalor, riscoFogo, areaQueimada, areaQueimadaPercentual, estadoBiomaArea, Foco, RiscoFogo, AreaQueimada, AreaQueimadaFeature, AreaQueimadaPercentual, EstadoBiomaArea } from "../services/ocorrenciaService";
import { FiltroConsulta, TipoBusca } from "../types/Filtros";
import { useFiltro } from "../context/FiltroContext";
import Legend from "./Legend";
import PopUp from "./Popup";
import ReactDOMServer from 'react-dom/server';


interface RecuperaFocoCalorIcon {
  (frp: number): L.DivIcon;
}

const recuperaFocoCalorIcon: RecuperaFocoCalorIcon = (frp) => {
  let color: string = "#FFD43B"; // Amarelo

  if (frp > 100) color = "#FF0000"; // Vermelho
  else if (frp > 50) color = "#FF7B00"; // Laranja

  const focoCalorIcon: L.DivIcon = L.divIcon({
    className: 'custom-fa-icon',
    html: `<i class="fa-solid fa-circle" style="color:${color}; font-size: 5px;"></i>`,
    iconSize: [15, 30],
    iconAnchor: [12, 24],
  });
  return focoCalorIcon;
};

interface MapaCalor {
  (frp: number): string;
}

const mapaCalor: MapaCalor = (frp) => {
  let color: string = "#FFD43B"; // Amarelo

  if (frp > 100) color = "#FF0000"; // Vermelho
  else if (frp > 50) color = "#FF7B00"; // Laranja

  return color;
};


const Mapa = () => {
  
  const { appliedFiltro } = useFiltro();
  const [focos, setFocos] = useState<Foco[]>([]);
  const [risco, setRisco] = useState<RiscoFogo[]>([]);
  const [area, setArea] = useState<AreaQueimada[]>([]);
  const [areaPercentual, setAreaPercentual] = useState<AreaQueimadaPercentual[]>([])
  const [geometrias, setGeometrias] = useState<EstadoBiomaArea[]>([])

  const tipoSelecionado = appliedFiltro.tipoFiltro;
  const localSelecionado = (appliedFiltro.state.trim() !== "" || appliedFiltro.biome.trim() !== "") && appliedFiltro.startDate && appliedFiltro.endDate;
  const filtroPreenchido = tipoSelecionado && localSelecionado;

  useEffect(() => {
    const filtro: FiltroConsulta = {
      estado: appliedFiltro.state,
      bioma: appliedFiltro.biome,
      dataInicial: appliedFiltro.startDate,
      dataFinal: appliedFiltro.endDate,
      tipoBusca: appliedFiltro.tipoFiltro === 'heatSpots' ? TipoBusca.focosCalor : appliedFiltro.tipoFiltro === 'heatRisk' ? TipoBusca.riscoFogo : TipoBusca.areaqueimada
    };


    if (appliedFiltro.tipoFiltro === 'heatSpots') {
      focosCalor(filtro).then(setFocos).catch(console.error);
      setRisco([]);
    } else if (appliedFiltro.tipoFiltro === 'heatRisk') {
      riscoFogo(filtro).then(setRisco).catch(console.error);
      setFocos([]);
    } else if (appliedFiltro.tipoFiltro == 'burnedAreas') {
      areaQueimada(filtro).then(setArea).catch(console.error);
      setArea([]);
      estadoBiomaArea(filtro).then(setGeometrias).catch(console.error);
      setGeometrias([]);
    }
  }, [appliedFiltro]);

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

      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png"
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
            {/* <Popup>
              <strong>Município: {item.municipionome}</strong>
              <br />
              <strong>Estado: {item.estadonome}</strong>
              <br />
              <strong>Bioma: {item.biomanome}</strong>
              <br />
              <strong>FRP: {item.ocorrenciafrp}</strong>
              <br />
              Lat: {item.ocorrenciaLatitude}, Lng: {item.ocorrenciaLongitude}
            </Popup> */}
            <Popup>
              <PopUp
                item={{
                  ...item,
                  estadonome: item.estadonome ?? "",
                  biomanome: item.biomanome ?? "",
                }}
              />
            </Popup>
          </Marker>
        ))
      }

  
      {appliedFiltro.tipoFiltro === 'heatRisk' &&
        risco
        .map((item, index) => (
          <Marker
            key={`risco-${index}`}
            position={[item.latitude, item.longitude]} 
            icon={recuperaFocoCalorIcon(item.risco_fogo ?? 0)}
          >
{/*             <Popup>
              <PopUp
                item={{
                  ...item,
                  estadonome: (item as any).estadonome ?? "",
                  biomanome: (item as any).biomanome ?? "",
                }}
              />
            </Popup> */}

          </Marker>
        ))
      }

  {appliedFiltro.tipoFiltro === 'burnedAreas' && (
  <>
  
    {geometrias
          .map((item, index) => {
            const geojsonData = typeof item.geojson === 'string' ? JSON.parse(item.geojson) : item.geojson;

            return (
              <GeoJSON
                key={`bioma-${index}`}
                data={geojsonData}
                style={{
                  color: "	#63ACCF",
                  weight: 1,
                  dashArray: "",
                  fillOpacity: 0,
                }}
                interactive={false}
              />
            );
          })}

          
    {area.map((item, index) => {
      const geojsonData =
        typeof item.geojson === 'string'
          ? JSON.parse(item.geojson)
          : item.geojson;

      return (
        <GeoJSON
          key={`area-${index}`}
          data={geojsonData}
          style={(AreaQueimadaFeature) => {
            const props = AreaQueimadaFeature?.properties;
            return {
              color: mapaCalor(props?.frp_total),
              weight: 2,
              fillOpacity: 0.4,
            };
          }}
          onEachFeature={(AreaQueimadaFeature, layer) => {
            const props = AreaQueimadaFeature.properties;

            const popupHtml = ReactDOMServer.renderToString(
              <PopUp
                item={{
                  estadonome: props.estadonome,
                  biomanome: props.biomanome,
                  areaQueimadaKm2: props.area_queimada_km2,
                  frpTotal: props.frp_total,
                }}
              />
            );

            layer.bindPopup(popupHtml);
          }}
        />
      );
    })}

      </>
    )}

      <Legend
        tipoBusca={
          appliedFiltro.tipoFiltro === "heatRisk"
            ? TipoBusca.focosCalor
            : appliedFiltro.tipoFiltro === "burnedAreas"
              ? TipoBusca.areaqueimada
              : TipoBusca.focosCalor
        }
      />

    </MapContainer>
  );
};

export default Mapa;