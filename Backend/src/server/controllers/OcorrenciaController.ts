import { Request, Response } from "express";
import { query } from "../models/db";

class OcorrenciaController {
  public async Filtrar_foco_calor(_: Request, res: Response): Promise<void> {
    const r: any = await query(
      "SELECT ocorrencialatitude, ocorrencialongitude FROM ocorrencia WHERE ocorrenciadatahora BETWEEN '2025-04-10 00:10:00.000' AND '2025-04-20 00:10:00.000'"
    );
    res.json(r);
  }
}

export default new OcorrenciaController();
