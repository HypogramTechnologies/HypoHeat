import { downloadArquivoFocosQueimada } from "./BaixarArquivoFocosQueimada";
import fs from "fs";
import { pool } from "../models/db";
import { from } from "pg-copy-streams";
import { constants } from "fs/promises";

function intervaloDownload() {
  const dataAtual = new Date();

  const ultimoDiaDoMesAnterior = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 0);
  const primeiroDiaMes = dataAtual.getDate() - 1 == 0
  const diaAnterior:number = primeiroDiaMes ? ultimoDiaDoMesAnterior.getDate() : dataAtual.getDate() - 1;
  const datasFormatadas:string[] = [];
  let dataFormatada:string = '';

  for (let dia = 1; dia <= diaAnterior; dia++) {
    const data = new Date(dataAtual.getFullYear(), primeiroDiaMes ? ultimoDiaDoMesAnterior.getMonth() : dataAtual.getMonth(), dia);
    dataFormatada = `${data.getFullYear()}${String(data.getMonth() + 1).padStart(2, '0')}${String(data.getDate()).padStart(2, '0')}`;
    datasFormatadas.push(dataFormatada);
    
  }

  return datasFormatadas;
}


async function processarCargaQueimadas() {
  const datasformatadas:string[] = intervaloDownload();
  console.log("Datas formatadas para download:", datasformatadas);
  const conexao = await pool.connect();
  try {
    for (const dia of datasformatadas) {
      const { nomeArquivo, caminhoArquivo } =
        await downloadArquivoFocosQueimada(`${dia}`);

      await conexao.query(`
        DROP TABLE IF EXISTS Temp_Ocorrencia;
        CREATE TEMP TABLE Temp_Ocorrencia (
            id UUID,
            lat NUMERIC(10,8),
            lon NUMERIC(10,8),
            data_hora_gmt TEXT,
            satelite VARCHAR(40),
            municipio VARCHAR(100),
            estado VARCHAR(40),
            pais VARCHAR(40),
            municipio_id INT,
            estado_id INT,
            pais_id INT,
            numero_dias_sem_chuva TEXT,
            precipitacao TEXT,
            risco_fogo TEXT,
            bioma VARCHAR(40),
            frp TEXT
        );
      `);

      const stream = await conexao.query(
        from(`
      COPY Temp_Ocorrencia FROM STDIN WITH (FORMAT csv, HEADER true, DELIMITER ',')
    `)
      );
      const fileStream = fs.createReadStream(caminhoArquivo);
      await new Promise((resolve, reject) => {
        fileStream.pipe(stream).on("finish", resolve).on("error", reject);
      });

      await conexao.query(`
      CALL ProcessarOcorrencias();
      `);

      console.log("Carga concluída com sucesso!");

      if (fs.existsSync(caminhoArquivo)) {
        fs.unlinkSync(caminhoArquivo);
        console.log(`Arquivo ${nomeArquivo} deletado com sucesso!`);
      }
    }
  } catch (error) {
    console.error("Erro no processamento:", error);
  } finally {
    conexao.release();
  }
}

processarCargaQueimadas();
