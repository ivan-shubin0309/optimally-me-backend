'use strict';

module.exports = {
  up(queryInterface) {
    return queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS recommendationFiles (
        id INTEGER AUTO_INCREMENT,
        
        fileId INTEGER NOT NULL, 
        recommendationId INTEGER NOT NULL, 

        createdAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY file (fileId) REFERENCES files (id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY recommendation (recommendationId) REFERENCES recommendations (id) ON DELETE CASCADE ON UPDATE CASCADE,
        PRIMARY KEY (id)
      ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;`);
  },
  down(sequelizeInterface) {
    return sequelizeInterface.dropTable('recommendationFiles');
  }
};
