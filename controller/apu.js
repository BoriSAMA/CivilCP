const express = require('express');
const router = express.Router();
var sequelize = require('../connection');
const { Op, QueryTypes  } = require("sequelize");

var initModels = require("../model/init-models");
var models = initModels(sequelize);

//submit a content to an apu
router.post('/content', async(req, res) => {
	try{
        var { ida, idc } = req.body;
        await sequelize.transaction(async (t) => {
            const item = await models.apu_content.create({
                            ID_CONTENT: idc,
                            ID_APU: ida,
                            TOTAL: 0
                        }, { transaction: t });
            return item;
        });
        
		res.status(200).json({name: "Exito", message: "Se ha registrado la secCion en el A.P.U."});
    }catch(err){
        res.status(500).json({name: "Error " + err.name, message: "internal server error" + err.message});
	}
});

//submit an item to an apu
router.post('/item', async(req, res) => {
	try{
        var { quan, total, iditem, idapuc} = req.body;

        if (!quan || iditem == 0 || idapuc == 0) {
            throw {name : "regError", message : "Datos del item incompletos"};
        }

        await sequelize.transaction(async (t) => {
            const item = await models.apu_item.create({
                            TOTAL: total,
                            CUSTOM_PERFORMANCE: 0,
                            CUSTOM_DESCRIPTION: '',
                            QUANTITY: quan,
                            ID_ITEM: iditem,
                            ID_APU_CONTENT: idapuc
                        }, { transaction: t });
            
            return item;
        });

		res.status(200).json({name: "Exito", message: "Se ha registrado el item"});
    }catch(err){
        if(err.name == "regError"){
            res.status(400).json({name: "Error", message: err.message});
		}else {
            res.status(500).json({name: "Error " + err.name, message: "internal server error" + err.message});
		}
	}
});

//submit an item to an apu
router.post('/gang', async(req, res) => {
	try{
        var { c_perf, c_desc, quan, idapuc, iditem, content } = req.body;
        var total = 0;
        if (!quan || iditem == 0 || idapuc == 0) {
            throw {name : "regError", message : "Datos del item incompletos"};
        }
        
        let item = await sequelize.transaction(async (t) => {
            const item = await models.item_list.findAll({
                                        where:{
                                            ID: iditem
                                        }
                                },{ transaction: t });
            return item;
        });

        if (item.length == 0) {
            throw {name : "regError", message : "Datos del item incompletos"};
        }
        item = item[0].dataValues;

        if (content == 1 || content == 4) {
            total = item.COST * quan;
        }
        /*
        if (content == 2) {
            let desc = item.DESCRIPTION
            if( c_desc !== ''){
                desc = c_desc;
            }
            await sequelize.transaction(async (t) => {
                const aux = await models.gang.create({
                                DESCRIPTION: desc,
                                ID_APU_ITEM: c_perf
                            }, { transaction: t });
                return aux;
            });
        }
        */

        let apu_i = await sequelize.transaction(async (t) => {
            const item = await models.apu_item.create({
                            TOTAL: total,
                            CUSTOM_PERFORMANCE: c_perf,
                            CUSTOM_DESCRIPTION: c_desc,
                            QUANTITY: quan,
                            ID_ITEM: iditem,
                            ID_APU_CONTENT: idapuc
                        }, { transaction: t });
            
            return item;
        });

        console.log(apu_i);

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
        var ac, items = [], apu = [], id = req.query.aid;
        
        const result1 = await sequelize.transaction(async (t) => {
			const item = await models.quote_activity.findAll({
                                                    where: { 
                                                        ID: id 
                                                    },include:{
                                                        model: models.activity_group
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
                                            },include: [{
                                                model: models.item_list
                                            }]
                                    },{ transaction: t });
                return item;
            });

            for (let i = 0; i < apu_i.length; i++) {
                apu_i[i] = apu_i[i].dataValues;
                apu_i[i].item_list = apu_i[i].item_list.dataValues;
            }

            apu_c[i].apu_i = apu_i
        }
        apu.apu_c = apu_c;

        for (let i = 0; i < 4; i++) {
            items[i] = await sequelize.transaction(async (t) => {
                const item = await models.item_list.findAll({
                                                    where: {
                                                        [Op.and]:[
                                                            { ID_CONTENT: i+1 },
                                                            { ID_ACT_GRP: ac.ID_ACT_GRP },
                                                            { [Op.or]:[
                                                                { ID_USER: req.session.user.ID },
                                                                { '$user.SUPERUSER$' : 1 }
                                                            ]}
                                                        ]
                                                    },include:{   
                                                        model: models.user,
                                                        attributes: ['ID', 'SUPERUSER']
                                                    }
                                                },{ transaction: t });
                return item;
            });
        }
        
        for (let j = 0; j < items.length; j++) {
            for (let i = 0; i < items[j].length; i++) {
                items[j][i] = items[j][i].dataValues;
                items[j][i].user = items[j][i].user.dataValues;
            }            
        }

        var response = {mt: items[0], ga: items[1], mc: items[2], tr: items[3]};

		res.status(200).render('index',{
            selected: 'apu',
            user: req.session.user,
            activity: ac,
            budget: req.query.bid,
            apu: apu,
            items: response
        });
	}catch(err){
		res.status(500).render('index',{
            selected: 'apu',
            user: req.session.user,
            error: "Internal server error " + err.name + " " + err.message
        });
	}
});

