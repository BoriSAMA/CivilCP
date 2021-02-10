const express = require('express');
const router = express.Router();
const url = require('url');

var sequelize = require('../connection');
var DataTypes = require("sequelize").DataTypes;
const { Op } = require("sequelize");

var Salary = require('../model/salary')(sequelize, DataTypes);

//submit an salary
router.post('/', async(req, res) => {
	try{
		var { mult, val, tran} = req.body;

        if (!mult || !val || !tran) {
			throw {name : "regError", message : "Datos incompletos"};
		}else if (mult < 1 || mult > 3) {
			throw {name : "regError", message : "El multiplicador debe ser un numero entre 1 y 3"};
		}

        await sequelize.transaction(async (t) => {
            const sal = await Salary.create({
                            VALUE: req.body.val,
                            MULTIPLIER: req.body.mult,
                            TRANSPORT_SUBSIDY: req.body.tran,
                            ENDOWMENT: 0,
                            SAFETY_EQUIPMENT: 0,
                            ANNUAL_CALENDAR_HOURS: 0,
                            ANNUAL_WORKING_HOURS: 0,
                            TOTAL_ANNUAL_EFFECTIVE_HOURS: 0,
                            DAILY_VALUE: 0,
                            HOURLY_VALUE: 0
                        }, { transaction: t });
            return sal;
        });
        
        res.status(200).json({name: "Exito", message: "Se ha registrado el salario corectamente"});
	}catch(err){
        if(err.name == "regError"){
            res.status(400).json({name: "Error", message: err.message});
		}else {
            res.status(500).json({name: "Error", message: "internal server error"});
		}
	}
});

//get all
router.get('/all/', async(req, res) => {
    var array = [];
	try{
		const result = await sequelize.transaction(async (t) => {
			const sal = await Salary.findAll({ transaction: t });
			return sal;
        });

        for (let i = 0; i < result.length; i++) {
            array[i] = result[i].dataValues;
        }
        
        res.status(200).render('index',{
            selected: 'salary',
            user: req.session.user,
            salaries: array
        });
	}catch(err){
        res.status(200).render('index',{
            selected: 'salary',
            user: req.session.user,
            error: "internal server error",
            salaries: array
        });
	}
});

//get one
router.get('/mult/:id', async(req, res) => {
	try{
		const result = await sequelize.transaction(async (t) => {
			const sal = await Salary.findOne({where: {MULTIPLIER: req.params.id}},{ transaction: t });
			return sal;
        });
		res.status(200).json(result);
	}catch(err){
        res.status(500).json({name: "Error", message: "internal server error"});
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
            res.status(400).json({name: "Error", message: err.message});
        }else{
            res.status(500).json({name: "Error", message: "internal server error"});
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

		if(result == 0){
			throw {name : "MatchError", message : "No se encontro el salario"}; 
        }
		res.status(200).json({name: "Exito", message: "Se ha eliminado el salario corectamente"});
	}catch(err){
        if(err.name == "MatchError"){
            res.status(400).json({name: "Error", message: err.message});
        }else{
            res.status(500).json({name: "Error", message: "internal server error"});
        }
	}
});

//Update
router.patch('/:id', async(req, res) => {
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
                                    ID: req.params.id
                                }
                            },{ transaction: t });
            return sal;
        });

		if(result == 0){
			throw {name : "MatchError", message : "No se encontro el salario"}; 
        }
        res.status(200).json({name: "Exito", message: "Se ha actualizado el salario corectamente"});
	}catch(err){
        if(err.name == "MatchError"){
            res.status(400).json({name: "Error", message: err.message});
        }else{
            res.status(500).json({name: "Error", message: "internal server error"});
        }
	}
});

//export module
module.exports = router;