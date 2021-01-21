const mysql = require('mysql2').verbose();

const connection = mysql.CreateConnection({
    host: 'localhost',
    user: 'root',
    database: 'test'
});

module.exports = connection;