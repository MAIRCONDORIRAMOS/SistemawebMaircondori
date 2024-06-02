// routes/clienteRoutes.js
const express = require('express');
const router = express.Router();
const clienteController = require('../controller/clienteController');

router.get('/clientes', clienteController.getAllClientes);
router.get('/cliente/:id', clienteController.getClienteById);
router.post('/cliente', clienteController.createCliente);
router.put('/cliente/:id', clienteController.updateCliente);
router.delete('/cliente/:id', clienteController.deleteCliente);

module.exports = router;
