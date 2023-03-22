'use strict';

module.exports = {
    up: async (queryInterface) => {
        await queryInterface.bulkInsert('hl7CriticalRanges', [
            {
                id: 1,
                name: 'ALT',
                maxRange: 400,
                minRange: null,
                reportingUnits: 'U/L'
            },
            {
                id: 2,
                name: 'AST',
                maxRange: 400,
                minRange: null,
                reportingUnits: 'U/L'
            },
            {
                id: 3,
                name: 'Creatine kinase (CK)',
                maxRange: 5000,
                minRange: null,
                reportingUnits: 'U/L'
            },
            {
                id: 4,
                name: 'Adjusted Calcium',
                maxRange: 3.0,
                minRange: 1.8,
                reportingUnits: 'mmol/L'
            },
            {
                id: 5,
                name: 'Cortisol',
                maxRange: null,
                minRange: 100,
                reportingUnits: 'nmol/L'
            },
            {
                id: 6,
                name: 'Creatinine',
                maxRange: 354,
                minRange: null,
                reportingUnits: 'µmol/L'
            },
            {
                id: 7,
                name: 'CRP/HsCRP',
                maxRange: 300,
                minRange: null,
                reportingUnits: 'mg/L'
            },
            {
                id: 8,
                name: 'eGFR',
                maxRange: null,
                minRange: 30,
                reportingUnits: 'ml/min/1.73m^2'
            },
            {
                id: 9,
                name: 'Glucose',
                maxRange: 25,
                minRange: 2.5,
                reportingUnits: 'mmol/L'
            },
            {
                id: 10,
                name: 'Haemoglobin',
                maxRange: 200,
                minRange: 100,
                reportingUnits: 'g/L'
            },
            {
                id: 11,
                name: 'HDL',
                maxRange: 5,
                minRange: null,
                reportingUnits: 'mmol/L'
            },
            {
                id: 12,
                name: 'Iron',
                maxRange: 50,
                minRange: null,
                reportingUnits: 'µmol/L'
            },
            {
                id: 13,
                name: 'Magnesium',
                maxRange: null,
                minRange: 0.4,
                reportingUnits: 'mmol/L'
            },
            {
                id: 14,
                name: 'Phosphate',
                maxRange: null,
                minRange: 0.3,
                reportingUnits: 'mmol/L'
            },
            {
                id: 15,
                name: 'Platelets',
                maxRange: 800,
                minRange: 100,
                reportingUnits: 'x10^9/L'
            },
            {
                id: 16,
                name: 'Potassium',
                maxRange: 6,
                minRange: 2.5,
                reportingUnits: 'mmol/L'
            },
            {
                id: 17,
                name: 'Sodium',
                maxRange: 160,
                minRange: 120,
                reportingUnits: 'mmol/L'
            },
            {
                id: 18,
                name: 'Total Bilirubin',
                maxRange: 25,
                minRange: 0,
                reportingUnits: 'µmol/L'
            },
            {
                id: 19,
                name: 'Triglycerides',
                maxRange: 20,
                minRange: null,
                reportingUnits: 'mmol/L'
            },
            {
                id: 20,
                name: 'Troponin',
                maxRange: null,
                minRange: null,
                reportingUnits: 'ng/L'
            },
            {
                id: 21,
                name: 'Urea',
                maxRange: 30,
                minRange: null,
                reportingUnits: 'mmol/L'
            },
            {
                id: 22,
                name: 'Uric Acid',
                maxRange: 340,
                minRange: 0,
                reportingUnits: 'µmol/L'
            },
        ], {});
    },
    down: async (queryInterface) => {
        await queryInterface.bulkDelete('hl7CriticalRanges', {
            where: {
                id: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
            }
        });
    }
};
