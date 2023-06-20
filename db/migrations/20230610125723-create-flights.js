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
      arrivalDate: {
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
      // label: {
      //   type: Sequelize.STRING,
      //   allowNull: false
      // },
      // economyPrice: {
      //   type: Sequelize.INTEGER,
      //   allowNull: false
      // },
      // economyCapacity: {
      //   type: Sequelize.INTEGER,
      //   allowNull: false
      // },
      // premiumEconomyPrice: {
      //   type: Sequelize.INTEGER,
      //   allowNull: false
      // },
      // premiumEconomyCapacity: {
      //   type: Sequelize.INTEGER,
      //   allowNull: false
      // },
      // businessPrice: {
      //   type: Sequelize.INTEGER,
      //   allowNull: false
      // },
      // businessCapacity: {
      //   type: Sequelize.INTEGER,
      //   allowNull: false
      // },
      // firstClassPrice: {
      //   type: Sequelize.INTEGER,
      //   allowNull: false
      // },
      // firstClassCapacity: {
      //   type: Sequelize.INTEGER,
      //   allowNull: false
      // },
      // additionalInformation: {
      //   type: Sequelize.STRING,
      //   allowNull: false
      // },
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
    await queryInterface.dropTable('Flights')
  }
}
