const pool = require('./db');

// Obtener todos los socios
exports.getAllSocios = (req, res) => {
  pool.query('SELECT * FROM socios', (error, results) => {
    if (error) {
      console.log(results);
      res.status(500).json({ error: 'Error al obtener los socios' });
    } else {
      res.json(results);
    }
  });
};

// Obtener un socio por su ID
exports.getSocioById = (req, res) => {
  const { id } = req.params;
  pool.query('SELECT * FROM socios WHERE id = ?', id, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al obtener el socio' });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'Socio no encontrado' });
    } else {
      res.json(results[0]);
    }
  });
};

// Crear un nuevo socio
exports.createSocio = (req, res) => {
  const { Nombre, CI, Celular, Direccion, Licencia, Placa, id_grupo } = req.body;
  pool.query('INSERT INTO socios (Nombre, CI, Celular, Direccion, Licencia, Placa, id_grupo) VALUES (?, ?, ?, ?, ?, ?, ?)', [Nombre, CI, Celular, Direccion, Licencia, Placa, id_grupo], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al crear el socio' });
    } else {
      res.status(201).json({ message: 'Socio creado exitosamente', id: results.insertId });
    }
  });
};

// Actualizar un socio existente
exports.updateSocio = (req, res) => {
  const { Nombre, CI, Celular, Direccion, Licencia, Placa, id_grupo } = req.body;
  const { id } = req.params;
  pool.query('UPDATE socios SET Nombre = ?, CI = ?, Celular = ?, Direccion = ?, Licencia = ?, Placa = ?, id_grupo = ? WHERE id = ?', [Nombre, CI, Celular, Direccion, Licencia, Placa, id_grupo, id], (error) => {
    if (error) {
      res.status(500).json({ error: 'Error al actualizar el socio' });
    } else {
      res.json({ message: 'Socio actualizado exitosamente' });
    }
  });
};

// Eliminar un socio por su ID
exports.deleteSocio = (req, res) => {
  const { id } = req.params;
  pool.query('DELETE FROM socios WHERE id = ?', id, (error) => {
    if (error) {
      res.status(500).json({ error: 'Error al eliminar el socio' });
    } else {
      res.json({ message: 'Socio eliminado exitosamente' });
    }
  });
};
exports.getPlacasBySocioId = (req, res) => {
  const { id } = req.params;
  pool.query('SELECT Placa FROM socios WHERE id = ?', id, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al obtener las placas del socio' });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'Socio no encontrado' });
    } else {
      res.json(results);
    }
  });
};
exports.getAllLicencias = (req, res) => {
  pool.query('SELECT DISTINCT Licencia FROM socios', (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al obtener las licencias de los socios' });
    } else {
      const licencias = results.map(result => result.Licencia);
      res.json(licencias);
    }
  });
};
exports.getSocioByLicencia = (req, res) => {
  const { licencia } = req.params;
  pool.query('SELECT * FROM socios WHERE Licencia = ?', licencia, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al obtener el socio por licencia' });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'Socio no encontrado con esta licencia' });
    } else {
      res.json(results[0]);
    }
  });
};
exports.getSocioByLicenciaWithParadaGrupo = (req, res) => {
  const { licencia } = req.params;
  const query = `
  SELECT s.id AS id_socio, s.Nombre AS nombre_socio, s.CI, s.Celular, s.Direccion, s.Licencia, s.Placa,
  p.id AS id_parada, p.Nombre_parada, g.Nombre_grupo
FROM socios s
JOIN paradas p ON s.id_grupo = p.id_grupo
JOIN grupos g ON s.id_grupo = g.id
WHERE s.Licencia = ?;
  `;
  pool.query(query, licencia, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al obtener el socio por licencia con parada y grupo' });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'Socio no encontrado con esta licencia' });
    } else {
      res.json(results[0]);
    }
  });
};