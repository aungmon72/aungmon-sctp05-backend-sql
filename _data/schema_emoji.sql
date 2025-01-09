USE Currencies

-- Creating Emoji Table
CREATE TABLE Emojis (
    emoji_id INT AUTO_INCREMENT PRIMARY KEY,
    emoji_iso2 VARCHAR(20) NOT NULL,
    emoji_iso3 VARCHAR(20) NOT NULL,
    emoji_code VARCHAR(20) NOT NULL
);