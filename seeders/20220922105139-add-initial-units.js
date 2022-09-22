'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('units', [
      {
        id: 1,
        unit: 'umol/L',
      },
      {
        id: 2,
        unit: 'ml/min/1.73m2',
      },
      {
        id: 3,
        unit: 'nmol/L',
      },
      {
        id: 4,
        unit: 'mMol/Mol',
      },
      {
        id: 5,
        unit: 'g/L',
      },
      {
        id: 6,
        unit: 'U/L',
      },
      {
        id: 7,
        unit: 'mmol/L',
      },
      {
        id: 8,
        unit: 'Ratio',
      },
      {
        id: 9,
        unit: 'ug/L',
      },
      {
        id: 10,
        unit: 'pmol/L',
      },
      {
        id: 11,
        unit: 'mIU/L',
      },
      {
        id: 12,
        unit: 'kU/L',
      },
      {
        id: 13,
        unit: 'kIU/L',
      },
      {
        id: 14,
        unit: 'MDRD',
      },
      {
        id: 15,
        unit: '%',
      },
      {
        id: 16,
        unit: 'mm/hour',
      },
      {
        id: 17,
        unit: '10 9/L',
      },
      {
        id: 18,
        unit: '10 12/L',
      },
      {
        id: 19,
        unit: 'L/L',
      },
      {
        id: 20,
        unit: 'pg',
      },
      {
        id: 21,
        unit: 'fL',
      },
      {
        id: 22,
        unit: 'mg/L',
      },
      {
        id: 23,
        unit: 'IU/L',
      },
    ], {});
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('units');
  }
};
