// const db = require('../util/database')

// module.exports = class Product {
//   constructor(id, title, imageUrl, description, price) {
//     this.id = id;
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.price = price;
//   }

//   save() {
//     return db.query(`INSERT INTO "products" ("title", "price", "imageUrl", "description") VALUES ($1, $2, $3, $4)`, [this.title, this.price, this.imageUrl, this.description])
//   }

//   static deleteById() {
//   }

//   static fetchAll() {
//     return db.query(`SELECT * FROM products`)
//   }

//   static findById(id) { 
//     return db.query(`SELECT * FROM products WHERE products.id = $1`,[id])
//   }
// };

const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Product = sequelize.define('product', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  title: Sequelize.STRING,
  price:{
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  imageUrl:{
    type: Sequelize.STRING,
    allowNull: false
  },
  description:{
    type: Sequelize.STRING,
    allowNull: false
  }
})

module.exports = Product;