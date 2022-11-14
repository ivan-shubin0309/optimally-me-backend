'use strict';

module.exports = {
  up(queryInterface) {
    const createBiomarkerFiltersTableSql = `
      CREATE TABLE IF NOT EXISTS studyLinks (
        id INTEGER AUTO_INCREMENT,
 
        filterBulletListId INTEGER NOT NULL,

        content VARCHAR(200) NULL,

        createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY filterBulletList (filterBulletListId) REFERENCES filterBulletLists (id) ON DELETE CASCADE ON UPDATE CASCADE,
        PRIMARY KEY (id)
      ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;`.replace(/\s+/ig, ' ').trim();

    return queryInterface.sequelize.query(createBiomarkerFiltersTableSql);
  },
  down(queryInterface) {
    return queryInterface.sequelize.query('DROP TABLE IF EXISTS studyLinks;');
  }
};
