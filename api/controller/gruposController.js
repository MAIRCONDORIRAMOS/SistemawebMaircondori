const pool = require('./db');
exports.getAllGrupos = (req, res) => {
  pool.query('SELECT * FROM grupos', (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al obtener los grupos' });
    } else {
      res.json(results);
    }
  });
};

exports.getGrupoById = (req, res) => {
  const { id } = req.params;
  pool.query('SELECT * FROM grupos WHERE id = ?', id, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al obtener el grupo' });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'Grupo no encontrado' });
    } else {
      res.json(results[0]);
    }
  });
};

exports.createGrupo = (req, res) => {
  const { Nombre_grupo } = req.body;
  pool.query('INSERT INTO grupos (Nombre_grupo) VALUES (?)', [Nombre_grupo], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al crear el grupo' });
    } else {
      res.status(201).json({ message: 'Grupo creado exitosamente', id: results.insertId });
    }
  });
};

exports.updateGrupo = (req, res) => {
  const { Nombre_grupo } = req.body;
  const { id } = req.params;
  pool.query('UPDATE grupos SET Nombre_grupo = ? WHERE id = ?', [Nombre_grupo, id], (error) => {
    if (error) {
      res.status(500).json({ error: 'Error al actualizar el grupo' });
    } else {
      res.json({ message: 'Grupo actualizado exitosamente' });
    }
  });
};

exports.deleteGrupo = (req, res) => {
  const { id } = req.params;
  pool.query('DELETE FROM grupos WHERE id = ?', id, (error) => {
    if (error) {
      res.status(500).json({ error: 'Error al eliminar el grupo' });
    } else {
      res.json({ message: 'Grupo eliminado exitosamente' });
    }
  });
};
