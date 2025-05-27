const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root', // replace with your MySQL username
    password: 'Vivitha@17', // replace with your MySQL password
    database: 'todo_app',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;