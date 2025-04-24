import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface Foco  {
  estadonome: string;
  ocorrenciaLatitude: number;
  ocorrenciaLongitude: number;
};

const Mapa = () => {
  const [focos, setFocos] = useState<Foco[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/focos-calor")
      .then((res) => res.json())
      .then((data) => {
        const focosFormatados = data.map((foco: any) => ({
          estadonome: foco.estadonome,
          ocorrenciaLatitude: parseFloat(foco.ocorrencialatitude),
          ocorrenciaLongitude: parseFloat(foco.ocorrencialongitude),
        }));
        setFocos(focosFormatados);
      })
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
        >
          <Popup>
            <strong>{foco.estadonome}</strong><br />
            Lat: {foco.ocorrenciaLatitude}, Lng: {foco.ocorrenciaLongitude}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Mapa;