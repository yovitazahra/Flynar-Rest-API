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
    flightCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    airline: {
      type: DataTypes.STRING,
      allowNull: false
    },
    departureAirport: {
      type: DataTypes.STRING,
      allowNull: false
    },
    arrivalAirport: {
      type: DataTypes.STRING,
      allowNull: false
    },
    departureCity: {
      type: DataTypes.STRING,
      allowNull: false
    },
    arrivalCity: {
      type: DataTypes.STRING,
      allowNull: false
    },
    departureDate: {
      type: DataTypes.STRING,
      allowNull: false
    },
    arrivalDate: {
      type: DataTypes.STRING,
      allowNull: false
    },
    departureTime: {
      type: DataTypes.STRING,
      allowNull: false
    },
    arrivalTime: {
      type: DataTypes.STRING,
      allowNull: false
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false
    },
    economyPrice: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    economyCapacity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    premiumEconomyPrice: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    premiumEconomyCapacity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    businessPrice: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    businessCapacity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    firstClassPrice: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    firstClassCapacity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    additionalInformation: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Flights'
  })
  return Flights
}

export {}
