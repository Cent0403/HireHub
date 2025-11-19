const db = require('../src/db');
const fs = require('fs');
const path = require('path');

async function run() {
  try {
    console.log('Modificando tabla detalles_candidato...');
    
    const sqlPath = path.join(__dirname, 'fix-detalles-candidato.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    await db.query(sql);
    
    console.log('✓ Tabla modificada exitosamente!');
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
