'use strict'

const { Model } = require('sequelize')

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
    username: {
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
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    resetPasswordLink:{
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue:''
    }
  }, {
    sequelize,
    modelName: 'Users'
  })
  return Users
}
