const mysql = require('mysql2/promise');
console.log(process.env.MYSQL_PASSWORD);

// Replace with your actual database credentials
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD | '',
    database: process.env.MYSQL_DATABASE
});


module.exports = pool;
