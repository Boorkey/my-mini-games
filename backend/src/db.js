import pkg from "pg";
import dotenv from "dotenv";

console.log("Database here");


dotenv.config();

const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
