require('dotenv').config();
 // Load environment variables from .env file

const mysql = require('mysql2');


// const connection = mysql.createConnection({
//   host: 'localhost',      // or your DB host
//   user: 'root',           // your DB username
//   password: '',           // your DB password
//   database: 'new_laravel', // your DB name
// });

const connection = mysql.createConnection({
  host: 'sql12.freesqldatabase.com', // your DB host
  user: 'sql12789993',          // your DB username
  password: 'KSl8cBGQyJ',      // your DB password
  database: 'sql12789993',    // your DB name
  port: 3306,                 // your DB port
});

connection.connect((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as ID ' + connection.threadId);
});

module.exports = connection;
