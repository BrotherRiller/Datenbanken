const { Pool } = require('pg');


const pool = new Pool({
  user: process.env.POSTGRES_USER || 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  database: process.env.POSTGRES_DB || 'ridesharing',
  password: process.env.POSTGRES_PASSWORD || 'Popillol123.',
  port: 5432,
});

module.exports = pool;