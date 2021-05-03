const express = require('express');
const router = express.Router();
var sequelize = require('../connection');
const { Op } = require("sequelize");

var initModels = require("../model/init-models");
var models = initModels(sequelize);


//submit an worker
router.post('/', async(req, res) => {
	try{
        var { rank, name, cc, phone, skill } = req.body;

        if ( !rank || !name || !cc || !phone || !skill) {
            throw {name : "regError", message : "Datos del trabajador incompletos"};
        }

        await sequelize.transaction(async (t) => {
            const sal = await models.worker.create({
                                            ID_USER: req.session.user.ID,
                                            ID_RANK: rank,
                                            NAME: name,
                                            CC: cc,
                                            PHONE: phone,
                                            SKILL: skill
                                        }, { transaction: t });
            return sal;
        });

		res.status(200).json({name: "Exito", message: "Se ha registrado el trabajador"});
	}catch(err){
        if(err.name == "regError"){
            res.status(400).json({name: "Error", message: err.message});
		}else {
            res.status(500).json({name: "Error " + err.name, message: "internal server error " + err.message});
		}
	}
});

//get all
router.get('/all', async(req, res) => {
	try{
        var array = [];
				const result = await sequelize.transaction(async (t) => {
					const sal = await models.worker.findAll({
		                                        where: {
		                                            ID_USER: req.session.user.ID
		                                        },
		                                        include: [{
		                                            model: models.rank
		                                        }]
		                                    },{ transaction: t });
					return sal;
        });

        for (let i = 0; i < result.length; i++) {
            array[i] = result[i].dataValues;
            array[i].rank = array[i].rank.dataValues;
        }

        res.status(200).render('index',{
            selected: 'workers',
            user: req.session.user,
            worker: array
        });
	}catch(err){
        res.status(200).render('index',{
            selected: 'workers',
            user: req.session.user,
						error: "yo"
        });
	}
});

//get all by rank
router.get('/json/:id', async(req, res) => {
	try{
        const result = await sequelize.transaction(async (t) => {
            const sal = await models.worker.findAll({
                                        where: {
                                            ID_USER: req.session.user.ID,
                                            ID_RANK: req.params.id
                                        }
                                    },{ transaction: t });
            return sal;
        });

        res.status(200).json(result);
	}catch(err){
        res.status(500).json({ name: "Error " + err.name, message: "internal server error" + err.message });
	}
});

//get one
router.get('/:id', async(req, res) => {
	try{
		const result = await sequelize.transaction(async (t) => {
			const sal = await models.worker.findAll({where: {
                                            ID_USER: req.session.user.ID,
                                            ID: req.params.id
                                        }},{ transaction: t });
			return sal;
        });

        res.status(200).json(result);
	}catch(err){
        res.status(500).json({name: "Error " + err.name, message: "internal server error " + err.message});
	}
});

//Delete
router.delete('/:id', async(req, res) => {
    try{
		const result = await sequelize.transaction(async (t) => {
            const sal = await models.worker.destroy({
                                where: {
                                    ID_USER: req.session.user.ID,
                                    ID: req.params.id
                                }
                            },{ transaction: t });
            return sal;
        });

		if(result == 0){
			throw {name : "MatchError", message : "No se elimino el trabajador"};
        }

		res.status(200).json({name: "Exito", message: "Se ha eliminado el trabajador"});
	}catch(err){
        if(err.name == "MatchError"){
            res.status(400).json({name: "Error", message: err.message});
        }else if(err.name == "SequelizeForeignKeyConstraintError"){
            res.status(400).json({name: "Error", message:"No se pueden eliminar trabajadores utilizados en presupuestos"});
        }else {
            res.status(500).json({name: "Error " + err.name, message:"internal server error" + err.message});
        }
	}
});

//Update
router.patch('/:id', async(req, res) => {
    try{

        var { rank, name, cc, phone, skill } = req.body;

        if ( !rank || !name || !cc || !phone || !skill) {
            throw {name : "regError", message : "Datos del trabajador incompletos"};
        }

		const result = await sequelize.transaction(async (t) => {
            const sal = await models.worker.update({
                                ID_RANK: req.body.rank,
                                NAME: req.body.name,
                                CC: req.body.cc,
                                PHONE:req.body.phone,
                                SKILL: req.body.skill
                            },{
                                where: {
                                    ID: req.params.id
                                }
                            },{ transaction: t });
            return sal;
        });

		if(result == 0){
			throw {name : "MatchError", message : "No se actualizo el trabajador"};
        }

        res.status(200).json({name: "Exito", message: "Se ha actualizado el trabajador"});
	}catch(err){
        if(err.name == "MatchError" || err.name == "regError"){
            res.status(400).json({message:err.message});
        }else{
            res.status(500).json({message:"internal server error"});
        }
	}
});

//export module
module.exports = router;
