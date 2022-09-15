'use strict';

module.exports = {
  up(queryInterface) {
    const createUsersTableSql = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER AUTO_INCREMENT,
        
        email VARCHAR(129) NOT NULL UNIQUE,
        password VARCHAR(255) NULL,
        username VARCHAR (255) NULL,
        salt VARCHAR(255) NULL,
        role TINYINT NOT NULL COMMENT '1 - user, 2 - admin',

        createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;`.replace(/\s+/ig, ' ').trim();

    return queryInterface.sequelize.query(createUsersTableSql);
  },
  down(queryInterface) {
    return queryInterface.sequelize.query('DROP TABLE IF EXISTS users;');
  }
};
