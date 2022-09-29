'use strict';

module.exports = {
  up(queryInterface) {
    const createCategoriesTableSql = `
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER AUTO_INCREMENT,
        
        name VARCHAR (250) NOT NULL,

        createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;`.replace(/\s+/ig, ' ').trim();

    return queryInterface.sequelize.query(createCategoriesTableSql);
  },
  down(queryInterface) {
    return queryInterface.sequelize.query('DROP TABLE IF EXISTS categories;');
  }
};
