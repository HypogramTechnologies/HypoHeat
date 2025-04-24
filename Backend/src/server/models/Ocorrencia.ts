export class Ocorrencia {
    ocorrenciaID: number;
    municipioID: number;
    biomaID: number;
    ocorrenciaDataHora: Date;
    sateliteID: number;
    ocorrenciaDiaSem: string;
    ocorrenciaPrecipitacao: number;
    ocorrenciaRiscoFogo: number;
    ocorrenciaLatitude: number;
    ocorrenciaLongitude: number;
    ocorrenciaFRP: number;
  
    constructor(
      ocorrenciaID: number,
      municipioID: number,
      biomaID: number,
      ocorrenciaDataHora: Date,
      sateliteID: number,
      ocorrenciaDiaSem: string,
      ocorrenciaPrecipitacao: number,
      ocorrenciaRiscoFogo: number,
      ocorrenciaLatitude: number,
      ocorrenciaLongitude: number,
      ocorrenciaFRP: number
    ) {
      this.ocorrenciaID = ocorrenciaID;
      this.municipioID = municipioID;
      this.biomaID = biomaID;
      this.ocorrenciaDataHora = ocorrenciaDataHora;
      this.sateliteID = sateliteID;
      this.ocorrenciaDiaSem = ocorrenciaDiaSem;
      this.ocorrenciaPrecipitacao = ocorrenciaPrecipitacao;
      this.ocorrenciaRiscoFogo = ocorrenciaRiscoFogo;
      this.ocorrenciaLatitude = ocorrenciaLatitude;
      this.ocorrenciaLongitude = ocorrenciaLongitude;
      this.ocorrenciaFRP = ocorrenciaFRP;
    }
  }
  