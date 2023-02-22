'use strict';

module.exports = {
  up(queryInterface) {
    const createBiomarkerFiltersTableSql = `
      CREATE TABLE IF NOT EXISTS userWidgetSettings (
        id INTEGER AUTO_INCREMENT,
 
        userId INTEGER NOT NULL,
        widgetType TINYINT NOT NULL,
        \`order\` INTEGER NULL,

        createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY user (userId) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
        PRIMARY KEY (id)
      ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;`.replace(/\s+/ig, ' ').trim();

    return queryInterface.sequelize.query(createBiomarkerFiltersTableSql);
  },
  down(queryInterface) {
    return queryInterface.sequelize.query('DROP TABLE IF EXISTS userWidgetSettings;');
  }
};
