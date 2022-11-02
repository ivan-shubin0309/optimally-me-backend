import { ValidationArguments, registerDecorator, ValidationOptions } from 'class-validator';

export function Xor(fieldName: string, validationOptions?: ValidationOptions) {
    return (object: object, propertyName: string) => {
        registerDecorator({
            name: 'Xor',
            target: object.constructor,
            propertyName,
            constraints: [fieldName],
            options: validationOptions,
            validator: {
                validate(propertyValue: string, args: ValidationArguments): boolean {
                    return (!!propertyValue && !args.object[args.constraints[0]]) || (!propertyValue && !!args.object[args.constraints[0]]);
                },
                defaultMessage(args: ValidationArguments): string {
                    return `${args.property} or ${args.constraints[0]} only must exist at same time`;
                },
            }
        });
    };
}