const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
//load model
var sequelize = require('../connection');
var DataTypes = require("sequelize").DataTypes;
const { Op } = require("sequelize");

var User = require('../model/user')(sequelize, DataTypes);

//register
router.post('/register', async(req, res) => {
	try{
		console.log(req.body);
		var { name, code, mail, pass, pass2 } = req.body;

		if (!name || !code || !mail || !pass || !pass2) {
			throw {name : "regError", message : "Datos incompletos"};
		}
		if (pass != pass2) {
			throw {name : "regError", message : "Las contraseñas no concuerdan"};
		}
		if (pass.length < 6) {
			throw {name : "regError", message : "La contraseña debe ser de al menos 6 de longitud"};
		}
		if (code.length < 7) {
			throw {name : "regError", message : "El codigo debe ser de al menos 7 de longitud"};
		}
		if (!mail.endsWith("@ufps.edu.co")){
			throw {name : "regError", message : "el correo debe ser de la UFPS"};
		}

		bcrypt.genSalt(10, async (err, salt) => {
			bcrypt.hash(pass, salt, async (err, hash) => {
			  if (err) throw err;
				pass = hash;
			});
		});

		await sequelize.transaction(async (t) => {
			const user = await User.create({
							CODE: code,
							NAME: name,
							SUPERUSER: false,
							PASWORD: pass,
							MAIL: mail
						}, { transaction: t });
			return user;
		});

		res.status(200).render('user/login',{
			success: "se ha registrado correctamente"
		});

	}catch(err){
		if(err.name == "SequelizeUniqueConstraintError"){
			res.status(400).render('user/register',{
				error: "Correo o codigo ya utilizados"
			});
		}else if(err.name == "regError"){
			res.status(400).render('user/register',{
				error: err.message
			});
		}else {
			res.status(400).render('user/register',{
				error: "internal server error"
			});
		}
	}
});

router.get('/register', async(req, res) => {
	try{
		res.status(200).render('user/register');
	}catch(err){
        res.status(500).json({message:"internal server error"});
	}
});

//login
router.post('/login', async(req, res) => {
	try{
		let result = await sequelize.transaction(async (t) => {
			const user = await User.findAll({
								where: {
									MAIL: req.body.mail
								}
							}, { transaction: t });
			return user;
		});

		if(result == ""){
			throw {name : "loginError", message : "Usuario o contraseña incorrecto"};
		}

		var user = result[0].dataValues;

          // Match password
            var passwaord = bcrypt.compare(req.body.pass, user.PASWORD, (err, isMatch) => {
				if (err) throw err;

                if (isMatch) {
                    return true;
                } else {
                    throw {name : "loginError", message : "Usuario o contraseña incorrecto"};
                }
            });

		res.status(200).render('index',{
			selected: 'normal',
			user: user
		});
	}catch(err){
		if(err.name == "loginError"){
			res.status(400).render('user/login',{
				error: err.message
			});
		}else{
			res.status(400).render('user/login',{
				error: err
				//error: "internal server error"
			});
		}
	}
});

router.get('/login', async(req, res) => {
	try{
		res.status(200).render('user/login');
	}catch(err){
        res.status(500).json({message:"internal server error"});
	}
});

//export module
module.exports = router;
