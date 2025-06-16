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
        AND (filtro_estadonome IS NULL OR vwo.estadonome = filtro_estadonome)
    GROUP BY
        vwo.biomanome, vwo.estadonome;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.prc_area_queimada_geojson(data_inicio timestamp without time zone DEFAULT NULL::timestamp without time zone, data_fim timestamp without time zone DEFAULT NULL::timestamp without time zone, satelite_nome text DEFAULT NULL::text, bioma_nome text DEFAULT NULL::text, filtro_estadonome text DEFAULT NULL::text)
 RETURNS TABLE(biomanome text, estadonome text, data_min_ocorrencia date, data_max_ocorrencia date, geojson text)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    WITH OcorrenciasComBuffer AS (
        SELECT
            vwo.ocorrenciaid,
            vwo.biomanome,
            vwo.estadonome,
            vwo.ocorrenciadatahora,
            vwo.ocorrenciafrp,
            ST_Transform(
                ST_Buffer(
                    ST_Transform(loc.localizacao_ocorrenciageometria, 3857),
                    CASE
                        WHEN vwo.satelitenome ILIKE '%GOES%' THEN 2000
                        ELSE 500
                    END
                ),
                4326
            ) AS geometria_buffer,
            (ST_Area(
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
            ) / 1000000.0) AS area_buffer_km2_individual
        FROM
            localizacao_ocorrencia loc
        JOIN
            view_ocorrencias vwo ON vwo.ocorrenciaid = loc.ocorrenciaid
        WHERE
            (data_inicio IS NULL OR vwo.ocorrenciadatahora >= data_inicio)
            AND (data_fim IS NULL OR vwo.ocorrenciadatahora <= data_fim)
            AND (satelite_nome IS NULL OR vwo.satelitenome ILIKE '%' || satelite_nome || '%')
            AND (bioma_nome IS NULL OR vwo.biomanome ILIKE '%' || bioma_nome || '%')
            AND (filtro_estadonome IS NULL OR vwo.estadonome = filtro_estadonome)
    ),
    OcorrenciasComClusterID AS (
        SELECT
            ocb.*,
            ST_ClusterDBSCAN(ocb.geometria_buffer, 0, 1) OVER (PARTITION BY ocb.biomanome, ocb.estadonome) AS cluster_id
        FROM
            OcorrenciasComBuffer ocb
    ),
    PoligonosUnificadosPorCluster AS (
        SELECT
            occi.biomanome,
            occi.estadonome,
            MIN(occi.ocorrenciadatahora)::DATE AS data_min_ocorrencia_cluster,
            MAX(occi.ocorrenciadatahora)::DATE AS data_max_ocorrencia_cluster,
            ST_Union(occi.geometria_buffer) AS geometria_unificada_cluster,
            SUM(occi.ocorrenciafrp) AS frp_total_cluster,
            SUM(occi.area_buffer_km2_individual) AS area_queimada_buffers_km2_total_cluster
        FROM
            OcorrenciasComClusterID occi
        GROUP BY
            occi.biomanome, occi.estadonome, occi.cluster_id -- Agora agrupamos por bioma, estado E o ID do cluster
    )
    SELECT
        pupc.biomanome::TEXT,
        pupc.estadonome::TEXT,
        MIN(pupc.data_min_ocorrencia_cluster)::DATE AS data_min_ocorrencia, -- Mínima data de ocorrência para o grupo bioma/estado
        MAX(pupc.data_max_ocorrencia_cluster)::DATE AS data_max_ocorrencia, -- Máxima data de ocorrência para o grupo bioma/estado
        jsonb_pretty(jsonb_build_object(
            'type', 'FeatureCollection',
            'features', jsonb_agg(
                jsonb_build_object(
                    'type', 'Feature',
                    'geometry', ST_AsGeoJSON(pupc.geometria_unificada_cluster)::jsonb,
                    'properties', jsonb_build_object(
                        'biomanome', pupc.biomanome,
                        'estadonome', pupc.estadonome,
                        'data_min_ocorrencia', pupc.data_min_ocorrencia_cluster,
                        'data_max_ocorrencia', pupc.data_max_ocorrencia_cluster,
                        'area_queimada_km2', ROUND((ST_Area(pupc.geometria_unificada_cluster::GEOGRAPHY) / 1000000.0)::NUMERIC, 2),
                        'frp_total', pupc.frp_total_cluster,
                        'area_queimada_buffers_km2_total', pupc.area_queimada_buffers_km2_total_cluster
                    )
                )
            )
        )
    )::TEXT AS geojson
    FROM
        PoligonosUnificadosPorCluster pupc
    GROUP BY
        pupc.biomanome, pupc.estadonome;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.prc_percentual_area_queimada_estado_bioma(
	data_inicio timestamp without time zone DEFAULT NULL::timestamp without time zone,
	data_fim timestamp without time zone DEFAULT NULL::timestamp without time zone,
	satelite_nome text DEFAULT NULL::text,
	bioma_nome text DEFAULT NULL::text,
	filtro_estadonome text DEFAULT NULL::text)
    RETURNS TABLE(nm_uf text, sigla_uf text, bioma text, data_ocorrencia date, area_bioma_no_estado_km2 numeric, area_queimada_km2 numeric, percentual_queimado numeric) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
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
    area_queimada_por_data AS (
        SELECT
            DATE(vwo.ocorrenciadatahora) AS data_ocorrencia,
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
            ) AS area_queimada_geom
        FROM
            localizacao_ocorrencia loc
        JOIN
            view_ocorrencias vwo ON vwo.ocorrenciaid = loc.ocorrenciaid
        WHERE
            (data_inicio IS NULL OR vwo.ocorrenciadatahora >= data_inicio)
            AND (data_fim IS NULL OR vwo.ocorrenciadatahora <= data_fim)
            AND (satelite_nome IS NULL OR vwo.satelitenome ILIKE '%' || satelite_nome || '%')
            AND (bioma_nome IS NULL OR vwo.biomanome ILIKE '%' || bioma_nome || '%')
        GROUP BY
            DATE(vwo.ocorrenciadatahora)
    )
    SELECT
        ebi.nm_uf,
        ebi.sigla_uf,
        ebi.bioma,
        aq.data_ocorrencia,
        ROUND((ST_Area(ebi.geom_intersecao) / 1000000.0)::NUMERIC, 2) AS area_bioma_no_estado_km2,
        ROUND(( 
            ST_Area(ST_Intersection(ebi.geom_intersecao, ST_Transform(aq.area_queimada_geom, 3857))) / 1000000.0
        )::NUMERIC, 2) AS area_queimada_km2,
        ROUND((
            ST_Area(ST_Intersection(ebi.geom_intersecao, ST_Transform(aq.area_queimada_geom, 3857))) /
            NULLIF(ST_Area(ebi.geom_intersecao), 0)
        )::NUMERIC * 100, 2) AS percentual_queimado
    FROM
        estado_bioma_intersecao ebi
    JOIN
        area_queimada_por_data aq ON ST_Intersects(ebi.geom_intersecao, ST_Transform(aq.area_queimada_geom, 3857))
    WHERE
        ST_IsValid(ebi.geom_intersecao)
        AND ST_Area(ebi.geom_intersecao) > 0;
END;
$BODY$;


--VIEW DE ÁREA QUEIMADA
CREATE OR REPLACE VIEW public.view_area_queimada AS
    SELECT
        vwo.biomanome,
        vwo.estadonome,
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
            )::numeric, 2
        ) AS area_queimada_km2
    FROM
        localizacao_ocorrencia loc
    JOIN
        view_ocorrencias vwo ON vwo.ocorrenciaid = loc.ocorrenciaid
    GROUP BY
        vwo.biomanome, vwo.estadonome;
`;
}

