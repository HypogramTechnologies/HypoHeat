import React, { CSSProperties } from "react";
import { useNavigate } from "react-router-dom";

interface CardProps {
  src: string;
  title: string;
  alt: string;
  redirectTo: string; // Define a rota de destino
}

const Card: React.FC<CardProps> = ({ src, title, alt, redirectTo }) => {
  const navigate = useNavigate(); // Hook do React Router para navegação

  const handleCardClick = () => {
    navigate(redirectTo); // Redireciona para a rota especificada
  };

  return (
    <div
      style={styles.CardStyle}
      onClick={handleCardClick}
    >
      <img style={styles.CardImageStyle} src={src} alt={alt} />
      <p style={styles.CardTitleStyle}>{title}</p>
    </div>
  );
};

export default Card;

const styles: { [key: string]: CSSProperties } = {
  CardStyle: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "200px",
    height: "250px",
    backgroundColor: "black",
    border: "solid 1px white",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  CardTitleStyle: {
    color: "white",
    marginTop: "10px",
    textAlign: "center",
    fontSize: "16px",
    fontFamily: "Arial, sans-serif",
  },
  CardImageStyle: {
    width: "100%",
    height: "70%",
    objectFit: "cover",
    borderRadius: "8px 8px 0 0",
  },
};
