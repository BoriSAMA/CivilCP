const express = require('express');
const router = express.Router();
var sequelize = require('../connection');
const { Op } = require("sequelize");

var initModels = require("../model/init-models");
var models = initModels(sequelize);


//submit a group p to the budget
router.post('/cg', async(req, res) => {
	try{
        var { numb, idq, idcg } = req.body;

        if (!numb || idq == 0 || idcg == 0) {
            throw {name : "regError", message : "Datos del grupo de procesos incompletos"};
        }

        await sequelize.transaction(async (t) => {
            const item = await models.quote_chp_grp.create({
                            QUOTE_NUMBER: numb,
                            CUSTOM_NAME: 'NA',
                            ID_QUOTE: idq,
                            ID_CHP_GRP: idcg
                        }, { transaction: t });
            return item;
        });
        
		res.status(200).json({name: "Exito", message: "Se ha registrado el grupo de procesos en el presupuesto"});
    }catch(err){
        if(err.name == "regError"){
            res.status(400).json({name: "Error", message: err.message});
		}else {
            res.status(500).json({name: "Error " + err.name, message: "internal server error" + err.message});
		}
	}
});

//submit a group to the budget
router.post('/ch', async(req, res) => {
	try{
        var { numb, name, idcg } = req.body;

        if (!numb || !name || idcg == 0) {
            throw {name : "regError", message : "Datos del capitulo incompletos"};
        }

        await sequelize.transaction(async (t) => {
            const item = await models.quote_chapter.create({
                            QUOTE_NUMBER: numb,
                            CUSTOM_NAME: name,
                            ID_QUO_CHP_GRP: idcg
                        }, { transaction: t });
            return item;
        });
        
		res.status(200).json({name: "Exito", message: "Se ha registrado el capitulo en el presupuesto"});
    }catch(err){
        if(err.name == "regError"){
            res.status(400).json({name: "Error", message: err.message});
		}else {
            res.status(500).json({name: "Error " + err.name, message: "internal server error" + err.message});
		}
	}
});

//submit an activity to the budget
router.post('/ac', async(req, res) => {
	try{
        var { numb, name, mesu, idch, idac, idqu } = req.body;

        if (!numb || !name || !mesu || idch == 0 || idac == 0) {
            throw {name : "regError", message : "Datos de la actividad incompletos"};
        }

        const result = await sequelize.transaction(async (t) => {
            const item = await models.quote_activity.create({
                            QUOTE_NUMBER: numb,
                            CUSTOM_NAME: name,
                            ID_QUO_CHP: idch,
                            ID_ACT_GRP: idac,
                            MEASSURE_UNIT: mesu,
                            QUANTITY: 0,
                            TOTAL: 0
                        }, { transaction: t });
            return item;
        });

        await sequelize.transaction(async (t) => {
            const item = await models.apu.create({
                            TOTAL: 0,
                            ID_QUO_ACT: result.dataValues.ID
                        }, { transaction: t });
            return item;
        });

        await sequelize.transaction(async (t) => {
            const uwu = await models.schedule.findOne({
                                where:{
                                    ID_QUOTE: idqu
                                }
                            }, { transaction: t });

            var today = new Date();   
            var tomorrow =  new Date();
            tomorrow.setDate(tomorrow.getDate()+1)
            console.log(today);
            console.log(tomorrow);
            const item = await models.schedule_activity.create({
                            ID_QOU_ACT: result.ID,
                            ID_SCHEDULE: uwu.ID,
                            DURATION: 1,
                            START_DATE: today,
                            FINISH_DATE: tomorrow,
                        }, { transaction: t });
            return item;
        });
        
		res.status(200).json({name: "Exito", message: "Se ha registrado la actividad en el presupuesto"});
    }catch(err){
        if(err.name == "regError"){
            res.status(400).json({name: "Error", message: err.message});
		}else {
            res.status(500).json({name: "Error " + err.name, message: "internal server error" + err.message});
		}
	}
});

