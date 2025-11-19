const db = require('../src/db');

async function run() {
  try {
    const userId = process.argv[2] || 11;
    
    console.log(`\nBuscando detalles para usuario ID: ${userId}\n`);
    
    const result = await db.query(
      'SELECT * FROM detalles_candidato WHERE id_usuario = $1',
      [userId]
    );
    
    if (result.rowCount === 0) {
      console.log('❌ No se encontró registro en detalles_candidato');
      console.log('\nCreando registro...');
      
      await db.query(
        'INSERT INTO detalles_candidato (id_usuario) VALUES ($1)',
        [userId]
      );
      
      console.log('✓ Registro creado exitosamente');
    } else {
      console.log('✓ Registro encontrado:');
      console.log(result.rows[0]);
    }
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
