--  CREATE DATABASE Currencies;

USE Currencies

-- Creating Regions,Countries Table
CREATE TABLE Loggings (
    logging_id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    category_description VARCHAR(100) NOT NULL,
    activity DATETIME NOT NULL   
);