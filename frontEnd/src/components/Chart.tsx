import { CSSProperties } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../Index.css";

export default function Chart() {
  return (
    <div style={styles.pageContainer}>
      <Header />
      <main style={styles.mainContent}>
        <h1>CHART</h1>
      </main>
      <Footer></Footer>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    minHeight: "100vh",
    overflowX: "hidden"
  },
  mainContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: "80px 30px 30px"
  },
  cardContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    flexDirection: "row",
    gap: "10px"
  },
};
