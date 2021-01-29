const express = require('express');
const router = express.Router();
var sequelize = require('../connection');
const { Op } = require("sequelize");

var initModels = require("../model/init-models");
var models = initModels(sequelize);


//submit a group to the quotation
router.post('/:groupType', async(req, res) => {
	try{
        var url = req.params.groupType;
        var result;

        if(url == "chp_grp"){
            result = await sequelize.transaction(async (t) => {
                const item = await models.quote_chp_grp.create({
                                QUOTE_NUMBER: req.body.numb,
                                CUSTOM_NAME: req.body.name,
                                ID_QUOTE: req.body.idq,
                                ID_CHP_GRP: req.body.idcg
                            }, { transaction: t });
                return item;
            });
        }else if(url == "chapter"){
            result = await sequelize.transaction(async (t) => {
                const item = await models.quote_chapter.create({
                                QUOTE_NUMBER: req.body.numb,
                                CUSTOM_NAME: req.body.name,
                                ID_CHAPTER: req.body.idch,
                                ID_QUO_CHP_GRP: req.body.idqcg
                            }, { transaction: t });
                return item;
            });
        }else if(url == "activity"){
            result = await sequelize.transaction(async (t) => {
                const item = await models.quote_chp_grp.create({
                                QUOTE_NUMBER: req.body.numb,
                                CUSTOM_NAME: req.body.name,
                                ID_ACTIVITY: req.body.ida,
                                ID_QUO_CHP: req.body.idqc
                            }, { transaction: t });
                return item;
            });
        }else{
            throw {name : "BadError", message : "Invalid URL"};
        }
        
		console.log("group created: "+ result.ID + " name: " + result.NAME);
		res.status(200).json(result);
	}catch(err){
        if(err.name == "BadError"){
            res.status(404).json({message:err.message});
        }else{
            res.status(500).json({message:"internal server error"});
        }
	}
});

//get all groups on an quotation
router.get('/', async(req, res) => {
	try{
        var result;
		const cg = await sequelize.transaction(async (t) => {
            const item = await models.quote_chp_grp.findAll({where: {ID_QUOTE: req.body.idq}},{ transaction: t });
			return item;
        });
        const ch = await sequelize.transaction(async (t) => {
            const item = await models.quote_chapter.findAll({include: [{   
                                                                model: models.quote_chp_grp,
                                                                where: {
                                                                    ID_QUOTE: req.body.idq
                                                                }}]
                                                        },{ transaction: t });
			return item;
        });
        const ac = await sequelize.transaction(async (t) => {
            const item = await models.quote_activity.findAll({include: [{   
                                                                model: models.chapter_group,
                                                                include: {
                                                                    model: models.quote_chp_grp,
                                                                    where: {
                                                                        ID_QUOTE: req.body.idq
                                                                    }
                                                                }
                                                            }]
                                                        },{ transaction: t });
			return item;
        });

        result = [cg,ch,ac]

		if(result == ""){
			throw new Error()
        }
		res.status(200).json(result);
	}catch(err){
		res.status(500).json({message:"internal server error"});
	}
});

//Delete
router.delete('/:groupType', async(req, res) => {
	try{
        var url = req.params.groupType;
        var result;

        if(url == "chp_grp"){
            result = await sequelize.transaction(async (t) => {
                const item = await models.quote_chp_grp.destroy({
                                                where: {
                                                    ID: req.body.id
                                                }
                                            }, { transaction: t });
                return item;
            });
        }else if(url == "chapter"){
            result = await sequelize.transaction(async (t) => {
                const item = await models.quote_chapter.create({
                                                where: {
                                                    ID: req.body.id
                                                }
                                            }, { transaction: t });
                return item;
            });
        }else if(url == "activity"){
            result = await sequelize.transaction(async (t) => {
                const item = await models.quote_chp_grp.create({
                                                where: {
                                                    ID: req.body.id
                                                }
                                            }, { transaction: t });
                return item;
            });
        }else{
            throw {name : "BadError", message : "Invalid URL"};
        }

		if(result == 0){
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
router.patch('/:groupType', async(req, res) => {
    try{
        var url = req.params.groupType;
        var result;

        if(url == "chp_grp"){
            result = await sequelize.transaction(async (t) => {
                const item = await models.quote_chp_grp.update({
                                                CUSTOM_NAME: req.body.name
                                            },{
                                                where: {
                                                    ID: req.body.id
                                                }
                                            }, { transaction: t });
                return item;
            });
        }else if(url == "chapter"){
            result = await sequelize.transaction(async (t) => {
                const item = await models.quote_chapter.update({
                                                CUSTOM_NAME: req.body.name
                                            },{
                                                where: {
                                                    ID: req.body.id
                                                }
                                            }, { transaction: t });
                return item;
            });
        }else if(url == "activity"){
            result = await sequelize.transaction(async (t) => {
                const item = await models.quote_activity.update({
                                                CUSTOM_NAME: req.body.name,
                                                TOTAL: req.body.total,
                                                QUANTITY: req.body.quan,
                                                MEASSURE_UNIT: req.body.meas
                                            },{
                                                where: {
                                                    ID: req.body.id
                                                }
                                            }, { transaction: t });
                return item;
            });
        }else{
            throw {name : "BadError", message : "Invalid URL"};
        }

		if(result == 0){
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

//export module
module.exports = router;