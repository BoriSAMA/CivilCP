const express = require('express');
const router = express.Router();

var sequelize = require('../connection');
var DataTypes = require("sequelize").DataTypes;
const { Op } = require("sequelize");

var Salary = require('../model/salary')(sequelize, DataTypes);

//submit an item
router.post('/', async(req, res) => {
	try{
        const result = await sequelize.transaction(async (t) => {
            const sal = await Salary.create({
                            VALUE: req.body.val,
                            MULTIPLIER: req.body.mult,
                            TRANSPORT_SUBSIDY: req.body.tran,
                            ENDOWMENT: req.body.endo,
                            SAFETY_EQUIPMENT: req.body.saeq,
                            ANNUAL_CALENDAR_HOURS: req.body.ach,
                            ANNUAL_WORKING_HOURS: req.body.awh,
                            TOTAL_ANNUAL_EFFECTIVE_HOURS: req.body.aeh,
                            DAILY_VALUE: req.body.daily,
                            HOURLY_VALUE: req.body.hourly
                        }, { transaction: t });
            return sal;
        });
        
		console.log("item created: "+ result.ID + " name: " + result.NAME);
		res.status(200).json(result);
	}catch(err){
        res.status(500).json({message:err});
        //res.status(500).json({message:"internal server error"});
	}
});

//get all
router.get('/', async(req, res) => {
	try{
		const result = await sequelize.transaction(async (t) => {
			const sal = await Salary.findAll({ transaction: t });
			return sal;
        });

		if(result == ""){
			throw {name : "EmptyError", message : "No hay salarios para mostrar"}; 
        }
		res.status(200).json(result);
	}catch(err){
		res.status(500).json({message:"internal server error"});
	}
});

//get one
router.get('/:id', async(req, res) => {
	try{
		const result = await sequelize.transaction(async (t) => {
			const sal = await Salary.findAll({where: {ID: req.params.id}},{ transaction: t });
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

//Delete
router.delete('/', async(req, res) => {
	try{
		const result = await sequelize.transaction(async (t) => {
            const item = await Salary.destroy({
                                    where: {
                                        ID: req.body.id
                                    }
                                }, { transaction: t });
            return item;
        });

		if(result == ""){
			throw {name : "MatchError", message : "No se encontro el salario"}; 
        }
		console.log("pg deleted: "+ result.ID + " name: " + result.NAME);
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
            const sal = await Salary.update({ 
                                VALUE: req.body.val,
                                MULTIPLIER: req.body.mult,
                                TRANSPORT_SUBSIDY: req.body.tran,
                                ENDOWMENT: req.body.endo,
                                SAFETY_EQUIPMENT: req.body.saeq,
                                ANNUAL_CALENDAR_HOURS: req.body.ach,
                                ANNUAL_WORKING_HOURS: req.body.awh,
                                TOTAL_ANNUAL_EFFECTIVE_HOURS: req.body.aeh,
                                DAILY_VALUE: req.body.daily,
                                HOURLY_VALUE: req.body.hourly
                            },{
                                where: {
                                    ID: req.body.id
                                }
                            },{ transaction: t });
            return sal;
        });

		if(result == 0){
			throw {name : "MatchError", message : "No se actualizo el salario"}; 
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