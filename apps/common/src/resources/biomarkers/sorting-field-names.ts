export const sortingFieldNames = [
    'createdAt',
    'name',
    'categoryName'
];

export const sortingServerValues = {
    'createdAt': 'createdAt',
    'name': () => 'name',
    'categoryName': '$category.name$'
};
