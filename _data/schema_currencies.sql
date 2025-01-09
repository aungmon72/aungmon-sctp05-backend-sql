CREATE DATABASE Currencies;

USE Currencies

-- Creating Currencies Table
CREATE TABLE Currencies (
    currency_id INT AUTO_INCREMENT PRIMARY KEY,
    currency_name VARCHAR(200) NOT NULL,
    alpha2 VARCHAR(20),
    CallingCodes VARCHAR(10),
    alpha3 VARCHAR(20), 
    ioc VARCHAR(20), 
    symbol VARCHAR(40)
);