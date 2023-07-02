'use strict'

const { Model } = require('sequelize')
const Sequelize = require('sequelize')

module.exports = (sequelize: typeof Sequelize, DataTypes: any): any => {
  class Notifications extends Model {
    /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
    static associate (models: any): void {
      // define association here
    }
  }
  Notifications.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      label: {
        type: DataTypes.STRING,
        allowNull: false
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Notifications'
    }
  )
  Notifications.associate = function (models) {
    Notifications.belongsTo(models.Users, {
      foreignKey: 'userId',
      as: 'notification'
    })
  }
  return Notifications
}

export {}
