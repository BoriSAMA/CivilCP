const express = require('express');
const router = express.Router();
var sequelize = require('../connection');

var initModels = require("../model/init-models");
var models = initModels(sequelize);

//submit a chapter group
router.post('/chp_grp/', async(req, res) => {
	try{
        console.log(req.body);
        var {name, pref, idchgr, idacgr} = req.body;

        if (!name || !pref) {
			throw {name : "regError", message : "Datos incompletos"};
		}

        await sequelize.transaction(async (t) => {
            const pg = await models.chapter_group.create({
                            NAME: name,
                            PREFIX: pref
                        }, { transaction: t });
            return pg;
        });
        
        res.status(200).json({name: "Exito", message: "Se ha registrado el grupo de procesos"});
	}catch(err){
        if(err.name == "regError"){
            res.status(400).json({name: "Error", message: err.message});
		}else {
            res.status(500).json({name: "Error", message: "internal server error"});
		}
	}
});

//submit an activity group
router.post('/act_grp/', async(req, res) => {
	try{
        var {name, pref, idchgr, idacgr} = req.body;

        if (!name || !pref || !idchgr) {
			throw {name : "regError", message : "Datos incompletos"};
		}

        await sequelize.transaction(async (t) => {
            const pg = await models.activity_group.create({
                            NAME: name,
                            PREFIX: pref,
                            ID_CHP_GRP: idchgr
                        }, { transaction: t });

            return pg;
        });
        
        res.status(200).json({name: "Exito", message: "Se ha registrado el grupo de actividades"});
	}catch(err){
        if(err.name == "regError"){
            res.status(400).json({name: "Error", message: err.message});
		}else {
            res.status(500).json({name: "Error", message: "internal server error"});
		}
	}
});

//submit an activity
router.post('/activity/', async(req, res) => {
	try{
        var {name, pref, idchgr, idacgr} = req.body;

        if (!name || !idacgr) {
			throw {name : "regError", message : "Datos incompletos"};
		}

        await sequelize.transaction(async (t) => {
            const pg = await models.activity.create({
                            NAME: name,
                            ID_ACT_GRP: idacgr
                        }, { transaction: t });

            return pg;
        });
        
        res.status(200).json({name: "Exito", message: "Se ha registrado la actividad"});
	}catch(err){
        if(err.name == "regError"){
            res.status(400).json({name: "Error", message: err.message});
		}else {
            res.status(500).json({name: "Error", message: "internal server error"});
		}
	}
});


//submit a chapter
router.post('/chapter/', async(req, res) => {
	try{
        var {name, pref, idchgr, idacgr} = req.body;

        if (!name || !idchgr) {
			throw {name : "regError", message : "Datos incompletos"};
		}

        await sequelize.transaction(async (t) => {
            const pg = await models.chapter.create({
                           NAME: name,
                           ID_CHP_GRP: idchgr
                       }, { transaction: t });
           return pg;
        });

        res.status(200).json({name: "Exito", message: "Se ha registrado el capitulo"});
	}catch(err){
        if(err.name == "regError"){
            res.status(400).json({name: "Error", message: err.message});
		}else {
            res.status(500).json({name: "Error", message: "internal server error"});
		}
	}
});


//get all
router.get('/all', async(req, res) => {
    var array = [];
	try{
		const cg = await sequelize.transaction(async (t) => {
			const pg = await models.chapter_group.findAll({
                                            order:[
                                                ['ID', 'DESC']
                                            ]}, { transaction: t });
			return pg;
        });
        const ch = await sequelize.transaction(async (t) => {
			const pg = await models.chapter.findAll({
                                            order:[
                                                ['ID_CHP_GRP', 'DESC']
                                            ]}, { transaction: t });
			return pg;
        });
        const ag = await sequelize.transaction(async (t) => {
			const pg = await models.activity_group.findAll({
                                            order:[
                                                ['ID_CHP_GRP', 'DESC']
                                            ]}, { transaction: t });
			return pg;
        });
        const ac = await sequelize.transaction(async (t) => {
            const pg = await models.activity.findAll({
                                            order:[
                                                ['ID_ACT_GRP', 'DESC']
                                            ]}, { transaction: t });
			return pg;
        });
        
        //var result = [cg, ch, ag, ac];
        console.log(cg)
		res.status(200).render('index',{
            selected: 'char'
        });
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