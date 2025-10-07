const db = require('../src/db');

async function run() {
  try {
    console.log('Testing DB connection...');
    const res = await db.query('SELECT NOW()');
    console.log('DB connected. Server time:', res.rows[0]);
  } catch (err) {
    console.error('DB test failed:', err.message || err);
    process.exitCode = 1;
  } finally {
    try {
      await db.pool.end();
    } catch (e) {
    }
  }
}

run();
