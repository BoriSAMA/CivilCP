const express = require('express');
const router = express.Router();
//var initModels = require("../models/init-models");
var User = require('../models/user')(sequelize, DataTypes);


// todos los modelos
// var models = initModels(sequelize);

//login
router.post('/login', async(req, res) => {
	try{
		await User.findOne({ user_email: req.body.email },
			function (err, user) {
				if (err) {
					res.status(500).json({
						ok: false,
						err: {
							message: "Usuario o contraseña incorrectos"
						},
						user: user
					})
				}
				// Verifica que exista un usuario con el mail escrita por el usuario.
				if (user == null) {
					res.status(400).json({
						ok: false,
						err: {
							message: "Usuario o contraseña incorrectos"
						}
					});
				}
				// Valida que la contraseña escrita por el usuario, sea la almacenada en la db
				else if (req.body.password != user.user_password){
					res.status(400).json({
						ok: false,
						err: {
							message: "Usuario o contraseña incorrectos"
						}
					});
				}
				else{
					res.status(200).json({
						ok: true,
						usuario: user
					})
				}
			}	
		);

	}catch(err){
		res.status(500).json({message:err});
	}
});
