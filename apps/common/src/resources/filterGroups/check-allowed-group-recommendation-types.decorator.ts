import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import { RecommendationTypes } from '../recommendations/recommendation-types';
import { CreateFilterGroupDto } from '../../../../biomarkers/src/models/filterGroups/create-filter-group.dto';

export function CheckAllowedGroupRecommendationTypes(validationOptions?: ValidationOptions) {
    return (object: object, propertyName: string): void => {
        registerDecorator({
            name: 'CheckAllowedGroupRecommendationTypes',
            target: object.constructor,
            propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(group: CreateFilterGroupDto, args: ValidationArguments): boolean {
                    const filter = args.object;

                    const isValidArray = group.recommendationTypes.map((recommendationType) => {
                        if (!RecommendationTypes[recommendationType]) {
                            return false;
                        }

                        if (
                            recommendationType === RecommendationTypes.criticalLow
                            || recommendationType === RecommendationTypes.criticalHigh
                        ) {
                            return typeof filter[RecommendationTypes[recommendationType]] === 'number';
                        } else {
                            return typeof filter[`${RecommendationTypes[recommendationType]}Min`] === 'number' || typeof filter[`${RecommendationTypes[recommendationType]}Max`] === 'number';
                        }
                    });

                    return isValidArray.filter(isValid => isValid).length === isValidArray.length;
                },
                defaultMessage(args: ValidationArguments): string {
                    return `${args.property} both coresponding ranges must exist to group recommendation`;
                },
            },
        });
    };
}