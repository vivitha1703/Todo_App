const Task = require('../models/task');

const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.getAll(req.userId);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getTaskById = async (req, res) => {
    try {
        const task = await Task.getById(req.params.id, req.userId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const createTask = async (req, res) => {
    try {
        const taskId = await Task.create(req.body, req.userId);
        res.status(201).json({ id: taskId, ...req.body });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const updateTask = async (req, res) => {
    try {
        await Task.update(req.params.id, req.body, req.userId);
        res.json({ message: 'Task updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteTask = async (req, res) => {
    try {
        await Task.delete(req.params.id, req.userId);
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
};