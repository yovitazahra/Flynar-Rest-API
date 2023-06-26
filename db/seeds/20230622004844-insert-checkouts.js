'use strict'
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Checkouts',
      [
        {
          fullName: 'Hans Rio',
          familyName: 'Alfredo Palla',
          phoneNumber: '083117926603',
          email: 'hansolo.palla2115@gmail.com',
          price: 11900000,
          total: 2,
          status: 'Unpaid',
          userId: 1,
          ticketId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          fullName: 'Han',
          familyName: 'Palla',
          phoneNumber: '083117926603',
          email: 'hantheclasssick@gmail.com',
          price: 5950000,
          total: 1,
          status: 'Unpaid',
          userId: 2,
          ticketId: 1,
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
