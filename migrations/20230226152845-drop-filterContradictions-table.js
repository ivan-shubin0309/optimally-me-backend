'use strict';

module.exports = {
  up(queryInterface) {
    return queryInterface.dropTable('filterContradictions');
  },
  down(queryInterface) {
    return queryInterface.sequelize.query(`
    CREATE TABLE IF NOT EXISTS filterContradictions (
      id INTEGER AUTO_INCREMENT,
       
      filterId INTEGER NOT NULL,

      contradictionType TINYINT NOT NULL,

      createdAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY filter (filterId) REFERENCES filters (id) ON DELETE CASCADE ON UPDATE CASCADE,
      PRIMARY KEY (id)
    ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;`);
  }
};
