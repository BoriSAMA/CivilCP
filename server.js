const express = require('express');
const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv/config');
var app = express();

app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views/ejs'));

//Middleware-open
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(express.static(path.join(__dirname, 'views/css')));
app.use(express.static(path.join(__dirname, 'views/img')));
app.use(express.static(path.join(__dirname, 'views/js')));
app.use(express.static(path.join(__dirname, 'views/ejs')));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
//Middleware-close

//routes-open
const userRoute = require('./controller/users');
app.use('/user', userRoute);
/*
const assetRoute = require('./routes/assets');
app.use('/asset', assetRoute);

const peopleRoute = require('./routes/people');
app.use('/people', peopleRoute);
*/
//routes-close

app.get('/', function(req, res){
	res.render('index');
});

/*
app.get('/assetFinancial', function(req, res){
	res.render('assetViews/assetFinancial' , {
		selected: "asset",
		assetView: "2"
	});
});
*/

//connect to db
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
	host: process.env.DB_HOST,
	dialect: 'mysql'
  });

sequelize.authenticate()
		.then(() => {console.info('INFO - Database connected.')})
		.catch(err => { console.error('ERROR - Unable to connect to the database:', err)});

//sequelize.close();
		
app.listen(1337, function(){
	console.log('app ready on port 1337');
});