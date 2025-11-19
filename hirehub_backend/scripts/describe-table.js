const db = require('../src/db');

async function run() {
  try {
    console.log('\nEstructura de la tabla detalles_candidato:\n');
    
    const result = await db.query(`
      SELECT 
        column_name, 
        data_type, 
        is_nullable,
        column_default
      FROM information_schema.columns 
      WHERE table_name = 'detalles_candidato'
      ORDER BY ordinal_position;
    `);
    
    result.rows.forEach(col => {
      console.log(`- ${col.column_name} (${col.data_type}) ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'} ${col.column_default ? `DEFAULT ${col.column_default}` : ''}`);
    });
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
