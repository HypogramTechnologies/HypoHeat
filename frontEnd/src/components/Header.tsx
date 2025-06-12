import { CSSProperties, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import Card from "../components/Card";

const Header: React.FC = () => {

    // Inline styles using CSSProperties
    const styles: { [key: string]: React.CSSProperties } = {
        header: {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "80px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px",
            background: "linear-gradient(to right, rgba(0, 0, 0, 1), rgb(3, 32, 54))",
            zIndex: 1000,
        },
        logo: {
            height: "80px",
            objectFit: "contain",
        },
        link: {
            color: "white",
            fontWeight: "bold",
            textDecoration: "none",
            transition: "color 0.3s ease",
            marginTop: "20px"

        },
        linkHover: {
            color: "#ff6347",
        },
        container: {
            display: "flex",
            alignItems: "center",
            gap: "30px",
        },
        cardContainer: {
            display: "flex",
            flexDirection: "row",
            gap: "20px"
        },
        nav: {
            display: "flex",
            justifyContent: "space-between", // Uniformiza o espaço entre os links
            gap: "30px", // Controla o espaçamento entre links
            alignItems: "center",
            marginTop: "-10px"
        },
    };


    return (
        <header style={styles.header} >
            <div style={styles.container}>
                <img src="src/assets/Header.png" alt="Logo" style={styles.logo} />
                <nav style={styles.nav}>
                    <a href="/" style={styles.link}>
                        Home
                    </a>

                    <a href="/Map" style={styles.link}>
                        Mapa
                    </a>

                    <a href="/Chart" style={styles.link}>
                        Gráfico
                    </a>

                    {/* <a href="/Analytics" style={styles.link}> */}
                        {/* Análises */}
                    {/* </a> */}

                </nav>
            </div>
        </header>
    );
};

export default Header;
