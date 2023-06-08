'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Flights', [
      {
        price: 2450000,
        passenger: 4,
        seat: 'bussinese',
        airline: 'fly emirates',
        departureLocation: 'uni emirates arab',
        returnLocation: 'sultan hassanudin airport',
        departureTime: 'jumat, 09 juni 2023',
        returnTime: 'minggu, 11 juni 2023',
        dateAvailable: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        price: 350000,
        passenger: 5,
        seat: 'economy',
        airline: 'etihad emirates',
        departureLocation: 'uni emirates arab',
        returnLocation: 'soekarno hatta airport',
        departureTime: 'rabu, 06 juni 2023',
        returnTime: 'sabtu, 10 juni 2023',
        dateAvailable: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        price: 140000,
        passenger: 4,
        seat: 'first class',
        airline: 'nippon airways',
        departureLocation: 'tokyo airport',
        returnLocation: 'soekarno hatta airport',
        departureTime: 'jumat, 09 juni 2023',
        returnTime: 'sabtu, 10 juni 2023',
        dateAvailable: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Flights', null, {})
  }
}
