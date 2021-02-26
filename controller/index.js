const express = require('express');
const router = express.Router();

router.get('/', function(req, res){
    res.status(200).render('index',{
        selected: 'normal',
        user: req.session.user
    });
});

router.get('/salary', function(req, res){
    res.redirect("/salary/all");
});

router.get('/char', function(req, res){
    res.redirect("/group/all");
});

router.get('/gangs', function(req, res){
    res.redirect("/item/gangs");
});

router.get('/machineries', function(req, res){
	res.redirect("/item/machineries");
});

router.get('/materials', function(req, res){
	res.redirect("/item/materials");
});

router.get('/materials', function(req, res){
	res.redirect("/item/materials");
});

router.get('/transports', function(req, res){
	res.status(200).render('index',{
        selected: 'normal',
        user: req.session.user
    });
});

router.get('/all-items', function(req, res){
	res.redirect("/item/all");
});

router.get('/machinaryL', function(req, res){
	res.status(200).render('index',{
        selected: 'machinaryL'
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
