import { Router } from "express";
import filtroController from "../controllers/FiltroController";

const routes = Router();

routes.get("/estados", filtroController.Estados);
routes.get("/biomas", filtroController.Biomas);

export default routes;
