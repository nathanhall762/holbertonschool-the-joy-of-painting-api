var mysql = require('mysql');

function createDBConnection() {
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'new_password',
    database : 'BobRossDatabase',
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

module.exports = createDBConnection;