//get all groups on an budget
router.get('/', async(req, res) => {
	try{
        var qu, cg = [], id = req.query.bid;

        const quote = await sequelize.transaction(async (t) => {
			const item = await models.quotation.findAll({
                                                    where: {
                                                        [Op.and]: [
                                                            { ID: id },
                                                            { ID_USER: req.session.user.ID }
                                                        ]
                                                    }
                                                },{ transaction: t });
			return item;
        });

        qu = quote[0].dataValues;

		const result = await sequelize.transaction(async (t) => {
            const item = await models.quote_chp_grp.findAll({
                                        where: {   
                                            ID_QUOTE: id
                                        },
                                        include: [{   
                                            model: models.chapter_group
                                        }],
                                        order:[
                                            ['QUOTE_NUMBER', 'ASC']
                                        ]
                                    },{ transaction: t });
			return item;
        });

        for (let i = 0; i < result.length; i++) {
            cg[i] = result[i].dataValues;
            cg[i].chapter_group = cg[i].chapter_group.dataValues;
            let ch = await sequelize.transaction(async (t) => {
                const item = await models.quote_chapter.findAll({
                                            where:{
                                                ID_QUO_CHP_GRP: cg[i].ID
                                            },
                                            order:[
                                                ['QUOTE_NUMBER', 'ASC']
                                            ]
                                    },{ transaction: t });
                return item;
            });

            for (let i = 0; i < ch.length; i++) {
                ch[i] = ch[i].dataValues;
                let ac = await sequelize.transaction(async (t) => {
                    const item = await models.quote_activity.findAll({
                                            where:{
                                                ID_QUO_CHP: ch[i].ID
                                            },include: [{   
                                                model: models.activity_group
                                            }],
                                            order:[
                                                ['QUOTE_NUMBER', 'ASC']
                                            ]
                                    },{ transaction: t });
                    return item;
                });

                for (let i = 0; i < ac.length; i++) {
                    ac[i] = ac[i].dataValues;

                    let apu = await sequelize.transaction(async (t) => {
                        const item = await models.apu.findAll({
                                                where:{
                                                    ID_QUO_ACT: ac[i].ID
                                                }
                                        },{ transaction: t });
                        return item;
                    });
                    if ( apu.length > 0 ) {
                        ac[i].apu =  apu[0].dataValues;
                    }
                }
                ch[i].ac = ac;
            }
            cg[i].ch = ch;
        }

		res.status(200).render('index',{
            selected: 'budget-one',
            user: req.session.user,
            quote: qu,
            cg: cg
        });
	}catch(err){
		res.status(500).render('index',{
            selected: 'budget-one',
            user: req.session.user,
            error: "Internal server error " + err.name + " " + err.message
        });
	}
});

