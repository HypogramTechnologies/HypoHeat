# 📄 Guia de Execução - Script Python NetCDF 🔥

Este guia explica como preparar o ambiente Python e executar o script de download e processamento de arquivos NetCDF, enviando os dados automaticamente para o banco de dados PostgreSQL.

---

## 🔧 Pré-requisitos

Antes de iniciar, verifique se você possui:

- ✅ **Python 3.10 ou superior** instalado → [Baixar Python](https://www.python.org/downloads/)

---

## 🚀 Passo 1 — Instalar as dependências Python

Abra o terminal (CMD, PowerShell, ou terminal Linux/macOS), navegue até a raiz do projeto e execute:

```bash
pip install -r requirements.txt
```

## 🚀 Passo 2- Rode o arquivo apartir do package.json

```bash
npm run pyload
```

## ⚠️ Certifique-se que o package.json já está configurado com o script correto, por exemplo:

```json

"scripts": {
  "pyload": "python ./scripts/NetCDFTranslater.py"
}
```

## ![Bandeira do Brasil](https://flagcdn.com/w40/br.png) Importação do shp do Brasil
```bash
"C:\Program Files\PostgreSQL\17\bin\shp2pgsql.exe" -I -s 4326 "C:\caminho\para\seu\arquivo\paises.shp" pais_area > pais_area.sql
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d nome_do_banco_de_dados -f pais_area.sql

```
