import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function RequiredIf(property: string, equals: string | number | boolean, validationOptions?: ValidationOptions) {
    return (object: object, propertyName: string): void => {
        registerDecorator({
            name: 'RequiredIf',
            target: object.constructor,
            propertyName,
            constraints: [property, equals],
            options: validationOptions,
            validator: {
                validate(value: any, validationArguments: ValidationArguments): boolean {
                    const body = validationArguments.object;
                    if (body[validationArguments.constraints[0]] === validationArguments.constraints[1]) {
                        return !!value;
                    }
                    return true;
                },
                defaultMessage(args: ValidationArguments): string {
                    return `${args.property} is required if ${args.constraints[0]} equals ${args.constraints[1]}`;
                },
            },
        });
    };
}