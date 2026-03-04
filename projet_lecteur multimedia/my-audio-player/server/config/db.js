import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.POSTGRES_USER || "radio",
  host: process.env.POSTGRES_HOST || "postgres",
  database: process.env.POSTGRES_DB || "radio_db",
  password: process.env.POSTGRES_PASSWORD || "radio123",
  port: parseInt(process.env.POSTGRES_PORT) || 5432,
});

pool.on("error", (err) => {
  console.error("Erreur PostgreSQL inattendue:", err);
});

export default pool;
