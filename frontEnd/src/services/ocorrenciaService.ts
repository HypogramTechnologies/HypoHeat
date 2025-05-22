import api from "./api";
import { FiltroConsulta } from "../types/Filtros";

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
  geojson: string;
}

export interface AreaQueimadaPercentual {
  biomanome: string;
  estadonome: string;
  dataInicio: string;
  dataFim: string;
  areaQueimadaKm2: number;
  areaqueimadaPercentual: number;
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