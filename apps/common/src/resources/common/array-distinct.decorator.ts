import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function ArrayDistinct(property: string, validationOptions?: ValidationOptions) {
    return (object: object, propertyName: string): void => {
        registerDecorator({
            name: 'ArrayDistinct',
            target: object.constructor,
            propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: any): boolean {
                    if (Array.isArray(value)) {
                        const distinct = [...new Set(value.map((v): object => v[property]))];
                        return distinct.length === value.length;
                    }
                    return false;
                },
                defaultMessage(args: ValidationArguments): string {
                    return `${args.property} must not contains duplicate entry for ${args.constraints[0]}`;
                },
            },
        });
    };
}