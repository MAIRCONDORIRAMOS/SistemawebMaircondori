// routes/hojasDeRutaRoutes.js
const express = require('express');
const router = express.Router();
const hojasDeRutaController = require('../controller/hojasDeRutaController');

router.get('/hojas-de-rutas', hojasDeRutaController.getAllHojasDeRuta);
router.get('/hoja-de-ruta/:id', hojasDeRutaController.getHojaDeRutaById);
router.post('/hoja-de-ruta', hojasDeRutaController.createHojaDeRuta);
router.put('/hoja-de-ruta/:id', hojasDeRutaController.updateHojaDeRuta);
router.delete('/hoja-de-ruta/:id', hojasDeRutaController.deleteHojaDeRuta);
router.get('/hoja-de-ruta/por-placa/:placa', hojasDeRutaController.getHojaDeRutaByPlaca);
module.exports = router;
