'use strict'

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const nodeProcess = require('process')
const basename = path.basename(__filename)
const env = nodeProcess.env.NODE_ENV !== undefined ? nodeProcess.env.NODE_ENV : 'development'
const config = require(path.join(__dirname, '/../../config/database.json'))[env]
const db: Record<string, any> = {}

let sequelize: any
if (config.use_env_variable === true) {
  sequelize = new Sequelize(config.url)
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config)
}

fs
  .readdirSync(__dirname)
  .filter((file: any) => {
    return (
      file.indexOf('.') !== 0 &&
        file !== basename &&
        file.slice(-3) === '.ts' &&
        file.indexOf('.test.ts') === -1
    )
  })
  .forEach((file: any) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
    db[model.name] = model
  })

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate !== undefined) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
