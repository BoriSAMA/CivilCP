const express = require('express');
const router = express.Router();
var sequelize = require('../connection');
const { Op } = require("sequelize");

var initModels = require("../model/init-models");
var models = initModels(sequelize);


//submit an apu
router.post('/', async(req, res) => {
	try{
        const result = await sequelize.transaction(async (t) => {
            const sal = await models.worker.create({
                            ID_USER: req.body.idu,
                            ID_RANK: req.body.rank,
                            NAME: req.body.name,
                            CC: req.body.cc,
                            PHONE:req.body.phone,
                            SKILL: req.body.skill
                        }, { transaction: t });
            return sal;
        });
        
		console.log("worker created: "+ result.ID);
		res.status(200).json(result);
	}catch(err){
        if(err.name == "SequelizeValidationError"){
			res.status(400).json({message:"Datos incompletos"});
		}else{
			res.status(500).json({message:"internal server error"});
		}
	}
});

//get all
router.get('/', async(req, res) => {
	try{
		const result = await sequelize.transaction(async (t) => {
			const sal = await models.worker.findAll({where: {ID_USER: req.body.idu}},{ transaction: t });
			return sal;
        });

		if(result == ""){
            throw {name : "EmptyError", message : "Empleados no encontrados"};
        }
		res.status(200).json(result);
	}catch(err){
		if(err.name == "EmptyError"){
            res.status(404).json({message:err.message});
        }else{
            res.status(500).json({message:"internal server error"});
        }
	}
});


//Delete
router.patch('/', async(req, res) => {
    try{
		const result = await sequelize.transaction(async (t) => {
            const sal = await models.worker.destroy({
                                where: {
                                    ID: req.body.id
                                }
                            },{ transaction: t });
            return sal;
        });

		if(result == 0){
			throw {name : "MatchError", message : "No se elimino el trabajador"}; 
        }
        console.log(result)
		res.status(200).json(result);
	}catch(err){
        if(err.name == "MatchError"){
            res.status(400).json({message:err.message});
        }else{
            res.status(500).json({message:"internal server error"});
        }
	}
});

//Update
router.patch('/', async(req, res) => {
    try{
		const result = await sequelize.transaction(async (t) => {
            const sal = await models.worker.update({
                                ID_RANK: req.body.rank,
                                NAME: req.body.name,
                                CC: req.body.cc,
                                PHONE:req.body.phone,
                                SKILL: req.body.skill
                            },{
                                where: {
                                    ID: req.body.id
                                }
                            },{ transaction: t });
            return sal;
        });

		if(result == 0){
			throw {name : "MatchError", message : "No se actualizo el trabajador"}; 
        }
        console.log(result)
		res.status(200).json(result);
	}catch(err){
        if(err.name == "MatchError"){
            res.status(400).json({message:err.message});
        }else{
            res.status(500).json({message:"internal server error"});
        }
	}
});

//export module
module.exports = router;