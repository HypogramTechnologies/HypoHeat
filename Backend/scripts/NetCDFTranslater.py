import os
import requests
import xarray as xr
import pandas as pd
import psycopg
from psycopg import sql
from dotenv import load_dotenv
from datetime import datetime, timedelta
import tempfile
import sys
import traceback

# Carrega variáveis de ambiente
load_dotenv()

# Conexão com o banco (agora via .env)
DB_CONFIG = {
    'host': os.getenv('DB_HOST'),
    'port': int(os.getenv('DB_PORT', 5432)),
    'dbname': os.getenv('DB_NAME'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD')
}

TABLE_NAME = 'risco_fogo'

# Calcula a data de ontem
def get_yesterday():
    yesterday = datetime.now() - timedelta(days=1)
    return yesterday.strftime("%Y%m%d")

# Monta a URL de download
def montar_url(data_arquivo):
    return f"https://dataserver-coids.inpe.br/queimadas/queimadas/riscofogo_meteorologia/observado/risco_fogo/INPE_FireRiskModel_2.2_FireRisk_{data_arquivo}.nc"

# Faz download do arquivo e salva no diretório temporário
def download_arquivo_nc(url, pasta_temp):
    local_path = os.path.join(pasta_temp, url.split('/')[-1])
    print(f"⬇️ Baixando arquivo: {url}")
    response = requests.get(url)
    response.raise_for_status()
    with open(local_path, 'wb') as f:
        f.write(response.content)
    print(f"✅ Arquivo baixado: {local_path}")
    return local_path

# Processa o NetCDF e gera o CSV
def processar_netcdf(nc_path, csv_path, data_str):
    print("🔎 Lendo arquivo NetCDF...")
    ds = xr.open_dataset(nc_path)
    data_array = ds['rf']
    df = data_array.to_dataframe().reset_index()

    print("🗺️ Filtrando área do Brasil...")
    df_brasil = df.query("lat >= -34.0 and lat <= 5.3 and lon >= -74.0 and lon <= -34.0")

    print("🧹 Removendo valores inválidos...")
    df_brasil = df_brasil[(df_brasil['rf'] != -999) & (df_brasil['rf'].notna())]

    # Ajusta o dataframe
    df_brasil = df_brasil.rename(columns={
        'time': 'data',
        'lat': 'latitude',
        'lon': 'longitude',
        'rf': 'risco_fogo'
    })

    # Sobrescreve a data com a data correta de ontem
    df_brasil['data'] = data_str

    print("💾 Exportando CSV...")
    df_brasil.to_csv(csv_path, index=False)
    print(f"✅ CSV salvo: {csv_path}")

    return df_brasil

# Insere no banco com COPY (usando o DataFrame)
import io
def importar_postgres_via_copy(df):
    print("🔌 Conectando no banco de dados...")
    copy_sql = f"COPY {TABLE_NAME} (data, latitude, longitude, risco_fogo) FROM STDIN WITH CSV HEADER DELIMITER ','"

    with psycopg.connect(**DB_CONFIG) as conn:
        with conn.cursor() as cur:
            print("🚀 Enviando dados via COPY para o PostgreSQL...")
            csv_buffer = io.StringIO()
            df.to_csv(csv_buffer, index=False)
            csv_buffer.seek(0)

            with cur.copy(copy_sql) as copy:
                for line in csv_buffer:
                    copy.write(line.encode())

            conn.commit()

    print("✅ Dados inseridos com sucesso no banco de dados via COPY.")

# Fluxo principal
def main():
    try:
        data_arquivo = get_yesterday()
        url = montar_url(data_arquivo)

        # Cria um diretório temporário
        with tempfile.TemporaryDirectory() as temp_dir:
            nc_path = download_arquivo_nc(url, temp_dir)
            csv_path = os.path.join(temp_dir, "export_brasil.csv")

            df = processar_netcdf(nc_path, csv_path,data_arquivo )
            importar_postgres_via_copy(df)

    except Exception as e:
        print("❌ Ocorreu um erro:")
        traceback.print_exc()
        sys.exit(1)

if __name__ == '__main__':
    main()
