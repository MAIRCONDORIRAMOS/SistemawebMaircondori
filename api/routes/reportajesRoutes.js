const express = require('express');
const router = express.Router();
const reportajesController = require('../controller/reportajesController');

router.get('/reportajes', reportajesController.getAllReportajes);
router.get('/reportaje/:id', reportajesController.getReportajeById);
router.post('/reportaje', reportajesController.createReportaje);
router.put('/reportaje/:id', reportajesController.updateReportaje);
router.delete('/reportaje/:id', reportajesController.deleteReportaje);
router.get('/reportajes/socios', reportajesController.getReportajesWithSocioName);
module.exports = router;
