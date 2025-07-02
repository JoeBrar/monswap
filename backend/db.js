const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.POSTGRESQL_DB_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on('connect',()=>{
  console.log('Connected to DB successfully');
})

pool.on('error', (err) => {
  console.error('Unexpected DB error : ', err);
  process.exit(-1);
});

module.exports = pool;