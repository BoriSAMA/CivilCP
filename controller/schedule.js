const express = require('express');
const router = express.Router();
var sequelize = require('../connection');
const { Op } = require("sequelize");

var initModels = require("../model/init-models");
var models = initModels(sequelize);

//get one schedule for user
router.get('/', async(req, res) => {
	try{
		const result = await sequelize.transaction(async (t) => {
			const item = await models.schedule.findAll({
                                        where: {
                                            [Op.and]: [
                                                { ID: req.query.sid },
                                                { ID_USER: req.session.user.ID }
                                            ]
                                        }
                                    },{ transaction: t });
			return item;
        });

        if ( result.length == 0 ) {
            throw {name : "regError", message : "Programacion no encontrada"};
        }

        res.status(200).render('index',{
            selected: 'gantt',
            user: req.session.user,
            schedule: result[0].dataValues
        });
	}catch(err){
        res.status(200).render('index',{
            selected: 'gantt',
            user: req.session.user,
            error: err.message
        });
	}
});

//get one schedule activity for user
router.get('/sch/:id', async(req, res) => {
	try{
		var result = await sequelize.transaction(async (t) => {
			const item = await models.schedule.findAll({
                                        where: {
                                            [Op.and]: [
                                                { ID: req.params.id },
                                                { ID_USER: req.session.user.ID }
                                            ]
                                        }
                                    },{ transaction: t });
			return item;
        });

         
        if ( result.length == 0 ) {
            throw {name : "regError", message : "Programacion no encontrada"};
        }

        result = result[0].dataValues;

        var act = await sequelize.transaction(async (t) => {
			const item = await models.schedule.findAll({
                                        where: {
                                            ID_QUOTE: result.ID
                                        }
                                    },{ transaction: t });
			return item;
        });
        
        for (let i = 0; i < act.length; i++) {
            act[i] = act[i].dataValues;
        }

        result.activities = act;

        res.status(200).json(result);
	}catch(err){
        res.status(500).json({name: "Error " + err.name, message:"internal server error" + err.message});
	}
});

//get one activity
router.get('/act/:id', async(req, res) => {
	try{
		const result = await sequelize.transaction(async (t) => {
			const item = await models.schedule_activity.findOne({
                                                    where: {
                                                        [Op.and]: [
                                                            { ID: req.params.id },
                                                            { ID_USER: req.session.user.ID }
                                                        ]
                                                    }
                                                },{ transaction: t });
			return item;
        });


        res.status(200).json(result);
	}catch(err){
        res.status(500).json({name: "Error " + err.name, message:"internal server error" + err.message});
	}
});

//Update a schedule
router.patch('/sch/:id', async(req, res) => {
    try{        
        var { date_s, date_f , dur } = req.body;

        if ( !dur ) {
            throw {name : "regError", message : "Datos del presupuesto incompletos"};
        }

		const result = await sequelize.transaction(async (t) => {
            const item = await models.quotation.update({ 
                                TOTAL_DURATION: dur,
                                START_DATE: date_s,
                                FINISH_DATE: date_f
                            },{
                                where: {
                                    ID: req.params.id
                                }
                            },{ transaction: t });
            return item;
        });

		if(result == ""){
			throw {name : "MatchError", message : "No se encontro pudo realizar la actualizacion"}; 
        }
		res.status(200).json({name: "Exito", message: "Se ha actualizado el presupuesto"});
	}catch(err){
        if(err.name == "MatchError" || err.name == "regError"){
            res.status(400).json({name: "Error", message: err.message});
        }else {
            res.status(500).json({name: "Error: " + err.name, message:"internal server error " + err.message});
        }
	}
});

//Update an activity
router.patch('/:id', async(req, res) => {
    try{        
        var { dur, del, date_s, date_f, date_d_f, idpa, idpt} = req.body;

        if (!dur || !del || idpa != 0 || idpt != 0) {
            throw {name : "regError", message : "Datos de la actividad incompletos"};
        }

		const result = await sequelize.transaction(async (t) => {
            const item = await models.quotation.update({ 
                                DURATION: dur,
                                DELAY: del,
                                START_DATE: date_s,
                                FINISH_DATE: date_f,
                                DELAYED_DATE: date_d_f,
                                ID_PRE_ACT: idpa,
                                ID_PRE_TYP: idpt
                            },{
                                where: {
                                    [Op.and]: [
                                        { ID: req.params.id },
                                        { ID_USER: req.session.user.ID }
                                    ]
                                }
                            },{ transaction: t });
            return item;
        });

		if( result == "" ){
			throw {name : "MatchError", message : "No se pudo realizar la actualizacion"}; 
        }
		res.status(200).json({name: "Exito", message: "Se ha actualizado la actividad"});
	}catch(err){
        if(err.name == "MatchError" || err.name == "regError"){
            res.status(400).json({name: "Error", message: err.message});
        }else {
            res.status(500).json({name: "Error: " + err.name, message:"internal server error " + err.message});
        }
	}
});

//export module
module.exports = router;