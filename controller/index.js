const express = require('express');
const router = express.Router();

router.get('/', function(req, res){
	res.status(200).render('index',{
        selected: 'normal'
    });
});

router.get('/salary', function(req, res){
	res.status(200).render('index',{
        selected: 'salary'
    });
});

router.get('/charac', function(req, res){
	res.status(200).render('index',{
        selected: 'charac'
    });
});

router.get('/gangs', function(req, res){
	res.status(200).render('index',{
        selected: 'gangs'
    });
});

router.get('/machinary', function(req, res){
	res.status(200).render('index',{
        selected: 'machinary'
    });
});

router.get('/mats', function(req, res){
	res.status(200).render('index',{
        selected: 'mats'
    });
});

//export module
module.exports = router;
