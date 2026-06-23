const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: '../storage/fritzapp.db'
});
module.exports = sequelize;