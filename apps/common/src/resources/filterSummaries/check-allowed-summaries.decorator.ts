import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import { EnumHelper } from '../../utils/helpers/enum.helper';
import { RecommendationTypes } from '../recommendations/recommendation-types';
import { CreateFilterSummaryDto } from 'apps/biomarkers/src/models/filterSummaries/create-filter-summary.dto';

export function CheckAllowedSummaries(validationOptions?: ValidationOptions) {
    return (object: object, propertyName: string): void => {
        registerDecorator({
            name: 'CheckAllowedSummaries',
            target: object.constructor,
            propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(summary: CreateFilterSummaryDto, args: ValidationArguments): boolean {
                    const filter = args.object;
                    const recommendationTypesCollection = EnumHelper.toCollection(RecommendationTypes);

                    const isValid = !!recommendationTypesCollection.find((recommendationType) => {
                        if (
                            recommendationType.value === RecommendationTypes.criticalLow
                            || recommendationType.value === RecommendationTypes.criticalHigh
                        ) {
                            return (typeof filter[recommendationType.key] === 'number' && typeof summary[recommendationType.key] === 'string')
                                || (typeof filter[recommendationType.key] !== 'number' && typeof summary[recommendationType.key] !== 'string');
                        } else {
                            return (
                                (typeof filter[`${recommendationType.key}Min`] === 'number' && typeof filter[`${recommendationType.key}Max`] === 'number')
                                && typeof summary[recommendationType.key] === 'string'
                            ) && (
                                    (typeof filter[`${recommendationType.key}Min`] !== 'number' || typeof filter[`${recommendationType.key}Max`] !== 'number')
                                    && typeof summary[recommendationType.key] !== 'string'
                                );
                        }
                    });

                    return isValid;
                },
                defaultMessage(args: ValidationArguments): string {
                    return `${args.property} for every existing summary field, coresponding range fields must exist`;
                },
            },
        });
    };
}