import { query } from "../server/db";

async function init() {
  return await query(`
    START TRANSACTION;

    DROP VIEW IF EXISTS view_Ocorrencias;
    DROP TABLE IF EXISTS Ocorrencia;
    DROP TABLE IF EXISTS Municipio;
    DROP TABLE IF EXISTS Estado;
    DROP TABLE IF EXISTS Pais;
    DROP TABLE IF EXISTS Bioma;
    DROP TABLE IF EXISTS Satelite;

    CREATE TABLE Satelite (
      SateliteID   SERIAL NOT NULL,
      SateliteNome VARCHAR(40) NOT NULL,
      PRIMARY KEY (SateliteID)
    );

    CREATE UNIQUE INDEX USATELITE1 ON Satelite (
      SateliteNome
    );

    CREATE TABLE Bioma (
      BiomaID   SERIAL NOT NULL,
      BiomaNome VARCHAR(40) NOT NULL,
      PRIMARY KEY (BiomaID)
    );

    CREATE UNIQUE INDEX UBIOMA ON Bioma (
      BiomaNome
    );

    CREATE TABLE Pais (
      PaisID   SERIAL  NOT NULL,
      PaisNome VARCHAR(40),
      PRIMARY KEY (PaisID)
    );

    CREATE UNIQUE INDEX UPAIS ON Pais (
      PaisNome
    );

    CREATE TABLE Estado (
      EstadoID   SERIAL  NOT NULL,
      PaisID     INT,
      EstadoNome VARCHAR(40),
      PRIMARY KEY (EstadoID)
    );

    ALTER TABLE Estado
      ADD CONSTRAINT FK_Estado_Pais FOREIGN KEY (PaisID) REFERENCES Pais(PaisID);

    ALTER TABLE Estado 
      ADD CONSTRAINT estado_unique UNIQUE (EstadoNome, PaisID);

    CREATE TABLE Municipio (
      MunicipioID   SERIAL  NOT NULL,
      EstadoID      INT,
      MunicipioNome VARCHAR(100),
      PRIMARY KEY (MunicipioID)
    );

    ALTER TABLE Municipio
      ADD CONSTRAINT FK_Municipio_Estado FOREIGN KEY (EstadoID) REFERENCES Estado(EstadoID);

    ALTER TABLE Municipio 
      ADD CONSTRAINT municipio_unique UNIQUE (MunicipioNome, EstadoID);

    CREATE TABLE Ocorrencia (
      OcorrenciaID        SERIAL NOT NULL,
      MunicipioID         INT,
      BiomaID             INT,
      OcorrenciaDataHora  TIMESTAMP WITHOUT TIME ZONE,
      SateliteID          INT,
      OcorrenciaDiaSemChuva   INT,
      OcorrenciaPrecipitacao  INT,
      OcorrenciaRiscoFogo     INT,
      OcorrenciaLatitude      NUMERIC(10,8),
      OcorrenciaLongitude     NUMERIC(11,8),
      OcorrenciaFRP           INT,
      PRIMARY KEY (OcorrenciaID)
    );

    CREATE INDEX IOCORRENCIA1 ON Ocorrencia (
      SateliteID
    );

    CREATE INDEX IOCORRENCIA2 ON Ocorrencia (
      BiomaID
    );

    CREATE INDEX IOCORRENCIA3 ON Ocorrencia (
      MunicipioID
    );

    ALTER TABLE Ocorrencia
      ADD CONSTRAINT FK_Ocorrencia_Municipio FOREIGN KEY (MunicipioID) REFERENCES Municipio(MunicipioID);

    ALTER TABLE Ocorrencia
      ADD CONSTRAINT FK_Ocorrencia_Bioma FOREIGN KEY (BiomaID) REFERENCES Bioma(BiomaID);

    ALTER TABLE Ocorrencia
      ADD CONSTRAINT FK_Ocorrencia_Satelite FOREIGN KEY (SateliteID) REFERENCES Satelite(SateliteID);

    CREATE OR REPLACE VIEW view_Ocorrencias AS
    SELECT 
      OC.OcorrenciaID,
      OC.MunicipioID,
      MC.MunicipioNome,
      MC.EstadoID,
      ET.EstadoNome,
      ET.PaisID, 
      PS.PaisNome,
      OC.BiomaID,
      BM.BiomaNome,
      OC.Ocorrenciadatahora,
      OC.SateliteID, 
      ST.SateliteNome,
      OC.OcorrenciaDiaSemChuva,
      OC.OcorrenciaPrecipitacao,
      OC.OcorrenciaRiscoFogo,
      OC.OcorrenciaLatitude,
      OC.OcorrenciaLongitude,
      OC.OcorrenciaFRP
    FROM Ocorrencia AS OC
    INNER JOIN Bioma AS BM ON OC.BiomaID = BM.BiomaID
    INNER JOIN Satelite ST ON OC.SateliteID = ST.SateliteID
    INNER JOIN Municipio AS MC ON OC.MunicipioID = MC.MunicipioID
    INNER JOIN Estado AS ET ON MC.EstadoID = ET.EstadoID
    INNER JOIN Pais AS PS ON ET.PaisID = PS.PaisID;

    CREATE OR REPLACE PROCEDURE ProcessarOcorrencias()
    LANGUAGE plpgsql
    AS $$
    BEGIN
      INSERT INTO Satelite (SateliteNome)
      SELECT DISTINCT Satelite FROM Temp_Ocorrencia
      WHERE Satelite IS NOT NULL
      ON CONFLICT (SateliteNome) DO NOTHING;

      INSERT INTO Pais (PaisNome)
      SELECT DISTINCT Pais FROM Temp_Ocorrencia
      WHERE Pais IS NOT NULL
      ON CONFLICT (PaisNome) DO NOTHING;

      INSERT INTO Estado (EstadoNome, PaisID)
      SELECT DISTINCT t.Estado, p.PaisID
      FROM Temp_Ocorrencia t
      JOIN Pais p ON t.Pais = p.PaisNome
      WHERE t.estado IS NOT NULL
      ON CONFLICT (EstadoNome, PaisID) DO NOTHING;

      INSERT INTO Municipio (MunicipioNome, EstadoID)
      SELECT DISTINCT t.Municipio, e.EstadoID
      FROM Temp_Ocorrencia t
      JOIN Estado e ON t.Estado = e.EstadoNome
      WHERE t.municipio IS NOT NULL
      ON CONFLICT (MunicipioNome, EstadoID) DO NOTHING;

      INSERT INTO Bioma (BiomaNome)
      SELECT DISTINCT Bioma FROM Temp_Ocorrencia
      WHERE Bioma IS NOT NULL
      ON CONFLICT (BiomaNome) DO NOTHING;

      INSERT INTO Ocorrencia (
        OcorrenciaDataHora, 
        SateliteID, 
        MunicipioID, 
        BiomaID, 
        OcorrenciaDiaSemChuva,
        OcorrenciaPrecipitacao, 
        OcorrenciaRiscoFogo, 
        OcorrenciaLatitude, 
        OcorrenciaLongitude, 
        OcorrenciaFRP
      )
      SELECT 
        TO_TIMESTAMP(t.data_hora_gmt, 'YYYY/MM/DD HH24:MI:SS'), 
        s.SateliteID, 
        m.MunicipioID, 
        COALESCE(b.BiomaID, NULL) AS BiomaID, 
        CAST(t.numero_dias_sem_chuva AS NUMERIC),
        CAST(t.precipitacao AS NUMERIC),
        CAST(t.risco_fogo AS NUMERIC), 
        t.lat::NUMERIC(10,8), 
        t.lon::NUMERIC(10,8), 
        CAST(t.FRP AS NUMERIC)
      FROM Temp_Ocorrencia t
      JOIN Satelite s ON t.Satelite = s.SateliteNome
      JOIN Municipio m ON t.Municipio = m.MunicipioNome
      LEFT JOIN Bioma b ON t.Bioma = b.BiomaNome
      WHERE t.data_hora_gmt IS NOT NULL
        AND t.lat IS NOT NULL
        AND t.lon IS NOT NULL;
    END $$;

    COMMIT;
  `);
}

init()
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.error(err);
  });
