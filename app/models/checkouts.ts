'use strict'
const { Model } = require('sequelize')
const Sequelize = require('sequelize')
module.exports = (sequelize: typeof Sequelize, DataTypes: any): any => {
  class Checkouts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models: any): void {
      // define association here
    }
  }
  Checkouts.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      familyName: {
        type: DataTypes.STRING
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      total: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      ticketId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Checkouts'
    }
  )
  Checkouts.associate = function (models) {
    Checkouts.belongsTo(models.Tickets, {
      as: 'ticket',
      foreignKey: 'ticketId'
    })
  }
  return Checkouts
}