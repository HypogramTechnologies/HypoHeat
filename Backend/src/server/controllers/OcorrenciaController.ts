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
    //Filtrar por satélite (validar)
    const filtro: Filtro = req.body;
    const consulta:string = `SELECT * FROM view_ocorrencias`
    const condicaoFiltroCalor: string = `ocorrenciafrp > 0 ORDER BY ocorrenciafrp DESC`;
    const consultaEstruturada: string = estrutrarConsulta(
      consulta,
      filtro,
      condicaoFiltroCalor
    );
    const r: any = await query(consultaEstruturada);

    res.json(r);
  }

  public async Filtrar_risco_fogo(req: Request, res: Response): Promise<void> {
    const filtro: Filtro = req.body;
    const consulta:string = `SELECT * FROM view_risco_fogo`
    const consultaEstruturada: string = estrutrarConsulta(
      consulta,
      filtro
    );
    const r: any = await query(consultaEstruturada);

    res.json(r);
  }


  public async Filtrar_area_queimada(req: Request, res: Response): Promise<void> {
    /* Validar a área de insterseção entre o bioma e o estado, validar os pontos dentro dessa área, estabelecer a área queimada e a intesidade (frp) para colorir o mapa. */


/*     const filtro: Filtro = req.body;
    const condicaoFiltroCalor: string = `ocorrenciariscofogo > 0`;
    const consultaEstruturada: string = estrutrarConsulta(
      filtro,
      condicaoFiltroCalor
    );
    const r: any = await query(consultaEstruturada); */

    res.json({status: "EM DESENVOLVIMENTO"});
  }
}

export default new OcorrenciaController();

function estrutrarConsulta(consulta:string, filtro: Filtro, condicaoExtra?: string): string {
  let condicoes: string[] = [];

  if (filtro) {
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
  }

  if (condicaoExtra) {
    condicoes.push(condicaoExtra);
  }

  if (condicoes.length > 0) {
    consulta += " WHERE " + condicoes.join(" AND ");
  }

  return consulta;
}
