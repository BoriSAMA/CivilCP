const express = require('express');
const router = express.Router();
var sequelize = require('../connection');
const { Op } = require("sequelize");

var initModels = require("../model/init-models");
var models = initModels(sequelize);

//get one chapter
router.get('/:idBudget', async (req, res) => {
    try {
        const id = req.params.idBudget;
        let items = {ma: [], ga: [], mc: [], tr: []};

        for (let i = 0; i < 4; i++) {
            const element = i;         
        }
        const result = await sequelize.transaction(async (t) => {
            const item = await models.apu_item.findAll({
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
                                        model: models.quote_chp_grp,
                                        include: {
                                            model: models.quotation,
                                            where: {
                                                ID = id
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

        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ name: "Error " + err.name, message: "internal server error" + err.message });
    }
});

//export module
module.exports = router;