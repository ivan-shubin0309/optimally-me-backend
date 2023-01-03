import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import { CreateSkinFilterDto } from '../../../../biomarkers/src/models/filters/create-skin-filter.dto';

export function ValidateIdealSkinType(validationOptions?: ValidationOptions) {
    return (object: object, propertyName: string): void => {
        registerDecorator({
            name: 'ValidateIdealSkinType',
            target: object.constructor,
            propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: number[], args: ValidationArguments): boolean {
                    const filter: CreateSkinFilterDto = args.object as CreateSkinFilterDto;

                    if (value?.length && filter?.notMeantForSkinTypes?.length) {
                        return !value.find(elem => filter.notMeantForSkinTypes.includes(elem));
                    }

                    return true;
                },
                defaultMessage(args: ValidationArguments): string {
                    return 'idealSkinTypes and notMeantForSkinTypes cannot have same values';
                },
            },
        });
    };
}