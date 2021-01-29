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

//export module
module.exports = router;