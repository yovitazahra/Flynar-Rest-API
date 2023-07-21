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
        allowNull: true
      },
      familyName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true
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
      isRoundTrip: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      ticketId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      departureSeat: {
        type: DataTypes.STRING,
        allowNull: true
      },
      returnSeat: {
        type: DataTypes.STRING,
        allowNull: true
      },
      passengersData: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'Checkouts'
    }
  )
  return Checkouts
}
