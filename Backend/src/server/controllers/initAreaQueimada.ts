import { query } from "../models/db";

async function validarEstadosBiomas() {
  try {
    const estadosResult = await query(`SELECT * FROM estados_areas;`);
    const biomasResult = await query(`SELECT * FROM biomas_areas;`);

    if (!estadosResult?.length)
      throw new Error("Tabela de estados não existe.");
    if (!biomasResult?.length) throw new Error("Tabela de biomas não existe.");

    return true;
  } catch (error) {
    console.error("Erro ao verificar tabelas de estados e biomas:", error);
    return false;
  }
}

export async function getQueryAreaQueimada(): Promise<string | null> {
  const isOk = await validarEstadosBiomas();
  if (!isOk) return null;

  return `
CREATE OR REPLACE FUNCTION public.prc_area_queimada(
    data_inicio TIMESTAMP DEFAULT NULL,
    data_fim TIMESTAMP DEFAULT NULL,
    satelite_nome TEXT DEFAULT NULL,
    bioma_nome TEXT DEFAULT NULL,
    filtro_estadonome TEXT DEFAULT NULL
)
RETURNS TABLE (
    biomanome TEXT,
    estadonome TEXT,
    data_min_ocorrencia DATE,
    data_max_ocorrencia DATE,
    area_queimada_geom GEOMETRY,
    area_queimada_km2 NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        vwo.biomanome::TEXT,
        vwo.estadonome::TEXT,
        MIN(vwo.ocorrenciadatahora)::DATE,
        MAX(vwo.ocorrenciadatahora)::DATE,
        ST_Union(
            ST_Transform(
                ST_Buffer(
                    ST_Transform(loc.localizacao_ocorrenciageometria, 3857),
                    CASE
                        WHEN vwo.satelitenome ILIKE '%GOES%' THEN 2000
                        ELSE 500
                    END
                ),
                4326
            )
        ),
        ROUND(
            (
                ST_Area(
                    ST_Union(
                        ST_Buffer(
                            ST_Transform(loc.localizacao_ocorrenciageometria, 3857),
                            CASE
                                WHEN vwo.satelitenome ILIKE '%GOES%' THEN 2000
                                ELSE 500
                            END
                        )
                    )
                ) / 1000000.0
            )::NUMERIC, 2
        )
    FROM
        localizacao_ocorrencia loc
    JOIN
        view_ocorrencias vwo ON vwo.ocorrenciaid = loc.ocorrenciaid
    WHERE
        (data_inicio IS NULL OR vwo.ocorrenciadatahora >= data_inicio)
        AND (data_fim IS NULL OR vwo.ocorrenciadatahora <= data_fim)
        AND (satelite_nome IS NULL OR vwo.satelitenome ILIKE '%' || satelite_nome || '%')
        AND (bioma_nome IS NULL OR vwo.biomanome ILIKE '%' || bioma_nome || '%')
        AND (filtro_estadonome IS NULL OR vwo.estadonome ILIKE '%' || filtro_estadonome || '%')
    GROUP BY
        vwo.biomanome, vwo.estadonome;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION public.prc_area_queimada_geojson(
    data_inicio TIMESTAMP DEFAULT NULL,
    data_fim TIMESTAMP DEFAULT NULL,
    satelite_nome TEXT DEFAULT NULL,
    bioma_nome TEXT DEFAULT NULL,
    filtro_estadonome TEXT DEFAULT NULL
)
RETURNS TABLE (
    biomanome TEXT,
    estadonome TEXT,
    data_min_ocorrencia DATE,
    data_max_ocorrencia DATE,
    geojson TEXT,
    area_queimada_km2 NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        vwo.biomanome::TEXT,
        vwo.estadonome::TEXT,
        MIN(vwo.ocorrenciadatahora)::DATE,
        MAX(vwo.ocorrenciadatahora)::DATE,
        ST_AsGeoJSON(
            ST_Union(
                ST_Transform(
                    ST_Buffer(
                        ST_Transform(loc.localizacao_ocorrenciageometria, 3857),
                        CASE
                            WHEN vwo.satelitenome ILIKE '%GOES%' THEN 2000
                            ELSE 500
                        END
                    ),
                    4326
                )
            )
        )::TEXT AS geojson,
        ROUND(
(
            ST_Area(
                ST_Union(
                    ST_Buffer(
                        ST_Transform(loc.localizacao_ocorrenciageometria, 3857),
                        CASE
                            WHEN vwo.satelitenome ILIKE '%GOES%' THEN 2000
                            ELSE 500
                        END
                    )
                ) 
            ) / 1000000.0
) ::NUMERIC, 2
        ) AS area_queimada_km2
    FROM
        localizacao_ocorrencia loc
    JOIN
        view_ocorrencias vwo ON vwo.ocorrenciaid = loc.ocorrenciaid
    WHERE
        (data_inicio IS NULL OR vwo.ocorrenciadatahora >= data_inicio)
        AND (data_fim IS NULL OR vwo.ocorrenciadatahora <= data_fim)
        AND (satelite_nome IS NULL OR vwo.satelitenome ILIKE '%' || satelite_nome || '%')
        AND (bioma_nome IS NULL OR vwo.biomanome ILIKE '%' || bioma_nome || '%')
        AND (filtro_estadonome IS NULL OR vwo.estadonome ILIKE '%' || filtro_estadonome || '%')
    GROUP BY
        vwo.biomanome, vwo.estadonome;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.prc_percentual_area_queimada_estado_bioma(
    data_inicio TIMESTAMP DEFAULT NULL,
    data_fim TIMESTAMP DEFAULT NULL,
    satelite_nome TEXT DEFAULT NULL,
    bioma_nome TEXT DEFAULT NULL,
    filtro_estadonome TEXT DEFAULT NULL
)
RETURNS TABLE (
    nm_uf TEXT,
    sigla_uf TEXT,
    bioma TEXT,
    data_min_ocorrencia DATE,
    data_max_ocorrencia DATE,
    area_bioma_no_estado_km2 NUMERIC,
    area_queimada_km2 NUMERIC,
    percentual_queimado NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    WITH estado_bioma_intersecao AS (
        SELECT
            ea.cd_uf::TEXT,
            ea.nm_uf::TEXT,
            ea.sigla_uf::TEXT,
            ba.cd_bioma::TEXT,
            ba.bioma::TEXT,
            ST_Intersection(
                ST_Transform(ea.geom, 3857),
                ST_Transform(ba.geom, 3857)
            ) AS geom_intersecao
        FROM
            estados_areas ea
        JOIN
            biomas_areas ba
            ON ST_Intersects(ea.geom, ba.geom)
        WHERE
            (bioma_nome IS NULL OR ba.bioma ILIKE '%' || bioma_nome || '%') AND
            (filtro_estadonome IS NULL OR ea.nm_uf ILIKE '%' || filtro_estadonome || '%')
    ),
    area_queimada_unificada AS (
        SELECT
            ST_Union(
                ST_Transform(
                    ST_Buffer(
                        ST_Transform(loc.localizacao_ocorrenciageometria, 3857),
                        CASE
                            WHEN vwo.satelitenome ILIKE '%GOES%' THEN 2000
                            ELSE 500
                        END
                    ),
                    4326
                )
            ) AS area_queimada_geom,
            MIN(vwo.ocorrenciadatahora)::DATE AS data_min,
            MAX(vwo.ocorrenciadatahora)::DATE AS data_max
        FROM
            localizacao_ocorrencia loc
        JOIN
            view_ocorrencias vwo ON vwo.ocorrenciaid = loc.ocorrenciaid
        WHERE
            (data_inicio IS NULL OR vwo.ocorrenciadatahora >= data_inicio)
            AND (data_fim IS NULL OR vwo.ocorrenciadatahora <= data_fim)
            AND (satelite_nome IS NULL OR vwo.satelitenome ILIKE '%' || satelite_nome || '%')
            AND (bioma_nome IS NULL OR vwo.biomanome ILIKE '%' || bioma_nome || '%')
    )
    SELECT
        ebi.nm_uf,
        ebi.sigla_uf,
        ebi.bioma,
        aq.data_min,
        aq.data_max,
        ROUND((ST_Area(ebi.geom_intersecao) / 1000000.0)::NUMERIC, 2) AS area_bioma_no_estado_km2,
        ROUND((
            ST_Area(ST_Intersection(ebi.geom_intersecao, ST_Transform(aq.area_queimada_geom, 3857))) / 1000000.0
        )::NUMERIC, 2) AS area_queimada_km2,
        ROUND((
            ST_Area(ST_Intersection(ebi.geom_intersecao, ST_Transform(aq.area_queimada_geom, 3857))) /
            NULLIF(ST_Area(ebi.geom_intersecao), 0)
        )::NUMERIC * 100, 2) AS percentual_queimado
    FROM
        estado_bioma_intersecao ebi,
        area_queimada_unificada aq
    WHERE
        ST_IsValid(ebi.geom_intersecao)
        AND ST_Area(ebi.geom_intersecao) > 0;
END;
$$ LANGUAGE plpgsql;
`;
}

