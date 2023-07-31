const createDBConnection = require('./dbConnection');

function checkDatabaseExists() {
  const db = createDBConnection();

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

module.exports = checkDatabaseExists;
