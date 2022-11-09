'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS userWefitterSleepSummary (
        id INTEGER AUTO_INCREMENT,
         
        userId INTEGER NOT NULL,
        
        \`timestamp\` TIMESTAMP NULL,
        \`timestampEnd\` TIMESTAMP NULL,
        duration VARCHAR(255) NULL,
        source VARCHAR(255) NOT NULL,
        awake VARCHAR(255) NULL,
        light VARCHAR(255) NULL,
        deep VARCHAR(255) NULL,
        rem VARCHAR(255) NULL,
        sleepScore INTEGER NULL,
        totalTimeInSleep VARCHAR(255) NULL,
        
        createdAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY user (userId) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
        PRIMARY KEY (id)
      ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;`);
  },

  async down(sequelizeInterface) {
    return sequelizeInterface.dropTable('userWefitterSleepSummary');
  }
};
