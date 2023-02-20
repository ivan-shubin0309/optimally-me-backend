'use strict';

module.exports = {
  up(queryInterface) {
    const createBiomarkerFiltersTableSql = `
      CREATE TABLE IF NOT EXISTS wefitterDiastolicBloodPressure (
        id INTEGER AUTO_INCREMENT,
 
        userId INTEGER NOT NULL,
        \`timestamp\` TIMESTAMP NULL,
        \`timestampEnd\` TIMESTAMP NULL,
        source VARCHAR(255) NOT NULL,
        isManual BOOLEAN NULL,
        value FLOAT NULL,
        unit VARCHAR(255) NULL,

        createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY user (userId) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
        PRIMARY KEY (id)
      ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;`.replace(/\s+/ig, ' ').trim();

    return queryInterface.sequelize.query(createBiomarkerFiltersTableSql);
  },
  down(queryInterface) {
    return queryInterface.sequelize.query('DROP TABLE IF EXISTS wefitterDiastolicBloodPressure;');
  }
};
