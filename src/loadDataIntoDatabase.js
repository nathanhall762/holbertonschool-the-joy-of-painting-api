const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');
const createDBConnection = require('./src/dbConnection');

function loadDataIntoDatabase() {
    // 1. Open the data files.
    const colorsData = fs.readFileSync(path.join(__dirname, '../data/colors.csv'), 'utf-8');
    const episodesData = fs.readFileSync(path.join(__dirname, '../data/episodes.csv'), 'utf-8');
    const subjectsData = fs.readFileSync(path.join(__dirname, '../data/subjects.csv'), 'utf-8');

    // 2. Parse the data.
    const colors = Papa.parse(colorsData, { header: true }).data;
    const episodes = Papa.parse(episodesData, { header: true }).data;
    const subjects = Papa.parse(subjectsData, { header: true }).data;

    console.log(title, season, episode, air_date);

    // 2.1 Get all color names.
    const colorNames = Object.keys(colors[0]).filter(key => key !== '' && key !== 'painting_index' && key !== 'img_src' && key !== 'painting_title' && key !== 'season' && key !== 'episode' && key !== 'num_colors' && key !== 'youtube_src' && key !== 'colors' && key !== 'color_hex');

    console.log(colorNames);

    // 2.2 Get all subject names.
    const subjectNames = Object.keys(subjects[0]).filter(header => header !== 'EPISODE' && header !== 'TITLE');

    console.log(subjectNames);

    // 3. Transform the data if necessary.
    // 4. Create a connection to the database.
    const db = createDBConnection();

    // 5. Insert the data into the database.
    // 5.1 Insert all colors into the database.
    colorNames.forEach((colorName) => {
      const sql = 'INSERT INTO Colors (Color_Name) VALUES (?)';
      db.query(sql, [colorName], (error, result) => {
        if (error) {
          console.log(`Failed to insert color ${colorName} into the database.`);
          throw error;
        }
        console.log(`Successfully inserted color ${colorName} into the database.`);
      });
    });

    // 5.2 Insert all subjects into the database.
    subjectNames.forEach((subjectName) => {
      const sql = 'INSERT INTO Subjects (Subject_Name) VALUES (?)';
      db.query(sql, [subjectName], (error, result) => {
        if (error) {
          console.log(`Failed to insert subject ${subjectName} into the database.`);
          throw error;
        }
        console.log(`Successfully inserted subject ${subjectName} into the database.`);
      });
    });

    // 5.3 Insert all episodes into the database.
    episodes.forEach((episodeData, index) => {
      const title = episodeData.TITLE;
      const air_date = episodeData.DATE.replace(/ "/g, '').split(' ')[0];
      const season = colors[index].season; // assuming colors and episodes are in the same order
      const episode = colors[index].episode; // assuming colors and episodes are in the same order
      
      const sql = 'INSERT INTO Episodes (Title, Season, Episode, Air_Date) VALUES (?, ?, ?, ?)';
      db.query(sql, [title, season, episode, air_date], (error, result) => {
        if (error) {
          console.log(`Failed to insert episode ${title} into the database.`);
          throw error;
        }
        console.log(`Successfully inserted episode ${title} into the database.`);
      });
    });
    
    // 6. Close the connection.
    db.end();
}

module.exports = loadDataIntoDatabase;
