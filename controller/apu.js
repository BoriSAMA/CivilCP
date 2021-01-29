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
            const sal = await models.apu.create({
                            ID_QUO_ACT: req.body.idqa
                        }, { transaction: t });
            return sal;
        });
        
		console.log("apu created: "+ result.ID);
		res.status(200).json(result);
	}catch(err){
        res.status(500).json({message:err});
        //res.status(500).json({message:"internal server error"});
	}
});

//get one
router.get('/', async(req, res) => {
	try{
		const result = await sequelize.transaction(async (t) => {
			const sal = await models.apu.findAll({where: {ID: req.body.id}},{ transaction: t });
			return sal;
        });

		if(result == ""){
            throw {name : "EmptyError", message : "Salario no encontrado"};
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

//Update
router.patch('/', async(req, res) => {
    try{
		const result = await sequelize.transaction(async (t) => {
            const sal = await models.apu.update({ 
                                TOTAL: req.body.total
                            },{
                                where: {
                                    ID: req.body.id
                                }
                            },{ transaction: t });
            return sal;
        });

		if(result == 0){
			throw {name : "MatchError", message : "No se actualizo el apu"}; 
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