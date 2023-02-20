'use strict';

module.exports = {
    async up(queryInterface) {
        return queryInterface.dropTable('userWefitterStressSummary');
    },

    async down(queryInterface) {
        return queryInterface.sequelize.query(`
            CREATE TABLE IF NOT EXISTS userWefitterStressSummary (
            id INTEGER AUTO_INCREMENT,
            
            userId INTEGER NOT NULL,
            dailySummaryId INTEGER NULL,
            
            \`timestamp\` TIMESTAMP NULL,
            duration VARCHAR(255) NULL,
            source VARCHAR(255) NOT NULL,
            stressQualifier VARCHAR(255) NULL,
            averageStressLevel INTEGER NULL,
            maxStressLevel INTEGER NULL,
            restStressDuration VARCHAR(255) NULL,
            lowStressDuration VARCHAR(255) NULL,
            mediumStressDuration VARCHAR(255) NULL,
            highStressDuration VARCHAR(255) NULL,
            stressDuration VARCHAR(255) NULL,
            
            createdAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    
            FOREIGN KEY user (userId) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
            FOREIGN KEY dailySummary (dailySummaryId) REFERENCES userWefitterDailySummary (id) ON DELETE CASCADE ON UPDATE CASCADE,
            PRIMARY KEY (id)
            ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;`
        );
    }
};
