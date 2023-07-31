// const parseCSVFile = require('./csvParser');
const createDBConnection = require('./dbConnection');

async function populateDatabase() {
  try {
    // Replace 'data.csv' with the path to your actual CSV file
    // const data = await parseCSVFile('data.csv');
    const db = createDBConnection();

    // Iterate over the data and perform your database operations
    data.forEach((row) => {
      db.query(`INSERT INTO ... VALUES ...`, (error, results, fields) => {
        if (error) throw error;
        // handle results...
      });
    });

    db.end();
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

module.exports = populateDatabase;
