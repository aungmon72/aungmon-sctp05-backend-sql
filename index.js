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
            ' Latlng_id AS LLID, ROUND(Latlng.lat,2) AS Lat2, ROUND(Latlng.lng,2) Lng2 ' +
            ' FROM Currencies ' + 
            ' INNER JOIN Latlng ON Currencies.alpha2 = Latlng.alpha2'],


/*    
SELECT currency_id, Currencies.country_name, Currencies.alpha2,  Currencies.alpha3, Currencies.symbol, ROUND(Latlng.lat,2), ROUND(Latlng.lng,2) FROM Currencies INNER JOIN Latlng ON Currencies.alpha2 = Latlng.alpha2
SELECT currency_id, country_name, symbol, ROUND(Latlng.lat,2), ROUND(Latlng.lng,2) FROM Currencies INNER JOIN Latlng ON Currencies.alpha2 = Latlng.alpha2
SELECT currency_id as ID, country_name NAME, symbol AS SYMBOL, Latlng.alpha2 AS ISO2, Latlng.alpha3 AS ISO3, Latlng_id AS LLID, ROUND(Latlng.lat,2) AS Lat2, ROUND(Latlng.lng,2) Lng2 FROM Currencies INNER JOIN Latlng ON Currencies.alpha2 = Latlng.alpha2
*/

/*6*/ ['Currencies_Latlng', 'currenciesLatlng', 
       'SELECT * FROM Currencies INNER JOIN Latlng ON Currencies.alpha2 = Latlng.alpha2'],

/*7*/ ['Currencies_Regions','currenciesRegions',
       'SELECT * FROM Currencies INNER JOIN Regions_Countries ON Currencies.alpha2 = Regions_Countries.country_iso2'],
/*8*/ ['Latlng','latlng','SELECT * FROM Latlng'],

