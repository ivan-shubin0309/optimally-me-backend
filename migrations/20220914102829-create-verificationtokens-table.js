'use strict';

module.exports = {
  up(queryInterface) {
    return queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS verificationTokens (
        id INTEGER AUTO_INCREMENT,
        
        userId INTEGER NOT NULL, 
        
        token  VARCHAR(255) NOT NULL,
        
        isUsed BOOLEAN NOT NULL DEFAULT false,             
        type TINYINT NOT NULL DEFAULT 1 COMMENT '1 - password',

        createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY user (userId) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE, 
        PRIMARY KEY (id)
      ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;`);
  },
  down(queryInterface) {
    return queryInterface.sequelize.query('DROP TABLE IF EXISTS verificationTokens;');
  }
};
