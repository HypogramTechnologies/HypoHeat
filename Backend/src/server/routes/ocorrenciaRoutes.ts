import { Router } from "express";
import ocorrencia from "../controllers/OcorrenciaController";
import filtro from "../controllers/FiltroController";

const routes = Router();

routes.get("/focos-calor", ocorrencia.Filtrar_foco_calor);
routes.get("/estados", filtro.Estados);
routes.get("/biomas", filtro.Biomas);

export default routes;
