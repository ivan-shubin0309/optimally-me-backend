'use strict';

module.exports = {
  up(queryInterface) {
    return queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS hl7TemplateStatuses (
        id INTEGER AUTO_INCREMENT,
        
        hl7TemplateId INTEGER NOT NULL,
        status TINYINT NOT NULL,

        createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY hl7Template (hl7TemplateId) REFERENCES hl7Templates (id) ON DELETE CASCADE ON UPDATE CASCADE, 
        PRIMARY KEY (id)
      ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;`);
  },
  down(queryInterface) {
    return queryInterface.sequelize.query('DROP TABLE IF EXISTS hl7TemplateStatuses;');
  }
};
