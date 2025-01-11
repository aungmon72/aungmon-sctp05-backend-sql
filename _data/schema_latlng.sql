--  CREATE DATABASE Currencies;

USE Currencies
-- Creating Latlng Table
-- country_name, alpha2, alpha3, CallingCodes, lat, lng

CREATE TABLE Latlng (
    Latlng_id INT AUTO_INCREMENT PRIMARY KEY,
    country_name VARCHAR(200) NOT NULL,
    alpha2 VARCHAR(20),
    alpha3 VARCHAR(10),
    CallingCodes VARCHAR(20), 
    lat FLOAT, 
    lng FLOAT
);
