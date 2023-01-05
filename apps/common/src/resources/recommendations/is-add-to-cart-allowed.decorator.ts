import { CreateRecommendationDto } from 'apps/biomarkers/src/models/recommendations/create-recommendation.dto';
import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function IsAddToCartAllowed(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'IsAddToCartAllowed',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const recommendationBody = args.object as CreateRecommendationDto;
                    if (value && !recommendationBody.productLink) {
                        return false;
                    }
                    return true;
                },
                defaultMessage(args: ValidationArguments): string {
                    return `${args.property} cannot be set to true whithout productLink`;
                },
            },
        });
    };
}