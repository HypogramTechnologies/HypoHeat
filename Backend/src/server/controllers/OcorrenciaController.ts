import { Request, Response } from "express";
import { query } from "../models/db";

interface Filtro {
  bioma?: string;
  estado?: string;
  dataInicial?: string;
  dataFinal?: string;
}

class OcorrenciaController {
  public async Filtrar_foco_calor(req: Request, res: Response): Promise<void> {
    const filtro: Filtro = req.body;
    let consulta: string = "SELECT * FROM view_ocorrencias";
    let condicoes: string[] = [];

    if (filtro.estado) {
      condicoes.push(`estadonome = '${filtro.estado}'`);
    }

    if (filtro.bioma) {
      condicoes.push(`biomanome = '${filtro.bioma}'`);
    }

    if (filtro.dataInicial) {
      condicoes.push(`ocorrenciadatahora >= '${filtro.dataInicial}'`);
    }

    if (filtro.dataFinal) {
      condicoes.push(`ocorrenciadatahora <= '${filtro.dataFinal}'`);
    }

    if (condicoes.length > 0) {
      consulta += " WHERE " + condicoes.join(" AND ");
      console.log(consulta);
    }

    const r: any = await query(consulta);

    res.json(r);
  }
}

export default new OcorrenciaController();
