const mysql = require("mysql2");

// Connect to database
const connection = mysql.createConnection({
  host: '127.0.0.1',
  // Your MySQL username,
  user: 'root',
  // Your MySQL password
  password: '',
  database: 'employee_tracker'
});

module.exports = connection;