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

router.get('/machinaryL', function(req, res){
	res.status(200).render('index',{
        selected: 'machinaryL'
    });
});

router.get('/mats', function(req, res){
	res.status(200).render('index',{
        selected: 'mats'
    });
});

router.get('/matsL', function(req, res){
	res.status(200).render('index',{
        selected: 'matsL'
    });
});

router.get('/budget', function(req, res){
	res.status(200).render('index',{
        selected: 'budget'
    });
});

router.get('/shoppinglist', function(req, res){
	res.status(200).render('index',{
        selected: 'shoppinglist'
    });
});

router.get('/gantt', function(req, res){
	res.status(200).render('index',{
        selected: 'gantt'
    });
});

router.get('/workers', function(req, res){
	res.status(200).render('index',{
        selected: 'workers'
    });
});

router.get('/apumachinary', function(req, res){
	res.status(200).render('index',{
        selected: 'apumachinary'
    });
});

router.get('/apumats', function(req, res){
	res.status(200).render('index',{
        selected: 'apumats'
    });
});

router.get('/apuworkers', function(req, res){
	res.status(200).render('index',{
        selected: 'apuworkers'
    });
});

router.get('/aputrans', function(req, res){
	res.status(200).render('index',{
        selected: 'aputrans'
    });
});
//export module
module.exports = router;
