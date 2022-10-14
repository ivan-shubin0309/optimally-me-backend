import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import { DateTime } from 'luxon';

export function IsDateInPast(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'IsOnlyDate',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: any) {
                    return typeof value === 'string' && DateTime.fromFormat(value, 'yyyy-MM-dd') < DateTime.utc().endOf('day');
                },
                defaultMessage(args: ValidationArguments): string {
                    return `${args.property} should be valid date in past`;
                },
            },
        });
    };
}