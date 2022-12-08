import { DateTime } from 'luxon';
import { EnumHelper } from '../../utils/helpers/enum.helper';
import { AgeTypes } from './age-types';

const ageRangeValidators = {
    [AgeTypes.afterSixty]: (value: number): boolean => value >= 60,
    [AgeTypes.betweenEighteenAndTwenty]: (value: number): boolean => value >= 18 && value <= 20,
    [AgeTypes.betweenTwentyAndThirtyNine]: (value: number): boolean => value >= 20 && value <= 39,
    [AgeTypes.betweenTwentyAndFifty]: (value: number): boolean => value >= 20 && value <= 50,
    [AgeTypes.betweenFourtyAndFiftyNine]: (value: number): boolean => value >= 40 && value <= 59,
    [AgeTypes.afterFifty]: (value: number): boolean => value >= 50,
    [AgeTypes.beforeFifty]: (value: number): boolean => value < 50,
    [AgeTypes.beforeFourtyFive]: (value: number): boolean => value >= 50,
    [AgeTypes.afterFourtyFive]: (value: number): boolean => value >= 45,
    [AgeTypes.betweenEighteenAndFiftyNine]: (value: number): boolean => value >= 18 && value <= 59,
    [AgeTypes.betweenSixtyAndSixtyNine]: (value: number): boolean => value >= 60 && value <= 69,
    [AgeTypes.betweenSeventyAndSeventyNine]: (value: number): boolean => value >= 70 && value <= 79,
    [AgeTypes.afterEighty]: (value: number): boolean => value >= 80,
};

export class AgeHelper {
    static getAgeRanges(dateOfBirth: string): AgeTypes[] {
        const age = DateTime.fromFormat(dateOfBirth, 'yyyy-MM-dd').diffNow().years;

        return EnumHelper
            .toCollection(AgeTypes)
            .filter(ageType => ageRangeValidators[ageType.value](age))
            .map(ageType => ageType.value);
    }
}