import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function OneOf(propertiesToCompare: string[], validationOptions?: ValidationOptions) {
    return (object: object, propertyName: string): void => {
        registerDecorator({
            name: 'OneOf',
            target: object.constructor,
            propertyName,
            constraints: [propertiesToCompare],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments): boolean {
                    const propertyNames: Array<string> = args.constraints[0];
                    if (typeof value === 'object') {
                        return !!propertyNames.find(propertyName => value[propertyName]);
                    }
                    return false;
                },
                defaultMessage(args: ValidationArguments): string {
                    return `${args.property} at least one of ${args.constraints[0].join(', ')} is required`;
                },
            },
        });
    };
}