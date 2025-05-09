import { Router } from "express";
import ocorrencia from "../controllers/OcorrenciaController";
import filtro from "../controllers/FiltroController";

const routes = Router();

routes.post("/focos-calor", ocorrencia.Filtrar_foco_calor);
routes.post("/risco-fogo", ocorrencia.Filtrar_risco_fogo);
routes.get("/area-queimada", ocorrencia.Filtrar_area_queimada);
routes.get("/estados", filtro.Estados);
routes.get("/biomas", filtro.Biomas);

export default routes;
