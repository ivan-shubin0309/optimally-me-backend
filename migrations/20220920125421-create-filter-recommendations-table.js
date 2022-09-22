'use strict';

module.exports = {
  up(queryInterface) {
    const createRecommendationsFilterTableSql = `
      CREATE TABLE IF NOT EXISTS recommendationsFilter (
        id INTEGER AUTO_INCREMENT,

        filterId INTEGER NOT NULL,
        biomarkerId INTEGER NOT NULL,
        recommendationId INTEGER NOT NULL,
        type TINYINT NOT NULL COMMENT '1 - criticalLow, 2 - low, 3 - high, 4 - criticalHigh',
        recommendationOrder TINYINT NOT NULL,

        createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY biomarkerFilter (filterId) REFERENCES biomarkerFilters (id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY recommendation (recommendationId) REFERENCES recommendations (id) ON DELETE CASCADE ON UPDATE CASCADE,
        PRIMARY KEY (id)
      ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;`.replace(/\s+/ig, ' ').trim();

    return queryInterface.sequelize.query(createRecommendationsFilterTableSql);
  },
  down(queryInterface) {
    return queryInterface.sequelize.query('DROP TABLE IF EXISTS recommendationsFilter;');
  }
};
