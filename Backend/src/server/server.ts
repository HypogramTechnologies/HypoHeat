import express from "express";
import { pool } from "./db";
import cors from "cors";
import ocorrenciaRoutes from "../routes/ocorrenciaRoutes"; 

pool
  .connect()
  .then(() => {
    console.log("Connected to PostgreSQL database!");
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });

const server = express();

server.use(cors());
server.use(express.json());

server.use("/api", ocorrenciaRoutes);

server.get("/", (req, res) => {
  res.send("Hello HypoHeat!");
});

export { server };
