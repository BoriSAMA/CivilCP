const express = require('express');
const router = express.Router();
var sequelize = require('../connection');
const { Op } = require("sequelize");

var initModels = require("../model/init-models");
var models = initModels(sequelize);


//get all gang workers
router.get('/', async (req, res) => {
    try {
        const id = req.query.bid;
        let aux = [];

        await sequelize.transaction(async (t) => {
            let activities = await models.quote_activity.findAll({
                where:{
                    '$quote_chapter.quote_chp_grp.quotation.ID$': { [Op.eq]: id },
                },
                include: [{
                    model: models.quote_chapter,
                    attributes: [],
                    include: {
                        model: models.quote_chp_grp,
                        attributes: [],
                        include: {
                            model: models.quotation,
                            attributes: ['ID']
                        }
                    }
                }],
                order: [
                    ['QUOTE_NUMBER', 'ASC']
                ]
            }, { transaction: t });

            for (let j = 0; j < activities.length; j++) {
                aux[j] = {}
                aux[j].activity = activities[j].toJSON();

                let fechas = await models.schedule_activity.findOne({ where: { ID_QOU_ACT: aux[j].activity.ID}} ,{ transaction: t })

                let items = await models.apu_item.findAll({
                    where:{
                        '$apu_content.ID_CONTENT$': { [Op.eq]: 2 },
                        '$apu_content.apu.ID_QUO_ACT$': { [Op.eq]: aux[j].activity.ID },
                    },
                    include: [{
                        model: models.apu_content,
                        attributes: [],
                        include: {
                            model: models.apu,
                            attributes: []
                        }
                    },{
                        model: models.item_list
                    }]
                }, { transaction: t });

                aux[j].activity.schedule = fechas.toJSON();
                aux[j].activity.items = [];
                for (let i = 0; i < items.length; i++) {
                    aux[j].activity.items[i] = items[i].toJSON();

                    let gangs = await models.gang_worker.findAll({
                        where: {
                            ID_GANG: aux[j].activity.items[i].ID
                        },include:{
                            model: models.worker
                        }
                    }, { transaction: t });

                    aux[j].activity.items[i].gangs = [];
                    for (let k = 0; k < gangs.length; k++) {
                        aux[j].activity.items[i].gangs[k] = gangs[k].toJSON();
                    }
                }
            }
        });

        res.status(200).render('index', {
            selected: 'gang',
            user: req.session.user,
            list: aux,
            quote: id
        });
    } catch (err) {
        res.status(500).render('index', {
            selected: 'gang',
            user: req.session.user,
            error: "Internal server error " + err.name + " " + err.message
        });
    }
});

//get one gang workers
router.get('/:id', async (req, res) => {
    try {
        const result = await sequelize.transaction(async (t) => {
            const item = await models.gang_worker.findAll({
                where: {
                    ID: req.params.id
                },include:{
                    model: models.worker
                }
            }, { transaction: t });
            return item;
        });

        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ name: "Error " + err.name, message: "internal server error" + err.message });
    }
});

