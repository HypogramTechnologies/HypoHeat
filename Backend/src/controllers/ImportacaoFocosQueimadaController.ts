import { downloadArquivoFocosQueimada } from "./BaixarArquivoFocosQueimada";
import fs from "fs";
import { pool } from "../server/db";
import { from } from "pg-copy-streams";

async function processarCargaQueimadas() {
  const conexao = await pool.connect();
  try {
    const { nomeArquivo, caminhoArquivo } = await downloadArquivoFocosQueimada();

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
  } catch (error) {
    console.error("Erro no processamento:", error);
  } finally {
    conexao.release();
  }
}

processarCargaQueimadas();
