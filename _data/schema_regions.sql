--  CREATE DATABASE Currencies;

USE Currencies

-- Creating Regions Table
CREATE TABLE Regions (
    region_id INT AUTO_INCREMENT PRIMARY KEY,
    region_alpha2 VARCHAR(20) NOT NULL
);