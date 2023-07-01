'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Checkouts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fullName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      familyName: {
        type: Sequelize.STRING
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      total: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      isRoundTrip: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      ticketId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      departureSeat: {
        type: Sequelize.STRING,
        allowNull: false
      },
      returnSeat: {
        type: Sequelize.STRING,
        allowNull: false
      },
      passengersData: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Checkouts')
  }
}
