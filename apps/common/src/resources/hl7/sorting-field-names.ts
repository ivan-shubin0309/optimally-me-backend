import sequelize from 'sequelize';

export const sortingFieldNames = [
    'createdAt',
    'activatedAt',
    'sampleAt',
    'labReceivedAt',
    'resultAt',
    'name'
];

export const hl7SortingServerValues = {
    'createdAt': 'createdAt',
    'activatedAt': 'activatedAt',
    'sampleAt': 'sampleAt',
    'labReceivedAt': 'labReceivedAt',
    'resultAt': 'resultAt',
    'name': sequelize.literal('CONCAT(`firstName`, `lastName`)'),
};