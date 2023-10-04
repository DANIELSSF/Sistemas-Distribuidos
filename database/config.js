const { Sequelize } = require('sequelize');

const database = new Sequelize('db_subjects', 'university', '123456', {
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = database;
