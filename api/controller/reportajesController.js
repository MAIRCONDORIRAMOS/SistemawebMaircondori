const pool = require('./db');
exports.getAllReportajes = (req, res) => {
  pool.query('SELECT * FROM reportajes', (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al obtener los reportajes' });
    } else {
      res.json(results);
    }
  });
};

exports.getReportajeById = (req, res) => {
  const { id } = req.params;
  pool.query('SELECT r.id AS id_reportaje, s.Nombre AS nombre_socio, s.CI, s.Celular, s.Direccion, s.Licencia, s.Placa, g.Nombre_grupo AS nombre_grupo_socio, p.Nombre_parada, gp.Nombre_grupo AS nombre_grupo_parada, r.Fecha, r.Mes, r.Costo FROM reportajes r JOIN socios s ON r.id_socio = s.id JOIN paradas p ON r.id_parada = p.id JOIN grupos g ON s.id_grupo = g.id JOIN grupos gp ON p.id_grupo = gp.id WHERE r.id = ?', id, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al obtener el reportaje' });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'Reportaje no encontrado' });
    } else {
      res.json(results[0]);
    }
  });
};
exports.createReportaje = (req, res) => {
  const { id_socio, Fecha, Mes, Costo, id_parada } = req.body;
  pool.query('INSERT INTO reportajes (id_socio, Fecha, Mes, Costo, id_parada) VALUES (?, ?, ?, ?, ?)',
             [id_socio, Fecha, Mes, Costo, id_parada],
             (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al crear el reportaje' });
    } else {
      res.status(201).json({ message: 'Reportaje creado exitosamente', id: results.insertId });
    }
  });
};

exports.updateReportaje = (req, res) => {
  const { id_socio, Fecha, Mes, Costo, id_parada } = req.body;
  const { id } = req.params;
  pool.query('UPDATE reportajes SET id_socio = ?, Fecha = ?, Mes = ?, Costo = ?, id_parada = ? WHERE id = ?',
             [id_socio, Fecha, Mes, Costo, id_parada, id],
             (error) => {
    if (error) {
      res.status(500).json({ error: 'Error al actualizar el reportaje' });
    } else {
      res.json({ message: 'Reportaje actualizado exitosamente' });
    }
  });
};

exports.deleteReportaje = (req, res) => {
  const { id } = req.params;
  pool.query('DELETE FROM reportajes WHERE id = ?', id, (error) => {
    if (error) {
      res.status(500).json({ error: 'Error al eliminar el reportaje' });
    } else {
      res.json({ message: 'Reportaje eliminado exitosamente' });
    }
  });
};

exports.getReportajesWithSocioName = (req, res) => {
    const query = `
    SELECT r.id, r.Fecha, r.Mes, r.Costo, s.Nombre AS nombre_socio, s.Licencia, c.Placa
    FROM reportajes r
    JOIN socios s ON r.id_socio = s.id
    LEFT JOIN choferes c ON s.id = c.id_socio
    `;
    pool.query(query, (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Error al obtener los reportajes con el nombre del socio' });
      } else {
        res.json(results);
      }
    });
  };