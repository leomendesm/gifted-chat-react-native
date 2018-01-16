const Sequelize = require('sequelize');
const sequelize = new Sequelize('chat', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
});

// sequelize
// .sync({force: true})
// .then( () => {
//   console.log('Connection has been established successfully.');
// })

module.exports = sequelize