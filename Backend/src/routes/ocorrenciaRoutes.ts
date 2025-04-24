import { Router } from "express"; 
import ocorrencia from "../controllers/OcorrenciaController";

const routes = Router();

routes.get("/focos-calor", ocorrencia.Filtrar_foco_calor);

export default routes;