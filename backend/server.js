const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./conexion'); // tu conexión

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Hacer visible la carpeta "fronted"
app.use(express.static(path.join(__dirname, '../fronted')));


// =========================
//   GUARDAR PEDIDO
// =========================
app.post('/guardar-pedido', async (req, res) => {
    try {
        const { nombre, fecha, hora, direccion, orden } = req.body;

        const query = `
            INSERT INTO pedidos (cliente, orden, fecha, hora, direccion)
            VALUES ($1, $2, $3, $4, $5)
        `;

        await pool.query(query, [nombre, orden, fecha, hora, direccion]);

        res.json({ mensaje: "Pedido guardado correctamente" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al guardar el pedido" });
    }
});

//======================
// MOSTRAR
//======================

app.get('/pedidos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM pedidos');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener pedidos');
    }
});

//==========================
// MODIFICAR 
//==========================

app.put('/modificar-pedido/:id', async (req, res) => {
    try {
        const id = req.params.id; // <-- Express siempre maneja el parámetro sin comillas
        const { nombre, fecha, hora, direccion, orden } = req.body;

        const query = `
            UPDATE pedidos
            SET cliente = $1, orden = $2, fecha = $3, hora = $4, direccion = $5
            WHERE "id" = $6
        `;

        await pool.query(query, [nombre, orden, fecha, hora, direccion, id]);

        res.json({ mensaje: "Pedido modificado correctamente" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al modificar el pedido" });
    }
});

//==========================
// ELIMINAR
//==========================

app.delete("/eliminar-pedido/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const query = `
            DELETE FROM pedidos
            WHERE "id" = $1
        `;

        await pool.query(query, [id]);

        res.json({ mensaje: "Pedido eliminado correctamente" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al eliminar el pedido" });
    }
});



// =========================
//   RUTA DE PRUEBA
// =========================
app.get('/api/pedidos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM pedidos');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error en la consulta');
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
