'use strict'

const { Model } = require('sequelize')
const Sequelize = require('sequelize')

module.exports = (sequelize: typeof Sequelize, DataTypes: any): any => {
  class Tickets extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models: any): void {
      // define association here
    }
  }
  Tickets.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      flightId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      classSeat: {
        type: DataTypes.STRING,
        allowNull: false
      },
      total: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      passengers: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      availableSeat: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      label: {
        type: DataTypes.STRING,
        allowNull: false
      },
      additionalInformation: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Tickets'
    }
  )
  Tickets.associate = function (models) {
    Tickets.belongsTo(models.Flights, {
      foreignKey: 'flightId',
      as: 'flight'
    })
  }
  return Tickets
}

export {}
