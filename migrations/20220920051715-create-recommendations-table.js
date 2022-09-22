'use strict';

module.exports = {
  up(queryInterface) {
    const createRecommendationsTableSql = `
      CREATE TABLE IF NOT EXISTS recommendations (
        id INTEGER AUTO_INCREMENT,

        category TINYINT NOT NULL DEFAULT 1 COMMENT '1 - diet, 2 - lifestyle, 3 - supplements, 4 - doctor, 5 - tests',
        content VARCHAR (250) NULL,

        createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;`.replace(/\s+/ig, ' ').trim();

    return queryInterface.sequelize.query(createRecommendationsTableSql);
  },
  down(queryInterface) {
    return queryInterface.sequelize.query('DROP TABLE IF EXISTS recommendations;');
  }
};