/* Extends from 5 */ 
/*9*/ ['Currencies_Latlng', 'currenciesLatlng', 
    'SELECT currency_id as ID, country_name NAME, symbol AS SYMBOL, ' +
    ' Latlng.alpha2 AS ISO2, Latlng.alpha3 AS ISO3, ' +
    ' Latlng_id AS LLID, ROUND(Latlng.lat,2) AS Lat2, ROUND(Latlng.lng,2) Lng2 ' +
    ' ' +
    ' FROM Currencies ' + 
    ' INNER JOIN Latlng ON Currencies.alpha2 = Latlng.alpha2' +
    ' INNER JOIN Regions ON Currencies.alpha2 = Regions.region_alpha2' ]

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
const { init } = require('express/lib/init.js');
//  const { init } = require('/javascript/init.js');

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

    async function dologging(category_id, category_description) {
        
        let [loggings] = await connection.execute('Select * from Loggings');

        let query = 'INSERT INTO Loggings SET category_id=?, category_description=?, activity=? ';
        console.log("query    ", query);

        let currentDateTime = new Date();
        let formattedDateTime = currentDateTime.toISOString().slice(0, 19).replace('T', ' ');

        console.log("category_id, category_description,currentDateTime   ", category_id, category_description,formattedDateTime )
        let bindings = [category_id, category_description, formattedDateTime];
        await connection.execute(query, bindings);
        // CREATE TABLE Loggings (
        //     logging_id INT AUTO_INCREMENT PRIMARY KEY,
        //     category_id INT NOT NULL,
        //     category_description VARCHAR(20) NOT NULL,
        //     activity DATETIME NOT NULL   
        // );
    }
    
    connection = await createConnection({
        'host': process.env.DB_HOST,
        'user': process.env.DB_USER,
        'database': process.env.DB_NAME,
        'password': process.env.DB_PASSWORD
    })

    app.get('/', (req,res) => {
        res.send('Hello, World!');
        dologging(1,'Hello World!');
    });
    
    app.get('/currencies', async (req, res) => {
        let [currencies] = await connection.execute(sqlCommands[0][2]);
        //  let [currenciesLatlngs] = await connection.execute(sqlCommands[5][2]);
        //  let [currenciesLatlngs] = await connection.execute(sqlCommands[9][2]);
        let [currenciesLatlngs] = await connection.execute(sqlCommands[5][2]);
        console.log(currenciesLatlngs);
        res.render('currencies/index', {
            'currencies': currencies,
            'currenciesLatlngs'   : currenciesLatlngs
        })
        dologging(20,'Table,  Currencies,  Operation,  List(Get)');
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
        dologging(21,'Table,  Currencies,  Operation,  Edit(Get)');
    })

    app.post('/currencies/:currency_id/edit', async (req, res) => {
        let {currency_name, alpha2, CallingCodes, alpha3, ioc, symbol} = req.body;
        console.log("req.body  ", req.body)
        console.log("currency_name, alpha2, CallingCodes, alpha3, ioc, symbol  ", currency_name, alpha2, CallingCodes, alpha3, ioc, symbol);
        let query = 'UPDATE Currencies SET currency_name=?, alpha2=?, CallingCodes=?, alpha3=?, ioc=?, symbol=? WHERE currency_id=?';
        let bindings = [currency_name, alpha2, CallingCodes, alpha3, ioc, symbol, req.params.currency_id];
        console.log("bindings  ",bindings);
        await connection.execute(query, bindings);
        res.redirect('/currencies');
        dologging(22,'Table,  Currencies,  Operation,  Edit(Post)');
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
        dologging(31,'Table,  Currencies,  Operation,  Create(Get)');

    })    

    app.post('/currencies/create', async (req, res) => {
        let {currency_name, alpha2, CallingCodes, alpha3, ioc, symbol} = req.body;
        console.log("req.body        ", req.body);
        console.log("currency_name, alpha2, CallingCodes, alpha3, ioc, symbol  ", currency_name, alpha2, CallingCodes, alpha3, ioc, symbol);
        let query = 'INSERT INTO Currencies SET currency_name=?, alpha2=?, CallingCodes=?, alpha3=?, ioc=?, symbol=? ';
        console.log("query    ", query);
        let bindings = [currency_name, alpha2, CallingCodes, alpha3, ioc, symbol];
        console.log("bindings   ", bindings);
        await connection.execute(query, bindings);
        res.redirect('/currencies');
        dologging(32,'Table,  Currencies,  Operation,  Create(Post)');
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
        });
        dologging(41,'Table,  Currencies,  Operation,  Delete(Get)');
    })

    //  8.2 Process the Delete
    app.post('/currencies/:currency_id/delete', async function(req, res){
        await connection.execute(`DELETE FROM Currencies WHERE currency_id =?`, [req.params.currency_id]);
        res.redirect('/currencies');
        dologging(42,'Table,  Currencies,  Operation,  Delete(Post)');
    })

    app.get('/currencies/currenciesRegions', async (req, res) => {
        let [currenciesRegions] = await connection.execute(sqlCommands[3][2]);
        console.log(currenciesRegions);

        res.render('./currencies/currenciesRegions', {
            'currenciesRegions': currenciesRegions
        })
        dologging(51,'Table,  CurrenciesRegions,  Operation,  List(Get)');
    })

    app.get('/currencies/regions', async (req, res) => {
        //  let [regions] = await connection.execute('SELECT * FROM Regions');
        let [regions] = await connection.execute(sqlCommands[1][2]);
        console.log(regions);
        res.render('currencies/regions', {
            'regions': regions
        })
        dologging(61,'Table,  Regions,  Operation,  List(Get)');
    })

    app.get('/currencies/regionsCountries', async (req, res) => {
        //let [regionsCountries] = await connection.execute('SELECT * FROM Regions_Countries');
        let [regionsCountries] = await connection.execute(sqlCommands[2][2]);
        console.log(regionsCountries);
        res.render('currencies/regionsCountries', {
            'regionsCountries': regionsCountries
        })
        dologging(70,'Table,  RegionsCountries,  Operation,  List(Get)');
    })

    app.get('/currencies/:regionsCountries_id/edit', async (req, res) => {
        let [regionsCountries] = await connection.execute(sqlCommands[2][2]);
        console.log(regionsCountries);

        let [currencies] = await connection.execute(sqlCommands[0][2]);
        let [regions]    = await connection.execute(sqlCommands[1][2]);
        let currency     = currencies[parseInt(req.params.currency_id)-1];
        console.log(currencies);
        console.log(currency);

        res.render('./currencies/regionsCountriesEdit', {
            'currency': currency,
            'regions' : regions
        })
        dologging(71,'Table,  RegionsCountries,  Operation,  Edit(Get)');
    })

    app.put('/currencies/:regionsCountries_id/edit', async (req, res) => {
        dologging(72,'Table,  RegionsCountries,  Operation,  Edit(Put)');
    })

    app.get('/currencies/:regionsCountries_id/delete', async (req, res) => {
        dologging(73,'Table,  RegionsCountries,  Operation,  Delete(Get)');
    })

    app.put('/currencies/:regionsCountries_id/delete', async (req, res) => {
        dologging(74,'Table,  RegionsCountries,  Operation,  Delete(Put)');
    })

    app.get('/currencies/:latlng_id/map', async (req, res) => {
        //let [latlngs] = await connection.execute(sqlCommands[0][8]);
        const LLID = parseInt(req.params.latlng_id);
        console.log (LLID)
        let [latlngs] = await connection.execute(`select * from Latlng where Latlng_id = ?`, [LLID]);
        const latlng = latlngs[0];
        console.log(latlngs);
        console.log(latlng);
        
        res.render('./currencies/latlngs', {
            'latlngs': latlngs,
            'latlng': latlng
            
        })

        dologging(80,'Table,  Latlng,  Operation,  List(Get)');
    })

    app.get('/currencies/:latlng_id/mapload', async (req, res) => {
        const LLID = parseInt(req.params.latlng_id);
        console.log (LLID)
        let [latlngs] = await connection.execute(`select * from Latlng where Latlng_id = ?`, [LLID]);
        const latlng = latlngs[0];
        const lat = latlng.lat;
        const lng = latlng.lng;
        console.log("lat   ", lat, "lng   ", lng);
        res.render('./currencies/foursquare', {
            'lat': lat,
            'lng' : lng
        }) 
        dologging(83,'Table,  Latlng,  Operation,  MapLoad(Get)');
        //  init(lat,lng);
    })

    app.get('/currencies/latlngs', async (req, res) => {
        //let [latlngs] = await connection.execute(sqlCommands[0][8]);

        let [latlngs] = await connection.execute('select * from Latlng ');
        console.log(latlngs);
        res.render('./currencies/foursquare', {
            'latlngs': latlngs
        })
        dologging(81,'Table,  Latlng,  Operation,  List(Get)');
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
        dologging(82,'Table,  Latlng,  Operation,  Map(FourSquare)(Get)');
    })

    app.get('/currencies/showloggings', async (req, res) => {

        dologging(100,'Table,  Loggings,  Operation,  List(Get)');
        let [loggings] = await connection.execute('SELECT * from Loggings ');
        console.log(loggings);
        res.render('currencies/loggings', {
            'loggings': loggings
        })
        
    })

    app.listen(3000, ()=>{
        
        console.log('Server is running')
    });

}

main();
