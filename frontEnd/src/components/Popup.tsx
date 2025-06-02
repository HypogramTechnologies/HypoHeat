import React from "react";

interface PopupProps {
  item: {
    municipionome: string;
    estadonome: string;
    biomanome: string;
    ocorrenciafrp?: number;
    ocorrenciaRiscoFogo?: number;
    ocorrenciaLatitude: number;
    ocorrenciaLongitude: number;
  };
}

const Popup: React.FC<PopupProps> = ({ item }) => {
  const containerStyle: React.CSSProperties = {
    backgroundColor: "#00070c",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    padding: "16px",
    fontFamily: "'Arial', sans-serif",
    lineHeight: "1.5",
    maxWidth: "250px",
  };

  const boldTextStyle: React.CSSProperties = {
    fontWeight: "bold",
    color:"white",
    marginBottom: "8px",
    display: "block",
  };

  const coordinatesStyle: React.CSSProperties = {
    fontSize: "0.8rem",
    color: "white",
    marginTop: "12px",
  };

  return (
    <div style={containerStyle}>
      <span style={boldTextStyle}>Município: {item.municipionome}</span>
      <span style={boldTextStyle}>Estado: {item.estadonome}</span>
      <span style={boldTextStyle}>Bioma: {item.biomanome}</span>
     {item.ocorrenciaRiscoFogo !== undefined && (
        <span style={boldTextStyle}>Risco de fogo: {item.ocorrenciaRiscoFogo}</span>
      )}
      {item.ocorrenciafrp !== undefined && (
        <span style={boldTextStyle}>Foco: {item.ocorrenciafrp}</span>
      )}
      <span style={boldTextStyle}>Latitude: {item.ocorrenciaLatitude}</span>
      <span style={boldTextStyle}>Longitude: {item.ocorrenciaLongitude}</span>
    </div>
  );
};

export default Popup;
