import { CreateRecommendationDto } from 'apps/biomarkers/src/models/recommendations/create-recommendation.dto';
import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import { RecommendationCategoryTypes } from './recommendation-category-types';

const skinCategoryTypes = [
    RecommendationCategoryTypes.skinProduct,
    RecommendationCategoryTypes.diy,
    RecommendationCategoryTypes.atHomeDevice
];

export function RecommendationCategoryValidation(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'RecommendationCategoryValidation',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments): boolean {
                    const body = args.object as CreateRecommendationDto;
                    if (
                        skinCategoryTypes.includes(value)
                        && (!body.idealTimeOfDay || !body?.idealSkinTypes?.length || !body?.notMeantForSkinTypes?.length)
                    ) {
                        return false;
                    }
                    return true;
                },
                defaultMessage(args: ValidationArguments): string {
                    return 'idealTimeOfDay, idealSkinTypes and notMeantForSkinTypes fields are required';
                },
            },
        });
    };
}