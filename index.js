//  2.0 Creating the Express App

const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
require('dotenv').config();

const sqlCommands = [
/*0*/ ['Currencies',        'currencies',       'SELECT * FROM Currencies'],
/*1*/ ['Regions',           'regions',          'SELECT * FROM Regions'],
/*2*/ ['Regions_Countries', 'regionsCountries', 'SELECT * FROM Regions_Countries'],
/*3*/ ['Currencies_Regions','currenciesRegions','SELECT * FROM Currencies INNER JOIN Regions_Countries ON Currencies.alpha2 = Regions_Countries.country_iso2'],

/*4*/ ['Currencies_Regions','currenciesRegions','SELECT * FROM Currencies INNER JOIN Regions_Countries ON Currencies.alpha2 = Regions_Countries.country_iso2'],
/*5*/ ['Currencies_Latlng', 'currenciesLatlng', 
       'SELECT currency_id as ID, country_name NAME, symbol AS SYMBOL, ' +
            ' Latlng.alpha2 AS ISO2, Latlng.alpha3 AS ISO3, ' +
            ' ROUND(Latlng.lat,2) AS Lat2, ROUND(Latlng.lng,2) Lng2 ' +
            ' FROM Currencies ' + 
            ' INNER JOIN Latlng ON Currencies.alpha2 = Latlng.alpha2'],

// /*5*/ ['Currencies_Latlng', 'currenciesLatlng', 
//        'SELECT currency_id, Currencies.country_name, Currencies.alpha2,  Currencies.alpha3, Currencies.symbol, ' +  
//        '       ROUND(Latlng.lat,2), ROUND(Latlng.lng,2) ' +
//        'FROM Currencies ' +
//        'INNER JOIN Latlng ON Currencies.alpha2 = Latlng.alpha2'],
/*    
}

SELECT currency_id, Currencies.country_name, Currencies.alpha2,  Currencies.alpha3, Currencies.symbol, ROUND(Latlng.lat,2), ROUND(Latlng.lng,2) FROM Currencies INNER JOIN Latlng ON Currencies.alpha2 = Latlng.alpha2
SELECT currency_id, country_name, symbol, ROUND(Latlng.lat,2), ROUND(Latlng.lng,2) FROM Currencies INNER JOIN Latlng ON Currencies.alpha2 = Latlng.alpha2
SELECT currency_id as ID, country_name NAME, symbol AS SYMBOL, Latlng.alpha2 AS ISO2, Latlng.alpha3 AS ISO3, ROUND(Latlng.lat,2) AS Lat2, ROUND(Latlng.lng,2) Lng2 FROM Currencies INNER JOIN Latlng ON Currencies.alpha2 = Latlng.alpha2

*/

/*6*/ ['Currencies_Latlng', 'currenciesLatlng', 
       'SELECT * FROM Currencies INNER JOIN Latlng ON Currencies.alpha2 = Latlng.alpha2'],

/*7*/ ['Currencies_Regions','currenciesRegions',
       'SELECT * FROM Currencies INNER JOIN Regions_Countries ON Currencies.alpha2 = Regions_Countries.country_iso2'],
/*8*/ ['Latlng','latlng','SELECT * FROM Latlng']

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

hbs.registerHelper('round', function(value) {
    if (isNaN(value)) {
        return '0.00';  
    }
    const value2 = parseFloat(parseFloat(value).toFixed(2));

    console.log("value" , value, " value2 ", value2);
    console.log("type of value   ",  Object.prototype.toString.call(value)); 
    console.log("type of value2  ",  Object.prototype.toString.call(value2)); 
    return value2;
});
  
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

    {
        // currency_name, alpha2,CallingCodes, alpha3, ioc, symbol
        // country_name, alpha2, alpha3, CallingCodes, lat, lng
    }
    app.get('/currencies', async (req, res) => {
        let [currencies] = await connection.execute(sqlCommands[0][2]);
        let [currenciesLatlngs] = await connection.execute(sqlCommands[5][2]);
        //  console.log(currencies);
        console.log(currenciesLatlngs);
        res.render('currencies/index', {
            'currencies': currencies,
            'currenciesLatlngs'   : currenciesLatlngs
        })
    })


    app.get('/currencies/:currency_id/edit', async (req, res) => {
        let [currencies] = await connection.execute(sqlCommands[0][2]);
        let [regions]    = await connection.execute(sqlCommands[1][2]);
        let currency     = currencies[parseInt(req.params.currency_id)-1];
        console.log(currencies);
        console.log(currency);

        res.render('./currencies/edit', {
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

    app.post('/currencies/:currency_id/edit', async (req, res) => {
        let {currency_name, alpha2, CallingCodes, alpha3, ioc, symbol} = req.body;
        console.log("req.body  ", req.body)
        console.log("currency_name, alpha2, CallingCodes, alpha3, ioc, symbol  ", currency_name, alpha2, CallingCodes, alpha3, ioc, symbol);
        let query = 'UPDATE Currencies SET currency_name=?, alpha2=?, CallingCodes=?, alpha3=?, ioc=?, symbol=? WHERE currency_id=?';
        let bindings = [currency_name, alpha2, CallingCodes, alpha3, ioc, symbol, req.params.currency_id];
        console.log("bindings  ",bindings);
        await connection.execute(query, bindings);
        res.redirect('./currencies');
    })


    app.get('/currencies/create', async(req,res)=>{
        let [currencies] = await connection.execute(sqlCommands[0][2]);
        let [regions]    = await connection.execute(sqlCommands[1][2]);
        //  let currency     = currencies[parseInt(req.params.currency_id)-1];
        console.log(currencies);
        console.log(regions);

        res.render('./currencies/add', {
            'currencies': currencies,
            'regions' : regions
        })
    })    

    // app.post('/customers/create', async(req,res)=>{
    //     let {first_name, last_name, rating, company_id} = req.body;
    //     let query = 'INSERT INTO Customers (first_name, last_name, rating, company_id) VALUES (?, ?, ?, ?)';
    //     let bindings = [first_name, last_name, rating, company_id];
    //     await connection.execute(query, bindings);
    //     res.redirect('/customers');
    // })

    // app.post('/currencies/:customer_id/create', async (req, res) => {
    //     let {currency_name, alpha2, CallingCodes, alpha3, ioc, symbol} = req.body;
    //     let query = 'UPDATE Currencies SET currency_name=?, alpha2=?, CallingCodes=?, alpha3=?, ioc=?, symbol=? WHERE currency_id=?';
    //     let bindings = [currency_name, alpha2, CallingCodes, alpha3, ioc, symbol, req.params.currency_id];
    //     await connection.execute(query, bindings);
    //     res.redirect('/currencies');
    // })

    app.post('/currencies/create', async (req, res) => {
        let {currency_name, alpha2, CallingCodes, alpha3, ioc, symbol} = req.body;
        console.log("req.body        ", req.body);
        console.log("currency_name, alpha2, CallingCodes, alpha3, ioc, symbol  ", currency_name, alpha2, CallingCodes, alpha3, ioc, symbol);
        let query = 'INSERT INTO Currencies SET currency_name=?, alpha2=?, CallingCodes=?, alpha3=?, ioc=?, symbol=? ';
        console.log("query    ", query);
        let bindings = [currency_name, alpha2, CallingCodes, alpha3, ioc, symbol];
        console.log("bindings   ", bindings);
        await connection.execute(query, bindings);
        res.redirect('./currencies');
    })

    //  8.1 Implement a Route to Show a Confirmation Form
    app.get('/currencies/:currency_id/delete', async function(req,res){
        // display a confirmation form 
        const [currencies] = await connection.execute(
            "SELECT * FROM Currencies WHERE currency_id =?", [req.params.currency_id]
        );
        const currency = currencies[0];
        console.log(currencies);
        console.log(currency);
        res.render('./currencies/delete', {
            currency
        })
    })

    //  8.2 Process the Delete
    app.post('/currencies/:currency_id/delete', async function(req, res){
        await connection.execute(`DELETE FROM Currencies WHERE currency_id =?`, [req.params.currency_id]);
        res.redirect('./currencies');
    })

    app.get('/currencies/currenciesRegions', async (req, res) => {
        let [currenciesRegions] = await connection.execute(sqlCommands[3][2]);
        console.log(currenciesRegions);

        res.render('./currencies/currenciesRegions', {
            'currenciesRegions': currenciesRegions
        })
    })

    app.get('/currencies/regions', async (req, res) => {
        //  let [regions] = await connection.execute('SELECT * FROM Regions');
        let [regions] = await connection.execute(sqlCommands[1][2]);
        console.log(regions);
        res.render('currencies/regions', {
            'regions': regions
        })
    })

    app.get('/currencies/regionsCountries', async (req, res) => {
        //let [regionsCountries] = await connection.execute('SELECT * FROM Regions_Countries');
        let [regionsCountries] = await connection.execute(sqlCommands[2][2]);
        console.log(regionsCountries);
        res.render('currencies/regionsCountries', {
            'regionsCountries': regionsCountries
        })
    })

    app.get('/map', async (req, res) => {
        //let [latlngs] = await connection.execute(sqlCommands[0][8]);
        let [latlngs] = await connection.execute('select * from Latlng');
    
        console.log(latlngs);
        res.render('./currencies/latlngs', {
            'latlngs': latlngs
        })
    })

    app.get('/currencies/latlngs', async (req, res) => {
        //let [latlngs] = await connection.execute(sqlCommands[0][8]);

        let [latlngs] = await connection.execute('select * from Latlng ');
        console.log(latlngs);
        res.render('./currencies/foursquare', {
            'latlngs': latlngs
        })
    })

    app.get('/currencies/:latlng_id_map/map', async (req, res) => {
        //let [latlngs] = await connection.execute(sqlCommands[0][8]);
        const latlng_id_map = req.params.latlng_id_map;
        console.log("req.params.latlng_id_map  ", latlng_id_map);

        let [latlngs] = await connection.execute('select * from Latlng where Latlng_id = latlng_id_map');
        console.log(latlngs);
        let latlng = latlngs[0];
        res.render('./currencies/foursquare', {
            'latlng': latlng
        })
    })

    app.listen(3000, ()=>{
        
        console.log('Server is running')
    });

}

main();
