'use strict'

const ticketsDummy = require('../../app/utils/ticketsDummy')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Tickets', ticketsDummy())
  },

  down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Tickets', null, {})
  }
}
