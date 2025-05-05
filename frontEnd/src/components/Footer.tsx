import { CSSProperties } from "react";

const Footer: React.FC = () => {
  const styles: { [key: string]: React.CSSProperties } = {
    footer: {
      position: "relative",
      bottom: 0,
      left: 0,
      width: "100%",
      height: "10%",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "white",
      padding: "0 20px",
      background: "linear-gradient(to right, rgba(0, 0, 0, 1), rgb(3, 32, 54))",

    },
    textContainer: {
      textAlign: "center",
      fontFamily: "Arial, sans-serif",
      color: "white",
      width: "100%", // Largura responsiva para manter margens nas laterais
      fontSize: "12px", // Texto ajustável conforme o tamanho da tela
    },
    logo: {
     marginTop: "2%",
      height: "100%", // Altura da logo relativa ao footer
      marginBottom: "2%", // Espaçamento entre a logo e o texto
    },
  };

  return (
    <footer style={styles.footer}>
      <img src="src/assets/Footer.png" alt="Logo da HypoHeat" style={styles.logo} />
      <div style={styles.textContainer}>
        <p>© 2025 Desenvolvido pela Hypogram. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
