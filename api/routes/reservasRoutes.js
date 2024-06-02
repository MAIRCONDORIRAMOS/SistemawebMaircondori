const express = require('express');
const router = express.Router();
const reservasController = require('../controller/reservasController');

router.get('/reservas', reservasController.getAllReservas);
router.get('/reserva/:id', reservasController.getReservaById);
router.post('/reserva', reservasController.createReserva);
router.put('/reserva/:id', reservasController.updateReserva);
router.delete('/reserva/:id', reservasController.deleteReserva);
router.get('/reserva/chofer/:id', reservasController.getReservasByChoferId);
module.exports = router;