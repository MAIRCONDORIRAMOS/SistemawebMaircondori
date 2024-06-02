// controllers/choferesController.js
//const mysql = require('mysql');
const pool = require('./db');
exports.getAllChoferes = (req, res) => {
  pool.query('SELECT * FROM choferes', (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al obtener los choferes' });
    } else {
      res.json(results);
    }
  });
};

exports.getNomChoferes = (req, res) => {
  pool.query('SELECT Nombre_completo FROM choferes', (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al obtener los choferes' });
    } else {
      res.json(results);
    }
  });
};
exports.getChoferById = (req, res) => {
  const { id } = req.params;
  pool.query('SELECT * FROM choferes WHERE id = ?', id, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al obtener el chofer' });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'Chofer no encontrado' });
    } else {
      res.json(results[0]);
    }
  });
};

exports.createChofer = (req, res) => {
  const { id_socio, Nombre_completo, CI, Celular, Licencia ,Placa } = req.body;
  pool.query('INSERT INTO choferes (id_socio, Nombre_completo, CI, Celular, Licencia ,Placa) VALUES (?, ?, ?, ?, ?,?)', [id_socio, Nombre_completo, CI, Celular, Licencia,Placa], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al crear el chofer' });
    } else {
      res.status(201).json({ message: 'Chofer creado exitosamente', id: results.insertId });
    }
  });
};

exports.updateChofer = (req, res) => {
  const { id_socio, Nombre_completo, CI, Celular, Licencia ,Placa } = req.body;
  const { id } = req.params;
  pool.query('UPDATE choferes SET id_socio = ?, Nombre_completo = ?, CI = ?, Celular = ?, Licencia = ? , Placa = ?  WHERE id = ?', [id_socio, Nombre_completo, CI, Celular, Licencia, Placa ,id], (error) => {
    if (error) {
      res.status(500).json({ error: 'Error al actualizar el chofer' });
    } else {
      res.json({ message: 'Chofer actualizado exitosamente' });
    }
  });
};

exports.deleteChofer = (req, res) => {
  const { id } = req.params;
  pool.query('DELETE FROM choferes WHERE id = ?', id, (error) => {
    if (error) {
      res.status(500).json({ error: 'Error al eliminar el chofer' });
    } else {
      res.json({ message: 'Chofer eliminado exitosamente' });
    }
  });
};
