const pool = require('./db');
exports.getAllViajes = (req, res) => {
  pool.query('SELECT id, estado, precio, tiempoderecogida, id_chofer, id_reservas FROM viajes', (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al obtener los viajes' });
    } else {
      res.json(results);
    }
  });
};

exports.getViajeById = (req, res) => {
  const { id } = req.params;
  pool.query('SELECT id, estado, precio, tiempoderecogida, id_chofer, id_reservas FROM viajes WHERE id = ?', [id], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al obtener el viaje' });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'Viaje no encontrado' });
    } else {
      res.json(results[0]);
    }
  });
};

exports.createViaje = async (req, res) => {
  const { id_chofer, id_reservas } = req.body;
  const estado = 'noconfirmado'; // Estado por defecto: no confirmado

  try {
    const insertViajeQuery = 'INSERT INTO viajes (estado, id_chofer, id_reservas) VALUES (?, ?, ?)';
    await pool.query(insertViajeQuery, [estado, id_chofer, id_reservas]);

    res.status(201).json({ message: 'Viaje creado exitosamente' });
  } catch (error) {
    console.error('Error al crear el viaje:', error);
    res.status(500).json({ error: 'Error al crear el viaje' });
  }
};
exports.updateViaje = (req, res) => {
  const { estado, precio, tiempoderecogida } = req.body;
  const { id } = req.params;
  pool.query('UPDATE viajes SET estado = ?, precio = ?, tiempoderecogida = ? WHERE id_reservas = ?', 
    [estado, precio, tiempoderecogida, id], 
    (error) => {
      if (error) {
        res.status(500).json({ error: 'Error al actualizar el viaje' });
      } else {
        res.json({ message: 'Viaje actualizado exitosamente' });
      }
  });
};
exports.deleteViaje = (req, res) => {
  const { id } = req.params;
  pool.query('DELETE FROM viajes WHERE id = ?', [id], (error) => {
    if (error) {
      res.status(500).json({ error: 'Error al eliminar el viaje' });
    } else {
      res.json({ message: 'Viaje eliminado exitosamente' });
    }
  });
};
exports.getViajesByChofer = (req, res) => {
  const { id_chofer } = req.params;

  const query = `
    SELECT v.id, v.estado, v.precio, v.id_reservas, 
           r.id AS reserva_id, r.id_cliente, c.nombre AS nombre_cliente, c.apellido AS apellido_cliente, c.domicilio,
           r.ubicacion_recogida, r.destino, r.fecha_hora, r.id_chofer
    FROM viajes v
    INNER JOIN reservas r ON v.id_reservas = r.id
    INNER JOIN clientes c ON r.id_cliente = c.id
    WHERE v.id_chofer = ?;
  `;

  pool.query(query, [id_chofer], (error, results) => {
    if (error) {
      console.error('Error al obtener los viajes:', error);
      res.status(500).json({ error: 'Error al obtener los viajes' });
    } else {
      res.json(results);
    }
  });
};
exports.getViajeByReservaId = (req, res) => {
  const { id_reserva, id_cliente } = req.params; // Obtener el id de la reserva y el id del cliente desde los parámetros de la solicitud

  // Consultar la base de datos para obtener el estado del viaje con el id de la reserva y el id del cliente proporcionados
  pool.query(
    `SELECT estado, precio, tiempoderecogida, id_reservas 
     FROM viajes 
     WHERE id_reservas = ? AND id_chofer IN (SELECT id_chofer FROM reservas WHERE id_reservas = ? AND id_cliente = ?)`,
    [id_reserva, id_reserva, id_cliente],
    (error, results) => {
      if (error) {
        // Si hay un error, devolver un error de servidor
        res.status(500).json({ error: 'Error al obtener el estado del viaje' });
      } else if (results.length === 0) {
        // Si no se encuentra ningún viaje con el id de reserva y cliente proporcionados, devolver un error de no encontrado
        res.status(404).json({ error: 'Viaje no encontrado' });
      } else {
        // Si se encuentra el viaje, devolver los detalles del viaje
        res.json(results[0]);
      }
    }
  );
};


exports.getUltimoViajePorCliente = (req, res) => {
  const { id_cliente } = req.params; // Obtener el id del cliente desde los parámetros de la solicitud

  // Consultar la base de datos para obtener el último viaje del cliente
  pool.query(
    `SELECT v.* 
     FROM viajes v 
     JOIN reservas r ON v.id_reservas = r.id 
     WHERE r.id_cliente = ? 
     ORDER BY r.fecha_hora DESC 
     LIMIT 1`,
    [id_cliente],
    (error, results) => {
      if (error) {
        // Si hay un error, devolver un error de servidor
        res.status(500).json({ error: 'Error al obtener el último viaje del cliente' });
      } else if (results.length === 0) {
        // Si no se encuentra ningún viaje para el cliente proporcionado, devolver un error de no encontrado
        res.status(404).json({ error: 'Viaje no encontrado para el cliente proporcionado' });
      } else {
        // Si se encuentra el viaje, devolver los detalles del viaje
        res.json(results[0]);
      }
    }
  );
};