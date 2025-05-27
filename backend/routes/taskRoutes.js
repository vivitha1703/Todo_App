const express = require('express');
const { 
    getAllTasks, 
    getTaskById, 
    createTask, 
    updateTask, 
    deleteTask 
} = require('../controllers/taskController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.use(authenticate);

router.get('/', getAllTasks);
router.get('/:id', getTaskById);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;