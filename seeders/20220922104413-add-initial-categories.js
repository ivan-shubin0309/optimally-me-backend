'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('categories', [
      {
        id: 1,
        name: 'Biochemistry',
      },
      {
        id: 2,
        name: 'Liver Function',
      },
      {
        id: 3,
        name: 'Cholesterol (Lipids)',
      },
      {
        id: 4,
        name: 'Haematinics',
      },
      {
        id: 5,
        name: 'Thyroid Function',
      },
      {
        id: 6,
        name: 'Vitamins',
      },
      {
        id: 7,
        name: 'Hormones',
      },
      {
        id: 8,
        name: 'Kidney Function',
      },
      {
        id: 9,
        name: 'Full Blood Count',
      },
      {
        id: 10,
        name: 'Bone Screen',
      },
      {
        id: 11,
        name: 'Minerals',
      },
      {
        id: 12,
        name: 'Skin',
      },
    ], {});
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('categories', {
      where: {
        id: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
      }
    });
  }
};
