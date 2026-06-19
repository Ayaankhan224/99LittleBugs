const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
});

const initDb = async () => {
  const createUsersTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      plan VARCHAR(50) DEFAULT 'free',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  const alterUsersTableQuery = `
    ALTER TABLE users ADD COLUMN IF NOT EXISTS plan VARCHAR(50) DEFAULT 'free';
  `;
  try {
    const client = await pool.connect();
    console.log("Connected to PostgreSQL successfully");
    await client.query(createUsersTableQuery);
    await client.query(alterUsersTableQuery);
    console.log("Users table verified/created and schema updated");
    client.release();
  } catch (error) {
    console.error("Database connection/initialization failed:", error.message);
  }
};

initDb();

module.exports = pool;
