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

    app.get('/currencies', async (req, res) => {
        let [currencies] = await connection.execute('SELECT * FROM Currencies');
        console.log(currencies);
        res.render('currencies/index', {
            'currencies': currencies
        })
    })

    app.get('/regions', async (req, res) => {
        let [regions] = await connection.execute('SELECT * FROM Regions');
        console.log(regions);
        res.render('currencies/regions', {
            'regions': regions
        })
    })

    app.get('/regionsCountries', async (req, res) => {
        let [regionsCountries] = await connection.execute('SELECT * FROM Regions_Countries');
        console.log(regionsCountries);
        res.render('currencies/regionsCountries', {
            'regionsCountries': regionsCountries
        })
    })

    app.listen(3000, ()=>{
        
        console.log('Server is running')
    });

}

main();
