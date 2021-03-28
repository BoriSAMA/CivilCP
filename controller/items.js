const express = require('express');
const router = express.Router();
var sequelize = require('../connection');
const { Op } = require("sequelize");

var initModels = require("../model/init-models");
const user = require('../model/user');
var models = initModels(sequelize);

/**
 * Submit methods
 */
//------------------------------------------------------------------------------------------------
//submit an item
router.post('/', async(req, res) => {
	try{
        var {name, mesu, perf, desc, cost, actg, cont} = req.body;
        console.log(req.body);
        switch (cont) {
            case '1':
                if (!name || !mesu || !cost || actg == '0') {
                    throw {name : "regError", message : "Datos del material incompletos"};
                }
                break;
            case '2':
                if (!desc || !mesu || !perf || actg == '0') {
                    throw {name : "regError", message : "Datos incompletos"};
                }
                break;
            case '3':
                if (!name || !mesu || !cost || actg == '0') {
                    throw {name : "regError", message : "Datos incompletos"};
                }
                break;
            case '4':
                if (!name || !mesu || !cost || actg == '0') {
                    throw {name : "regError", message : "Datos incompletos"};
                }
                break;
            default:
                break;
        }
        await sequelize.transaction(async (t) => {
            const item = await models.item_list.create({
                            NAME: name,
                            MEASSURE_UNIT: mesu,
                            PERFORMANCE: parseInt(perf),
                            DESCRIPTION: desc,
                            COST: cost,
                            ID_ACT_GRP: actg,
                            ID_CONTENT: cont,
                            ID_USER: req.session.user.ID
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
//------------------------------------------------------------------------------------------------
/**
 * Get methods
 */
//------------------------------------------------------------------------------------------------
//get all materials for the user
router.get('/user/materials', async(req, res) => {
	try{
        var array = [];
		const result = await sequelize.transaction(async (t) => {
			const item = await models.item_list.findAll({
                                                where: {
                                                    [Op.and]: [
                                                        { ID_CONTENT: 1 },
                                                        { ID_USER: req.session.user.ID }
                                                    ]
                                                },include: [{   
                                                    model: models.activity_group,
                                                    include: {
                                                        model: models.chapter_group
                                                    }
                                                }]
                                            },{ transaction: t });
			return item;
        });

        for (let i = 0; i < result.length; i++) {
            array[i] = result[i].dataValues;
            array[i].activity_group = array[i].activity_group.dataValues;
            array[i].activity_group.chapter_group = array[i].activity_group.chapter_group.dataValues;
        }

        res.status(200).render('index',{
            selected: 'item',
            type: 'u_materials',
            user: req.session.user,
            mt: array
        });
	}catch(err){
		res.status(200).render('index',{
            selected: 'item',
            type: 'u_materials',
            user: req.session.user,
            error: "internal server error"
        });
	}
});

//get all gangs for the user
router.get('/user/gangs', async(req, res) => {
	try{
        var array = [];
		const result = await sequelize.transaction(async (t) => {
			const item = await models.item_list.findAll({
                                                where: {
                                                    [Op.and]: [
                                                        { ID_CONTENT: 2 },
                                                        { ID_USER: req.session.user.ID }
                                                    ]
                                                },include: [{   
                                                    model: models.activity_group,
                                                    include: {
                                                        model: models.chapter_group
                                                    }
                                                }]
                                            },{ transaction: t });
			return item;
        });

        for (let i = 0; i < result.length; i++) {
            array[i] = result[i].dataValues;
            array[i].activity_group = array[i].activity_group.dataValues;
            array[i].activity_group.chapter_group = array[i].activity_group.chapter_group.dataValues;
        }

        res.status(200).render('index',{
            selected: 'item',
            type: 'u_gangs',
            user: req.session.user,
            ga: array
        });
	}catch(err){
		res.status(200).render('index',{
            selected: 'item',
            type: 'u_gangs',
            user: req.session.user,
            error: "internal server error"
        });
	}
});

//get all machinery for the user
router.get('/user/machineries', async(req, res) => {
	try{
        var array = [];
		const result = await sequelize.transaction(async (t) => {
			const item = await models.item_list.findAll({
                                                where: {
                                                    [Op.and]: [
                                                        { ID_CONTENT: 3 },
                                                        { ID_USER: req.session.user.ID }
                                                    ]
                                                },include: [{   
                                                    model: models.activity_group,
                                                    include: {
                                                        model: models.chapter_group
                                                    }
                                                }]
                                            },{ transaction: t });
			return item;
        });

        for (let i = 0; i < result.length; i++) {
            array[i] = result[i].dataValues;
            array[i].activity_group = array[i].activity_group.dataValues;
            array[i].activity_group.chapter_group = array[i].activity_group.chapter_group.dataValues;
        }

        res.status(200).render('index',{
            selected: 'item',
            type: 'u_machineries',
            user: req.session.user,
            mc: array
        });
	}catch(err){
		res.status(200).render('index',{
            selected: 'item',
            type: 'u_machineries',
            user: req.session.user,
            error: "internal server error"
        });
	}
});

//get all tranports for the user
router.get('/user/transports', async(req, res) => {
	try{
        var array = [];
		const result = await sequelize.transaction(async (t) => {
			const item = await models.item_list.findAll({
                                                where: {
                                                    [Op.and]: [
                                                        { ID_CONTENT: 4 },
                                                        { ID_USER: req.session.user.ID }
                                                    ]
                                                },include: [{   
                                                    model: models.activity_group,
                                                    include: {
                                                        model: models.chapter_group
                                                    }
                                                }]
                                            },{ transaction: t });
			return item;
        });

        for (let i = 0; i < result.length; i++) {
            array[i] = result[i].dataValues;
            array[i].activity_group = array[i].activity_group.dataValues;
            array[i].activity_group.chapter_group = array[i].activity_group.chapter_group.dataValues;
        }

        res.status(200).render('index',{
            selected: 'item',
            type: 'u_transports',
            user: req.session.user,
            tr: array
        });
	}catch(err){
		res.status(200).render('index',{
            selected: 'item',
            type: 'u_transports',
            user: req.session.user,
            error: "internal server error"
        });
	}
});
//------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------
//get all materials from the Superuser
router.get('/materials', async(req, res) => {
	try{
        var array = [];
		const result = await sequelize.transaction(async (t) => {
			const item = await models.item_list.findAll({
                                                where: {
                                                    [Op.and]: [
                                                        { ID_CONTENT: 1 },
                                                        { '$user.SUPERUSER$' : 1 }
                                                    ]
                                                },include: [{   
                                                    model: models.activity_group,
                                                    include: {
                                                        model: models.chapter_group
                                                    }
                                                },{
                                                    model: models.user,
                                                    attributes: ['SUPERUSER']
                                                }]
                                            },{ transaction: t });
			return item;
        });

        for (let i = 0; i < result.length; i++) {
            array[i] = result[i].dataValues;
            array[i].activity_group = array[i].activity_group.dataValues;
            array[i].activity_group.chapter_group = array[i].activity_group.chapter_group.dataValues;
            array[i].user = array[i].user.dataValues;
        }

        res.status(200).render('index',{
            selected: 'item',
            type: 'materials',
            user: req.session.user,
            mt: array
        });
	}catch(err){
		res.status(200).render('index',{
            selected: 'item',
            type: 'materials',
            user: req.session.user,
            error: "internal server error"
        });
	}
});

//get all gangs from the Superuser
router.get('/gangs', async(req, res) => {
	try{
        var array = [];
		const result = await sequelize.transaction(async (t) => {
			const item = await models.item_list.findAll({
                                                where: {
                                                    [Op.and]: [
                                                        { ID_CONTENT: 2 },
                                                        { '$user.SUPERUSER$' : 1 }
                                                    ]
                                                },include: [{   
                                                    model: models.activity_group,
                                                    include: {
                                                        model: models.chapter_group
                                                    }
                                                },{
                                                    model: models.user,
                                                    attributes: ['SUPERUSER']
                                                }]
                                            },{ transaction: t });
			return item;
        });

        for (let i = 0; i < result.length; i++) {
            array[i] = result[i].dataValues;
            array[i].activity_group = array[i].activity_group.dataValues;
            array[i].activity_group.chapter_group = array[i].activity_group.chapter_group.dataValues;
            array[i].user = array[i].user.dataValues;
        }

        res.status(200).render('index',{
            selected: 'item',
            type: 'gangs',
            user: req.session.user,
            ga: array
        });
	}catch(err){
		res.status(200).render('index',{
            selected: 'item',
            type: 'gangs',
            user: req.session.user,
            error: "internal server error"
        });
	}
});

//get all machinery from the Superuser
router.get('/machineries', async(req, res) => {
	try{
        var array = [];
		const result = await sequelize.transaction(async (t) => {
			const item = await models.item_list.findAll({
                                                where: {
                                                    [Op.and]: [
                                                        { ID_CONTENT: 3 },
                                                        { '$user.SUPERUSER$' : 1 }
                                                    ]
                                                },include: [{   
                                                    model: models.activity_group,
                                                    include: {
                                                        model: models.chapter_group
                                                    }
                                                },{
                                                    model: models.user,
                                                    attributes: ['SUPERUSER']
                                                }]
                                            },{ transaction: t });
			return item;
        });

        for (let i = 0; i < result.length; i++) {
            array[i] = result[i].dataValues;
            array[i].activity_group = array[i].activity_group.dataValues;
            array[i].activity_group.chapter_group = array[i].activity_group.chapter_group.dataValues;
            array[i].user = array[i].user.dataValues;
        }

        res.status(200).render('index',{
            selected: 'item',
            type: 'machineries',
            user: req.session.user,
            mc: array
        });
	}catch(err){
		res.status(200).render('index',{
            selected: 'item',
            type: 'machineries',
            user: req.session.user,
            error: "internal server error"
        });
	}
});

//get all tranports from the Superuser
router.get('/transports', async(req, res) => {
	try{
        var array = [];
		const result = await sequelize.transaction(async (t) => {
			const item = await models.item_list.findAll({
                                                where: {
                                                    [Op.and]: [
                                                        { ID_CONTENT: 4 },
                                                        { '$user.SUPERUSER$' : 1 }
                                                    ]
                                                },include: [{   
                                                    model: models.activity_group,
                                                    include: {
                                                        model: models.chapter_group
                                                    }
                                                },{
                                                    model: models.user,
                                                    attributes: ['SUPERUSER']
                                                }]
                                            },{ transaction: t });
			return item;
        });

        for (let i = 0; i < result.length; i++) {
            array[i] = result[i].dataValues;
            array[i].activity_group = array[i].activity_group.dataValues;
            array[i].activity_group.chapter_group = array[i].activity_group.chapter_group.dataValues;
            array[i].user = array[i].user.dataValues;
        }

        res.status(200).render('index',{
            selected: 'item',
            type: 'transports',
            user: req.session.user,
            tr: array
        });
	}catch(err){
		res.status(200).render('index',{
            selected: 'item',
            type: 'transports',
            user: req.session.user,
            error: "internal server error"
        });
	}
});

//get copy for superuser
router.get('/copy/:id', async(req, res) => {
	try{
		const result = await sequelize.transaction(async (t) => {
			const item = await models.item_list.findOne({
                                                where: {
                                                    ID: req.params.id
                                                }
                                            },{ transaction: t });
			return item;
        });
        
        var copy = result.dataValues;

        const search = await sequelize.transaction(async (t) => {
			const item = await models.item_list.findOne({
                                                where: {
                                                    NAME: copy.NAME,
                                                    ID_ACT_GRP: copy.ID_ACT_GRP
                                                },
                                                include:{   
                                                    model: models.user,
                                                    where: {
                                                        SUPERUSER: 1
                                                    }
                                                }
                                            },{ transaction: t });
			return item;
        });
        if (typeof search.dataValues.ID !== 'undefined') {
            throw {name : "regError", message : "El item ya ha sido copiado"};
        }

        await sequelize.transaction(async (t) => {
            const item = await models.item_list.create({
                            NAME: copy.NAME,
                            MEASSURE_UNIT: copy.MEASSURE_UNIT,
                            PERFORMANCE: copy.PERFORMANCE,
                            DESCRIPTION: copy.DESCRIPTION,
                            COST: copy.COST,
                            ID_ACT_GRP: copy.ID_ACT_GRP,
                            ID_CONTENT: copy.ID_CONTENT,
                            ID_USER: req.session.user.ID
                        }, { transaction: t });
            return item;
        });

        res.status(200).json({name: "Exito", message: "Item " + copy.NAME + " copiado"});
	}catch(err){
		res.status(500).json({name: "Error " + err.name, message:"internal server error" + err.message});
	}
});

//get all for SuperUser
router.get('/all', async(req, res) => {
	try{
        var array = [];

        for (let i = 0; i < 4; i++) {
            array[i] = await sequelize.transaction(async (t) => {
                const item = await models.item_list.findAll({
                                                    where: {
                                                        ID_CONTENT: i+1
                                                    }, 
                                                    include: [{   
                                                        model: models.activity_group,
                                                        include: {
                                                            model: models.chapter_group
                                                        }
                                                    },{   
                                                        model: models.user,
                                                        attributes: ['CODE', 'NAME', 'SUPERUSER'],
                                                        where: {
                                                            SUPERUSER:{
                                                                [Op.ne]: 1
                                                            }
                                                        }
                                                    }],
                                                    order:[
                                                        ['ID_ACT_GRP', 'ASC']
                                                    ]
                                                },{ transaction: t });
                return item;
            });
        }
        
        for (let j = 0; j < array.length; j++) {
            for (let i = 0; i < array[j].length; i++) {
                array[j][i] = array[j][i].dataValues;
                array[j][i].activity_group = array[j][i].activity_group.dataValues;
                array[j][i].activity_group.chapter_group = array[j][i].activity_group.chapter_group.dataValues;
                array[j][i].user = array[j][i].user.dataValues;
            }            
        }

        var response = {mt: array[0], ga: array[1], mc: array[2], tr: array[3]};

        res.status(200).render('index',{
            selected: 'item',
            type: 'su_items',
            user: req.session.user,
            items: response
        });
	}catch(err){
		res.status(200).render('index',{
            selected: 'item',
            type: 'su_item',
            user: req.session.user,
            error: "internal server error"
        });
	}
});

//get one 
router.get('/:id', async(req, res) => {
	try{
		const result = await sequelize.transaction(async (t) => {
			const item = await models.item_list.findAll({
                                                where: {
                                                    ID: req.params.id
                                                }, include: [{
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
//------------------------------------------------------------------------------------------------

//Delete
router.delete('/:id', async(req, res) => {
	try{
        var id_item = parseInt(req.params.id);
        var where = {where: {ID: id_item}};

        if (req.session.SUPERUSER == 0) {
            where = {where: {
                        [Op.and]: [{
                            ID: id_item
                        },{
                            ID_USER: req.session.ID
                        }]
                    }}
        }

		const result = await sequelize.transaction(async (t) => {
            const item = await models.item_list.destroy(where, { transaction: t });
            return item;
        });

		if(result == 0){
			throw {name : "MatchError", message : "No cuenta con los permisos para eliminar este item"}; 
        }

		res.status(200).json({name: "Exito", message: "Se ha eliminado el item"});
	}catch(err){
        if(err.name == "MatchError"){
            res.status(400).json({name: "Error", message: err.message});
        }else if(err.name == "SequelizeForeignKeyConstraintError"){
            res.status(400).json({name: "Error", message:"No se pueden eliminar items utilizados en presupuestos"});
        }else {
            res.status(500).json({name: "Error " + err.name, message:"internal server error" + err.message});
        }
	}
});

//Update
router.patch('/:id', async(req, res) => {
    try{
        var {name, unit, perf, desc, cost, actg} = req.body;

        if (!name || !unit || !cost || !desc || actg == '0') {
            throw {name : "regError", message : "Datos del material incompletos"};
        }

		const result = await sequelize.transaction(async (t) => {
            const item = await models.item_list.update({ 
                                NAME: name,
                                MEASSURE_UNIT: unit,
                                PERFORMANCE: perf,
                                DESCRIPTION: desc,
                                COST: cost,
                                ID_ACT_GRP: actg
                            },{
                                where: {
                                    ID: req.params.id
                                }
                            },{ transaction: t });
            return item;
        });

		if(result == ""){
			throw {name : "MatchError", message : "No se encontro el objeto en la lista del usuario"}; 
        }

        res.status(200).json({name: "Exito", message: "Se ha actualizado el item"});
	}catch(err){
        if(err.name == "MatchError" || err.name == "regError"){
            res.status(400).json({name: "Error", message: err.message});
        }else {
            res.status(500).json({name: "Error: " + err.name, message:"internal server error " + err.message});
        }
	}
});

//export module
module.exports = router;

