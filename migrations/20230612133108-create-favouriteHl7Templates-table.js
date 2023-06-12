'use strict';

module.exports = {
  up(queryInterface) {
    return queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS favouriteHl7Templates (
        id INTEGER AUTO_INCREMENT,
        
        hl7TemplateId INTEGER NOT NULL,
        userId INTEGER NOT NULL,

        createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY hl7Template (hl7TemplateId) REFERENCES hl7Templates (id) ON DELETE CASCADE ON UPDATE CASCADE, 
        FOREIGN KEY user (userId) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE, 
        PRIMARY KEY (id)
      ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;`);
  },
  down(queryInterface) {
    return queryInterface.sequelize.query('DROP TABLE IF EXISTS favouriteHl7Templates;');
  }
};
