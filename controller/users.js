const express = require('express');
const router = express.Router();
var initModels = require("../models/init-models");

var models = initModels(sequelize);

models.User.findAll({ where: { username: "tony" }}).then(...);