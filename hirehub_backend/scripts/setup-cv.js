const db = require('../src/db');
const fs = require('fs');
const path = require('path');

async function run() {
  try {
    console.log('Adding cv_url column to detalles_candidato...');
    
    const sqlPath = path.join(__dirname, 'add-cv-column.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    await db.query(sql);
    
    console.log('✓ CV column added successfully!');
  } catch (err) {
    console.error('Error:', err.message || err);
    process.exitCode = 1;
  } finally {
    try {
      await db.pool.end();
    } catch (e) {
      // ignore
    }
  }
}

run();
