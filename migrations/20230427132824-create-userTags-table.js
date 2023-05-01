'use strict';

module.exports = {
  up(queryInterface) {
    return queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS userTags (
        id INTEGER AUTO_INCREMENT,
        
        userId INTEGER NOT NULL,
        \`key\` VARCHAR(255) NOT NULL,
        \`type\` VARCHAR(255) NOT NULL,
        value VARCHAR(255) NOT NULL,
        quizType TINYINT NOT NULL,

        createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY user (userId) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE, 
        PRIMARY KEY (id)
      ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;`);
  },
  down(queryInterface) {
    return queryInterface.sequelize.query('DROP TABLE IF EXISTS userTags;');
  }
};
