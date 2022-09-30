'use strict';

module.exports = {
  up(queryInterface) {
    const createBiomarkerFiltersTableSql = `
      CREATE TABLE IF NOT EXISTS filters (
        id INTEGER AUTO_INCREMENT,
 
        biomarkerId INTEGER NOT NULL,

        name VARCHAR (200) NOT NULL,
        criticalLow FLOAT NULL,
        lowMin FLOAT NULL,
        lowMax FLOAT NULL,
        subOptimalMin FLOAT NULL,
        subOptimalMax FLOAT NULL,
        optimalMin FLOAT NULL,
        optimalMax FLOAT NULL,
        supraOptimalMin FLOAT NULL,
        supraOptimalMax FLOAT NULL,
        highMin FLOAT NULL,
        highMax FLOAT NULL,
        criticalHigh FLOAT NULL,

        createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY biomarker (biomarkerId) REFERENCES biomarkers (id) ON DELETE CASCADE ON UPDATE CASCADE,
        PRIMARY KEY (id)
      ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;`.replace(/\s+/ig, ' ').trim();

    return queryInterface.sequelize.query(createBiomarkerFiltersTableSql);
  },
  down(queryInterface) {
    return queryInterface.sequelize.query('DROP TABLE IF EXISTS filters;');
  }
};
