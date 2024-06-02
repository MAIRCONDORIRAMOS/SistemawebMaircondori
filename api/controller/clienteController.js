const pool = require('./db');
exports.getAllClientes = (req, res) => {
  pool.query('SELECT id, nombre_usuario,contra, nombre, apellido, domicilio FROM clientes', (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al obtener los clientes' });
    } else {
      res.json(results);
    }
  });
};
exports.getClienteById = (req, res) => {
  const { id } = req.params;
  pool.query('SELECT * FROM clientes WHERE id = ?', [id], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al obtener el cliente' });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'Cliente no encontrado' });
    } else {
      res.json(results[0]);
    }
  });
};

exports.createCliente = (req, res) => {
  const { nombre_usuario, contra, nombre, apellido, domicilio } = req.body;
  pool.query('INSERT INTO clientes (nombre_usuario, contra, nombre, apellido, domicilio) VALUES (?, ?, ?, ?, ?)', [nombre_usuario, contra, nombre, apellido, domicilio], (error, results) => {
    if (error) {
      console.error('Error al crear el cliente:', error); 
      res.status(500).json({ error: 'Error al crear el cliente' });
    } else {
      res.status(201).json({ message: 'Cliente creado exitosamente', id: results.insertId });
    }
  });
};
exports.updateCliente = (req, res) => {
  const { nombre_usuario,contra, nombre, apellido, domicilio } = req.body;
  const { id } = req.params;
  pool.query('UPDATE clientes SET nombre_usuario = ?, contra = ?, nombre = ?, apellido = ?, domicilio = ? WHERE id = ?', [nombre_usuario,contra, nombre, apellido, domicilio, id], (error) => {
    if (error) {
      res.status(500).json({ error: 'Error al actualizar el cliente' });
    } else {
      res.json({ message: 'Cliente actualizado exitosamente' });
    }
  });
};

exports.deleteCliente = (req, res) => {
  const { id } = req.params;
  pool.query('DELETE FROM clientes WHERE id = ?', [id], (error) => {
    if (error) {
      res.status(500).json({ error: 'Error al eliminar el cliente' });
    } else {
      res.json({ message: 'Cliente eliminado exitosamente' });
    }
  });
};