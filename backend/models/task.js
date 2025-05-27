const db = require('../config/db');

class Task {
    static async getAll(userId) {
        const [rows] = await db.query('SELECT * FROM tasks WHERE user_id = ?', [userId]);
        return rows;
    }

    static async getById(id, userId) {
        const [rows] = await db.query('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [id, userId]);
        return rows[0];
    }

    static async create(taskData, userId) {
        const { title, description, due_date, status } = taskData;
        const [result] = await db.query(
            'INSERT INTO tasks (user_id, title, description, due_date, status) VALUES (?, ?, ?, ?, ?)',
            [userId, title, description, due_date, status || 'Open']
        );
        return result.insertId;
    }

    static async update(id, taskData, userId) {
        const { title, description, due_date, status } = taskData;
        await db.query(
            'UPDATE tasks SET title = ?, description = ?, due_date = ?, status = ? WHERE id = ? AND user_id = ?',
            [title, description, due_date, status, id, userId]
        );
    }

    static async delete(id, userId) {
        await db.query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [id, userId]);
    }
}

module.exports = Task;