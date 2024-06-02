// routes/choferesRoutes.js
const express = require('express');
const router = express.Router();
const choferesController = require('../controller/choferesController');

router.get('/choferes', choferesController.getAllChoferes);
router.get('/chofer/:id', choferesController.getChoferById);
router.get('/choferes/nombre', choferesController.getNomChoferes);
router.post('/chofer', choferesController.createChofer);
router.put('/chofer/:id', choferesController.updateChofer);
router.delete('/chofer/:id', choferesController.deleteChofer);

module.exports = router;
