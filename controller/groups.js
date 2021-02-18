const express = require('express');
const router = express.Router();
var sequelize = require('../connection');

var initModels = require("../model/init-models");
var models = initModels(sequelize);

/**
 * Submit methods
 */
//------------------------------------------------------------------------------------------------
//submit a chapter group
router.post('/chp_grp/', async(req, res) => {
	try{
        var {name, pref, idchgr} = req.body;

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
        var {name, pref, idchgr} = req.body;

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
//------------------------------------------------------------------------------------------------
/**
 * Get methods
 */
//------------------------------------------------------------------------------------------------
//get all
router.get('/all', async(req, res) => {
	try{
        var array = {cg: [], ag: []};
		const cg = await sequelize.transaction(async (t) => {
			const pg = await models.chapter_group.findAll({
                                            order:[
                                                ['ID', 'ASC']
                                            ]}, { transaction: t });
			return pg;
        });
        const ag = await sequelize.transaction(async (t) => {
			const pg = await models.activity_group.findAll({
                                            order:[
                                                ['ID_CHP_GRP', 'ASC']
                                            ],
                                            include: [
                                                models.chapter_group
                                            ]}, { transaction: t });
			return pg;
        });
        for (let i = 0; i < cg.length; i++) {
            array.cg[i] = cg[i].dataValues;
        }
        for (let i = 0; i < ag.length; i++) {
            array.ag[i] = ag[i].dataValues;
            array.ag[i].chapter_group = array.ag[i].chapter_group.dataValues;
        }

        res.status(200).render('index',{
            selected: 'char',
            user: req.session.user,
            groups: array
        });
	}catch(err){
        res.status(200).render('index',{
            selected: 'char',
            user: req.session.user,
            error: err,
            groups: array
        });
	}
});

//get one chapter group
router.get('/chp_grp/:id', async(req, res) => {
	try{
		const cg = await sequelize.transaction(async (t) => {
			const pg = await models.chapter_group.findAll({
                                            where: {
                                                ID: req.params.id
                                            }}, { transaction: t });
			return pg;
        });

        if(result == ""){
            throw {name : "EmptyError", message : "Grupo de procesos no encontrado"};
        }

        res.status(200).json(cg);
	}catch(err){
        if(err.name == "EmptyError"){
            res.status(400).json({name: "Error", message: err.message});
        }else{
            res.status(500).json({name: "Error", message: "internal server error"});
        }
	}
});

//get one activity group
router.get('/act_grp/:id', async(req, res) => {
	try{
        const ag = await sequelize.transaction(async (t) => {
			const pg = await models.activity_group.findAll({
                                            where: {
                                                ID: req.params.id
                                            },
                                            include: [
                                                models.chapter_group
                                            ]}, { transaction: t });
			return pg;
        });
        
        if(result == ""){
            throw {name : "EmptyError", message : "Grupo de actividades no encontrado"};
        }

        res.status(200).json(cg);
	}catch(err){
        if(err.name == "EmptyError"){
            res.status(400).json({name: "Error", message: err.message});
        }else{
            res.status(500).json({name: "Error", message: "internal server error"});
        }
	}
});

//------------------------------------------------------------------------------------------------
/**
 * Delete methods
 */
//------------------------------------------------------------------------------------------------
//Delete a chapter group
router.delete('/chp_grp/:id', async(req, res) => {
	try{
        const result = await sequelize.transaction(async (t) => {
            const pg = await models.chapter_group.destroy({
                            where: {
                                ID: req.params.id
                            }
                        }, { transaction: t });
            return pg;
        });
        
		if(result == 0){
			throw {name : "MatchError", message : "No se encontro"}; 
        }

		res.status(200).json({name: "Exito", message: "Se ha eliminado el grupo de procesos correctamente"});
	}catch(err){
        if(err.name == "MatchError"){
            res.status(400).json({name: "Error", message: err.message});
        }else if(err.name == "SequelizeForeignKeyConstraintError"){
            res.status(400).json({name: "Error", message:"No se pueden eliminar grupos de procesos referenciados por otras caracterizaciones"});
        }else {
            res.status(500).json({name: "Error", message:"internal server error"});
        }
	}
});

//Delete an activity group
router.delete('/act_grp/:id', async(req, res) => {
	try{
        const result = await sequelize.transaction(async (t) => {
            const pg = await models.activity_group.destroy({
                            where: {
                                ID: req.params.id
                            }
                        }, { transaction: t });
            return pg;
        });
        
		if(result == 0){
			throw {name : "MatchError", message : "No se encontro"}; 
        }

		res.status(200).json({name: "Exito", message: "Se ha eliminado el grupo de actividades correctamente"});
	}catch(err){
        if(err.name == "MatchError"){
            res.status(400).json({name: "Error", message: err.message});
        }else if(err.name == "SequelizeForeignKeyConstraintError"){
            res.status(400).json({name: "Error", message:"No se pueden eliminar grupos de actividades referenciados por otras caracterizaciones"});
        }else {
            res.status(500).json({name: "Error", message:"internal server error"});
        }
	}
});
//------------------------------------------------------------------------------------------------
/**
 * Update chapter
 */
//------------------------------------------------------------------------------------------------
//Update a chapter group
router.patch('/chp_grp/:id', async(req, res) => {
	try{
        var {name, pref, idchgr} = req.body;

        console.log(req.body);
        if (!name || !pref) {
			throw {name : "regError", message : "Datos incompletos"};
		}
        
        const result = await sequelize.transaction(async (t) => {
            const pg = await models.chapter_group.update({ 
                                NAME: name,
                                PREFIX: pref
                            }, {
                                where: {
                                    ID: req.params.id
                                }
                            }, { transaction: t });
            return pg;
        });
        
		if(result == 0){
			throw {name : "MatchError", message : "No se encontro"}; 
        }

		res.status(200).json({name: "Exito", message: "Se ha actualizado el grupo de procesos"});
	}catch(err){
        if(err.name == "MatchError" || err.name == "regError"){
            res.status(400).json({name: "Error", message: err.message});
        }else {
            res.status(500).json({name: "Error", message:"internal server error"});
        }
	}
});

//Update an activity group
router.patch('/act_grp/:id', async(req, res) => {
	try{
        var {name, pref, idchgr} = req.body;

        if (!name || !pref || !idchgr) {
			throw {name : "regError", message : "Datos incompletos"};
		}
        const result = await sequelize.transaction(async (t) => {
            const pg = await models.activity_group.update({
                                NAME: name,
                                PREFIX: pref,
                                ID_CHP_GRP: idchgr
                            }, {
                                where: {
                                    ID: req.params.id
                                }
                            }, { transaction: t });
            return pg;
        });
        
		if(result == 0){
			throw {name : "MatchError", message : "No se encontro"}; 
        }

		res.status(200).json({name: "Exito", message: "Se ha actualizado el grupo de actividades"});
	}catch(err){
        if(err.name == "MatchError"){
            res.status(400).json({name: "Error", message: err.message});
        }else {
            res.status(500).json({name: "Error", message:"internal server error"});
        }
	}
});

//export module
module.exports = router;