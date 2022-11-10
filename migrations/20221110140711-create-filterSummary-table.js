'use strict';

module.exports = {
  up(queryInterface) {
    const createBiomarkerFiltersTableSql = `
      CREATE TABLE IF NOT EXISTS filterSummaries (
        id INTEGER AUTO_INCREMENT,
 
        filterId INTEGER NOT NULL,

        criticalLow TEXT(10000) NULL,
        low TEXT(10000) NULL,
        subOptimal TEXT(10000) NULL,
        optimal TEXT(10000) NULL,
        supraOptimal TEXT(10000) NULL,
        high TEXT(10000) NULL,
        criticalHigh TEXT(10000) NULL,

        createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY filter (filterId) REFERENCES filters (id) ON DELETE CASCADE ON UPDATE CASCADE,
        PRIMARY KEY (id)
      ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;`.replace(/\s+/ig, ' ').trim();

    return queryInterface.sequelize.query(createBiomarkerFiltersTableSql);
  },
  down(queryInterface) {
    return queryInterface.sequelize.query('DROP TABLE IF EXISTS filterSummaries;');
  }
};
