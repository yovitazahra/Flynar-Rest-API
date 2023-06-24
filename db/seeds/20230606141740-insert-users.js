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
          name: 'Hans',
          email: 'hansolo.palla2115@gmail.com',
          password: hashPassword,
          phoneNumber: '083117926603',
          otp: 121212,
          isVerified: true,
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
