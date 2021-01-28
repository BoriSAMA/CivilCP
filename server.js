const express = require('express');
const path = require('path');
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

//routes start
const userRoute = require('./controller/users');
app.use('/user', userRoute);

const groupRoute = require('./controller/groups');
app.use('/group', groupRoute);
//routes finish

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
		
app.listen(1337, function(){
	var date = new Date();
	console.log(date.getHours() + ":" + date.getMinutes() + ' app ready on port 1337');
});