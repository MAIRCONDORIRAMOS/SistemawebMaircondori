const express = require('express');
const router = express.Router();
const paradasController = require('../controller/paradasController');

// Ruta para obtener todas las paradas
router.get('/paradas', paradasController.getAllParadas);

// Rutas específicas para operaciones CRUD de una parada
router.get('/parada/:id', paradasController.getParadaById);
router.post('/parada', paradasController.createParada);
router.put('/parada/:id', paradasController.updateParada);
router.delete('/parada/:id', paradasController.deleteParada);

module.exports = router;
