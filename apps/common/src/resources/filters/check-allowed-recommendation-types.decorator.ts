import { AddRecommendationDto } from '../../../../biomarkers/src/models/recommendations/add-recommendation.dto';
import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import { EnumHelper } from '../../utils/helpers/enum.helper';
import { RecommendationTypes } from '../recommendations/recommendation-types';

export function CheckAllowedRecommendationTypes(validationOptions?: ValidationOptions) {
    return (object: object, propertyName: string): void => {
        registerDecorator({
            name: 'CheckAllowedRecommendationTypes',
            target: object.constructor,
            propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(recommendation: AddRecommendationDto, args: ValidationArguments): boolean {
                    const filter = args.object;
                    const recommendationTypesCollection = EnumHelper.toCollection(RecommendationTypes);

                    const isValid = !!recommendationTypesCollection.find((recommendationType) => {
                        if (recommendationType.value !== recommendation.type) {
                            return false;
                        }

                        if (
                            recommendationType.value === RecommendationTypes.criticalLow
                            || recommendationType.value === RecommendationTypes.criticalHigh
                        ) {
                            return typeof filter[recommendationType.key] === 'number';
                        } else {
                            return typeof filter[`${recommendationType.key}Min`] === 'number' || typeof filter[`${recommendationType.key}Max`] === 'number';
                        }
                    });

                    return isValid;
                },
                defaultMessage(args: ValidationArguments): string {
                    return `${args.property} both coresponding ranges must exist to add recommendation`;
                },
            },
        });
    };
}