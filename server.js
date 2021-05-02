const express = require('express');
const path = require('path');
const session = require('express-session');
var sequelize = require('./connection');
const auth = require('./authenticate');
var SequelizeStore = require("connect-session-sequelize")(session.Store);


var app = express();

app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views/ejs'));

//Middleware-open
var myUser = new SequelizeStore({
	db: sequelize,
	tableName: 'session',
	checkExpirationInterval: 30 * 60 * 1000,
	expiration: 2 * 60 * 60 * 1000 
});

// configure express
app.use(
	session({
	  secret: "uwu",
	  store: myUser,
	  resave: false,
	  saveUninitialized: false
	})
);

app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(express.static(path.join(__dirname, 'views/css')));
app.use(express.static(path.join(__dirname, 'views/img')));
app.use(express.static(path.join(__dirname, 'views/js')));
app.use(express.static(path.join(__dirname, 'views/ejs')));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
//Middleware-close

//routes start
app.get('/', function(req, res){
	res.render('user/login');
});

const userRoute = require('./controller/users');
app.use('/user', userRoute);

//custom middleware to comprobate if a user is logged
app.use(auth);

const groupRoute = require('./controller/groups');
app.use('/group', groupRoute);

const itemRoute = require('./controller/items');
app.use('/item', itemRoute);

const salaryRoute = require('./controller/salaries');
app.use('/salary', salaryRoute);

const quotesRoute = require('./controller/budgets');
app.use('/budgets', quotesRoute);

const quoteRoute = require('./controller/budget');
app.use('/budget', quoteRoute);

const apuRoute = require('./controller/apu');
app.use('/apu', apuRoute);

const apuItemsRoute = require('./controller/apuItems');
app.use('/apuItems', apuItemsRoute);

const workerRoute = require('./controller/workers');
app.use('/worker', workerRoute);

const scheduleRoute = require('./controller/schedule');
app.use('/schedule', scheduleRoute);

const shoppingRoute = require('./controller/summary');
app.use('/shoppinglist', shoppingRoute);

const indexRoute = require('./controller/index');
app.use('/index', indexRoute);
//routes finish

app.listen(1337, function(){
	var date = new Date();
	console.log(date.getHours() + ":" + date.getMinutes() + ' app ready on port 1337');
});
