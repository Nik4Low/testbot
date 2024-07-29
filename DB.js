const {Sequelize} = require('sequelize');


module.exports = new Sequelize(
    'telega_bot',
    'root',
    'root',
    {
        host: '176.114.64.194',
        port: '5432',
        dialect: 'postgres'
    }
    

)

