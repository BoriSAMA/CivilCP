const express = require('express');
const router = express.Router();
var sequelize = require('../connection');

var initModels = require("../model/init-models");
var models = initModels(sequelize);

//submit a group
router.post('/:name', async(req, res) => {
	try{
        var result;
        var url = req.params.name;
        console.log(url)
        if(url == 'chp_grp'){
            result = await sequelize.transaction(async (t) => {
                const pg = await models.chapter_group.create({
                                NAME: req.body.name,
                                PREFIX: req.body.pref
                            }, { transaction: t });
                return pg;
            });
        }else if(url == 'chapter'){
            result = await sequelize.transaction(async (t) => {
                const pg = await models.chapter.create({
                               NAME: req.body.name,
                               ID_CHP_GRP: req.body.idchgr
                           }, { transaction: t });
               return pg;
            });
       }else if(url == 'act_grp'){
            result = await sequelize.transaction(async (t) => {
                const pg = await models.activity_group.create({
                                NAME: req.body.name,
                                PREFIX: req.body.pref,
                                ID_CHP_GRP: req.body.idchgr
                            }, { transaction: t });

                return pg;
            });
        }else if(url == 'activity'){
            result = await sequelize.transaction(async (t) => {
                const pg = await models.activity.create({
                                NAME: req.body.name,
                                ID_ACT_GRP: req.body.idacgr
                            }, { transaction: t });

                return pg;
            });
        }else{
            throw {name : "BadError", message : "URL not found"};
        }
		console.log("pg created: "+ result.ID + " name: " + result.NAME);
		res.status(200).json(result);
	}catch(err){
        if(err.name == "BadError"){
            res.status(404).json({message:err.message});
        }else{
            res.status(500).json({message:"internal server error"});
        }
	}
});

//get all
router.get('/', async(req, res) => {
	try{
        var result;
		const cg = await sequelize.transaction(async (t) => {
			const pg = await models.chapter_group.findAll({ transaction: t });
			return pg;
        });
        const ch = await sequelize.transaction(async (t) => {
			const pg = await models.chapter.findAll({include: [models.chapter_group]},{ transaction: t });
			return pg;
        });
        const ag = await sequelize.transaction(async (t) => {
			const pg = await models.activity_group.findAll({include: [models.chapter_group]},{ transaction: t });
			return pg;
        });
        const ac = await sequelize.transaction(async (t) => {
            const pg = await models.activity.findAll({include: {
                                                            model: models.activity_group,
                                                            include: {model: models.chapter_group}
                                                      }
                                                    },{ transaction: t });
			return pg;
        });

        result = [cg, ch, ag, ac];

		if(result == ""){
			throw {name : "EmptyError", message : "No se encontro el objeto en la lista del usuario"};
        }

		res.status(500).json(result);
	}catch(err){
        if(err.name == "EmptyError"){
            res.status(400).json({message:err.message});
        }else{
            res.status(500).json({message:"internal server error"});
        }
	}
});


//Delete
router.delete('/:name', async(req, res) => {
	try{
        var result;
        var url = req.params.name;
        if(url == 'chp_grp'){
            result = await sequelize.transaction(async (t) => {
                const pg = await models.chapter_group.destroy({
                                where: {
                                    ID: req.body.id
                                }
                            }, { transaction: t });
                return pg;
            });
        }else if(url == 'chapter'){
            result = await sequelize.transaction(async (t) => {
                const pg = await models.chapter.destroy({
                                where: {
                                    ID: req.body.id
                                }
                            },  { transaction: t });
               return pg;
            });
       }else if(url == 'act_grp'){
            result = await sequelize.transaction(async (t) => {
                const pg = await models.activity_group.destroy({
                                where: {
                                    ID: req.body.id
                                }
                            }, { transaction: t });
                return pg;
            });
        }else if(url == 'activity'){
            result = await sequelize.transaction(async (t) => {
                const pg = await models.activity.destroy({
                                where: {
                                    ID: req.body.id
                                }
                            }, { transaction: t });
                return pg;
            });
        }else{
            throw {name : "BadError", message : "URL not found"};
        }
		console.log("pg deleted: "+ result.ID + " name: " + result.NAME);
		res.status(200).json(result);
	}catch(err){
        if(err.name == "BadError"){
            res.status(404).json({message:err.message});
        }else{
            res.status(500).json({message:"internal server error"});
        }
	}
});

//Update
router.patch('/:name', async(req, res) => {
	try{
        var result;
        var url = req.params.name;
        if(url == 'chp_grp'){
            result = await sequelize.transaction(async (t) => {
                const pg = await models.chapter_group.update({ 
                                    NAME: req.body.name,
                                    PREFIX: req.body.pref
                                }, {
                                    where: {
                                        ID: req.body.id
                                    }
                                }, { transaction: t });
                return pg;
            });
        }else if(url == 'chapter'){
            result = await sequelize.transaction(async (t) => {
                const pg = await models.chapter.update({
                                    NAME: req.body.name,
                                    ID_CHP_GRP: req.body.idchgr
                                }, {
                                    where: {
                                        ID: req.body.id
                                    }
                                }, { transaction: t });
               return pg;
            });
       }else if(url == 'act_grp'){
            result = await sequelize.transaction(async (t) => {
                const pg = await models.activity_group.update({
                                    NAME: req.body.name,
                                    PREFIX: req.body.pref,
                                    ID_CHP_GRP: req.body.idchgr
                                }, {
                                    where: {
                                        ID: req.body.id
                                    }
                                }, { transaction: t });
                return pg;
            });
        }else if(url == 'activity'){
            result = await sequelize.transaction(async (t) => {
                const pg = await models.activity.update({
                                    NAME: req.body.name,
                                    ID_ACT_GRP: req.body.idacgr
                                }, {
                                    where: {
                                        ID: req.body.id
                                    }
                                }, { transaction: t });
                return pg;
            });
        }else{
            throw {name : "BadError", message : "URL not found"};
        }
		console.log("pg updated: "+ result.ID + " name: " + result.NAME);
		res.status(200).json(result);
	}catch(err){
        if(err.name == "BadError"){
            res.status(404).json({message:err.message});
        }else{
            res.status(500).json({message:"internal server error"});
        }
	}
});

//export module
module.exports = router;