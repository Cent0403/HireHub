// Simple DB connectivity test for HireHub
// Usage: node scripts/test-db.js

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
    // Ensure pool is closed so the process can exit cleanly
    try {
      await db.pool.end();
    } catch (e) {
      // ignore
    }
  }
}

run();
