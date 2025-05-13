import api from "./api";
import { FiltroConsulta } from "../types/Filtros";

export interface Foco {
  estadonome: string;
  ocorrenciaLatitude: number;
  ocorrenciaLongitude: number;
}

export interface RiscoFogo {
  estadonome: string;
  ocorrenciaLatitude: number;
  ocorrenciaLongitude: number;
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
    ocorrenciaLatitude: parseFloat(item.ocorrencialatitude),
    ocorrenciaLongitude: parseFloat(item.ocorrencialongitude),
  }));
};

export const riscoFogo = async (body: FiltroConsulta = {}): Promise<RiscoFogo[]> => {
  const { data } = await api.post("/risco-fogo", body);
  return (data as any[]).map((item: any) => ({
    estadonome: item.estadonome,
    ocorrenciaLatitude: parseFloat(item.ocorrencialatitude),
    ocorrenciaLongitude: parseFloat(item.ocorrencialongitude),
  }));
};

export const areaQueimada = async (body: FiltroConsulta = {}): Promise<AreaQueimada[]> => {
  const { data } = await api.post("/area-queimada", body);
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