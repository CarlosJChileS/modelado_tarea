const express = require('express');
const router = express.Router();
const materiasController = require('../controllers/materiasController');

router.get('/', materiasController.getMaterias);
router.post('/', materiasController.createMateria);

module.exports = router;
