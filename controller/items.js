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

        await sequelize.transaction(async (t) => {
            const item = await models.item_list.create({
                            NAME: req.body.name,
                            MEASSURE_UNIT: req.body.mesu,
                            PERFORMANCE: req.body.perf,
                            DESCRIPTION: req.body.desc,
                            COST: req.body.cost,
                            ID_ACT_GRP: req.body.actg,
                            ID_CONTENT: req.body.cont,
                            ID_USER: req.session.user.ID
                        }, { transaction: t });
            return item;
        });
        
		res.status(200).json({name: "Exito", message: "Se ha registrado el item"});
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
//get all materials for the user
router.get('/materials', async(req, res) => {
	try{
        var array = [];
		const result = await sequelize.transaction(async (t) => {
			const item = await models.item_list.findAll({
                                                where: {
                                                    ID_CONTENT: 1,
                                                    ID_USER: req.session.user.ID
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
            selected: 'materials',
            user: req.session.user,
            materials: array
        });
	}catch(err){
		res.status(200).render('index',{
            selected: 'materials',
            user: req.session.user,
            error: "internal server error",
            materials: array
        });
	}
});

//get all gangs for the user
router.get('/gangs', async(req, res) => {
	try{
        var array = [];
		const result = await sequelize.transaction(async (t) => {
			const item = await models.item_list.findAll({
                                                where: {
                                                    ID_CONTENT: 2,
                                                    ID_USER: req.session.user.ID
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
            selected: 'gangs',
            user: req.session.user,
            gangs: array
        });
	}catch(err){
		res.status(200).render('index',{
            selected: 'gangs',
            user: req.session.user,
            error: "internal server error",
            gangs: array
        });
	}
});

//get all machinery for the user
router.get('/machineries', async(req, res) => {
	try{
        var array = [];
		const result = await sequelize.transaction(async (t) => {
			const item = await models.item_list.findAll({
                                                where: {
                                                    ID_CONTENT: 3,
                                                    ID_USER: req.session.user.ID
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
            selected: 'machinery',
            user: req.session.user,
            machineries: array
        });
	}catch(err){
		res.status(200).render('index',{
            selected: 'machinery',
            user: req.session.user,
            error: "internal server error",
            machineries: array
        });
	}
});

//get all tranports for the user
//TODO

//get all materials from the Superuser
router.get('/materials', async(req, res) => {
	try{
        var array = [];
		const result = await sequelize.transaction(async (t) => {
			const item = await models.item_list.findAll({
                                                where: {
                                                    [Op.and]: [
                                                        { ID_CONTENT: 1 },
                                                        { SUPERUSER: 1 }
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
            selected: 'materials',
            user: req.session.user,
            materials: array
        });
	}catch(err){
		res.status(200).render('index',{
            selected: 'materials',
            user: req.session.user,
            error: "internal server error",
            materials: array
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
                                                    ID_CONTENT: 2,
                                                    ID_USER: req.session.user.ID
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
            selected: 'gangs',
            user: req.session.user,
            gangs: array
        });
	}catch(err){
		res.status(200).render('index',{
            selected: 'gangs',
            user: req.session.user,
            error: "internal server error",
            gangs: array
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
                                                    ID_CONTENT: 3,
                                                    ID_USER: req.session.user.ID
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
            selected: 'machinery',
            user: req.session.user,
            machineries: array
        });
	}catch(err){
		res.status(200).render('index',{
            selected: 'machinery',
            user: req.session.user,
            error: "internal server error",
            machineries: array
        });
	}
});

//get all tranports from the Superuser
//TODO

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
		res.status(500).json({name: "Error", message: err.message});
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
            selected: 'su_items',
            user: req.session.user,
            items: response
        });
	}catch(err){
		res.status(200).render('index',{
            selected: 'su_items',
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
                                                    ID: req.params.ID
                                                }
                                            },{ transaction: t });
			return item;
        });

        res.status(200).json(result);
	}catch(err){
		res.status(500).json({name: "Error", message: "internal server error"});
	}
});
//------------------------------------------------------------------------------------------------


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