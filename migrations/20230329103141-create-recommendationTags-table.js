'use strict';

module.exports = {
    up(queryInterface) {
        return queryInterface.sequelize.query(`
            CREATE TABLE IF NOT EXISTS recommendationTags (
                id INTEGER AUTO_INCREMENT,
                
                recommendationId INTEGER NOT NULL,
                name VARCHAR(50) NOT NULL,

                createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY recommendation (recommendationId) REFERENCES recommendations (id) ON DELETE CASCADE ON UPDATE CASCADE, 
                PRIMARY KEY (id)
            ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;`);
    },
    down(queryInterface) {
        return queryInterface.sequelize.query('DROP TABLE IF EXISTS recommendationTags;');
    }
};
