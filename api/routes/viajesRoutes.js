// routes/viajesRoutes.js
const express = require('express');
const router = express.Router();
const viajesController = require('../controller/viajesController');

router.get('/viajes', viajesController.getAllViajes);
router.get('/viaje/:id', viajesController.getViajeById);
router.get('/viajes/chofer/:id_chofer', viajesController.getViajesByChofer);
router.post('/viaje', viajesController.createViaje);
router.put('/viaje/:id', viajesController.updateViaje);
router.delete('/viaje/:id', viajesController.deleteViaje);
router.get('/viaje/reserva/:id_reserva/:id_cliente', viajesController.getViajeByReservaId);
router.get('/viaje/ultimo/:id_cliente', viajesController.getUltimoViajePorCliente);
module.exports = router;
