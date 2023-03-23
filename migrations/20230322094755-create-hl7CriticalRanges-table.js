'use strict';

module.exports = {
  up(queryInterface) {
    return queryInterface.sequelize.query(`
        CREATE TABLE IF NOT EXISTS hl7CriticalRanges (
          id INTEGER AUTO_INCREMENT,
  
          name VARCHAR(255) NOT NULL,
          minRange DECIMAL(19, 9) NULL,
          maxRange DECIMAL(19, 9) NULL,
          reportingUnits VARCHAR(255) NOT NULL,

          createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,

          PRIMARY KEY (id)
        ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;
      `.replace(/\s+/ig, ' ').trim()
    );
  },
  down(queryInterface) {
    return queryInterface.sequelize.query('DROP TABLE IF EXISTS hl7CriticalRanges;');
  }
};
