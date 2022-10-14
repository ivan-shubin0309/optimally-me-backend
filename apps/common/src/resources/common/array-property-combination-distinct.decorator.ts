import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function ArrayPropertyCombinationDistinct(properties: string[], validationOptions?: ValidationOptions) {
    return (object: object, propertyName: string): void => {
        registerDecorator({
            name: 'ArrayDistinct',
            target: object.constructor,
            propertyName,
            constraints: properties,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments): boolean {
                    if (Array.isArray(value)) {
                        const propertiesArray = args.constraints;
                        const distinct = [
                            ...new Set(
                                value.map((v): object =>
                                    propertiesArray.reduce((previousValue, property) => `${previousValue}_${v[property]}`, '')
                                )
                            )
                        ];
                        return distinct.length === value.length;
                    }
                    return false;
                },
                defaultMessage(args: ValidationArguments): string {
                    return `${args.property} must not contains duplicate entry for combination of ${args.constraints.join(', ')}`;
                },
            },
        });
    };
}