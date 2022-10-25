'use strict';

module.exports = {
  async up (queryInterface) {
    return queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS userWefitterDailySummary (
        id INTEGER AUTO_INCREMENT,
         
        userId INTEGER NOT NULL,

        date DATE NOT NULL,
        distance INTEGER NULL,
        steps INTEGER NULL,
        calories INTEGER NULL,
        activeCalories INTEGER NULL,
        bmrCalories INTEGER NULL,
        points INTEGER NULL,
        source VARCHAR(255) NOT NULL,
        
        heartRateSummaryMin INTEGER NULL,
        heartRateSummaryMax INTEGER NULL,
        heartRateSummaryAverage INTEGER NULL,
        heartRateSummaryResting INTEGER NULL,
        
        stressQualifier VARCHAR(255) NOT NULL,
        averageStressLevel INTEGER NULL,
        maxStressLevel INTEGER NULL,
        restStressDuration VARCHAR(255) NULL,
        lowStressDuration VARCHAR(255) NULL,
        mediumStressDuration VARCHAR(255) NULL,
        highStressDuration VARCHAR(255) NULL,
        stressDuration VARCHAR(255) NULL,
        
        createdAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY user (userId) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
        PRIMARY KEY (id)
      ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;`);
  },

  async down (sequelizeInterface) {
    return sequelizeInterface.dropTable('userWefitterDailySummary');
  }
};
