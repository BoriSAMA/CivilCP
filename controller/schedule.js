const express = require('express');
const router = express.Router();
var sequelize = require('../connection');
const { Op } = require("sequelize");

var initModels = require("../model/init-models");
var models = initModels(sequelize);

//get one for user
router.get('/:id', async(req, res) => {
	try{
		const result = await sequelize.transaction(async (t) => {
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



        res.status(200).json(result);
	}catch(err){
        res.status(500).json({name: "Error " + err.name, message:"internal server error" + err.message});
	}
});

//get one activity
router.get('/:id', async(req, res) => {
	try{
		const result = await sequelize.transaction(async (t) => {
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



        res.status(200).json(result);
	}catch(err){
        res.status(500).json({name: "Error " + err.name, message:"internal server error" + err.message});
	}
});

//Update a schedule
router.patch('/:id', async(req, res) => {
    try{
        console.log(req.body);
        
        var {name, tdir, padm, admi, pune, unex, puti, util, piva, iva, total} = req.body;

        

        if (!name || !tdir || !padm || !admi || 
            !pune || !unex || !puti || !util || 
            !piva || !iva || !total) {
            throw {name : "regError", message : "Datos del presupuesto incompletos"};
        }

		const result = await sequelize.transaction(async (t) => {
            const item = await models.quotation.update({ 
                                NAME: name,
                                TOTAL_DIRECT: tdir,
                                PRC_ADMIN: padm,
                                ADMIN: admi,
                                PRC_UNEXPECTED: pune,
                                UNEXPECTED: unex,
                                PRC_UTILITY: puti,
                                UTILITY: util,
                                PRC_IVA: piva,
                                IVA: iva,
                                TOTAL: total
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
        console.log(req.body);
        
        var {name, tdir, padm, admi, pune, unex, puti, util, piva, iva, total} = req.body;

        

        if (!name || !tdir || !padm || !admi || 
            !pune || !unex || !puti || !util || 
            !piva || !iva || !total) {
            throw {name : "regError", message : "Datos del presupuesto incompletos"};
        }

		const result = await sequelize.transaction(async (t) => {
            const item = await models.quotation.update({ 
                                NAME: name,
                                TOTAL_DIRECT: tdir,
                                PRC_ADMIN: padm,
                                ADMIN: admi,
                                PRC_UNEXPECTED: pune,
                                UNEXPECTED: unex,
                                PRC_UTILITY: puti,
                                UTILITY: util,
                                PRC_IVA: piva,
                                IVA: iva,
                                TOTAL: total
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

//export module
module.exports = router;