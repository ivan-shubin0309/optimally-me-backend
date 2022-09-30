'use strict';

module.exports = {
  up(queryInterface) {
    const createInteractionsTableSql = `
      CREATE TABLE IF NOT EXISTS interactions (
        id INTEGER AUTO_INCREMENT,

        filterId INTEGER NOT NULL,

        type TINYINT NOT NULL COMMENT '1 - medication, 2 - supplement',
        name VARCHAR (100) NULL,
        alsoKnowAs VARCHAR (100) NULL,
        impact TINYINT NULL,
        effects VARCHAR(5000) NULL,

        createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY filter (filterId) REFERENCES filters (id) ON DELETE CASCADE ON UPDATE CASCADE,
        PRIMARY KEY (id)
      ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;`.replace(/\s+/ig, ' ').trim();

    return queryInterface.sequelize.query(createInteractionsTableSql);
  },
  down(queryInterface) {
    return queryInterface.sequelize.query('DROP TABLE IF EXISTS interactions;');
  }
};
