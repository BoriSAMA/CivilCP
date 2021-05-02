const express = require('express');
const router = express.Router();
var sequelize = require('../connection');
const { Op, QueryTypes } = require("sequelize");

var initModels = require("../model/init-models");
var models = initModels(sequelize);

//submit a content to an apu
router.post('/content', async (req, res) => {
    try {
        var { ida, idc } = req.body;
        await sequelize.transaction(async (t) => {
            const item = await models.apu_content.create({
                ID_CONTENT: idc,
                ID_APU: ida,
                TOTAL: 0
            }, { transaction: t });
            return item;
        });
        if (idc == 2) {
            await sequelize.transaction(async (t) => {
                const item = await models.apu_content.create({
                    ID_CONTENT: 5,
                    ID_APU: ida,
                    TOTAL: 0
                }, { transaction: t });
                return item;
            });
        }

        res.status(200).json({ name: "Exito", message: "Se ha registrado la seccion en el A.P.U." });
    } catch (err) {
        res.status(500).json({ name: "Error " + err.name, message: "internal server error" + err.message });
    }
});

//submit an item to an apu
router.post('/item', async (req, res) => {
    try {
        var { quan, total, iditem, idapuc } = req.body;

        if (!quan || iditem == 0 || idapuc == 0) {
            throw { name: "regError", message: "Datos del item incompletos" };
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

        res.status(200).json({ name: "Exito", message: "Se ha registrado el item" });
    } catch (err) {
        if (err.name == "regError") {
            res.status(400).json({ name: "Error", message: err.message });
        } else {
            res.status(500).json({ name: "Error " + err.name, message: "internal server error" + err.message });
        }
    }
});

//submit a gang to an apu
router.post('/gang', async (req, res) => {
    try {
        var { quan, total, iditem, idapuc, salary, quantity, c_perf, c_desc } = req.body;

        if (!quan || c_perf == 0 || iditem == 0 || idapuc == 0) {
            throw { name: "regError", message: "Datos de la cuadrilla incompletos" };
        }

        let sal = await sequelize.transaction(async (t) => {
            const item = await models.salary.findOne({ where: { MULTIPLIER: 1 } }, { transaction: t });
            return item;
        });

        for (let i = 0; i < salary.length; i++) {
            if (salary[i] == '') {
                salary[i] = sal.ID;
            }
        }

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

        var dist = apu_i.dataValues.CUSTOM_DESCRIPTION.split(':');
        var rank = [1, 2, 3]
        var rank_n = ['OT', 'O', 'A'];

        for (let i = 0; i < dist.length; i++) {
            for (let j = 0; j < dist[i]; j++) {
                let ind = j + 1;
                await sequelize.transaction(async (t) => {
                    await models.gang_worker.create({
                        ID_RANK: rank[i],
                        GANG_CHAR: rank_n[i] + "." + ind,
                        ID_GANG: apu_i.dataValues.ID,
                        QUANTITY: parseFloat(quantity[i]),
                        ID_SALARY: salary[i],
                    }, { transaction: t });
                });
            }
        }

        res.status(200).json({ name: "Exito", message: "Se ha registrado la cuadrilla en el presupuesto" });
    } catch (err) {
        if (err.name == "regError") {
            res.status(400).json({ name: "Error", message: err.message });
        } else {
            res.status(500).json({ name: "Error " + err.name, message: "internal server error" + err.message });
        }
    }
});

//get all apu contents
router.get('/', async (req, res) => {
    try {
        var ac, items = [], apu = [], id = req.query.aid;

        const result1 = await sequelize.transaction(async (t) => {
            const item = await models.quote_activity.findAll({
                where: {
                    ID: id
                }, include: {
                    model: models.activity_group
                }
            }, { transaction: t });
            return item;
        });

        if (result1.length == 0) {
            throw { name: "Not found", message: "No se ha encontrado el apu" };
        }
        ac = result1[0].dataValues;

        const result = await sequelize.transaction(async (t) => {
            const item = await models.apu.findAll({
                where: {
                    ID_QUO_ACT: id
                }
            }, { transaction: t });
            return item;
        });

        apu = result[0].dataValues;
        apu.tools = 0;

        let apu_c = await sequelize.transaction(async (t) => {
            const item = await models.apu_content.findAll({
                where: {
                    ID_APU: apu.ID
                },
                order: [
                    ['ID_CONTENT', 'ASC']
                ]
            }, { transaction: t });
            return item;
        });

        for (let i = 0; i < apu_c.length; i++) {
            apu_c[i] = apu_c[i].dataValues;
            if (apu_c[i].ID_CONTENT == 5) {
                apu.tools = apu_c[i].TOTAL;
            }else{
                let apu_i = await sequelize.transaction(async (t) => {
                    const item = await models.apu_item.findAll({
                        where: {
                            ID_APU_CONTENT: apu_c[i].ID
                        }, include: [{
                            model: models.item_list
                        }]
                    }, { transaction: t });
                    return item;
                });

                for (let j = 0; j < apu_i.length; j++) {
                    apu_i[j] = apu_i[j].dataValues;
                    apu_i[j].item_list = apu_i[j].item_list.dataValues;


                    if (apu_c[i].ID_CONTENT == 2) {
                        var gang = ['', '', '']
                        for (let k = 0; k < 3; k++) {
                            let ga = await sequelize.transaction(async (t) => {
                                const item = await models.gang_worker.findOne({
                                    where: {
                                        ID_GANG: apu_i[j].ID,
                                        ID_RANK: k + 1
                                    }, include: [{
                                        model: models.salary,
                                        attributes: ['HOURLY_VALUE']
                                    }]
                                }, { transaction: t });
                                return item;
                            });

                            if (ga != null) {
                                gang[k] = ga.dataValues;
                                gang[k].salary = gang[k].salary.dataValues;
                            }
                        }
                        apu_i[j].gang = { OT: gang[0], O: gang[1], A: gang[2] };
                    }
                }
                apu_c[i].apu_i = apu_i
            }
        }
        apu.apu_c = apu_c;

        for (let i = 0; i < 4; i++) {
            items[i] = await sequelize.transaction(async (t) => {
                const item = await models.item_list.findAll({
                    where: {
                        [Op.and]: [
                            { ID_CONTENT: i + 1 },
                            { ID_ACT_GRP: ac.ID_ACT_GRP },
                            {
                                [Op.or]: [
                                    { ID_USER: req.session.user.ID },
                                    { '$user.SUPERUSER$': 1 }
                                ]
                            }
                        ]
                    }, include: {
                        model: models.user,
                        attributes: ['ID', 'SUPERUSER']
                    }
                }, { transaction: t });
                return item;
            });
        }

        for (let j = 0; j < items.length; j++) {
            for (let i = 0; i < items[j].length; i++) {
                items[j][i] = items[j][i].dataValues;
                items[j][i].user = items[j][i].user.dataValues;
            }
        }

        var response = { mt: items[0], ga: items[1], mc: items[2], tr: items[3] };

        const salary = await sequelize.transaction(async (t) => {
            const sal = await models.salary.findAll({ transaction: t });
            return sal;
        });

        res.status(200).render('index', {
            selected: 'apu',
            user: req.session.user,
            activity: ac,
            budget: req.query.bid,
            apu: apu,
            salaries: salary,
            items: response
        });
    } catch (err) {
        res.status(500).render('index', {
            selected: 'apu',
            user: req.session.user,
            error: "Internal server error " + err.name + " " + err.message
        });
    }
});

//get an item
router.get('/:id', async (req, res) => {
    try {
        const result = await sequelize.transaction(async (t) => {
            const item = await models.apu_item.findOne({
                where: {
                    ID: req.params.id
                }, include: {
                    model: models.item_list
                }
            }, { transaction: t });
            return item;
        });

        res.status(200).json(result);
    } catch (err) {
        if (err.name == "regError") {
            res.status(400).json({ name: "Error", message: err.message });
        } else {
            res.status(500).json({ name: "Error " + err.name, message: "internal server error" + err.message });
        }
    }
});

//get a gang
router.get('/gang/:id', async (req, res) => {
    try {
        let result = await sequelize.transaction(async (t) => {
            const item = await models.apu_item.findOne({
                where: {
                    ID: req.params.id
                }, include: {
                    model: models.item_list
                }
            }, { transaction: t });
            return item;
        });

        result = result.dataValues;
        result.item_list = result.item_list.dataValues;
        var gang = ['', '', ''];

        for (let k = 0; k < 3; k++) {
            let ga = await sequelize.transaction(async (t) => {
                const item = await models.gang_worker.findOne({
                    where: {
                        ID_GANG: result.ID,
                        ID_RANK: k + 1
                    }, include: [{
                        model: models.salary,
                        attributes: ['HOURLY_VALUE', 'MULTIPLIER']
                    }]
                }, { transaction: t });
                return item;
            });

            if (ga != null) {
                gang[k] = ga.dataValues;
                gang[k].salary = gang[k].salary.dataValues;
            }
        }
        result.gang = { OT: gang[0], O: gang[1], A: gang[2] };

        res.status(200).json(result);
    } catch (err) {
        if (err.name == "regError") {
            res.status(400).json({ name: "Error", message: err.message });
        } else {
            res.status(500).json({ name: "Error " + err.name, message: "internal server error" + err.message });
        }
    }
});

//Delete a section
router.delete('/content/:id', async (req, res) => {
    try {
        deleteTools(req.params.id);
        const result = await sequelize.transaction(async (t) => {
            const item = await models.apu_content.destroy({
                where: {
                    ID: req.params.id
                }
            }, { transaction: t });
            return item;
        });

        if (result == "") {
            throw { name: "MatchError", message: "Ocurrio un error al eliminar la seccion" };
        }

        res.status(200).json({ name: "Exito", message: "Se ha eliminado la seccion" });
    } catch (err) {
        if (err.name == "MatchError") {
            res.status(400).json({ name: "Error", message: err.message });
        } else {
            res.status(500).json({ name: "Error " + err.name, message: "internal server error" + err.message });
        }
    }
});

//Delete an item
router.delete('/item/:id', async (req, res) => {
    try {
        const result = await sequelize.transaction(async (t) => {
            const item = await models.apu_item.destroy({
                where: {
                    ID: req.params.id
                }
            }, { transaction: t });
            return item;
        });

        if (result == "") {
            throw { name: "MatchError", message: "Ocurrio un error al eliminar el item" };
        }

        res.status(200).json({ name: "Exito", message: "Se ha eliminado el item" });
    } catch (err) {
        if (err.name == "MatchError") {
            res.status(400).json({ name: "Error", message: err.message });
        } else {
            res.status(500).json({ name: "Error " + err.name, message: "internal server error" + err.message });
        }
    }
});

//recalculate the whole value on the budget
router.patch('/calculate/', async (req, res) => {
    try {
        var bid = req.body.bid;
        var aid = req.body.aid;
        var apid = req.body.apid;
        var acid = req.body.acid;
        
        var total = [0, 0, 0, 0];

        await sequelize.transaction(async (t) => {
            if (acid != 0 && typeof acid !== 'undefined') {
                //sumar todos los items del apu al contenido
                total[0] = await models.apu_item.sum('TOTAL', { where: { ID_APU_CONTENT: acid } });

                if (isNaN(total[0])) { total[0] = 0; }

                await models.apu_content.update({
                    TOTAL: total[0]
                }, {
                    where: {
                        ID: acid
                    }
                }, { transaction: t });

                await updateTools(acid);

                //imprimir suma de los items del contenido
                console.log("sumaItems: " + total[0]);
            }
            if (aid != 0 && typeof aid !== 'undefined') {
                //sumar todos los contenidos del apu
                if (apid != 0) {
                    total[1] = await models.apu_content.sum('TOTAL', { where: { ID_APU: apid } });

                    await models.apu.update({ TOTAL: total[1] }, { where: { ID: apid } }, { transaction: t });

                    //imprimir suma de los contenidos del apu
                    console.log("SumaContenidos1: " + total[1]);
                } else {
                    let apu_aux = await models.apu.findOne({ where: { ID_QUO_ACT: aid } }, { transaction: t });

                    total[1] = await models.apu_content.sum('TOTAL', { where: { ID_APU: apu_aux.ID } });
                    
                    await models.apu.update({ TOTAL: total[1] }, { where: { ID: apid } }, { transaction: t });

                    //imprimir suma de los contenidos del apu
                    console.log("SumaContenidos2: " + total[1]);
                }

                //calcular de la actividad con el valor del apu por la cantidad
                await models.quote_activity.findOne({ where: { ID: aid } })
                    .then(qua => {
                        total[2] = qua.dataValues.QUANTITY * total[1];
                        //imprimir valor de la actividad
                        console.log("ValorActividad1: " + total[2]);
                    });

                await models.quote_activity.update({ TOTAL: total[2] }, { where: { ID: aid } }, { transaction: t });

            }

            //sumar todos las actividades al presupeusto
            let total3 = await sequelize.query("SELECT sum(`quote_activity`.`TOTAL`) AS `sum` FROM (((`quote_activity`AS `quote_activity` INNER JOIN `quote_chapter` ON `quote_activity`.`ID_QUO_CHP` = `quote_chapter`.`ID`) INNER JOIN `quote_chp_grp` ON `quote_chapter`.`ID_QUO_CHP_GRP` = `quote_chp_grp`.`ID`) INNER JOIN `quotation` ON `quote_chp_grp`.`ID_QUOTE` = `quotation`.`ID`) WHERE `ID_QUOTE` = '" + bid + "'",
                { type: QueryTypes.SELECT });

            total[3] = total3[0].sum;
            console.log("SumaActividades: " + total[3]);

            const quo = await models.quotation.findOne({ where: { ID: bid } }, { transaction: t });
            var totals = [quo.PRC_ADMIN / 100 * total[3], quo.PRC_UNEXPECTED / 100 * total[3], quo.PRC_UTILITY / 100 * total[3]];
            var tot = parseFloat(totals.reduce((acc, curr) => parseFloat(acc) + parseFloat(curr))) + parseFloat(total[3]);

            const aux = await models.quotation.update({
                TOTAL_DIRECT: total[3],
                ADMIN: totals[0],
                UNEXPECTED: totals[1],
                UTILITY: totals[2],
                IVA: quo.PRC_IVA / 100 * totals[2],
                TOTAL: tot
            }, {
                where: {
                    ID: bid
                }
            }, { transaction: t });

            return aux;
        });

        res.status(200).json({ name: "Exito", message: "Se han actualizado los totales" });
    } catch (err) {
        res.status(500).json({ name: "Error " + err.name, message: "internal server error" + err.message });
    }
});

//Update
router.patch('/:id', async (req, res) => {
    try {
        var { total, quan } = req.body;

        const result = await sequelize.transaction(async (t) => {
            const sal = await models.apu_item.update({
                TOTAL: total,
                QUANTITY: quan
            }, {
                where: {
                    ID: req.params.id
                }
            }, { transaction: t });
            return sal;
        });

        if (result == "") {
            throw { name: "MatchError", message: "No se ha actualizado el item" };
        }
        res.status(200).json({ name: "Exito", message: "Se ha actualizado el item" });
    } catch (err) {
        if (err.name == "MatchError") {
            res.status(400).json({ message: err.message });
        } else {
            res.status(500).json({ message: "internal server error" });
        }
    }
});

//Update a gang
router.patch('/gang/:id', async (req, res) => {
    try {
        var { total, quan, c_perf, c_desc, salary, quantity} = req.body;

        if (!quan || c_perf == 0) {
            throw { name: "regError", message: "Datos de la cuadrilla incompletos" };
        }

        const result = await sequelize.transaction(async (t) => {
            const sal = await models.apu_item.update({
                TOTAL: total,
                CUSTOM_PERFORMANCE: c_perf,
                CUSTOM_DESCRIPTION: c_desc,
                QUANTITY: quan
            }, {
                where: {
                    ID: req.params.id
                }
            }, { transaction: t });

            models.gang_worker.destroy({ where: { ID_GANG: req.params.id }}, { transaction: t });
            return sal;
        });
       
        var dist = c_desc.split(':');
        var rank = [1, 2, 3]
        var rank_n = ['OT', 'O', 'A'];

        for (let i = 0; i < dist.length; i++) {
            for (let j = 0; j < dist[i]; j++) {
                let ind = j + 1;
                await sequelize.transaction(async (t) => {
                    await models.gang_worker.create({
                        ID_RANK: rank[i],
                        GANG_CHAR: rank_n[i] + "." + ind,
                        ID_GANG: req.params.id,
                        QUANTITY: parseFloat(quantity[i]),
                        ID_SALARY: salary[i],
                    }, { transaction: t });
                });
            }
        }

        if (result == "") {
            throw { name: "MatchError", message: "No se ha actualizado la cuadrilla" };
        }
        res.status(200).json({ name: "Exito", message: "Se ha actualizado la cuadrilla" });
    } catch (err) {
        if (err.name == "MatchError") {
            res.status(400).json({ message: err.message });
        } else {
            res.status(500).json({ name: "Error " + err.name, message: "internal server error" + err.message });
        }
    }
});

async function updateTools(idapuc) {
    let apu_c = await sequelize.transaction(async (t) => {
        const item = await models.apu_content.findOne({ where: { ID: idapuc } }, { transaction: t });

        if (item.dataValues.ID_CONTENT != 2) {
            return;
        }

        const item2 = await models.apu_content.findOne({ where: { ID_APU: item.dataValues.ID_APU, ID_CONTENT: 5 } }, { transaction: t });

        return item2.dataValues;
    });
    
    let gangs_tool = await sequelize.transaction(async (t) => {
        const item = await models.apu_item.findAll({
            where: {
                ID_APU_CONTENT: idapuc
            }
        }, { transaction: t });
        return item;
    });

    let suma_tools = 0;

    for (let i = 0; i < gangs_tool.length; i++) {
        gangs_tool[i] = gangs_tool[i].dataValues;
        suma_tools += gangs_tool[i].TOTAL;
    }

    const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,      
        maximumFractionDigits: 2,
     });

    await sequelize.transaction(async (t) => {
        await models.apu_content.update({ TOTAL: formatter.format(suma_tools * 0.05) }, { where: { ID: apu_c.ID }}, { transaction: t });
    });
}

async function deleteTools(idapuc) {
    await sequelize.transaction(async (t) => {
        const item = await models.apu_content.findOne({ where: { ID: idapuc } }, { transaction: t });

        if (item.dataValues.ID_CONTENT != 2) {
            return;
        }

        const item2 = await models.apu_content.findOne({ where: { ID_APU: item.dataValues.ID_APU, ID_CONTENT: 5 } }, { transaction: t });
        await models.apu_content.destroy({ where: { ID: item2.dataValues.ID }}, { transaction: t });
    });
}

//export module
module.exports = router;