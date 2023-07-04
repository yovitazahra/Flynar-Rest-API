'use strict'

const { Model } = require('sequelize')
const Sequelize = require('sequelize')

module.exports = (sequelize: typeof Sequelize, DataTypes: any): any => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models: any): void {
      // define association here
    }
  }
  Users.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    otp: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    // refreshToken: {
    //   type: DataTypes.STRING,
    //   allowNull: true
    // },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ''
    }
  }, {
    sequelize,
    modelName: 'Users'
  })
  Users.associate = function (models) {
    Users.hasMany(models.Checkouts, {
      foreignKey: 'userId'
    })
  }
  return Users
}

export {}
