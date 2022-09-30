'use strict';

module.exports = {
  up(queryInterface) {
    const createFilterAgeTableSql = `
      CREATE TABLE IF NOT EXISTS filterAges (
        id INTEGER AUTO_INCREMENT,

        filterId INTEGER NOT NULL,
        age TINYINT NOT NULL DEFAULT 0 COMMENT '0 - all, 1 - 0-19, 2 - 20-50, 3 - 50-59, 4 - >60, 5 - 50>, 6 - <50',

        createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY filter (filterId) REFERENCES filters (id) ON DELETE CASCADE ON UPDATE CASCADE,
        PRIMARY KEY (id)
      ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;`.replace(/\s+/ig, ' ').trim();

    return queryInterface.sequelize.query(createFilterAgeTableSql);
  },
  down(queryInterface) {
    return queryInterface.sequelize.query('DROP TABLE IF EXISTS filterAges;');
  }
};
