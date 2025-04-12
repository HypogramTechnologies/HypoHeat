import { Pool } from "pg";
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "hypoheat",
  password: "1234",
  port: 5432,
});

export default pool;
