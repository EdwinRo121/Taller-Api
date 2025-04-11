const express = require('express');
const client = require('./bd.js'); // conexión a PostgreSQL
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Prueba
app.get('/api/prueba', (req, res) => {
    res.send('API funcionando correctamente');
});

// Crear persona
app.post('/api/persona', async (req, res) => {
    const { nombre, apellido1, apellido2, dni } = req.body;
    const query = 'INSERT INTO persona (nombre, apellido1, apellido2, dni) VALUES ($1, $2, $3, $4)';

    try {
        await client.query(query, [nombre, apellido1, apellido2, dni]);
        res.status(201).json({ mensaje: "Persona guardada con éxito", nombre, apellido1, apellido2, dni });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener todas las personas
app.get('/api/obtener/personas', async (req, res) => {
    const query = 'SELECT * FROM persona';

    try {
        const result = await client.query(query);
        res.status(200).json({
            success: true,
            message: "Lista de personas",
            data: result.rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener las personas",
            details: error.message
        });
    }
});

// Eliminar persona por id
app.delete('/api/eliminar/persona/:id', async (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM persona WHERE id = $1';

    try {
        const result = await client.query(query, [id]);
        if (result.rowCount === 0) {
            res.status(404).json({ success: false, message: `No existe persona con id ${id}` });
        } else {
            res.status(200).json({ success: true, message: "Persona eliminada correctamente" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al eliminar", details: error.message });
    }
});

// Actualizar persona
app.put('/api/persona/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido1, apellido2, dni } = req.body;
    const query = 'UPDATE persona SET nombre=$1, apellido1=$2, apellido2=$3, dni=$4 WHERE id=$5';

    try {
        const result = await client.query(query, [nombre, apellido1, apellido2, dni, id]);
        if (result.rowCount === 0) {
            res.status(404).json({ success: false, message: `No se encontró persona con id ${id}` });
        } else {
            res.status(200).json({
                success: true,
                message: "Persona actualizada correctamente",
                data: { id, nombre, apellido1, apellido2, dni }
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al actualizar", details: error.message });
    }
});

// Crear coche
app.post('/api/coche', async (req, res) => {
  const { matricula, marca, modelo, caballos, persona_id } = req.body;
  const query = 'INSERT INTO coche (matricula, marca, modelo, caballos, persona_id) VALUES ($1, $2, $3, $4, $5)';

  try {
      await client.query(query, [matricula, marca, modelo, caballos, persona_id]);
      res.status(201).json({ mensaje: "Coche guardado con éxito", matricula, marca, modelo, caballos, persona_id });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Obtener todos los coches
app.get('/api/obtener/coches', async (req, res) => {
  const query = 'SELECT * FROM coche';

  try {
      const result = await client.query(query);
      res.status(200).json({
          success: true,
          message: "Lista de coches",
          data: result.rows
      });
  } catch (error) {
      res.status(500).json({
          success: false,
          message: "Error al obtener los coches",
          details: error.message
      });
  }
});

// Obtener coches de una persona
app.get('/api/obtener/persona/:id/coches', async (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM coche WHERE persona_id = $1';

  try {
      const result = await client.query(query, [id]);
      res.status(200).json({
          success: true,
          message: `Coches de la persona con id ${id}`,
          data: result.rows
      });
  } catch (error) {
      res.status(500).json({
          success: false,
          message: "Error al obtener coches",
          details: error.message
      });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
