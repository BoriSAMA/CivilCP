const express = require('express');
const router = express.Router();

var sequelize = require('../connection');
var DataTypes = require("sequelize").DataTypes;
const { Op } = require("sequelize");

var User = require('../model/user')(sequelize, DataTypes);

//register
router.post('/register', async(req, res) => {
	try{
		const result = await sequelize.transaction(async (t) => {
			const user = await User.create({
							CODE: req.body.code,
							NAME: req.body.name,
							SUPERUSER: false,
							PASWORD: req.body.pass,
							MAIL: req.body.mail
						}, { transaction: t });

			return user;
		});
		sequelize.close();
		console.log("user created: ", result.ID + "codigo: " + result.CODE);
		res.status(200).json(result);
	}catch(err){
		if(err.name == "SequelizeUniqueConstraintError"){
			res.status(400).json({message:"Correo o codigo ya utilizados"});
		}else if(err.name == "SequelizeValidationError"){
			res.status(400).json({message:"Datos incompletos"});
		}else{
			res.status(500).json({message:"internal server error"});
		}
	}
});

//login
router.get('/login', async(req, res) => {
	try{
		const result = await sequelize.transaction(async (t) => {
			const user = await User.findAll({
						where: {
							[Op.and]: [{
								CODE: req.body.code
							},{
								PASWORD: req.body.pass
							}]
						}
						}, { transaction: t });
			console.log("user" + user);
			return user;
		});
		sequelize.close();
		if(result == ""){
			throw new Error()
		}
		res.json(result);
	}catch(err){
		res.status(406).json({message:'Usuario o contraseña incorrecto'});
	}
});

//export module
module.exports = router;