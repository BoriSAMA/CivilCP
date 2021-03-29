const { Sequelize } = require('sequelize');
require('dotenv/config');

//connect to db
const sequelize = new Sequelize(
                        process.env.DB_NAME,
                        process.env.DB_USER,
                        process.env.DB_PASS,
                        {
                            host: process.env.DB_HOST,
                            dialect: 'mysql',
                            logging: true,
                        });

/*
sequelize.authenticate()
		.then(() => {console.info('INFO - Database connected.')})
		.catch(err => { console.error('ERROR - Unable to connect to the database:', err)});

sequelize.close();
*/
module.exports = sequelize;
