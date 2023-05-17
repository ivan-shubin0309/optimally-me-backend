'use strict';

module.exports = {
  up(queryInterface) {
    return queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS hl7Templates (
        id INTEGER AUTO_INCREMENT,
        
        userId INTEGER NOT NULL,
        isPrivate BOOLEAN NOT NULL,
        name VARCHAR(100) NOT NULL,
        dateOfBirthStart DATE NULL,
        dateOfBirthEnd DATE NULL,
        activatedAtStartDate DATETIME NULL,
        activatedAtEndDate DATETIME NULL,
        activatedAtFilterType TINYINT NULL,
        sampleAtStartDate DATETIME NULL,
        sampleAtEndDate DATETIME NULL,
        sampleAtFilterType TINYINT NULL,
        labReceivedAtStartDate DATETIME NULL,
        labReceivedAtEndDate DATETIME NULL,
        labReceivedAtFilterType TINYINT NULL,
        resultAtStartDate DATETIME NULL,
        resultAtEndDate DATETIME NULL,
        resultAtFilterType TINYINT NULL,
        status TINYINT NULL,
        searchString VARCHAR(255) NULL,

        createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY user (userId) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE, 
        PRIMARY KEY (id)
      ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;`);
  },
  down(queryInterface) {
    return queryInterface.sequelize.query('DROP TABLE IF EXISTS hl7Templates;');
  }
};
