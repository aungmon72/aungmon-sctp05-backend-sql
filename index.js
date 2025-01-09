//  2.0 Creating the Express App

const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
require('dotenv').config();

//  4.0 Connecting to the Database using MySQL2

const { createConnection } = require('mysql2/promise');

let app = express();
app.set('view engine', 'hbs');
app.use(express.static('public'));
app.use(express.urlencoded({extended:false}));

wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

// require in handlebars and their helpers
const helpers = require('handlebars-helpers');
// tell handlebars-helpers where to find handlebars
helpers({
    'handlebars': hbs.handlebars
})

let connection;


async function main() {
    connection = await createConnection({
        'host': process.env.DB_HOST,
        'user': process.env.DB_USER,
        'database': process.env.DB_NAME,
        'password': process.env.DB_PASSWORD
    })



    app.get('/', (req,res) => {
        res.send('Hello, World!');
    });


    
}

main();
