const express = require('express');
const router = express.Router();
var sequelize = require('../connection');
const { Op } = require("sequelize");

var initModels = require("../model/init-models");
var models = initModels(sequelize);


//submit an quote
router.post('/', async(req, res) => {
	try{
        var {name, padm, pune, puti, piva} = req.body;

        if (!name || padm == 0 || pune == 0 || puti == 0 || piva == 0) {
            throw {name : "regError", message : "Datos del presupuesto incompletos"};
        }

        const result = await sequelize.transaction(async (t) => {
            const item = await models.quotation.create({
                            NAME: name,
                            PRC_ADMIN: padm,
                            PRC_UNEXPECTED: pune,
                            PRC_UTILITY: puti,
                            PRC_IVA: piva,
                            TOTAL_DIRECT: 0,
                            ADMIN: 0,
                            UNEXPECTED: 0,
                            UTILITY: 0,
                            IVA: 0,
                            TOTAL: 0,
                            ID_USER: req.session.user.ID
                        }, { transaction: t });
            return item;
        });
        
		res.status(200).json({name: "Exito", message: "Se ha registrado el presupuesto"});
	}catch(err){
        if(err.name == "regError"){
            res.status(400).json({name: "Error", message: err.message});
		}else {
            res.status(500).json({name: "Error " + err.name, message: "internal server error" + err.message});
		}
	}
});

//get all for user
router.get('/', async(req, res) => {
	try{
        var array = [];
		const result = await sequelize.transaction(async (t) => {
			const item = await models.quotation.findAll({
                                                where: {
                                                    ID_USER: req.session.user.ID
                                                }
                                                },{ transaction: t });
			return item;
        });

		for (let i = 0; i < result.length; i++) {
            array[i] = result[i].dataValues;
        }

        res.status(200).render('index',{
            selected: 'budget-all',
            user: req.session.user,
            quotes: array
        });
	}catch(err){
		res.status(200).render('index',{
            selected: 'budget-all',
            user: req.session.user,
            error: "Internal server error"
        });
	}
});

//get one for user
router.get('/:id', async(req, res) => {
	try{
		const result = await sequelize.transaction(async (t) => {
			const item = await models.quotation.findAll({
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

//Delete
router.delete('/:id', async(req, res) => {
	try{

		const result = await sequelize.transaction(async (t) => {
            const item = await models.quotation.destroy({
                            where: {
                                [Op.and]: [
                                    { ID: req.params.id },
                                    { ID_USER: req.session.user.ID }
                                ]
                            }
                        }, { transaction: t });
            return item;
        });

		if(result == ""){
			throw {name : "MatchError", message : "No se encontro el presupuesto en la lista del usuario"}; 
        }
		res.status(200).json({name: "Exito", message: "Se ha eliminado el presupuesto"});
	}catch(err){
        if(err.name == "MatchError"){
            res.status(400).json({name: "Error", message: err.message});
        }else if(err.name == "SequelizeForeignKeyConstraintError"){
            res.status(400).json({name: "Error", message:"Si continua eliminara todos los contenidos de este presupuesto"});
        }else {
            res.status(500).json({name: "Error " + err.name, message:"internal server error" + err.message});
        }
	}
});

//Update
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