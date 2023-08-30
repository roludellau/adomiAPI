'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
let config
if (fs.existsSync('/etc/secrets/config.json')){
  config = require('/etc/secrets/config.json')['production'];
} else {
  config = require('../config/config.json')['development'];
}


const db: any = {};

let sequelize: any;
try {
  if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
  } else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
  }
} catch (err){
    console.log(err)
    throw err
}



// cet appel permet de synchroniser la base de donnee au models creer, 
// cela permet de creer les differentes tables intermediaires automatiquement grace aux associations
// sequelize.sync()

fs
  .readdirSync(__dirname)
  .filter((file: string) => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach((file: any) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Check la connexion à la bdd

db.sequelize = sequelize
db.Sequelize = Sequelize;

export default db;
