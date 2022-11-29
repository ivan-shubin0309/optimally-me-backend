'use strict';

module.exports = {
  up(queryInterface) {
    return queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS impactStudyLinks (
        id INTEGER AUTO_INCREMENT,
         
        recommendationImpactId INTEGER NOT NULL,

        content VARCHAR(200) NULL,
        type TINYINT NOT NULL,

        createdAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY recommendationImpact (recommendationImpactId) REFERENCES recommendationImpacts (id) ON DELETE CASCADE ON UPDATE CASCADE,
        PRIMARY KEY (id)
      ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;`);
  },
  down(sequelizeInterface) {
    return sequelizeInterface.dropTable('impactStudyLinks');
  }
};
