'use strict';

module.exports = {
  up(queryInterface) {
    const createRecommendationsTableSql = `
      CREATE TABLE IF NOT EXISTS filterRecommendations (
        id INTEGER AUTO_INCREMENT,

        type TINYINT NOT NULL,

        filterId INTEGER NOT NULL,
        recommendationId INTEGER NOT NULL,

        \`order\` INTEGER NULL,

        createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY filter (filterId) REFERENCES filters (id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY recommendation (recommendationId) REFERENCES recommendations (id) ON DELETE CASCADE ON UPDATE CASCADE,
        PRIMARY KEY (id)
      ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;`.replace(/\s+/ig, ' ').trim();

    return queryInterface.sequelize.query(createRecommendationsTableSql);
  },
  down(queryInterface) {
    return queryInterface.sequelize.query('DROP TABLE IF EXISTS filterRecommendations;');
  }
};
