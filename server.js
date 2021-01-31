const express = require('express');
const path = require('path');
const session = require('express-session');

var app = express();

app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views/ejs'));

//Middleware-open
app.use(session({
    secret: 'uwu',
    resave: false,
	saveUninitialized: true,
	cookie: { maxAge: 3600000 }
}))

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
const userRoute = require('./controller/users');
app.use('/user', userRoute);

const groupRoute = require('./controller/groups');
app.use('/group', groupRoute);

const itemRoute = require('./controller/items');
app.use('/item', itemRoute);

const salaryRoute = require('./controller/salaries');
app.use('/salary', salaryRoute);

const quotesRoute = require('./controller/quotations');
app.use('/quotations', quotesRoute);

const quoteRoute = require('./controller/quotationGroups');
app.use('/quotation', quoteRoute);

const apuRoute = require('./controller/apu');
app.use('/apu', apuRoute);

const apuItemsRoute = require('./controller/apuItems');
app.use('/apuItems', apuItemsRoute);

const workerRoute = require('./controller/workers');
app.use('/worker', workerRoute);

const indexRoute = require('./controller/index');
app.use('/index', indexRoute);
//routes finish

app.get('/', function(req, res){
	res.render('user/login');
});

app.listen(1337, function(){
	var date = new Date();
	console.log(date.getHours() + ":" + date.getMinutes() + ' app ready on port 1337');
});
