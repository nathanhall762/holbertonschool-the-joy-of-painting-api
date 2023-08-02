CREATE DATABASE IF NOT EXISTS BobRossDatabase;
USE BobRossDatabase;

CREATE TABLE IF NOT EXISTS Episodes (
  episode_id INT AUTO_INCREMENT PRIMARY KEY,
  episode_number VARCHAR(50),
  episode_title VARCHAR(255),
  season INT,
  episode INT,
  month VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS Colors (
  color_id INT AUTO_INCREMENT PRIMARY KEY,
  color_name VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS Episode_Color (
  episode_color_id INT AUTO_INCREMENT PRIMARY KEY,
  episode_id INT,
  color_id INT,
  FOREIGN KEY (episode_id) REFERENCES Episodes(episode_id),
  FOREIGN KEY (color_id) REFERENCES Colors(color_id)
);

CREATE TABLE IF NOT EXISTS Subjects (
  subject_id INT AUTO_INCREMENT PRIMARY KEY,
  subject_name VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS Episode_Subject (
  episode_subject_id INT AUTO_INCREMENT PRIMARY KEY,
  episode_id INT,
  subject_id INT,
  FOREIGN KEY (episode_id) REFERENCES Episodes(episode_id),
  FOREIGN KEY (subject_id) REFERENCES Subjects(subject_id)
);
