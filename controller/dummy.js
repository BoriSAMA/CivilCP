const express = require('express');
const router = express.Router();

//var Uwu = require('../models/user')(sequelize, DataTypes);

// todos los modelos
// var initModels = require("../model/init-models");
// var models = initModels(sequelize);
// models.User.findAll({ where: { username: "tony" }}).then(...);


//submit
router.post('/', async(req, res) => {
	try{
		const result = await sequelize.transaction(async (t) => {
			const uwu = await Uwu.create({
							NombreAtrEnModelo: req.body.uwu
						}, { transaction: t });

			return uwu;
		});
		
		console.log("wuu created: ", result.ID + "");
		res.status(200).json(result);
	}catch(err){
		res.status(400).json({message:err});
	}
});

//get all
router.get('/', async(req, res) => {
	try{
		const result = await sequelize.transaction(async (t) => {
			const uwu = await Uwu.findAll({	}, { transaction: t });
			return uwu;
		});

		if(result == ""){
			throw {name : "Error", message : "jajanose"};
		}
		res.json(result);
	}catch(err){
		if(err.name == "Error"){
            res.status(404).json({message:err.message});
        }else{
            res.status(500).json({message:"internal server error"});
        }
	}
});

//get one
router.get('/:userId', async(req,res) => {
	try{
		let user = await User.findById(req.params.userId);
		res.json(user);
	}catch(err){
		res.json({message:err});
	}
});

//cambiar en init_models
//models.chapter_group.hasMany(models.chapter, {foreignKey: 'ID_CHP_GRP'})
//models.chapter.belongsTo(models.chapter_group, {foreignKey: 'ID'})
//como popular el arreglo
//await models.chapter.findAll({include: [models.chapter_group]},{ transaction: t });


//Delete
router.delete('/:userId', async(req, res) => {
	try{
		let removedUser = await user.remove({_id: req.params.userId});
		res.json(removedUser);
	}catch(err){
		res.json({message:err});
	}
});

//Update
router.patch('/:userId', async(req, res) => {
	try{
		let updatedUser = await user.updateOne(
			{_id: req.params.userId}, 
			{$set: { title: req.body.title}} 
		);
		res.json(updatedUser);
	}catch(err){
		res.json({message:err});
	}
});

//export module
module.exports = router;