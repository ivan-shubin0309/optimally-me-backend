'use strict';

module.exports = {
  up(queryInterface) {
    const createUnitsTableSql = `
      CREATE TABLE IF NOT EXISTS units (
        id INTEGER AUTO_INCREMENT,

        unit VARCHAR (250) NOT NULL,

        createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;`.replace(/\s+/ig, ' ').trim();

    return queryInterface.sequelize.query(createUnitsTableSql);
  },
  down(queryInterface) {
    return queryInterface.sequelize.query('DROP TABLE IF EXISTS units;');
  }
};
