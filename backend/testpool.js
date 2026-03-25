const pool = require('./conexion');

async function testPool() {
    try {
        const res = await pool.query('SELECT NOW()');
        console.log("Conexión exitosa ✔");
        console.log("Hora servidor:", res.rows[0]);
    } catch (err) {
        console.error("Error ❌", err);
    } finally {
        pool.end();
    }
}

testPool();

