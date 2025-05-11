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
     const filtro: Filtro = req.body || {};
     const consulta = `
        SELECT * FROM prc_area_queimada_geojson(
          ${filtro.dataInicial ? `'${filtro.dataInicial}'::TIMESTAMP` : 'NULL::TIMESTAMP'},
          ${filtro.dataFinal ? `'${filtro.dataFinal}'::TIMESTAMP` : 'NULL::TIMESTAMP'},
          ${filtro.bioma ? `'${filtro.bioma}'::TEXT` : 'NULL::TEXT'},
          ${filtro.estado ? `'${filtro.estado}'::TEXT` : 'NULL::TEXT'}
        );
  `;
    console.log(consulta);
    const r: any = await query(consulta);
    res.json(r);
  }

    public async Filtrar_area_queimada_percentual(req: Request, res: Response): Promise<void> {
     const filtro: Filtro = req.body || {};
     const consulta = `
        SELECT * FROM prc_percentual_area_queimada_estado_bioma(
          ${filtro.dataInicial ? `'${filtro.dataInicial}'::TIMESTAMP` : 'NULL::TIMESTAMP'},
          ${filtro.dataFinal ? `'${filtro.dataFinal}'::TIMESTAMP` : 'NULL::TIMESTAMP'},
          ${filtro.bioma ? `'${filtro.bioma}'::TEXT` : 'NULL::TEXT'},
          ${filtro.estado ? `'${filtro.estado}'::TEXT` : 'NULL::TEXT'}
        );
  `;
    const r: any = await query(consulta);
    res.json(r);

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
