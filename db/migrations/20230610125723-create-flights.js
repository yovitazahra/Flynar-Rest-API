'use strict'
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Flights', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      flightCode: {
        type: Sequelize.STRING,
        allowNull: false
      },
      airline: {
        type: Sequelize.STRING,
        allowNull: false
      },
      airlineCode: {
        type: Sequelize.STRING,
        allowNull: false
      },
      departureAirport: {
        type: Sequelize.STRING,
        allowNull: false
      },
      arrivalAirport: {
        type: Sequelize.STRING,
        allowNull: false
      },
      departureCity: {
        type: Sequelize.STRING,
        allowNull: false
      },
      arrivalCity: {
        type: Sequelize.STRING,
        allowNull: false
      },
      departureDate: {
        type: Sequelize.STRING,
        allowNull: false
      },
      departureTime: {
        type: Sequelize.STRING,
        allowNull: false
      },
      arrivalTime: {
        type: Sequelize.STRING,
        allowNull: false
      },
      duration: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    })
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Flights')
  }
}
