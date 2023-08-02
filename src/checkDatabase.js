const mysql = require('mysql');

function checkDatabaseExists() {
  const db = createDBConnectionWithoutDB();

  return new Promise((resolve, reject) => {
    // Query to check if database exists
    db.query("SHOW DATABASES LIKE 'BobRossDatabase'", (error, results, fields) => {
      if (error) reject(error);
      
      // Close the database connection
      db.end();

      // If database does not exist, resolve promise with false, else resolve with true
      results.length === 0 ? resolve(false) : resolve(true);
    });
  });
}

function createDBConnectionWithoutDB() {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_new_password',
    multipleStatements: true
  });

  connection.connect((error) => {
    if (error) {
      console.error('Error connecting to database: ' + error.stack);
      return;
    }
    console.log('Connected to database as id ' + connection.threadId);
  });

  return connection;
}

module.exports = { checkDatabaseExists, createDBConnectionWithoutDB };