//get one chapter
router.get('/ch/:id', async(req, res) => {
	try{
		const result = await sequelize.transaction(async (t) => {
			const item = await models.quote_chapter.findAll({
                                                    where: { 
                                                        ID: req.params.id
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
router.get('/ac/:id', async(req, res) => {
	try{
		const result = await sequelize.transaction(async (t) => {
			const item = await models.quote_activity.findAll({
                                                    where: { 
                                                        ID: req.params.id
                                                    },include: [{
                                                        model: models.activity_group
                                                    }]
                                                },{ transaction: t });
			return item;
        });

        res.status(200).json(result);
	}catch(err){
        res.status(500).json({name: "Error " + err.name, message:"internal server error" + err.message});
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

//Delete chapter group
router.delete('/cg/:id', async(req, res) => {
	try{
		const result = await sequelize.transaction(async (t) => {
            const item = await models.quote_chp_grp.destroy({
                            where: { 
                                ID: req.params.id
                            }
                        }, { transaction: t });
            return item;
        });

		if(result == ""){
			throw {name : "MatchError", message : "No se encontro el grupo de procesos"}; 
        }
		res.status(200).json({name: "Exito", message: "Se ha eliminado el grupo de procesos"});
	}catch(err){
        if(err.name == "MatchError"){
            res.status(400).json({name: "Error", message: err.message});
        } else {
            res.status(500).json({name: "Error " + err.name, message:"internal server error" + err.message});
        }
	}
});

//Delete chapter
router.delete('/ch/:id', async(req, res) => {
	try{
		const result = await sequelize.transaction(async (t) => {
            const item = await models.quote_chapter.destroy({
                            where: { 
                                ID: req.params.id
                            }
                        }, { transaction: t });
            return item;
        });

		if(result == ""){
			throw {name : "MatchError", message : "No se encontro el capitulo"}; 
        }
		res.status(200).json({name: "Exito", message: "Se ha eliminado el capitulo"});
	}catch(err){
        if(err.name == "MatchError"){
            res.status(400).json({name: "Error", message: err.message});
        } else {
            res.status(500).json({name: "Error " + err.name, message:"internal server error" + err.message});
        }
	}
});

//Delete activity
router.delete('/ac/:id', async(req, res) => {
	try{
		const result = await sequelize.transaction(async (t) => {
            const item = await models.quote_activity.destroy({
                            where: { 
                                ID: req.params.id
                            }
                        }, { transaction: t });
            return item;
        });

		if(result == ""){
			throw {name : "MatchError", message : "Ocurrio un error al eliminar la actividad"}; 
        }

		res.status(200).json({name: "Exito", message: "Se ha eliminado la actividad"});
	}catch(err){
        if(err.name == "MatchError"){
            res.status(400).json({name: "Error", message: err.message});
        } else {
            res.status(500).json({name: "Error " + err.name, message:"internal server error" + err.message});
        }
	}
});

//update chapter
router.patch('/ch/:id', async(req, res) => {
	try{
        var { numb, name} = req.body;

        if (!numb || !name) {
            throw {name : "regError", message : "Datos del capitulo incompletos"};
        }

		const result = await sequelize.transaction(async (t) => {
            const item = await models.quote_chapter.update({
                                QUOTE_NUMBER: numb,
                                CUSTOM_NAME: name
                            },{    
                                where: { 
                                    ID: req.params.id
                                },
                            }, { transaction: t });
            return item;
        });

		if(result == ""){
			throw {name : "MatchError", message : "No se encontro el capitulo"}; 
        }
		res.status(200).json({name: "Exito", message: "Se ha actualizado el capitulo"});
	}catch(err){
        if(err.name == "MatchError"){
            res.status(400).json({name: "Error", message: err.message});
        } else {
            res.status(500).json({name: "Error " + err.name, message:"internal server error" + err.message});
        }
	}
});

//update an activity
router.patch('/ac/:id', async(req, res) => {
	try{
        var { numb, name, mesu, idac, quan} = req.body;

        if (!numb || !name || !mesu || idac == 0) {
            throw {name : "regError", message : "Datos de la actividad incompletos"};
        }

        const apu = await sequelize.transaction(async (t) => {
            const item = await models.apu.findAll({
                                where:{
                                    ID_QUO_ACT: req.params.id
                                }
                        }, { transaction: t });
            return item;
        });

		const result = await sequelize.transaction(async (t) => {
            const item = await models.quote_activity.update({
                                QUOTE_NUMBER: numb,
                                CUSTOM_NAME: name,
                                ID_ACT_GRP: idac,
                                MEASSURE_UNIT: mesu,
                                QUANTITY: quan,
                                TOTAL: quan * apu[0].dataValues.TOTAL
                            },{
                                where: { 
                                    ID: req.params.id
                                }
                            }, { transaction: t });
            return item;
        });

		if(result == ""){
			throw {name : "MatchError", message : "Ocurrio un error al actualizar la actividad"}; 
        }

		res.status(200).json({name: "Exito", message: "Se ha actualizado la actividad"});
	}catch(err){
        if(err.name == "MatchError"){
            res.status(400).json({name: "Error", message: err.message});
        } else {
            res.status(500).json({name: "Error " + err.name, message:"internal server error" + err.message});
        }
	}
});

//export module
module.exports = router;