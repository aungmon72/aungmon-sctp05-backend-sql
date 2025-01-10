//  2.0 Creating the Express App

const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
require('dotenv').config();

const sqlCommands = [
    ['Currencies',        'currencies',       'SELECT * FROM Currencies'],
    ['Regions',           'regions',          'SELECT * FROM Regions'],
    ['Regions_Countries', 'regionsCountries', 'SELECT * FROM Regions_Countries'],
    ['Currencies_Regions','currenciesRegions','SELECT * FROM Currencies INNER JOIN Regions_Countries ON Currencies.alpha2 = Regions_Countries.country_iso2']

]

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
        let [currencies] = await connection.execute(sqlCommands[0][2]);
        console.log(currencies);
        res.render('currencies/index', {
            'currencies': currencies
        })
    })

    app.get('/currencies/:currency_id/edit', async (req, res) => {
        let [currencies] = await connection.execute(sqlCommands[0][2]);
        let [regions]    = await connection.execute(sqlCommands[1][2]);
        let currency     = currencies[parseInt(req.params.currency_id)-1];
        console.log(currencies);
        console.log(currency);

        res.render('currencies/edit', {
            'currency': currency,
            'regions' : regions
        })
    })

{   // SCHEMA Currencies
    // currency_id: 40,
    // currency_name: 'Cocos',
    // alpha2: 'CC',
    // CallingCodes: '61',
    // alpha3: 'CCK',
    // ioc: '',
    // symbol: 'AUD',

    // region_country_id: 19,
    // region_name: 'southeastAsia',
    // country_iso2: 'CC'
}

    app.post('/currencies:customer_id/edit', async (req, res) => {
        let {currency_name, alpha2, CallingCodes, alpha3, ioc, symbol} = req.body;
        let query = 'UPDATE Currencies SET currency_name=?, alpha2=?, CallingCodes=?, alpha3=?, ioc=?, symbol=? WHERE currency_id=?';
        let bindings = [currency_name, alpha2, CallingCodes, alpha3, ioc, symbol, req.params.currency_id];
        await connection.execute(query, bindings);
        res.redirect('/currencies');
    })


    app.get('/currenciesRegions', async (req, res) => {
        let [currenciesRegions] = await connection.execute(sqlCommands[3][2]);
        console.log(currenciesRegions);

        res.render('currencies/currenciesRegions', {
            'currenciesRegions': currenciesRegions
        })
    })

    app.get('/regions', async (req, res) => {
        //  let [regions] = await connection.execute('SELECT * FROM Regions');
        let [regions] = await connection.execute(sqlCommands[1][2]);
        console.log(regions);
        res.render('currencies/regions', {
            'regions': regions
        })
    })

    app.get('/regionsCountries', async (req, res) => {
        //let [regionsCountries] = await connection.execute('SELECT * FROM Regions_Countries');
        let [regionsCountries] = await connection.execute(sqlCommands[2][2]);
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
