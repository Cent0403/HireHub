const db = require('../src/db');
const fs = require('fs');
const path = require('path');

async function run() {
  try {
    console.log('Creating forum tables...');
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'create-forum-tables.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Execute the SQL
    await db.query(sql);
    
    console.log('✓ Forum tables created successfully!');
  } catch (err) {
    console.error('Error creating forum tables:', err.message || err);
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
