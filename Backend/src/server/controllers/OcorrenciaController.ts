import { Request, Response } from "express";
import { query } from "../models/db";

interface Filtro {
  bioma?: string;
  estado?: string;
  dataInicial?: string;
  dataFinal?: string;
  tipoBusca?: string;
}

/* select estadonome, biomanome, AVG(ocorrenciariscofogo) as ocorrenciariscofogo, SUM(ocorrenciafrp) as ocorrenciafrp
from view_ocorrencias  where ocorrenciafrp > 0 and ocorrenciariscofogo > 0  and ocorrenciadatahora >= '2025-05-01 00:00:00' 
and ocorrenciadatahora <= '2025-05-20 00:00:00' GROUP BY estadonome, biomanome */

const cache = new Map<string, string>();

class OcorrenciaController {
  public async Filtrar_foco_calor(req: Request, res: Response): Promise<void> {
    //Filtrar por satélite (validar)

    const filtro: Filtro = req.body;
    const consulta: string = `SELECT * FROM view_ocorrencias`;
    const condicaoFiltroCalor: string = `ocorrenciafrp > 0 ORDER BY ocorrenciafrp DESC`;
    const consultaEstruturada: string = estrutrarConsulta(
      consulta,
      filtro,
      condicaoFiltroCalor
    );

    await validarCache(res, filtro, consultaEstruturada);

  }

/*   public async Filtrar_foco_calor_agrupado(req: Request, res: Response): Promise<void> {
    const filtro: Filtro = req.body;
    const consulta: string = `SELECT * FROM view_ocorrencias_agrupadas`;
    const condicaoFiltroCalor: string = `ocorrenciafrp > 0 ORDER BY ocorrenciafrp DESC`;
    const consultaEstruturada: string = estrutrarConsulta(
      consulta,
      filtro,
      condicaoFiltroCalor
    );

    await validarCache(res, filtro, consultaEstruturada);
  } */

  public async Filtrar_risco_fogo(req: Request, res: Response): Promise<void> {
    const filtro: Filtro = req.body;
    const consulta: string = `SELECT * FROM view_risco_fogo`;
    const consultaEstruturada: string = estrutrarConsulta(consulta, filtro);
    await validarCache(res, filtro, consultaEstruturada);
  }

  public async Filtrar_area_queimada(
    req: Request,
    res: Response
  ): Promise<void> {
    const filtro: Filtro = req.body || {};
    const consulta = `
        SELECT * FROM prc_area_queimada_geojson(
          ${
            filtro.dataInicial
              ? `'${filtro.dataInicial}'::TIMESTAMP`
              : "NULL::TIMESTAMP"
          },
          ${
            filtro.dataFinal
              ? `'${filtro.dataFinal}'::TIMESTAMP`
              : "NULL::TIMESTAMP"
          },
          ${"NULL::TEXT"},
          ${filtro.bioma ? `'${filtro.bioma}'::TEXT` : "NULL::TEXT"},
          ${filtro.estado ? `'${filtro.estado}'::TEXT` : "NULL::TEXT"}
        );
  `;
    console.log(consulta)
    await validarCache(res, filtro, consulta);
  }

  public async Filtrar_area_queimada_percentual(
    req: Request,
    res: Response
  ): Promise<void> {
    const filtro: Filtro = req.body || {};
    const consulta = `
        SELECT * FROM prc_percentual_area_queimada_estado_bioma(
          ${
            filtro.dataInicial
              ? `'${filtro.dataInicial}'::TIMESTAMP`
              : "NULL::TIMESTAMP"
          },
          ${
            filtro.dataFinal
              ? `'${filtro.dataFinal}'::TIMESTAMP`
              : "NULL::TIMESTAMP"
          },
          ${"NULL::TEXT"},
          ${filtro.bioma ? `'${filtro.bioma}'::TEXT` : "NULL::TEXT"},
          ${filtro.estado ? `'${filtro.estado}'::TEXT` : "NULL::TEXT"}
        );
  `;
    /* console.log('Área queimada percentual: ', consulta) */
    await validarCache(res, filtro, consulta);
  }
}

export default new OcorrenciaController();

function estrutrarConsulta(
  consulta: string,
  filtro: Filtro,
  condicaoExtra?: string
): string {
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

async function validarCache(
  res: Response,
  filtro: Filtro,
  consulta: string
): Promise<void> {
  const chaveCache = JSON.stringify(filtro);

  if (cache.has(chaveCache)) {
    const resultado = cache.get(chaveCache);
    /* console.log(resultado) */
    console.log("Possui cache.");
    res.json(resultado);
  } else {
    const resultado: any = await query(consulta);
    /* console.log(resultado) */
    /* cache.set(chaveCache, resultado); */
    console.log("Não possui cache.");
    res.json(resultado);
  }
}
