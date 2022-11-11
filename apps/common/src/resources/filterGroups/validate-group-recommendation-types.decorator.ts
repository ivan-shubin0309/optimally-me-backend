import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import { FilterGroups } from './filter-groups';

export function ValidateGroupRecommendationTypes(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'ValidateGroupRecommendationTypes',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments): boolean {
                    const currentObject: any = args.object;
                    if (!FilterGroups[currentObject.type]) {
                        return false;
                    }
                    return FilterGroups[currentObject.type].includes(value);
                },
                defaultMessage(args: ValidationArguments): string {
                    const currentObject: any = args.object;
                    if (!FilterGroups[currentObject.type]) {
                        return `${args.property} wrong group type`;
                    }
                    return `${args.property} should be in ${FilterGroups[currentObject.type].join(', ')}`;
                },
            },
        });
    };
}