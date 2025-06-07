import api from "./api";
import { FiltroConsulta } from "../types/Filtros";
import { geoJSON } from "leaflet";

export interface Foco {
  estadonome: string;
  biomanome: string;
  municipionome: string;
  ocorrenciaLatitude: number;
  ocorrenciaLongitude: number;
  ocorrenciafrp:number;

}

export interface RiscoFogo {
  estadonome: string;
  biomanome: string;
  municipionome: string;
  ocorrenciaLatitude: number;
  ocorrenciaLongitude: number;
  ocorrenciaRiscoFogo: number;
}

export interface AreaQueimada {
  biomanome: string;
  estadonome: string;
  dataInicio: string;
  dataFim: string;
  geojson: AreaQueimadaGeoJSON;
}

export interface AreaQueimadaGeoJSON {
  type: 'FeatureCollection';
  features: AreaQueimadaFeature[];
}

export interface AreaQueimadaFeature {
  type: 'Feature';
  geometry: {
    type: string;
    coordinates: number[][][];
  };
  properties: AreaQueimadaFeatureProperties;
}

export interface AreaQueimadaFeatureProperties {
  biomanome: string;
  estadonome: string;
  frpTotal: number;
  area_queimada_km2: number;
  dataMaxOcorrencia: string;
  dataMinOcorrencia: string;
  areaQueimadaBuffersKm2Total: number;
}

export interface AreaQueimadaPercentual {
  biomanome: string;
  estadonome: string;
  dataInicio: string;
  dataFim: string;
  areaQueimadaKm2: number;
  areaqueimadaPercentual: number;
}

export interface FiltroOcorrenciaAgrupado {
  estadonome: string;
  biomanome: string;
  municipionome: string;
  ocorrenciariscofogo: number;
  ocorrenciafrp: number;
  ocorrenciadatahora: Date;
}

export interface EstadoBiomaArea {
  estadonome: string;
  biomanome: string;
  tipo: string;
  geojson: string;

}


export const focosCalor = async (body: FiltroConsulta = {}): Promise<Foco[]> => {
  const { data } = await api.post("/focos-calor", body);
  return (data as any[]).map((item: any) => ({
    estadonome: item.estadonome,
    biomanome: item.biomanome,
    municipionome: item.municipionome,
    ocorrenciaLatitude: parseFloat(item.ocorrencialatitude),
    ocorrenciaLongitude: parseFloat(item.ocorrencialongitude),
    ocorrenciafrp: parseFloat(item.ocorrenciafrp)
  }));
};

export const riscoFogo = async (body: FiltroConsulta = {}): Promise<RiscoFogo[]> => {
  const { data } = await api.post("/risco-fogo", body);
  return (data as any[]).map((item: any) => ({
    estadonome: item.estadonome,
    biomanome: item.biomanome,
    municipionome: item.municipionome,
    ocorrenciaLatitude: parseFloat(item.ocorrencialatitude),
    ocorrenciaLongitude: parseFloat(item.ocorrencialongitude),
    ocorrenciaRiscoFogo: parseFloat(item.ocorrenciariscofogo)
  }));
};

export const areaQueimada = async (body: FiltroConsulta = {}): Promise<AreaQueimada[]> => {
  const { data } = await api.post("/area-queimada", body);
  /* console.log(data) */
  return (data as any[]).map((item: any) => ({
    biomanome: item.biomanome,
    estadonome: item.estadonome,
    dataInicio: item.dataInicio,
    dataFim: item.dataFim,
    geojson: item.geojson,
  }));
};

export const areaQueimadaPercentual = async (
  body: FiltroConsulta = {}
): Promise<AreaQueimadaPercentual[]> => {
  const { data } = await api.post("/area-queimada-percentual", body);
  return (data as any[]).map((item: any) => ({
    biomanome: item.biomanome,
    estadonome: item.estadonome,
    dataInicio: item.dataInicio,
    dataFim: item.dataFim,
    areaQueimadaKm2: parseFloat(item.areaQueimadaKm2),
    areaqueimadaPercentual: parseFloat(item.areaqueimadaPercentual),
  }));
};

export const filtroOcorrenciaAgrupado = async (body: FiltroConsulta = {}): Promise<FiltroOcorrenciaAgrupado[]> => {
  const { data } = await api.post("/ocorrencia-agrupada", body);
  return (data as any[]).map((item: any) => ({
    estadonome: item.estadonome,
    biomanome: item.biomanome,
    municipionome: item.municipionome,
    ocorrenciariscofogo: parseFloat(item.ocorrenciariscofogo),
    ocorrenciafrp: parseFloat(item.ocorrenciafrp),
    ocorrenciadatahora: item.ocorrenciadatahora
  }));
};

export const estadoBiomaArea = async (
  body: FiltroConsulta = {}
): Promise<EstadoBiomaArea[]> => {
  const { data } = await api.post("/estado-bioma-area", body);
  return (data as any[]).map((item: any) => ({
    biomanome: item.biomanome,
    estadonome: item.estadonome,
    tipo: item.tipo,
    geojson: item.geojson
  }));
};
