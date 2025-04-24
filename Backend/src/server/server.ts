import express from "express";
import { pool } from "./models/db";
import cors from "cors";
import ocorrenciaRoutes from "./routes/ocorrenciaRoutes";
import filtrosRoutes from "./routes/FiltrosRoutes";

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
server.use("/api", filtrosRoutes);

export { server };
