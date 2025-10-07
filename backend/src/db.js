require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
	user: process.env.DB_USER || process.env.PGUSER,
	host: process.env.DB_HOST || process.env.PGHOST || 'localhost',
	database: process.env.DB_DATABASE || process.env.PGDATABASE,
	password: process.env.DB_PASSWORD || process.env.PGPASSWORD,
	port: parseInt(process.env.DB_PORT, 10) || 5432,
	max: 10,
	idleTimeoutMillis: 30000,
});

pool.on('error', (err) => {
	console.error('Unexpected error on idle pg client', err);
});

async function query(text, params) {
	const start = Date.now();
	const res = await pool.query(text, params);
	const duration = Date.now() - start;
	console.log('executed query', { text, duration, rows: res.rowCount });
	return res;
}

module.exports = {
	query,
	pool,
};
