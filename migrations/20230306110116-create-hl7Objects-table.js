'use strict';

module.exports = {
  up(queryInterface) {
    const createBiomarkerFiltersTableSql = `
      CREATE TABLE IF NOT EXISTS hl7Objects (
        id INTEGER AUTO_INCREMENT, 
        
        userId INTEGER NOT NULL,
 
        lab VARCHAR(255) NULL,
        orderId INTEGER NULL,
        testProductName VARCHAR(255) NULL,
        sampleCode VARCHAR(6) NULL,
        status TINYINT NULL,
        email VARCHAR(129) NULL,
        firstName VARCHAR(20) NULL,
        lastName VARCHAR(20) NULL,
        dateOfBirth DATE NULL,
        sex TINYINT NULL,
        activatedAt DATE NULL,
        sampleAt DATE NULL,
        labReceivedAt DATE NULL,
        resultAt DATE NULL,
        isQuizCompleted BOOLEAN NULL,
        labId VARCHAR(255) NULL,
        abnormalResults VARCHAR(255) NULL,
        failedTests VARCHAR(255) NULL,
        toFollow VARCHAR(255) NULL,

        createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY user (userId) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
        PRIMARY KEY (id)
      ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;`.replace(/\s+/ig, ' ').trim();

    return queryInterface.sequelize.query(createBiomarkerFiltersTableSql);
  },
  down(queryInterface) {
    return queryInterface.sequelize.query('DROP TABLE IF EXISTS hl7Objects;');
  }
};
