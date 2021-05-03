const express = require('express');
const router = express.Router();
var sequelize = require('../connection');
const { Op, QueryTypes  } = require("sequelize");

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
                    include: [
                        { model: models.item_list },
                        {
                            model: models.apu_content,
                            where: {
                                ID_CONTENT: i + 1,
                            },
                            include: {
                                model: models.apu,
                                include: {
                                    model: models.quote_activity,
                                    include: {
                                        model: models.quote_chapter,
                                        include: {
                                            model: models.quote_chp_grp,
                                            include: {
                                                model: models.quotation,
                                                where: {
                                                    ID: id
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }]
                }, { transaction: t });
                return item;
            });
            for (let j = 0; j < aux[i].items.length; j++) {
                aux[i].items[j] = aux[i].items[j].toJSON();
            }
        }
        for (let i = 0; i < 5; i++) {
            let result =  await sequelize.query("SELECT sum(`apu_content`.`TOTAL`) AS `sum` FROM `apu_content` AS `apu_content`"+
                                                        " LEFT OUTER JOIN `apu` AS `apu` ON `apu_content`.`ID_APU` = `apu`.`ID` "+
                                                        " LEFT OUTER JOIN `quote_activity` AS `apu->quote_activity` ON `apu`.`ID_QUO_ACT` = `apu->quote_activity`.`ID`"+
                                                        " LEFT OUTER JOIN `quote_chapter` AS `apu->quote_activity->quote_chapter` ON `apu->quote_activity`.`ID_QUO_CHP` = `apu->quote_activity->quote_chapter`.`ID`"+
                                                        " LEFT OUTER JOIN ( `quote_chp_grp` AS `apu->quote_activity->quote_chapter->quote_chp_grp`"+
                                                            " INNER JOIN `quotation` AS `apu->quote_activity->quote_chapter->quote_chp_grp->quotation` ON `apu->quote_activity->quote_chapter->quote_chp_grp`.`ID_QUOTE` = `apu->quote_activity->quote_chapter->quote_chp_grp->quotation`.`ID`"+
                                                            " AND `apu->quote_activity->quote_chapter->quote_chp_grp->quotation`.`ID` = '" + id + "' ) ON `apu->quote_activity->quote_chapter`.`ID_QUO_CHP_GRP` = `apu->quote_activity->quote_chapter->quote_chp_grp`.`ID` WHERE `apu_content`.`ID_CONTENT` ="+ (i+1),
            { type: QueryTypes.SELECT });

            if (result[0].sum === null) {
                aux[i].total = 0;
            }else{
                aux[i].total = result[0].sum;
            }
        }

        res.status(200).render('index',{
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
                    include: [
                        { model: models.item_list },
                        {
                            model: models.apu_content,
                            where: {
                                ID_CONTENT: i + 1,
                            },
                            include: {
                                model: models.apu,
                                include: {
                                    model: models.quote_activity,
                                    include: {
                                        model: models.quote_chapter,
                                        include: {
                                            model: models.quote_chp_grp,
                                            include: {
                                                model: models.quotation,
                                                where: {
                                                    ID: id
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }]
                }, { transaction: t });
                return item;
            });
            for (let j = 0; j < aux[i].items.length; j++) {
                aux[i].items[j] = aux[i].items[j].toJSON();
            }
        }
        for (let i = 0; i < 5; i++) {
            let result =  await sequelize.query("SELECT sum(`apu_content`.`TOTAL`) AS `sum` FROM `apu_content` AS `apu_content`"+
                                                        " LEFT OUTER JOIN `apu` AS `apu` ON `apu_content`.`ID_APU` = `apu`.`ID` "+
                                                        " LEFT OUTER JOIN `quote_activity` AS `apu->quote_activity` ON `apu`.`ID_QUO_ACT` = `apu->quote_activity`.`ID`"+
                                                        " LEFT OUTER JOIN `quote_chapter` AS `apu->quote_activity->quote_chapter` ON `apu->quote_activity`.`ID_QUO_CHP` = `apu->quote_activity->quote_chapter`.`ID`"+
                                                        " LEFT OUTER JOIN ( `quote_chp_grp` AS `apu->quote_activity->quote_chapter->quote_chp_grp`"+
                                                            " INNER JOIN `quotation` AS `apu->quote_activity->quote_chapter->quote_chp_grp->quotation` ON `apu->quote_activity->quote_chapter->quote_chp_grp`.`ID_QUOTE` = `apu->quote_activity->quote_chapter->quote_chp_grp->quotation`.`ID`"+
                                                            " AND `apu->quote_activity->quote_chapter->quote_chp_grp->quotation`.`ID` = '" + id + "' ) ON `apu->quote_activity->quote_chapter`.`ID_QUO_CHP_GRP` = `apu->quote_activity->quote_chapter->quote_chp_grp`.`ID` WHERE `apu_content`.`ID_CONTENT` ="+ (i+1),
            { type: QueryTypes.SELECT });
            
            if (result[0].sum === null) {
                aux[i].total = 0;
            }else{
                aux[i].total = result[0].sum;
            }
        }

        res.status(200).json(aux);
    } catch (err) {
        res.status(500).json({ name: "Error " + err.name, message: "internal server error" + err.message });
    }
});

//export module
module.exports = router;