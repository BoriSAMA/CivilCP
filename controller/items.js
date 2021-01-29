const express = require('express');
const router = express.Router();
var sequelize = require('../connection');
const { Op } = require("sequelize");

var initModels = require("../model/init-models");
var models = initModels(sequelize);


//TODO
/**
 * get all items by a activity group
*/

//submit an item
router.post('/', async(req, res) => {
	try{
        const result = await sequelize.transaction(async (t) => {
            const item = await models.item_list.create({
                            NAME: req.body.name,
                            MEASSURE_UNIT: req.body.pref,
                            PERFORMANCE: req.body.pref,
                            DESCRIPTION: req.body.desc,
                            COST: req.body.cost,
                            ID_ACT_GRP: req.body.actg,
                            ID_CONTENT: req.body.cont,
                            ID_USER: req.body.user
                        }, { transaction: t });
            return item;
        });
        
		console.log("item created: "+ result.ID + " name: " + result.NAME);
		res.status(200).json(result);
	}catch(err){
        res.status(500).json({message:"internal server error"});
	}
});

//get all for superuser
router.get('/', async(req, res) => {
	try{
		const result = await sequelize.transaction(async (t) => {
			const item = await models.item_list.findAll({include: [{   
                                                    model: models.activity_group,
                                                    include: {model: models.chapter_group}},
                                                {   
                                                    model: models.user
                                                }]
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

//get all for items
router.get('/:name', async(req, res) => {
	try{
        if(!(req.params.name == "user")){
            throw {name : "BadError", message : "Invalid URL"};
        }

		const result = await sequelize.transaction(async (t) => {
			const item = await models.item_list.findAll({where: {ID_USER: req.body.id}, include: {
                                                            model: models.activity_group,
                                                            include: {model: models.chapter_group}
                                                        }},{ transaction: t });
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
            const item = await models.item_list.destroy({
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

//Update
router.patch('/', async(req, res) => {
    try{
		const result = await sequelize.transaction(async (t) => {
            const item = await models.item_list.update({ 
                                NAME: req.body.name,
                                MEASSURE_UNIT: req.body.pref,
                                PERFORMANCE: req.body.pref,
                                DESCRIPTION: req.body.desc,
                                COST: req.body.cost,
                                ID_ACT_GRP: req.body.actg,
                                ID_CONTENT: req.body.cont
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