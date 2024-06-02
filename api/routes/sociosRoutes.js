// routes/sociosRoutes.js

const express = require('express');
const router = express.Router();
const sociosController = require('../controller/sociosController');

// Ruta para obtener todos los socios
router.get('/socios', sociosController.getAllSocios);
router.get('/socio/:id/placas', sociosController.getPlacasBySocioId);
router.get('/socio/:id', sociosController.getSocioById);
router.post('/socio', sociosController.createSocio);
router.put('/socio/:id', sociosController.updateSocio);
router.delete('/socio/:id', sociosController.deleteSocio);
router.get('/socios/licencias', sociosController.getAllLicencias);
router.get('/socios/licencias/:licencia', sociosController.getSocioByLicencia);
router.get('/socios/licencias/:licencia/parada-grupo', sociosController.getSocioByLicenciaWithParadaGrupo);
module.exports = router;
