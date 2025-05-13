export enum TipoBusca {
  focosCalor = "focosCalor",
  riscoFogo = "riscoFogo",
  areaqueimada = "areaQueimada",
  areaQueimadaPercentual = "areaQueimadaPercentual",
}

export interface FiltroConsulta {
  estado?: string;
  bioma?: string;
  dataInicial?: string;
  dataFinal?: string;
  tipoBusca?: TipoBusca;
}
