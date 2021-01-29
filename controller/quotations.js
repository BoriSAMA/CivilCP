const express = require('express');
const router = express.Router();
var sequelize = require('../connection');
const { Op } = require("sequelize");

var initModels = require("../model/init-models");
var models = initModels(sequelize);


//submit an quote
router.post('/', async(req, res) => {
	try{
        const result = await sequelize.transaction(async (t) => {
            const item = await models.quotation.create({
                            NAME: req.body.name,
                            ID_USER: req.body.id
                        }, { transaction: t });
            return item;
        });
        
		console.log("item created: "+ result.ID + " name: " + result.NAME);
		res.status(200).json(result);
	}catch(err){
        res.status(500).json({message:"internal server error"});
	}
});

//get all quotes for su
router.get('/', async(req, res) => {
	try{
		const result = await sequelize.transaction(async (t) => {
			const item = await models.quotation.findAll({include: [models.user]
                                            },{ transaction: t });
			return item;
        });

		if(result == ""){
			throw new Error()
        }
		res.status(200).json(result);
	}catch(err){
		res.status(500).json({message:"internal server error"});
	}
});

//get all for user
router.get('/:name', async(req, res) => {
	try{
        if(!(req.params.name == "user")){
            throw {name : "BadError", message : "Invalid URL"};
        }

		const result = await sequelize.transaction(async (t) => {
			const item = await models.quotation.findAll({where: {ID_USER: req.body.id}},{ transaction: t });
			return item;
        });

		if(result == ""){
            throw new Error();
        }
		res.status(500).json(result);
	}catch(err){
		if(err.name == "BadError"){
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
            const item = await models.quotation.destroy({
                            where: {
                                [Op.and]: [{
                                    ID: req.body.id
                                },{
                                    ID_USER: req.body.idusr
                                }]
                            }
                        }, { transaction: t });
            return item;
        });

		if(result == ""){
			throw {name : "MatchError", message : "No se encontro el presupuesto en la lista del usuario"}; 
        }
		console.log("deleted: "+ result.ID + " name: " + result.NAME);
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
            const item = await models.quotation.update({ 
                                NAME: req.body.name,
                                TOTAL_DIRECT: req.body.tdir,
                                PRC_ADMIN: req.body.padm,
                                ADMIN: req.body.admi,
                                PRC_UNEXPECTED: req.body.pune,
                                UNEXPECTED: req.body.unex,
                                PRC_UTILITY: req.body.puti,
                                UTILITY: req.body.util,
                                PRC_IVA: req.body.piva,
                                IVA: req.body.iva,
                                TOTAL: req.body.total
                            },{
                                where: {
                                    [Op.and]: [{
                                        ID: req.body.id
                                    },{
                                        ID_USER: req.body.idusr
                                    }]
                                }
                            },{ transaction: t });
            return item;
        });

		if(result == ""){
			throw {name : "MatchError", message : "No se encontro el objeto en la lista del usuario"}; 
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

//export module
module.exports = router;