'use strict';

module.exports = {
    async up(queryInterface) {
        return queryInterface.sequelize.query(`
            ALTER TABLE hl7Objects
                ADD COLUMN statusFileAt DATETIME NULL,
                ADD COLUMN resultFileAt DATETIME NULL;
        `);
    },

    async down(queryInterface) {
        return queryInterface.sequelize.query(`
            ALTER TABLE hl7Objects
                DROP COLUMN statusFileAt,
                DROP COLUMN resultFileAt;
    `);
    }
};