//get all gang workers
router.get('/json/:bid', async (req, res) => {
    try {
        const id = req.params.bid;
        let aux = [];

        await sequelize.transaction(async (t) => {
            let activities = await models.quote_activity.findAll({
                where:{
                    '$quote_chapter.quote_chp_grp.quotation.ID$': { [Op.eq]: id },
                },
                include: [{
                    model: models.quote_chapter,
                    attributes: [],
                    include: {
                        model: models.quote_chp_grp,
                        attributes: [],
                        include: {
                            model: models.quotation,
                            attributes: ['ID']
                        }
                    }
                }],
                order: [
                    ['QUOTE_NUMBER', 'ASC']
                ]
            }, { transaction: t });

            for (let j = 0; j < activities.length; j++) {
                aux[j] = {}
                aux[j].activity = activities[j].toJSON();

                let fechas = await models.schedule_activity.findOne({ where: { ID_QOU_ACT: aux[j].activity.ID}} ,{ transaction: t })

                let items = await models.apu_item.findAll({
                    where:{
                        '$apu_content.ID_CONTENT$': { [Op.eq]: 2 },
                        '$apu_content.apu.ID_QUO_ACT$': { [Op.eq]: aux[j].activity.ID },
                    },
                    include: [{
                        model: models.apu_content,
                        attributes: [],
                        include: {
                            model: models.apu,
                            attributes: []
                        }
                    },{
                        model: models.item_list
                    }]
                }, { transaction: t });

                aux[j].activity.schedule = fechas.toJSON();
                aux[j].activity.items = [];
                for (let i = 0; i < items.length; i++) {
                    aux[j].activity.items[i] = items[i].toJSON();

                    let gangs = await models.gang_worker.findAll({
                        where: {
                            ID_GANG: aux[j].activity.items[i].ID
                        },include:{
                            model: models.worker
                        }
                    }, { transaction: t });

                    aux[j].activity.items[i].gangs = [];
                    for (let k = 0; k < gangs.length; k++) {
                        aux[j].activity.items[i].gangs[k] = gangs[k].toJSON();
                    }
                }
            }
        });

        res.status(200).json(aux);
    } catch (err) {
        res.status(500).json({ name: "Error " + err.name, message: "internal server error" + err.message });
    }
});

router.patch('/:id', async(req, res) => {
	try{
		var { idw, idq, fstart, ffin} = req.body;

        let fechas = await sequelize.transaction(async (t) => {
            const item = await models.availavibility.findAll({
                where: {
                    ID_WORKER: idw,
                    ID_SCHEDULE: idq
                }
            }, { transaction: t });
            return item;
        });

        for (let i = 0; i < fechas.length; i++) {
            fechas[i] = fechas[i].toJSON();
            //(StartA <= EndB) and (EndA >= StartB)
            if ((fstart <= fechas[i].FINISH_DATE) && (ffin >= fechas[i].START_DATE) ) {
                throw { name: "regError", message: "El trabajador se encuentra ocupado en este rango de fechas, por favor seleccione otro" };
            }
        }

        await sequelize.transaction(async (t) => {
            await models.availavibility.destroy({ 
                where: {
                    ID_GANG_WORKER: req.params.id
                }
            },{ transaction: t });
        });

        await sequelize.transaction(async (t) => {
            await models.availavibility.create({ 
                START_DATE: fstart,
                FINISH_DATE: ffin,
                ID_SCHEDULE: idq,
                ID_WORKER: idw,
                ID_GANG_WORKER: req.params.id
            },{ transaction: t });
        });

        await sequelize.transaction(async (t) => {
            await models.gang_worker.update({ 
                ID_WORKER: idw,
            },{
                where: {
                    ID: req.params.id
                }
            }, { transaction: t });
            console.log('c');
        }); 
       
        res.status(200).json({name: "Exito", message: "Se ha registrado el trabajador correctamente"});
	}catch(err){
        if(err.name == "regError"){
            res.status(400).json({name: "Error", message: err.message});
		}else{
            res.status(500).json({name: "Error", message: "internal server error " + err.message});
		}
	}
});

//Delete
router.delete('/:id', async(req, res) => {
	try{

		const result = await sequelize.transaction(async (t) => {
            const item = await models.gang_worker.update({ 
                ID_WORKER: null,
            },{
                where: {
                    ID: req.params.id
                }
            }, { transaction: t });

            await models.availavibility.destroy({
                where: {
                    ID_GANG_WORKER: req.params.id
                }
            }, { transaction: t });
            return item;
        });

		if(result == 0){
			throw {name : "MatchError", message : "No se encontro el trabajador"}; 
        }
		res.status(200).json({name: "Exito", message: "Se ha eliminado el trabajador de la actividad corectamente"});
	}catch(err){
        if(err.name == "MatchError"){
            res.status(400).json({name: "Error", message: err.message});
        }else{
            res.status(500).json({name: "Error", message: "internal server error"});
        }
	}
});
// router.delete();

//export module
module.exports = router;