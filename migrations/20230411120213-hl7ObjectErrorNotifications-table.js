'use strict';

module.exports = {
    up(queryInterface) {
        return queryInterface.sequelize.query(`
            CREATE TABLE IF NOT EXISTS hl7ObjectErrorNotifications (
                id INTEGER AUTO_INCREMENT,
                
                hl7ObjectId INTEGER NOT NULL,
                message VARCHAR(255) NOT NULL,
                isResolved BOOLEAN NOT NULL DEFAULT FALSE,

                createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY hl7Object (hl7ObjectId) REFERENCES hl7Objects (id) ON DELETE CASCADE ON UPDATE CASCADE, 
                PRIMARY KEY (id)
            ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;`);
    },
    down(queryInterface) {
        return queryInterface.sequelize.query('DROP TABLE IF EXISTS hl7ObjectErrorNotifications;');
    }
};
