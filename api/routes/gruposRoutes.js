
const express = require('express');
const router = express.Router();
const gruposController = require('../controller/gruposController');

router.get('/grupos', gruposController.getAllGrupos);
router.get('/grupo/:id', gruposController.getGrupoById);
router.post('/grupo', gruposController.createGrupo);
router.put('/grupo/:id', gruposController.updateGrupo);
router.delete('/grupo/:id', gruposController.deleteGrupo);

module.exports = router;