//Delete a section
router.delete('/content/:id', async(req, res) => {
	try{
		const result = await sequelize.transaction(async (t) => {
            const item = await models.apu_content.destroy({
                            where: { 
                                ID: req.params.id
                            }
                        }, { transaction: t });
            return item;
        });

		if(result == ""){
			throw {name : "MatchError", message : "Ocurrio un error al eliminar la seccion"}; 
        }

		res.status(200).json({name: "Exito", message: "Se ha eliminado la seccion"});
	}catch(err){
        if(err.name == "MatchError"){
            res.status(400).json({name: "Error", message: err.message});
        } else {
            res.status(500).json({name: "Error " + err.name, message:"internal server error" + err.message});
        }
	}
});

//recalculate the whole value on the budget
router.patch('/calculate/', async(req, res) => {
	try{
        console.log(req.body);
        var bid = req.body.bid;
        var aid = req.body.aid;
        var apid = req.body.apid;
        var acid = req.body.acid;
        var total = [0, 0, 0, 0];

        await sequelize.transaction(async (t) => {
            if (acid != 0) {
                //sumar todos los items del apu al contenido
                total[0] = await models.apu_item.sum('TOTAL', { where: { ID_APU_CONTENT: acid } });
                console.log(total[0]);

                await models.apu_content.update({ 
                                        TOTAL: total[0]
                                    },{
                                        where: {
                                            ID: acid
                                        }
                                    },{ transaction: t });
 
            }

            //sumar todos los contenidos del apu al apu
            total[1] = await models.apu_content.sum('TOTAL', { where: { ID_APU: apid } });

            await models.apu.update({ 
                                    TOTAL: total[1]
                                },{
                                    where: {
                                        ID: apid
                                    }
                                },{ transaction: t });

            //multiplica el valor del apu por la cantidad fijada en la actividad
            await models.quote_activity.findOne({ where: { ID: aid } })
                    .then(qua => {
                        total[2] = qua.dataValues.QUANTITY * total[1];
                    });

            await models.quote_activity.update({ 
                                    TOTAL: total[2]
                                },{
                                    where: {
                                        ID: aid
                                    }
                                },{ transaction: t });

            //sumar todos las actividades al presupeusto
            let total3 = await sequelize.query("SELECT sum(`TOTAL`) AS `sum` FROM `quote_activity` AS `quote_activity` LEFT OUTER JOIN ( `quote_chapter` AS `quote_chapter` INNER JOIN `quote_chp_grp` AS `quote_chapter->quote_chp_grp` ON `quote_chapter`.`ID_QUO_CHP_GRP` = `quote_chapter->quote_chp_grp`.`ID` AND `quote_chapter->quote_chp_grp`.`ID_QUOTE` = '4' ) ON `quote_activity`.`ID_QUO_CHP` = `quote_chapter`.`ID` GROUP BY `quote_chapter->quote_chp_grp`.`ID_QUOTE`", { type: QueryTypes.SELECT });

            /* total[3] = await models.quote_activity.sum('TOTAL', 
            //                             {group:['quote_chapter.ID', 'quote_chapter.quote_chp_grp.ID', 'quote_chapter.quote_chp_grp.ID_QUOTE' ],
            //                                 include:{
            //                                     model: models.quote_chapter,
            //                                     attributes: [ 'ID' ],
            //                                     include:{
            //                                         model: models.quote_chp_grp,
            //                                         attributes: [ 'ID' ],
            //                                         where:{
            //                                             ID_QUOTE: bid
            //                                         }
            //                                     }
            //                                 }
            //                             },{ transaction: t });
            */
            total[3] = total3[0].sum;

            const aux = await models.quotation.update({ 
                                    TOTAL_DIRECT: total[3]
                                },{
                                    where: {
                                        ID: bid
                                    }
                                },{ transaction: t });
            
            return aux;
        });

        if(result == ""){
			throw {name : "MatchError", message : "No se han actualizado los totales"}; 
        }
		res.status(200).json({name: "Exito", message: "Se han actualizado los totales"});
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