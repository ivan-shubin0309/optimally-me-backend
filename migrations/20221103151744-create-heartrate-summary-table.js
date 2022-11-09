'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS userWefitterHeartrateSummary (
        id INTEGER AUTO_INCREMENT,
         
        userId INTEGER NOT NULL,
        
        \`timestamp\` TIMESTAMP NULL,
        source VARCHAR(255) NULL,
        duration VARCHAR(255) NULL,
        \`min\` INTEGER NULL,
        \`max\` INTEGER NULL,
        average INTEGER NULL,
        resting INTEGER NULL,
        
        createdAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY user (userId) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
        PRIMARY KEY (id)
      ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;`);
  },

  async down(sequelizeInterface) {
    return sequelizeInterface.dropTable('userWefitterHeartrateSummary');
  }
};
