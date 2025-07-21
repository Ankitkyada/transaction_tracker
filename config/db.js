require('dotenv').config();
 // Load environment variables from .env file

const mysql = require('mysql2');


// const connection = mysql.createConnection({
//   host: 'localhost',      // or your DB host
//   user: 'root',           // your DB username
//   password: '',           // your DB password
//   database: 'new_laravel', // your DB name
// });

//const connection = mysql.createConnection({
  //host: 'db4free.net', // your DB host
  //user: 'alienarmpit',          // your DB username
 // password: 'alienarmpit@354',      // your DB password
  //database: 'khatabook',    // your DB name
  //port: 3306,                 // your DB port
//});

connection.connect((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as ID ' + connection.threadId);
});

module.exports = connection;
