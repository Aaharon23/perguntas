const Sequelize = require('sequelize');

const connection = new Sequelize('guiaperguntas', 'root', 'fal762M16**',{
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;
