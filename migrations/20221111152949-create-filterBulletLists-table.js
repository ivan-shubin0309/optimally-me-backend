'use strict';

module.exports = {
  up(queryInterface) {
    const createBiomarkerFiltersTableSql = `
      CREATE TABLE IF NOT EXISTS filterBulletLists (
        id INTEGER AUTO_INCREMENT,
 
        filterId INTEGER NOT NULL,

        content TEXT(10000) NOT NULL,
        type TINYINT NOT NULL,

        createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY filter (filterId) REFERENCES filters (id) ON DELETE CASCADE ON UPDATE CASCADE,
        PRIMARY KEY (id)
      ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;`.replace(/\s+/ig, ' ').trim();

    return queryInterface.sequelize.query(createBiomarkerFiltersTableSql);
  },
  down(queryInterface) {
    return queryInterface.sequelize.query('DROP TABLE IF EXISTS filterBulletLists;');
  }
};
