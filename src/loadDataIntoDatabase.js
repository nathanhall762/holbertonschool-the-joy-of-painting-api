const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");
const util = require("util");
const createDBConnection = require("./dbConnection");

function loadDataIntoDatabase() {
  // 1. Open the data files.
  const colorsData = fs.readFileSync(
    path.join(__dirname, "../data/colors.csv"),
    "utf-8"
  );
  const episodesData = fs.readFileSync(
    path.join(__dirname, "../data/episodes.csv"),
    "utf-8"
  );
  const subjectsData = fs.readFileSync(
    path.join(__dirname, "../data/subjects.csv"),
    "utf-8"
  );

  // 2. Parse the data.
  const colors = Papa.parse(colorsData, { header: true }).data;
  const episodes = Papa.parse(episodesData, { header: true }).data;
  const subjects = Papa.parse(subjectsData, { header: true }).data;

  // 2.1 Get all color names.
  const colorNames = Object.keys(colors[0]).filter(
    (key) =>
      key !== "" &&
      key !== "painting_index" &&
      key !== "img_src" &&
      key !== "painting_title" &&
      key !== "season" &&
      key !== "episode" &&
      key !== "num_colors" &&
      key !== "youtube_src" &&
      key !== "colors" &&
      key !== "color_hex"
  );

  // 2.2 Get all subject names.
  const subjectNames = Object.keys(subjects[0]).filter(
    (header) => header !== "EPISODE" && header !== "TITLE"
  );

  // 3. Transform the data if necessary.
  // 4. Create a connection to the database.
  const db = createDBConnection();

  // Promisify db.query
  const query = util.promisify(db.query).bind(db);

  // 5. Insert the data into the database.
  // 5.1 Insert all colors into the database.
  const colorPromises = colorNames.map((colorName) => {
    const sql = "INSERT INTO Colors (Color_Name) VALUES (?)";
    return query(sql, [colorName])
      .then(() =>
        console.log(
          `Successfully inserted color ${colorName} into the database.`
        )
      )
      .catch((error) => {
        console.log(`Failed to insert color ${colorName} into the database.`);
        throw error;
      });
  });

  // 5.2 Insert all subjects into the database.
  const subjectPromises = subjectNames.map((subjectName) => {
    const sql = "INSERT INTO Subjects (Subject_Name) VALUES (?)";
    return query(sql, [subjectName])
      .then(() =>
        console.log(
          `Successfully inserted subject ${subjectName} into the database.`
        )
      )
      .catch((error) => {
        console.log(
          `Failed to insert subject ${subjectName} into the database.`
        );
        throw error;
      });
  });

  // 5.3 Insert all episodes into the database and their associations.
  const episodePromises = episodes.map(async (episodeData, index) => {
    const title = episodeData.TITLE;
    const month = episodeData.DATE.replace(/ "/g, "").split(" ")[0];
    const season = colors[index].season; // assuming colors and episodes are in the same order
    const episode = colors[index].episode; // assuming colors and episodes are in the same order

    const sql =
      "INSERT INTO Episodes (episode_title, season, episode, month) VALUES (?, ?, ?, ?)";
    try {
      const result = await query(sql, [title, season, episode, month]);
      console.log(`Successfully inserted episode ${title} into the database.`);
      const episodeId = result.insertId;

      // 5.3.1 Insert episode color associations into the database.
      const colorPromises = colorNames.map(async (colorName) => {
        if (colors[index][colorName] == "1") {
          // if the color is associated with the episode
          // Get the color ID
          const sqlColorId = "SELECT Color_Id FROM Colors WHERE Color_Name = ?";
          const resultColor = await query(sqlColorId, [colorName]);
          const colorId = resultColor[0].Color_Id;

          // Insert the association into the Episode_Color table
          const sqlAssociationColor =
            "INSERT INTO Episode_Color (Episode_Id, Color_Id) VALUES (?, ?)";
          await query(sqlAssociationColor, [episodeId, colorId]);
          console.log(
            `Successfully associated color ${colorName} with episode ${title}.`
          );
        }
      });

      // 5.3.2 Insert episode subject associations into the database.
      const subjectPromises = subjectNames.map(async (subjectName) => {
        if (subjects[index][subjectName] == "1") {
          // if the subject is associated with the episode
          // Get the subject ID
          const sqlSubjectId =
            "SELECT Subject_Id FROM Subjects WHERE Subject_Name = ?";
          const resultSubject = await query(sqlSubjectId, [subjectName]);
          const subjectId = resultSubject[0].Subject_Id;

          // Insert the association into the Episode_Subject table
          const sqlAssociationSubject =
            "INSERT INTO Episode_Subject (Episode_Id, Subject_Id) VALUES (?, ?)";
          await query(sqlAssociationSubject, [episodeId, subjectId]);
          console.log(
            `Successfully associated subject ${subjectName} with episode ${title}.`
          );
        }
      });

      // Wait for all color and subject association promises to resolve
      await Promise.all([...colorPromises, ...subjectPromises]);
    } catch (error) {
      console.log(`Failed to insert episode ${title} into the database.`);
      throw error;
    }
  });

  // Wait for all promises to resolve before closing the connection
  Promise.all([...colorPromises, ...subjectPromises, ...episodePromises])
    .then(() => db.end())
    .catch((error) =>
      console.error("Error during database insertions:", error)
    );
}

module.exports = loadDataIntoDatabase;
