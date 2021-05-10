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
            aux[i].total1 = 0;
            for (let j = 0; j < aux[i].items.length; j++) {
                aux[i].items[j] = aux[i].items[j].toJSON();
                aux[i].items[j].total_activity = aux[i].items[j].TOTAL * aux[i].items[j].apu_content.apu.quote_activity.QUANTITY;
                aux[i].total1 += aux[i].items[j].total_activity;
            }
        }

        for (let i = 0; i < 5; i++) {
            let sumQuery = " SELECT sum(`apu_content`.`TOTAL`) AS `sum` FROM `apu_content` AS `apu_content`" +
                " LEFT OUTER JOIN `apu` AS `apu` ON `apu_content`.`ID_APU` = `apu`.`ID`" +
                " LEFT OUTER JOIN `quote_activity` AS `apu->quote_activity` ON `apu`.`ID_QUO_ACT` = `apu->quote_activity`.`ID`" +
                " LEFT OUTER JOIN `quote_chapter` AS `apu->quote_activity->quote_chapter` ON `apu->quote_activity`.`ID_QUO_CHP` = `apu->quote_activity->quote_chapter`.`ID`" +
                " LEFT OUTER JOIN `quote_chp_grp` AS `apu->quote_activity->quote_chapter->quote_chp_grp` ON `apu->quote_activity->quote_chapter`.`ID_QUO_CHP_GRP` = `apu->quote_activity->quote_chapter->quote_chp_grp`.`ID`" +
                " WHERE (`apu_content`.`ID_CONTENT` = " + (i + 1) + " AND `apu->quote_activity->quote_chapter->quote_chp_grp`.`ID_QUOTE` = '" + id + "');"

            let sumQuery1 = " SELECT sum(`apu->quote_activity`.`QUANTITY`) AS `sum` FROM `apu_content` AS `apu_content`" +
                " LEFT OUTER JOIN `apu` AS `apu` ON `apu_content`.`ID_APU` = `apu`.`ID`" +
                " LEFT OUTER JOIN `quote_activity` AS `apu->quote_activity` ON `apu`.`ID_QUO_ACT` = `apu->quote_activity`.`ID`" +
                " LEFT OUTER JOIN `quote_chapter` AS `apu->quote_activity->quote_chapter` ON `apu->quote_activity`.`ID_QUO_CHP` = `apu->quote_activity->quote_chapter`.`ID`" +
                " LEFT OUTER JOIN `quote_chp_grp` AS `apu->quote_activity->quote_chapter->quote_chp_grp` ON `apu->quote_activity->quote_chapter`.`ID_QUO_CHP_GRP` = `apu->quote_activity->quote_chapter->quote_chp_grp`.`ID`" +
                " WHERE (`apu_content`.`ID_CONTENT` = " + (i + 1) + " AND `apu->quote_activity->quote_chapter->quote_chp_grp`.`ID_QUOTE` = '" + id + "');"

            let result = await sequelize.query(sumQuery, { type: QueryTypes.SELECT });
            let result1 = await sequelize.query(sumQuery1, { type: QueryTypes.SELECT });

            if (result[0].sum === null) {
                aux[i].total = 0;
                aux[i].quantity = 0;
            } else {
                aux[i].total = result[0].sum;
                aux[i].quantity = result1[0].sum;
            }
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
            aux[i].total1 = 0;
            for (let j = 0; j < aux[i].items.length; j++) {
                aux[i].items[j] = aux[i].items[j].toJSON();
                aux[i].items[j].total_activity = aux[i].items[j].TOTAL * aux[i].items[j].apu_content.apu.quote_activity.QUANTITY;
                aux[i].total1 += aux[i].items[j].total_activity;
            }
        }
        for (let i = 0; i < 5; i++) {
            let sumQuery = " SELECT sum(`apu_content`.`TOTAL`) AS `sum` FROM `apu_content` AS `apu_content`" +
                " LEFT OUTER JOIN `apu` AS `apu` ON `apu_content`.`ID_APU` = `apu`.`ID`" +
                " LEFT OUTER JOIN `quote_activity` AS `apu->quote_activity` ON `apu`.`ID_QUO_ACT` = `apu->quote_activity`.`ID`" +
                " LEFT OUTER JOIN `quote_chapter` AS `apu->quote_activity->quote_chapter` ON `apu->quote_activity`.`ID_QUO_CHP` = `apu->quote_activity->quote_chapter`.`ID`" +
                " LEFT OUTER JOIN `quote_chp_grp` AS `apu->quote_activity->quote_chapter->quote_chp_grp` ON `apu->quote_activity->quote_chapter`.`ID_QUO_CHP_GRP` = `apu->quote_activity->quote_chapter->quote_chp_grp`.`ID`" +
                " WHERE (`apu_content`.`ID_CONTENT` = " + (i + 1) + " AND `apu->quote_activity->quote_chapter->quote_chp_grp`.`ID_QUOTE` = '" + id + "');"

            let sumQuery1 = " SELECT sum(`apu->quote_activity`.`QUANTITY`) AS `sum` FROM `apu_content` AS `apu_content`" +
                " LEFT OUTER JOIN `apu` AS `apu` ON `apu_content`.`ID_APU` = `apu`.`ID`" +
                " LEFT OUTER JOIN `quote_activity` AS `apu->quote_activity` ON `apu`.`ID_QUO_ACT` = `apu->quote_activity`.`ID`" +
                " LEFT OUTER JOIN `quote_chapter` AS `apu->quote_activity->quote_chapter` ON `apu->quote_activity`.`ID_QUO_CHP` = `apu->quote_activity->quote_chapter`.`ID`" +
                " LEFT OUTER JOIN `quote_chp_grp` AS `apu->quote_activity->quote_chapter->quote_chp_grp` ON `apu->quote_activity->quote_chapter`.`ID_QUO_CHP_GRP` = `apu->quote_activity->quote_chapter->quote_chp_grp`.`ID`" +
                " WHERE (`apu_content`.`ID_CONTENT` = " + (i + 1) + " AND `apu->quote_activity->quote_chapter->quote_chp_grp`.`ID_QUOTE` = '" + id + "');"

            let result = await sequelize.query(sumQuery, { type: QueryTypes.SELECT });
            let result1 = await sequelize.query(sumQuery1, { type: QueryTypes.SELECT });

            if (result[0].sum === null) {
                aux[i].total = 0;
                aux[i].quantity = 0;
            } else {
                aux[i].total = result[0].sum;
                aux[i].quantity = result1[0].sum;
            }
        }

        res.status(200).json(aux);
    } catch (err) {
        res.status(500).json({ name: "Error " + err.name, message: "internal server error" + err.message });
    }
});

//export module
module.exports = router;