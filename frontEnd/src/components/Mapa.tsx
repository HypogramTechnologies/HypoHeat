import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "../Index.css";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import fireIconUrl from "../assets/fire.png";

import { focosCalor, Foco } from "../services/ocorrenciaService";
import { FiltroConsulta } from "../types/Filtros";

const fireIcon = new L.Icon({
  iconUrl: fireIconUrl,
  iconSize: [30, 30],   
  iconAnchor: [15, 30],    
  popupAnchor: [0, -30],   
});

const filtro: FiltroConsulta = {
  estado: "SÃO PAULO",
};

const Mapa = () => {
  const [focos, setFocos] = useState<Foco[]>([]); 

  useEffect(() => {
    focosCalor(filtro) 
      .then(setFocos)
      .catch((err) => console.error("Erro ao buscar focos:", err));
  }, []);

  return (
    <MapContainer
      center={[-15.77972, -47.92972]}
      zoom={4}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {focos.map((foco, index) => (
        <Marker
          key={index}
          position={[foco.ocorrenciaLatitude, foco.ocorrenciaLongitude]}
          icon={fireIcon}
        >
          <Popup>
            <strong>{foco.estadonome}</strong>
            <br />
            Lat: {foco.ocorrenciaLatitude}, Lng: {foco.ocorrenciaLongitude}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Mapa;