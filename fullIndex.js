checkDatabaseExists().then(exists => {
    if(!exists) {
      // Read the SQL file
      const createDatabaseSQL = fs.readFileSync(path.join(__dirname, './createDatabase.sql'), 'utf-8');
  
      // Create a connection
      const db = createDBConnection();
  
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

  function createDBConnection() {
    var connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      database : 'BobRossDatabase'
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