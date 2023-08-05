'use strict'

const { flightsDummy } = require('../../app/utils/flightsDummy')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Flights', flightsDummy())
  },

  down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Flights', null, {})
  }
}
