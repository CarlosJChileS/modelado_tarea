const express = require('express');
const router = express.Router();
const etiquetasController = require('../controllers/etiquetasController');

router.get('/', etiquetasController.getEtiquetas);
router.post('/', etiquetasController.createEtiqueta);

module.exports = router;
