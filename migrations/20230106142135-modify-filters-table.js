'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE filters
        MODIFY COLUMN criticalLow DECIMAL(19, 9) NULL,
        MODIFY COLUMN lowMin DECIMAL(19, 9) NULL,
        MODIFY COLUMN lowMax DECIMAL(19, 9) NULL,
        MODIFY COLUMN subOptimalMin DECIMAL(19, 9) NULL,
        MODIFY COLUMN subOptimalMax DECIMAL(19, 9) NULL,
        MODIFY COLUMN optimalMin DECIMAL(19, 9) NULL,
        MODIFY COLUMN optimalMax DECIMAL(19, 9) NULL,
        MODIFY COLUMN supraOptimalMin DECIMAL(19, 9) NULL,
        MODIFY COLUMN supraOptimalMax DECIMAL(19, 9) NULL,
        MODIFY COLUMN highMin DECIMAL(19, 9) NULL,
        MODIFY COLUMN highMax DECIMAL(19, 9) NULL,
        MODIFY COLUMN criticalHigh DECIMAL(19, 9) NULL;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE filters
        MODIFY COLUMN criticalLow FLOAT NULL,
        MODIFY COLUMN lowMin FLOAT NULL,
        MODIFY COLUMN lowMax FLOAT NULL,
        MODIFY COLUMN subOptimalMin FLOAT NULL,
        MODIFY COLUMN subOptimalMax FLOAT NULL,
        MODIFY COLUMN optimalMin FLOAT NULL,
        MODIFY COLUMN optimalMax FLOAT NULL,
        MODIFY COLUMN supraOptimalMin FLOAT NULL,
        MODIFY COLUMN supraOptimalMax FLOAT NULL,
        MODIFY COLUMN highMin FLOAT NULL,
        MODIFY COLUMN highMax FLOAT NULL,
        MODIFY COLUMN criticalHigh FLOAT NULL;
    `);
  }
};
