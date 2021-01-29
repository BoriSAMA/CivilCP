const express = require('express');
const router = express.Router();

var sequelize = require('../connection');
var DataTypes = require("sequelize").DataTypes;
const { Op } = require("sequelize");

var User = require('../model/user')(sequelize, DataTypes);

//register
router.post('/:name', async(req, res) => {
	try{
		var url = req.params.name;
		console.log("awa:" + url)
		if(url == "register"){
				let result = await sequelize.transaction(async (t) => {
					const user = await User.create({
									CODE: req.body.code,
									NAME: req.body.name,
									SUPERUSER: false,
									PASWORD: req.body.pass,
									MAIL: req.body.mail
								}, { transaction: t });
					return user;
				});
				console.log("user created: ", result.ID + "codigo: " + result.CODE);
				res.status(200).json(result);
			
		}else if(url == "login"){
				let result = await sequelize.transaction(async (t) => {
					const user = await User.findAll({
								where: {
									[Op.and]: [{
										MAIL: req.body.mail
									},{
										PASWORD: req.body.pass
									}]
								}
								}, { transaction: t });
					console.log("user" + user);
					return user;
				});

				if(result == ""){
					throw {name : "loginError", message : "Usuario o contraseña incorrecto"}; 
				}
				res.status(200).json(result);				
		}else{
			throw {name : "matchError", message : "url invalida"};
		}
		
	}catch(err){
		if(err.name == "SequelizeUniqueConstraintError"){
			res.status(400).json({message:"Correo o codigo ya utilizados"});
		}else if(err.name == "SequelizeValidationError"){
			res.status(400).json({message:"Datos incompletos"});
		}else if(err.name == "loginError"){
			res.status(406).json({message:err.message});
		}else{
			res.status(500).json({message:"internal server error"});
		}
	}
});


//get views
router.get('/:uwu', async(req, res) => {
	try{
		var url = req.params.uwu;
        if(url == "register"){
			res.status(200).render('user/register');
		}else if(url == "login"){
			res.status(200).render('user/login');
		}else{
			throw {name : "matchError", message : "url invalida"};
		}
	}catch(err){
		if(err.name == "matchError"){
            res.status(404).json({message:err.message});
        }else{
            res.status(500).json({message:"internal server error"});
        }
	}
});

//export module
module.exports = router;