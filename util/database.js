// const pgsql = require("pg")

// const pool = new pgsql.Pool({
//     host: "localhost",
//     user: "postgres",
//     port: 5432,
//     password: "jafferali",
//     database: "firstNodeApp"
// })

// pool.connect()

// module.exports = pool;

const Sequelize = require('sequelize');

const sequelize = new Sequelize('firstNodeApp', 'postgres', 'jafferali', { host: 'localhost', dialect: 'postgres' });
// (async ()=>{
// try {
//     await sequelize.authenticate();
//     console.log('Connection has been established successfully.');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }})()

module.exports = sequelize