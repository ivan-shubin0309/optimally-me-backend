'use strict';

module.exports = {
  up(queryInterface) {
    return queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS files (
        id INTEGER AUTO_INCREMENT,
        
        userId INTEGER NOT NULL, 
        
        name VARCHAR(255) NOT NULL,
        fileKey VARCHAR(255) NOT NULL,
        status TINYINT NOT NULL DEFAULT 1 COMMENT '1 - pending, 2 - loaded', 
        type TINYINT NOT NULL,
        isUsed BOOLEAN NOT NULL DEFAULT false,
        isResized BOOLEAN NOT NULL DEFAULT false,

        createdAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY user (userId) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
        PRIMARY KEY (id)
      ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;`);
  },
  down(sequelizeInterface) {
    return sequelizeInterface.dropTable('files');
  }
};
