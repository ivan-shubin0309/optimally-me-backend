'use strict';

module.exports = {
  up(queryInterface) {
    return queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS biomarkers (
        id INTEGER AUTO_INCREMENT,
        
        userId INTEGER NOT NULL,
        name VARCHAR(200) NOT NULL UNIQUE,
        ruleId INTEGER NOT NULL,
        unitId INTEGER NOT NULL,
        categoryId INTEGER NOT NULL,

        createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY user (userId) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY biomarkerRule (ruleId) REFERENCES biomarkerRules (id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY category (categoryId) REFERENCES categories (id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY unit (unitId) REFERENCES units (id) ON DELETE CASCADE ON UPDATE CASCADE,
        PRIMARY KEY (id)
      ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;`);
  },
  down(queryInterface) {
    return queryInterface.sequelize.query('DROP TABLE IF EXISTS biomarkers;');
  }
};
