import pg from "pg";

const pool = new pg.Pool({
  user: "postgres",
  password: "1",
  host: "localhost",
  port: 5432,
  database: "gohere"
});

export default pool;
