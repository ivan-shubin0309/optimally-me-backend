'use strict';

module.exports = {
  up(queryInterface) {
    const createRulesLibraryTableSql = `
      CREATE TABLE IF NOT EXISTS rulesLibrary (
        id INTEGER AUTO_INCREMENT,

        name VARCHAR (100) NOT NULL,

        summary TEXT(5000) NULL,
        whatIsIt TEXT(5000) NULL,
        whatAreTheCauses TEXT(5000) NULL,
        whatAreTheRisks TEXT(5000) NULL,
        whatCanYouDo TEXT(5000) NULL,

        interactionsIsOn BOOLEAN NOT NULL DEFAULT FALSE,

        createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;`.replace(/\s+/ig, ' ').trim();

    return queryInterface.sequelize.query(createRulesLibraryTableSql);
  },
  down(queryInterface) {
    return queryInterface.sequelize.query('DROP TABLE IF EXISTS rulesLibrary;');
  }
};
