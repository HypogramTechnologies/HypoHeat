import { execSync } from 'child_process';
import { config } from 'dotenv';

// Carrega variáveis do .env
config();

// Lê argumentos CLI simples: --estados=... --biomas=...
const args = process.argv.slice(2).reduce<Record<string, string>>((acc, arg) => {
  const [key, value] = arg.replace(/^--/, '').split('=');
  acc[key] = value;
  return acc;
}, {});

// Caminhos dos executáveis do PostGIS
const SHP2PGSQL = `"C:\\Program Files\\PostgreSQL\\17\\bin\\shp2pgsql.exe"`;
const PSQL = `"C:\\Program Files\\PostgreSQL\\17\\bin\\psql.exe"`;

// Banco de dados
const DB = process.env.DB_NAME;
const USER = process.env.DB_USER || 'postgres';

// Caminhos dos arquivos .shp (CLI > .env)
const estadosShp = process.env.ESTADOS_SHP;
const biomasShp = args.biomas || process.env.BIOMAS_SHP;

if (!DB || !estadosShp || !biomasShp) {
  console.error('❌ Erro: Faltando variáveis obrigatórias (DB_NAME, ESTADOS_SHP, BIOMAS_SHP)');
  process.exit(1);
}

try {
  console.log('Convertendo estados...');
  execSync(`${SHP2PGSQL} -I -s 4326 "${estadosShp}" estados_areas > estados_areas.sql`, { stdio: 'inherit' });

  console.log('Importando estados...');
  execSync(`${PSQL} -U ${USER} -d ${DB} -f estados_areas.sql`, { stdio: 'inherit' });

  console.log('Convertendo biomas...');
  execSync(`${SHP2PGSQL} -I -s 4326 "${biomasShp}" biomas_areas > biomas_areas.sql`, { stdio: 'inherit' });

  console.log('Importando biomas...');
  execSync(`${PSQL} -U ${USER} -d ${DB} -f biomas_areas.sql`, { stdio: 'inherit' });

  console.log('✅ Importação concluída com sucesso!');
// eslint-disable-next-line @typescript-eslint/no-explicit-any
} catch (error: any) {
  console.error('❌ Erro durante a importação:', error.message);
}
 