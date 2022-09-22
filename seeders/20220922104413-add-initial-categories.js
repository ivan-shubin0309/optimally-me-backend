'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('categories', [
      {
        id: 1,
        name: 'Biomechanics',
      },
      {
        id: 2,
        name: 'Biochemistry',
      },
      {
        id: 3,
        name: 'Lipids',
      },
      {
        id: 4,
        name: 'Kidney Function',
      },
      {
        id: 5,
        name: 'Testosterone',
      },
      {
        id: 6,
        name: 'Liver function tests',
      },
      {
        id: 7,
        name: 'Hematology',
      },
      {
        id: 8,
        name: 'Thyroid',
      },
    ], {});
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('categories');
  }
};
