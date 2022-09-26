'use strict';

module.exports = {
  up(queryInterface) {
    const createLibraryFiltersSexTableSql = `
      CREATE TABLE IF NOT EXISTS libraryFiltersSex (
        id INTEGER AUTO_INCREMENT,

        filterId INTEGER NOT NULL,
        sex TINYINT NOT NULL DEFAULT 0 COMMENT '0 - all, 1 - Male, 2 - female',

        createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY filter (filterId) REFERENCES filtersLibrary (id) ON DELETE CASCADE ON UPDATE CASCADE,
        PRIMARY KEY (id)
      ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;`.replace(/\s+/ig, ' ').trim();

    return queryInterface.sequelize.query(createLibraryFiltersSexTableSql);
  },
  down(queryInterface) {
    return queryInterface.sequelize.query('DROP TABLE IF EXISTS libraryFiltersSex;');
  }
};
