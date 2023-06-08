'use strict'

const { Model } = require('sequelize')

module.exports = (sequelize: typeof Sequelize, DataTypes: any): any => {
  class Flights extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models: any): void {
      // define association here
    }
  }
  Flights.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    passenger: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    seat: {
      type: DataTypes.STRING,
      allowNull: false
    },
    airline: {
      type: DataTypes.STRING,
      allowNull: false
    },
    departureLocation: {
      type: DataTypes.STRING,
      allowNull: false
    },
    returnLocation: {
      type: DataTypes.STRING,
      allowNull: false
    },
    departureTime: {
      type: DataTypes.STRING,
      allowNull: false
    },
    returnTime: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dateAvailable: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Flights'
  })
  return Flights
}

export {}
