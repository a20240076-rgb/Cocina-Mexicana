const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'la_cocina_mexicana',
    password: '123456789', // <-- 
    port: 5432,
    max: 10,          // conexiones máximas
    idleTimeoutMillis: 30000 // tiempo máxima de conexión inactiva
});

module.exports = pool;
