const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasksController');

router.get('/', tasksController.getTasks);
router.post('/', tasksController.createTask);
router.put('/:id', tasksController.toggleTask);
router.delete('/:id', tasksController.deleteTask);
router.put('/edit/:id', tasksController.editTask);

module.exports = router;
