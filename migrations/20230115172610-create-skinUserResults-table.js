'use strict';

module.exports = {
  up(queryInterface) {
    return queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS skinUserResults (
        id INTEGER AUTO_INCREMENT,
         
        userHautAiFieldId INTEGER NOT NULL,

        hautAiBatchId VARCHAR(255) NULL,
        hautAiFileId VARCHAR(255) NULL,
        itaScore UNSIGNED INTEGER NULL,
        status TINYINT NOT NULL DEFAULT 1,

        createdAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY userHautAiField (userHautAiFieldId) REFERENCES userHautAiFields (id) ON DELETE CASCADE ON UPDATE CASCADE,
        PRIMARY KEY (id)
      ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;`);
  },
  down(sequelizeInterface) {
    return sequelizeInterface.dropTable('skinUserResults');
  }
};
