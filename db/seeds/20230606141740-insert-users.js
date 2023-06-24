'use strict'
/** @type {import('sequelize-cli').Migration} */

const bcryptjs = require('bcryptjs')

module.exports = {
  async up (queryInterface, Sequelize) {
    const salt = await bcryptjs.genSalt()
    const hashPassword = await bcryptjs.hash('hansFlynarADMIN123', salt)

    await queryInterface.bulkInsert(
      'Users',
      [
        {
          username: 'Hans',
          email: 'hansolo.palla2115@gmail.com',
          password: hashPassword,
          firstName: 'Hans',
          lastName: 'Rio',
          phoneNumber: '083117926603',
          resetPasswordToken: '',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          username: 'Gilang Maulana',
          email: 'gilangmaulana541@gmail.com',
          password: hashPassword,
          firstName: 'Gilang',
          lastName: 'Maulana',
          phoneNumber: '08987676762',
          resetPasswordToken: '',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
}
