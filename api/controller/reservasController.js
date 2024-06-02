const pool = require('./db');
exports.getAllReservas = (req, res) => {
  pool.query('SELECT id, id_cliente, ubicacion_recogida, destino, fecha_hora FROM reservas', (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al obtener las reservas' });
    } else {
      res.json(results);
    }
  });
};

exports.getReservaById = (req, res) => {
  const { id } = req.params;
  pool.query('SELECT * FROM reservas WHERE id = ?', [id], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al obtener la reserva' });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'Reserva no encontrada' });
    } else {
      res.json(results[0]);
    }
  });
};

exports.createReserva = (req, res) => {
  const { id_cliente, ubicacion_recogida, destino, fecha_hora,id_chofer } = req.body;
  pool.query('INSERT INTO reservas (id_cliente, ubicacion_recogida, destino, fecha_hora , id_chofer) VALUES (?, ?, ?, ?,?)', [id_cliente, ubicacion_recogida, destino, fecha_hora , id_chofer], (error, results) => {
    const id_reserva = results.insertId;
    if (error) {
      res.status(500).json({ error: 'Error al crear la reserva' });
    } else {
      res.status(201).json({ message: 'Reserva creada exitosamente ', idreserva: id_reserva });
    }
  });
};

exports.updateReserva = (req, res) => {
  const { id_cliente, ubicacion_recogida, destino, fecha_hora , id_chofer} = req.body;
  const { id } = req.params;
  pool.query('UPDATE reservas SET id_cliente = ?, ubicacion_recogida = ?, destino = ?, fecha_hora = ? , id_chofer = ? WHERE id = ?', [id_cliente, ubicacion_recogida, destino, fecha_hora,id_chofer, id], (error) => {
    if (error) {
      res.status(500).json({ error: 'Error al actualizar la reserva' });
    } else {
      res.json({ message: 'Reserva actualizada exitosamente' });
    }
  });
};

exports.deleteReserva = (req, res) => {
  const { id } = req.params;
  pool.query('DELETE FROM reservas WHERE id = ?', [id], (error) => {
    if (error) {
      res.status(500).json({ error: 'Error al eliminar la reserva' });
    } else {
      res.json({ message: 'Reserva eliminada exitosamente' });
    }
  });
};
exports.getReservasByChoferId = (req, res) => {
  const { id } = req.params; // ID del chofer proporcionado como parámetro en la URL

  const query = `
    SELECT 
      r.id AS reserva_id, 
      r.id_cliente,
      c.nombre AS nombre_cliente, 
      c.apellido AS apellido_cliente, 
      c.domicilio AS domicilio_cliente,
      r.ubicacion_recogida, 
      r.destino, 
      r.fecha_hora
    FROM 
      reservas r
    JOIN 
      clientes c ON r.id_cliente = c.id
    WHERE 
      r.id_chofer = ?
  `;

  pool.query(query, [id], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al obtener las reservas del chofer' });
    } else {
      res.json(results);
    }
  });
};