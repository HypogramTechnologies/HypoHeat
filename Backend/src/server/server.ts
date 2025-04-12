import express from "express";
import pool from "./db";

pool
  .connect()
  .then(() => {
    console.log("Connected to PostgreSQL database!");
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });

const server = express();

server.get("/", (req, res) => {
  res.send("Hello HypoHeat!");
});

export { server };
