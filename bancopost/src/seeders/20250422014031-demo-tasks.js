'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tasks', [
      {
        title: 'Reunião com equipe',
        start: new Date('2025-04-22T09:00:00'),
        end: new Date('2025-04-22T10:00:00'),
        details: 'Discutir progresso da sprint',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Treinamento interno',
        start: new Date('2025-04-23T14:00:00'),
        end: new Date('2025-04-23T16:00:00'),
        details: 'Workshop de boas práticas com Sequelize',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Planejamento do mês',
        start: new Date('2025-04-25T11:00:00'),
        end: new Date('2025-04-25T12:30:00'),
        details: 'Definir metas e reuniões do mês',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tasks', null, {})
  }
}
