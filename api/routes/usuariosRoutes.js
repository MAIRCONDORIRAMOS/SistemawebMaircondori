// routes/usuariosRoutes.js
const express = require('express');
const router = express.Router();
const usuariosController = require('../controller/usuariosController');

router.get('/usuarios', usuariosController.getAllUsuarios);
router.get('/usuario/:id', usuariosController.getUsuarioById);
router.post('/usuario', usuariosController.createUsuario);
router.put('/usuario/:id', usuariosController.updateUsuario);
router.delete('/usuario/:id', usuariosController.deleteUsuario);
router.get('/usuario/login/:Nombre_usuario/:Contra', usuariosController.login);

module.exports = router;
