import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

const DATE_REGEX = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;

export function IsOnlyDate(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'IsOnlyDate',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: any) {
                    return typeof value === 'string' && DATE_REGEX.test(value);
                },
                defaultMessage(args: ValidationArguments): string {
                    return `${args.property} should be valid date in format yyyy-mm-dd`;
                },
            },
        });
    };
}