const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function main() {
  try {
    console.log('Connecting to PostgreSQL database...');
    const res = await pool.query('SELECT NOW()');
    console.log('Success! Database time:', res.rows[0]);

    const tablesRes = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('Existing tables:', tablesRes.rows.map(r => r.table_name));

  } catch (err) {
    console.error('Database query failed:', err);
  } finally {
    await pool.end();
  }
}

main();
