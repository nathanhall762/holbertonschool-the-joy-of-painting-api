const { checkDatabaseExists, createDBConnectionWithoutDB } = require('./src/checkDatabase');
const fs = require('fs');
const path = require('path');
// const populateDatabase = require('./src/populateDatabase');
const createDBConnection = require('./src/dbConnection');

checkDatabaseExists().then(exists => {
    if(!exists) {
      // Read the SQL file
      const createDatabaseSQL = fs.readFileSync(path.join(__dirname, './sql/createDatabase.sql'), 'utf-8');
  
      // Create a connection
      const db = createDBConnectionWithoutDB();
  
      // Create the database
      db.query(createDatabaseSQL, (error, results, fields) => {
        if (error) {
          console.log('An error occurred while creating the database: ', error);
          db.end(); // Close the connection if there's an error
          return;
        }
  
        console.log('Database and tables created successfully.');
  
        // TODO: populateDatabase();
  
        db.end(); // Close the connection when done
      });
  } else {
    console.log("Database already exists.");
  }
}).catch(err => {
  console.log('An error occurred: ', err);
});

