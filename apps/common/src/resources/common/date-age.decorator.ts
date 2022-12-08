import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import { DateTime } from 'luxon';
import { DATE_REGEX } from './constants';

export function DateAge(minAge: number, validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'DateAge',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: any) {
                    if (typeof value === 'string' && DATE_REGEX.test(value)) {
                        return DateTime.fromFormat(value, 'yyyy-MM-dd').plus({ years: minAge }) <= DateTime.utc();
                    }
                    return false;
                },
                defaultMessage(args: ValidationArguments): string {
                    return `${args.property} age should be greater than ${minAge}`;
                },
            },
        });
    };
}