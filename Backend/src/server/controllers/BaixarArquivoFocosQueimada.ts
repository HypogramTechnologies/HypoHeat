import fs from "fs";
const { Builder, Browser } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

const path = require("path");
const os = require("os");

export async function downloadArquivoFocosQueimada(dataParametro?: string) {
  const pastaTemporaria = path.join(os.homedir(), "Downloads");
  const pastaDownload = "C:\\Program Files\\PostgreSQL\\17\\data\\";
  
  const options = new chrome.Options();
  options.addArguments('--headless=new');
  let driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build();

  const dataOntem = new Date();
  dataOntem.setDate(dataOntem.getDate() - 1);
  const dia = String(dataOntem.getDate()).padStart(2, "0");
  const mes = String(dataOntem.getMonth() + 1).padStart(2, "0");
  const ano = dataOntem.getFullYear();
  const formatData = dataParametro ?? `${ano}${mes}${dia}`;
  const nomeArquivo: string = `focos_diario_br_${formatData}.csv`;
  const caminhoArquivoTemporario = path.join(pastaTemporaria, nomeArquivo);
  const caminhoArquivo = path.join(pastaDownload, nomeArquivo);
  try {
    await driver.get(
      "https://dataserver-coids.inpe.br/queimadas/queimadas/focos/csv/diario/Brasil/"
    );
    let arquivo = driver.findElement({
      css: `a[href*="${nomeArquivo}"]`,
    });
    await arquivo.click();
    await driver.sleep(1000);
    console.log("Aguardando download do arquivo...");

    if (fs.existsSync(caminhoArquivoTemporario)) {
      fs.renameSync(caminhoArquivoTemporario, caminhoArquivo);
      console.log("Arquivo movido para:", caminhoArquivo);
    } else {
      throw new Error("Arquivo não encontrado para mover.");
    }

    console.log("Arquivo baixado com sucesso!");
    return { nomeArquivo, caminhoArquivo };
  } catch (error) {
    console.error("Erro ao baixar o arquivo:", error);
    throw error;
  } finally {
    await driver.quit();
  }
}
