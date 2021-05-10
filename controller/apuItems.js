const express = require('express');
const router = express.Router();
var sequelize = require('../connection');
const { Op } = require("sequelize");

var initModels = require("../model/init-models");
var models = initModels(sequelize);


//submit an item
router.post('/:item', async(req, res) => {
	try{
        var result;
        var url = req.params.item;

        if(url == "content"){
            result = await sequelize.transaction(async (t) => {
                const item = await models.apu_content.create({
                                ID_APU: req.body.idapu,
                                ID_CONTENT: req.body.idco
                            }, { transaction: t });
                return item;
            });
        }else if(url == "item"){
            result = await sequelize.transaction(async (t) => {
                const item = await models.apu_item.create({
                                CUSTOM_DESCRIPTION: req.body.desc,
                                CUSTOM_PERFORMANCE: parseFloat(req.body.perf),
                                ID_APU_CONTENT: req.body.idapuc,
                                QUANTITY: req.body.quan,
                                TOTAL: req.body.total,
                                ID_ITEM: req.body.idit,
                                ID_SALARY: req.body.sala
                            }, { transaction: t });
                return item;
            });
        }else{
            throw {name : "BadError", message : "Invalid URL"};
        }
        
        
		console.log("item created: "+ result.ID + " name: " + result.NAME);
		res.status(200).json(result);
	}catch(err){
        if(err.name == "BadError"){
            res.status(404).json({message:err.message});
        }else{
            res.status(500).json({message:"internal server error"});
        }
	}
});

//get all for superuser
router.get('/', async(req, res) => {
	try{
        var result;

        const ac = await sequelize.transaction(async (t) => {
			const item = await models.apu_content.findAll({where:{
                                                    ID_APU: req.body.idapu
                                                }
                                            },{ transaction: t });
			return item;
        });

		const ai = await sequelize.transaction(async (t) => {
			const item = await models.apu_item.findAll({include: [{   
                                                    model: models.apu_content,
                                                    where:{
                                                        ID_APU: req.body.idapu
                                                    }}]
                                            },{ transaction: t });
			return item;
        });

        result = [ac, ai];

		if(result == ""){
			throw new Error()
        }
		res.status(200).json(result);
	}catch(err){
		res.status(500).json({message:"internal server error"});
	}
});

//Delete
router.delete('/', async(req, res) => {
    try{
        var result;
        var url = req.params.item;

        if(url == "content"){
            result = await sequelize.transaction(async (t) => {
                const item = await models.apu_content.destroy({
                                                where:{
                                                    ID: req.body.idcon
                                                }
                                            }, { transaction: t });
                return item;
            });
        }else if(url == "item"){
            result = await sequelize.transaction(async (t) => {
                const item = await models.apu_item.destroy({
                                                where:{
                                                    ID: req.body.idite
                                                }
                                            }, { transaction: t });
                return item;
            });
        }else{
            throw {name : "BadError", message : "Invalid URL"};
        }
        
        if(result == 0){
			throw {name : "MatchError", message : "No se borro el item"}; 
        }
		res.status(200).json(result);
	}catch(err){
        if(err.name == "BadError" || err.name == "MatchError"){
            res.status(404).json({message:err.message});
        }else{
            res.status(500).json({message:"internal server error"});
        }
    }
});

//Update
router.patch('/', async(req, res) => {
    try{
        var result;
        var url = req.params.item;

        if(url == "content"){
            result = await sequelize.transaction(async (t) => {
                const item = await models.apu_content.update({
                                                TOTAL: req.body.total
                                            },{
                                                where:{
                                                    ID: req.body.idcon
                                                }
                                            }, { transaction: t });
                return item;
            });
        }else if(url == "item"){
            result = await sequelize.transaction(async (t) => {
                const item = await models.apu_item.update({
                                                    ID_SALARY: req.body.idsal,
                                                    ID_ITEM: req.body.idite,
                                                    QUANTITY: req.body.quan,
                                                    TOTAL: req.body.total,
                                                    CUSTOM_DESCRIPTION: req.body.cdes,
                                                    CUSTOM_PERFORMANCE: req.body.cper
                                            },{
                                                where:{
                                                    ID: req.body.idapit
                                                }
                                            }, { transaction: t });
                return item;
            });
        }else{
            throw {name : "BadError", message : "Invalid URL"};
        }
        
        if(result == 0){
			throw {name : "MatchError", message : "No se borro el item"}; 
        }
		res.status(200).json(result);
	}catch(err){
        if(err.name == "BadError" || err.name == "MatchError"){
            res.status(404).json({message:err.message});
        }else{
            res.status(500).json({message:"internal server error"});
        }
    }
});

//export module
module.exports = router;