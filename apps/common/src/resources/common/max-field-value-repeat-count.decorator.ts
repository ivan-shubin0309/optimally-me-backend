import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function MaxFieldValueRepeatCount(fieldName: string, maxCount: number, validationOptions?: ValidationOptions) {
    return (object: object, propertyName: string) => {
        registerDecorator({
            name: 'MaxFieldValueRepeatCount',
            target: object.constructor,
            propertyName,
            constraints: [fieldName, maxCount],
            options: validationOptions,
            validator: {
                validate(array: any[], args: ValidationArguments): boolean {
                    const [propertyName, count] = args.constraints;
                    const valuesMap = {};
                    array.forEach(obj => {
                        if (!valuesMap[obj[propertyName]]) {
                            valuesMap[obj[propertyName]] = 0;
                        }
                        valuesMap[obj[propertyName]]++;
                    });
                    return !Object
                        .values(valuesMap)
                        .find(value => value > count);
                },
            }
        });
    };
}