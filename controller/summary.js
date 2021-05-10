const express = require('express');
const router = express.Router();
var sequelize = require('../connection');
const { Op, QueryTypes } = require("sequelize");

var initModels = require("../model/init-models");
var models = initModels(sequelize);

//get one chapter
router.get('/', async (req, res) => {
    try {
        const id = req.query.bid;
        let aux = [];
        for (let i = 0; i < 5; i++) {
            aux[i] = {};
            aux[i].items = await sequelize.transaction(async (t) => {
                const item = await models.apu_item.findAll({
                    where: {
                        [Op.and]: {
                            '$apu_content.ID_CONTENT$': { [Op.eq]: i + 1 },
                            '$apu_content.apu.quote_activity.quote_chapter.quote_chp_grp.ID_QUOTE$': { [Op.eq]: id },
                        }
                    },
                    include: [
                        { model: models.item_list },
                        {
                            model: models.apu_content,
                            include: {
                                model: models.apu,
                                include: {
                                    model: models.quote_activity,
                                    include: {
                                        model: models.quote_chapter,
                                        include: {
                                            model: models.quote_chp_grp
                                        }
                                    }
                                }
                            }
                        }]
                }, { transaction: t });
                return item;
            });
            aux[i].total = 0;
            for (let j = 0; j < aux[i].items.length; j++) {
                aux[i].items[j] = aux[i].items[j].toJSON();
                aux[i].items[j].total_activity = aux[i].items[j].TOTAL * aux[i].items[j].apu_content.apu.quote_activity.QUANTITY;
                aux[i].total += aux[i].items[j].total_activity;
            }
        }

        let tools = await sequelize.transaction(async (t) => {
            const item = await models.apu_content.findAll({
                where: {
                    [Op.and]: {
                        ID_CONTENT: { [Op.eq]: 5 },
                        '$apu.quote_activity.quote_chapter.quote_chp_grp.ID_QUOTE$': { [Op.eq]: id },
                    }
                },
                include: [{
                    model: models.apu,
                    include: {
                        model: models.quote_activity,
                        include: {
                            model: models.quote_chapter,
                            include: {
                                model: models.quote_chp_grp
                            }
                        }
                    }
                }]
            }, { transaction: t });
            return item;
        });

        aux[4].total = 0;
        for (let i = 0; i < tools.length; i++) {
            tools[i] = tools[i].toJSON();
            aux[4].total += tools[i].TOTAL * tools[i].apu.quote_activity.QUANTITY;
        }

        res.status(200).render('index', {
            selected: 'shoppinglist',
            user: req.session.user,
            list: aux,
            quote: id
        });
    } catch (err) {
        res.status(500).render('index', {
            selected: 'shoppinglist',
            user: req.session.user,
            error: "Internal server error " + err.name + " " + err.message
        });
    }
});

router.get('/json/:bid', async (req, res) => {
    try {
        const id = req.params.bid;
        let aux = [];
        for (let i = 0; i < 5; i++) {
            aux[i] = {};
            aux[i].items = await sequelize.transaction(async (t) => {
                const item = await models.apu_item.findAll({
                    where: {
                        [Op.and]: {
                            '$apu_content.ID_CONTENT$': { [Op.eq]: i + 1 },
                            '$apu_content.apu.quote_activity.quote_chapter.quote_chp_grp.ID_QUOTE$': { [Op.eq]: id },
                        }
                    },
                    include: [
                        { model: models.item_list },
                        {
                            model: models.apu_content,
                            include: {
                                model: models.apu,
                                include: {
                                    model: models.quote_activity,
                                    include: {
                                        model: models.quote_chapter,
                                        include: {
                                            model: models.quote_chp_grp
                                        }
                                    }
                                }
                            }
                        }]
                }, { transaction: t });
                return item;
            });
            aux[i].total = 0;
            for (let j = 0; j < aux[i].items.length; j++) {
                aux[i].items[j] = aux[i].items[j].toJSON();
                aux[i].items[j].total_activity = aux[i].items[j].TOTAL * aux[i].items[j].apu_content.apu.quote_activity.QUANTITY;
                aux[i].total += aux[i].items[j].total_activity;
            }
        }

        let tools = await sequelize.transaction(async (t) => {
            const item = await models.apu_content.findAll({
                where: {
                    [Op.and]: {
                        ID_CONTENT: { [Op.eq]: 5 },
                        '$apu.quote_activity.quote_chapter.quote_chp_grp.ID_QUOTE$': { [Op.eq]: id },
                    }
                },
                include: [{
                    model: models.apu,
                    include: {
                        model: models.quote_activity,
                        include: {
                            model: models.quote_chapter,
                            include: {
                                model: models.quote_chp_grp
                            }
                        }
                    }
                }]
            }, { transaction: t });
            return item;
        });

        aux[4].total = 0;
        for (let i = 0; i < tools.length; i++) {
            tools[i] = tools[i].toJSON();
            aux[4].total += tools[i].TOTAL * tools[i].apu.quote_activity.QUANTITY;
        }

        res.status(200).json(aux);
    } catch (err) {
        res.status(500).json({ name: "Error " + err.name, message: "internal server error" + err.message });
    }
});

//export module
module.exports = router;