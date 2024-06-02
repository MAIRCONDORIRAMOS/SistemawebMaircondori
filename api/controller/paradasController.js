const pool = require('./db');
// Obtener todas las paradas
exports.getAllParadas = (req, res) => {
  pool.query('SELECT * FROM paradas', (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al obtener las paradas' });
    } else {
      res.json(results);
    }
  });
};

// Obtener una parada por su ID
exports.getParadaById = (req, res) => {
  const { id } = req.params;
  pool.query('SELECT * FROM paradas WHERE id = ?', id, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al obtener la parada' });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'Parada no encontrada' });
    } else {
      res.json(results[0]);
    }
  });
};

// Crear una nueva parada
exports.createParada = (req, res) => {
  const { Nombre_parada, id_grupo } = req.body;
  pool.query('INSERT INTO paradas (Nombre_parada, id_grupo) VALUES (?, ?)', [Nombre_parada, id_grupo], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al crear la parada' });
    } else {
      res.status(201).json({ message: 'Parada creada exitosamente', id: results.insertId });
    }
  });
};

// Actualizar una parada existente
exports.updateParada = (req, res) => {
  const {  id_grupo } = req.body;
  const { id } = req.params;
  pool.query('UPDATE paradas SET  id_grupo = ? WHERE id = ?', [ id_grupo, id], (error) => {
    if (error) {
      res.status(500).json({ error: 'Error al actualizar la parada' });
    } else {
      res.json({ message: 'Parada actualizada exitosamente' });
    }
  });
};

// Eliminar una parada por su ID
exports.deleteParada = (req, res) => {
  const { id } = req.params;
  pool.query('DELETE FROM paradas WHERE id = ?', id, (error) => {
    if (error) {
      res.status(500).json({ error: 'Error al eliminar la parada' });
    } else {
      res.json({ message: 'Parada eliminada exitosamente' });
    }
  });
};
