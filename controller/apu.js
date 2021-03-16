const express = require('express');
const router = express.Router();
var sequelize = require('../connection');
const { Op } = require("sequelize");

var initModels = require("../model/init-models");
var models = initModels(sequelize);

//submit a group p to the budget
router.post('/content', async(req, res) => {
	try{
        var { ida, idc } = req.body;
        console.log(req.body);
        console.log(idc);
        await sequelize.transaction(async (t) => {
            const item = await models.apu_content.create({
                            ID_CONTENT: idc,
                            ID_APU: ida,
                            TOTAL: 0
                        }, { transaction: t });
            return item;
        });
        
		res.status(200).json({name: "Exito", message: "Se ha registrado la secion en el A.P.U."});
    }catch(err){
        res.status(500).json({name: "Error " + err.name, message: "internal server error" + err.message});
	}
});

//submit a group p to the budget
router.post('/item', async(req, res) => {
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

//get all apu contents
router.get('/', async(req, res) => {
	try{
        console.log(req.query);
        var ac, apu = [], id = req.query.aid;
        
        const result1 = await sequelize.transaction(async (t) => {
			const item = await models.quote_activity.findAll({
                                                    where: { 
                                                        ID: id 
                                                    }
                                                },{ transaction: t });
			return item;
        });
        if (result1.length == 0) {
            throw {name : "Not found", message : "No se ha encontrado el apu"};
        }
        ac = result1[0].dataValues;

		const result = await sequelize.transaction(async (t) => {
			const item = await models.apu.findAll({
                                    where: {
                                        ID_QUO_ACT: id
                                    }
                                },{ transaction: t });
			return item;
        });

        apu = result[0].dataValues;

        let apu_c = await sequelize.transaction(async (t) => {
            const item = await models.apu_content.findAll({
                                        where:{
                                            ID_APU: apu.ID
                                        },
                                        order:[
                                            ['ID_CONTENT', 'ASC']
                                        ]
                                },{ transaction: t });
            return item;
        });
        
        for (let i = 0; i < apu_c.length; i++) {
            apu_c[i] = apu_c[i].dataValues;

            let apu_i = await sequelize.transaction(async (t) => {
                const item = await models.apu_item.findAll({
                                            where:{
                                                ID_APU_CONTENT: apu_c[i].ID
                                            },
                                            order:[
                                                ['ID', 'ASC']
                                            ]
                                    },{ transaction: t });
                return item;
            });

            for (let i = 0; i < apu_i.length; i++) {
                apu_i[i] = apu_i[i].dataValues;
            }
            apu_c[i].apu_i = apu_i
        }
        apu.apu_c = apu_c;

		res.status(200).render('index',{
            selected: 'apu',
            user: req.session.user,
            activity: ac,
            budget: req.query.bid,
            apu: apu,
        });
	}catch(err){
		res.status(500).render('index',{
            selected: 'apu',
            user: req.session.user,
            error: "Internal server error " + err.name + " " + err.message
        });
	}
});

//get all contents id
router.get('/:id', async(req, res) => {
	try{
        var id = req.params.id;

        let content = await sequelize.transaction(async (t) => {
            const item = await models.apu_content.findAll({
                                        where:{
                                            ID_APU: id
                                        },
                                        order:[
                                            ['ID_CONTENT', 'ASC']
                                        ]
                                },{ transaction: t });
            return item;
        });
        
        for (let i = 0; i < content.length; i++) {
            content[i] = content[i].dataValues;
        }
        
        res.status(200).json(content);
	}catch(err){
        res.status(500).json({name: "Error " + err.name, message:"internal server error" + err.message});
	}
});

//Update
router.patch('/:id', async(req, res) => {
    try{
        var { total } = req.body;
        
		const result = await sequelize.transaction(async (t) => {
            const sal = await models.apu.update({ 
                                TOTAL: total
                            },{
                                where: {
                                    ID: req.params.id
                                }
                            },{ transaction: t });
            return sal;
        });

		if(result == ""){
			throw {name : "MatchError", message : "No se ha actualizado el apu"}; 
        }
		res.status(200).json({name: "Exito", message: "Se ha actualizado el apu"});
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