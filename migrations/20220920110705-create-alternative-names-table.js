'use strict';

module.exports = {
  up(queryInterface) {
    const createAlternativeNamesTableSql = `
      CREATE TABLE IF NOT EXISTS alternativeNames (
        id INTEGER AUTO_INCREMENT,
        
        biomarkerId INTEGER NOT NULL,
        name VARCHAR (200) NOT NULL,

        createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY biomarker (biomarkerId) REFERENCES biomarkers (id) ON DELETE CASCADE ON UPDATE CASCADE,
        PRIMARY KEY (id)
      ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;`.replace(/\s+/ig, ' ').trim();

    return queryInterface.sequelize.query(createAlternativeNamesTableSql);
  },
  down(queryInterface) {
    return queryInterface.sequelize.query('DROP TABLE IF EXISTS alternativeNames;');
  }
};
