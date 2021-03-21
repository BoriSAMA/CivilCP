const express = require('express');
const router = express.Router();
const url = require('url');

router.get('/', function(req, res){
    res.status(200).render('index',{
        selected: 'normal',
        user: req.session.user
    });
});

router.get('/salary', function(req, res){
    res.redirect("/salary/all");
});

router.get('/group', function(req, res){
    res.redirect("/group/all");
});

router.get('/all-items', function(req, res){
	res.redirect("/item/all");
});

router.get('/materials', function(req, res){
	res.redirect("/item/materials");
});

router.get('/gangs', function(req, res){
    res.redirect("/item/gangs");
});

router.get('/machineries', function(req, res){
	res.redirect("/item/machineries");
});

router.get('/transports', function(req, res){
	res.redirect("/item/transports");
});

router.get('/u_materials', function(req, res){
	res.redirect("/item/user/materials");
});

router.get('/u_gangs', function(req, res){
    res.redirect("/item/user/gangs");
});

router.get('/u_machineries', function(req, res){
	res.redirect("/item/user/machineries");
});

router.get('/u_transports', function(req, res){
	res.redirect("/item/user/transports");
});

router.get('/budgets', function(req, res){
    res.redirect("/budgets");
});

router.get('/budget', function(req, res){
	res.redirect("/budget?bid=" + req.query.bid);
});

router.get('/apu', function(req, res){
    res.redirect(url.format({
        pathname:"/apu",
        query:req.query,
    }));
});

router.get('/gantt', function(req, res){
	res.status(200).render('index',{
        selected: 'gantt'
    });
});

router.get('/workers', function(req, res){
	res.redirect("/worker/all");
});

router.get('/shoppinglist', function(req, res){
	res.status(200).render('index',{
        selected: 'shoppinglist',
        user: req.session.user
    });
});

//export module
module.exports = router;
