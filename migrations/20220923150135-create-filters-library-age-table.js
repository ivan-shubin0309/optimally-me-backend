'use strict';

module.exports = {
  up(queryInterface) {
    const createLibraryFiltersAgeTableSql = `
      CREATE TABLE IF NOT EXISTS libraryFiltersAge (
        id INTEGER AUTO_INCREMENT,

        filterId INTEGER NOT NULL,
        age TINYINT NOT NULL DEFAULT 0 COMMENT '0 - all, 1 - 0-19, 2 - 20-50, 3 - 50-59, 4 - >60, 5 - 50>, 6 - <50',

        createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY filter (filterId) REFERENCES filtersLibrary (id) ON DELETE CASCADE ON UPDATE CASCADE,
        PRIMARY KEY (id)
      ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;`.replace(/\s+/ig, ' ').trim();

    return queryInterface.sequelize.query(createLibraryFiltersAgeTableSql);
  },
  down(queryInterface) {
    return queryInterface.sequelize.query('DROP TABLE IF EXISTS libraryFiltersAge;');
  }
};
