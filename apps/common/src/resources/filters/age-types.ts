export enum AgeTypes {
    afterSixty = 1,
    betweenEighteenAndTwenty = 2,
    betweenTwentyAndThirtyNine = 3,
    betweenTwentyAndFifty = 4,
    betweenFourtyAndFiftyNine = 5,
    afterFifty = 6,
    beforeFifty = 7,
    beforeFourtyFive = 8,
    afterFourtyFive = 9,
    betweenEighteenAndFiftyNine = 10,
    betweenSixtyAndSixtyNine = 11,
    betweenSeventyAndSeventyNine = 12,
    afterEighty = 13,
}

export const AgeClientValues = {
    [AgeTypes.afterSixty]: '>60',
    [AgeTypes.betweenEighteenAndTwenty]: '18-20',
    [AgeTypes.betweenTwentyAndThirtyNine]: '20-39',
    [AgeTypes.betweenTwentyAndFifty]: '20-50',
    [AgeTypes.betweenFourtyAndFiftyNine]: '40-59',
    [AgeTypes.afterFifty]: '>50',
    [AgeTypes.beforeFifty]: '<50',
    [AgeTypes.beforeFourtyFive]: '<45',
    [AgeTypes.afterFourtyFive]: '>45',
    [AgeTypes.betweenEighteenAndFiftyNine]: '18-59',
    [AgeTypes.betweenSixtyAndSixtyNine]: '60-69',
    [AgeTypes.betweenSeventyAndSeventyNine]: '70-79',
    [AgeTypes.afterEighty]: '>80',
};
