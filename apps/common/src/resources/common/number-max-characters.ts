import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function NumberMaxCharacters(maxCharacters: number, validationOptions?: ValidationOptions) {
    return (object: object, propertyName: string): void => {
        registerDecorator({
            name: 'NumberMaxCharacters',
            target: object.constructor,
            propertyName,
            constraints: [maxCharacters],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments): boolean {
                    if (typeof value === 'number') {
                        return value.toString().length <= args.constraints[0];
                    }
                    return false;
                },
                defaultMessage(args: ValidationArguments): string {
                    return `${args.property} must not contain more than ${args.constraints[0]} symbols`;
                },
            },
        });
    };
}