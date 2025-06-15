import { downloadArquivoFocosQueimada } from "./BaixarArquivoFocosQueimada";
import fs from "fs";
import { pool } from "../models/db";
import { from } from "pg-copy-streams";


async function processarCargaQueimadas() {
  const conexao = await pool.connect();

  const utlimoArquivoBaixado = await conexao.query(`SELECT * FROM ArquivoImportado ORDER BY ArquivoImportadoDataImportacao DESC LIMIT 1;`)
  let dataDownload: Date | undefined = undefined;
  if (utlimoArquivoBaixado.rows.length > 0) {
    dataDownload = new Date(utlimoArquivoBaixado.rows[0].arquivoimportadodataarquivo);
  }
  const datasformatadas:string[] = intervaloDownload(dataDownload);
  console.log("Datas formatadas para download:", datasformatadas);
  
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

      console.log("Carga concluída com sucesso.");

      const anotlimoArquivoBaixado = parseInt(dia.substring(0, 4));
      const mestlimoArquivoBaixado = parseInt(dia.substring(4, 6)) - 1;
      const diatlimoArquivoBaixado = parseInt(dia.substring(6, 8));
      
      const dataUtlimoArquivoBaixado: Date = new Date(anotlimoArquivoBaixado, mestlimoArquivoBaixado, diatlimoArquivoBaixado);

      const dataArquivo = dataUtlimoArquivoBaixado.toISOString().slice(0, 10);
      await conexao.query(`
        CALL ProcessarArquivoImportado('${nomeArquivo}', '${dataArquivo}')  
      `);

      console.log("Log do download inserido com sucesso.")

      if (fs.existsSync(caminhoArquivo)) {
        fs.unlinkSync(caminhoArquivo);
        console.log(`Arquivo ${nomeArquivo} deletado com sucesso.`);
      }

    }
  } catch (error) {
    console.error("Erro no processamento:", error);
  } finally {
    conexao.release();
  }
}

processarCargaQueimadas();


function intervaloDownload(dataUltimoDownload?: Date): string[] {
  const datasFormatadas: string[] = [];
  const hoje = new Date();
  const ontem = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 1);

  // Caso não haja arquivos baixados
  if (!dataUltimoDownload) {
    // Se for o 1° dia do mês, será feito o download dos arquivos do mês anterior
    if (hoje.getDate() === 1) {
      const ano = hoje.getMonth() === 0 ? hoje.getFullYear() - 1 : hoje.getFullYear();
      const mes = hoje.getMonth() === 0 ? 11 : hoje.getMonth() - 1;
      const diasNoMesAnterior = new Date(ano, mes + 1, 0).getDate();
      for (let d = 1; d <= diasNoMesAnterior; d++) {
        const data = new Date(ano, mes, d);
        datasFormatadas.push(
          `${data.getFullYear()}${String(data.getMonth() + 1).padStart(2, '0')}${String(data.getDate()).padStart(2, '0')}`
        );
      }
    } else {
      // Realiza o download dos arquivos do mês atual (do 1° dia do mês até o dia de ontem)
      for (let d = 1; d <= ontem.getDate(); d++) {
        const data = new Date(hoje.getFullYear(), hoje.getMonth(), d);
        datasFormatadas.push(
          `${data.getFullYear()}${String(data.getMonth() + 1).padStart(2, '0')}${String(data.getDate()).padStart(2, '0')}`
        );
      }
    }
    return datasFormatadas;
  }

  // Se o último arquivo baixado já é de ontem, o download não será realizado
  if (
    dataUltimoDownload.getFullYear() === ontem.getFullYear() &&
    dataUltimoDownload.getMonth() === ontem.getMonth() &&
    dataUltimoDownload.getDate() === ontem.getDate()
  ) {
    return [];
  }

  // O downalod será realizado da data do último arquivo baixado até o dia de ontem
  let dataInicio = new Date(dataUltimoDownload);
  dataInicio.setDate(dataInicio.getDate() + 1);

  while (
    dataInicio.getFullYear() < ontem.getFullYear() ||
    (dataInicio.getFullYear() === ontem.getFullYear() && dataInicio.getMonth() < ontem.getMonth()) ||
    (dataInicio.getFullYear() === ontem.getFullYear() && dataInicio.getMonth() === ontem.getMonth() && dataInicio.getDate() <= ontem.getDate())
  ) {
    datasFormatadas.push(
      `${dataInicio.getFullYear()}${String(dataInicio.getMonth() + 1).padStart(2, '0')}${String(dataInicio.getDate()).padStart(2, '0')}`
    );
    dataInicio.setDate(dataInicio.getDate() + 1);
  }

  return datasFormatadas;
}