const pool = require('./db');
exports.getAllHojasDeRuta = (req, res) => {
  pool.query('SELECT * FROM hoja_de_ruta', (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al obtener las hojas de ruta' });
    } else {
      res.json(results);
    }
  });
};

exports.getHojaDeRutaById = (req, res) => {
  const { id } = req.params;
  pool.query('SELECT * FROM hoja_de_ruta WHERE id = ?', [id], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al obtener la hoja de ruta' });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'Hoja de ruta no encontrada' });
    } else {
      res.json(results[0]);
    }
  });
};

exports.createHojaDeRuta = (req, res) => {
  const { id_reportaje, fecha_marcacion } = req.body;
  pool.query('INSERT INTO hoja_de_ruta (id_reportaje, fecha_marcacion) VALUES (?, ?)', [id_reportaje, fecha_marcacion], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al crear la hoja de ruta' });
    } else {
      res.status(201).json({ message: 'Hoja de ruta creada exitosamente', id: results.insertId });
    }
  });
};

exports.updateHojaDeRuta = (req, res) => {
  const { id } = req.params; // ID de la hoja de ruta a actualizar
  const { fecha_marcacion } = req.body; // Fecha de marcación seleccionada

  pool.query(
    'UPDATE hoja_de_ruta SET fecha_marcacion = ? WHERE id = ?',
    [fecha_marcacion, id],
    (error) => {
      if (error) {
        res.status(500).json({ error: 'Error al actualizar la hoja de ruta' });
      } else {
        res.json({ message: 'Hoja de ruta actualizada exitosamente' });
      }
    }
  );
};

exports.deleteHojaDeRuta = (req, res) => {
  const { id } = req.params;
  pool.query('DELETE FROM hoja_de_ruta WHERE id = ?', [id], (error) => {
    if (error) {
      res.status(500).json({ error: 'Error al eliminar la hoja de ruta' });
    } else {
      res.json({ message: 'Hoja de ruta eliminada exitosamente' });
    }
  });
};
exports.getHojaDeRutaByPlaca = (req, res) => {
  const { placa } = req.params;
  pool.query(`
  SELECT
  h.id AS hoja_id,
  h.id_reportaje,
  h.Fecha_marcacion,
  r.id AS reportaje_id,
  r.id_socio,
  r.Fecha AS reportaje_fecha,
  r.Mes AS reportaje_mes,
  r.Costo AS reportaje_costo,
  r.id_parada,
  s.id AS socio_id,
  s.Nombre AS socio_nombre,
  s.CI AS socio_ci,
  s.Celular AS socio_celular,
  s.Direccion AS socio_direccion,
  s.Licencia AS socio_licencia,
  s.Placa AS socio_placa,
  s.id_grupo AS socio_id_grupo,
  c.id AS chofer_id,
  c.Nombre_completo AS chofer_nombre_completo,
  c.CI AS chofer_ci,
  c.Licencia AS chofer_licencia,
  c.Placa AS chofer_placa,
  g_socio.Nombre_grupo AS grupo_nombre,
  p.Nombre_parada AS parada_nombre
FROM
  choferes c
INNER JOIN
  socios s ON c.id_socio = s.id
INNER JOIN
  reportajes r ON s.id = r.id_socio
INNER JOIN
  (SELECT * FROM hoja_de_ruta ORDER BY id DESC LIMIT 1) h ON r.id = h.id_reportaje
INNER JOIN
  paradas p ON r.id_parada = p.id
INNER JOIN
  grupos g_socio ON s.id_grupo = g_socio.id
WHERE
  c.Placa = ?; 
  `, [placa], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al obtener la hoja de ruta' });
    } else {
      res.json(results[0]);
    }
  });
};