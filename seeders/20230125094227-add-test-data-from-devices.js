'use strict';

const USER_ID = 1;

module.exports = {
  async up(queryInterface, Sequelize) {
    const dailySummaryData = [], heartrateSummaryData = [], sleepSummaryData = [];

    const currentDateInMilliseconds = Date.now();
    const dayInMilliseconds = 24 * 60 * 60 * 1000;

    for (let i = 0; i < 600; i++) {
      dailySummaryData.push({
        steps: Math.round(Math.random() * 1000),
        source: 'TEST',
        bmrCalories: Math.round(Math.random() * 1000),
        date: new Date(currentDateInMilliseconds - (dayInMilliseconds * (i + 1))),
        userId: USER_ID,
      });

      heartrateSummaryData.push({
        average: Math.round(Math.random() * 50 + 50),
        source: 'TEST',
        timestamp: new Date(currentDateInMilliseconds - (dayInMilliseconds * (i + 1))),
        userId: USER_ID,
      });

      sleepSummaryData.push({
        totalTimeInSleep: Math.round(Math.random() * 12),
        sleepScore: Math.round(Math.random() * 100),
        source: 'TEST',
        timestamp: new Date(currentDateInMilliseconds - (dayInMilliseconds * (i + 1))),
        userId: USER_ID,
      });
    }

    await Promise.all([
      queryInterface.bulkInsert('userWefitterDailySummary', dailySummaryData),
      queryInterface.bulkInsert('userWefitterHeartrateSummary', heartrateSummaryData),
      queryInterface.bulkInsert('userWefitterSleepSummary', sleepSummaryData),
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('userWefitterDailySummary', null, { where: { source: 'TEST', userId: USER_ID } });
    await queryInterface.bulkDelete('userWefitterHeartrateSummary', null, { where: { source: 'TEST', userId: USER_ID } });
    await queryInterface.bulkDelete('userWefitterSleepSummary', null, { where: { source: 'TEST', userId: USER_ID } });
  }
};
