'use strict';

module.exports = {
  up(queryInterface) {
    const createFilterEthnicityTableSql = `
      CREATE TABLE IF NOT EXISTS filterEthnicities (
        id INTEGER AUTO_INCREMENT,

        filterId INTEGER NOT NULL,
        ethnicity TINYINT NOT NULL DEFAULT 0 COMMENT '0 - all, 1 - White, 2 - Indian, 3 - Pakistani, 4 - Bangladeshi, 5 - Black Caribbean, 6 - Black African, 7 - Chinese, 8 - Other Asian, 9 - Other ethnic group, 10 - Mixed ethnicity, 11 - None of the above',

        createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY filter (filterId) REFERENCES filters (id) ON DELETE CASCADE ON UPDATE CASCADE,
        PRIMARY KEY (id)
      ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;`.replace(/\s+/ig, ' ').trim();

    return queryInterface.sequelize.query(createFilterEthnicityTableSql);
  },
  down(queryInterface) {
    return queryInterface.sequelize.query('DROP TABLE IF EXISTS filterEthnicities;');
  }
};
