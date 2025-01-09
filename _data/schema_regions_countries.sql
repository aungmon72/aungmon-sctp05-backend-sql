USE Currencies

-- Creating Regions,Countries Table
CREATE TABLE Regions_Countries (
    region_country_id INT AUTO_INCREMENT PRIMARY KEY,
    region_name VARCHAR(40) NOT NULL,
    country_iso2 VARCHAR(20) NOT NULL
    
);