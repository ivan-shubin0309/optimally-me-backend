import { CreateRecommendationDto } from '../../../../biomarkers/src/models/recommendations/create-recommendation.dto';
import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function ValidateIdealSkinType(validationOptions?: ValidationOptions) {
    return (object: object, propertyName: string): void => {
        registerDecorator({
            name: 'ValidateIdealSkinType',
            target: object.constructor,
            propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: number[], args: ValidationArguments): boolean {
                    const recommendation: CreateRecommendationDto = args.object as CreateRecommendationDto;

                    if (value?.length && recommendation?.notMeantForSkinTypes?.length) {
                        return !value.find(elem => recommendation.notMeantForSkinTypes.includes(elem));
                    }

                    return true;
                },
                defaultMessage(args: ValidationArguments): string {
                    return 'idealSkinTypes and notMeantForSkinTypes cannot have same values';
                },
            },
        });
    };
}