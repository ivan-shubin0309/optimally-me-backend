'use strict';

module.exports = {
  up(queryInterface) {
    const createFiltersOtherFeaturesTableSql = `
      CREATE TABLE IF NOT EXISTS filterOtherFeatures (
        id INTEGER AUTO_INCREMENT,

        filterId INTEGER NOT NULL,
        otherFeature TINYINT NOT NULL DEFAULT 0 COMMENT '0 - None, 1 - Pregnant, 2 - Menopause',

        createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY filter (filterId) REFERENCES filters (id) ON DELETE CASCADE ON UPDATE CASCADE,
        PRIMARY KEY (id)
      ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;`.replace(/\s+/ig, ' ').trim();

    return queryInterface.sequelize.query(createFiltersOtherFeaturesTableSql);
  },
  down(queryInterface) {
    return queryInterface.sequelize.query('DROP TABLE IF EXISTS filterOtherFeatures;');
  }
};
