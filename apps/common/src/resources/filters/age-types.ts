export enum AgeTypes {
    upToNineteen = 1,
    betweenTwentyAndFifty = 2,
    betweenFiftyAndFiftyNine = 3,
    afterSixty = 4,
    beforeFifty = 5,
    afterFifty = 6,
}

export const AgeClientValues = {
    [AgeTypes.upToNineteen]: '0-19',
    [AgeTypes.betweenTwentyAndFifty]: '20-50',
    [AgeTypes.betweenFiftyAndFiftyNine]: '50-59',
    [AgeTypes.afterSixty]: '>60',
    [AgeTypes.beforeFifty]: '<50',
    [AgeTypes.afterFifty]: '>50'
};
