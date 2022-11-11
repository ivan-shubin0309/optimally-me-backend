import { CreateFilterBulletListDto } from '../../../../biomarkers/src/models/filterBulletLists/create-filter-bullet-list.dto';
import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import { CreateWhatAreTheRisksDto } from 'apps/biomarkers/src/models/filters/create-what-are-the-risks.dto';
import { BulletListTypes } from './bullet-list-types';

export function CheckAllowedTypes(validationOptions?: ValidationOptions) {
    return (object: object, propertyName: string): void => {
        registerDecorator({
            name: 'CheckAllowedTypes',
            target: object.constructor,
            propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(bulletList: CreateFilterBulletListDto, args: ValidationArguments): boolean {
                    const whatAreTheRisks: CreateWhatAreTheRisksDto = args.object as CreateWhatAreTheRisksDto;

                    if (!BulletListTypes[bulletList.type]) {
                        return true;
                    }

                    return !!whatAreTheRisks[BulletListTypes[bulletList.type]];
                },
                defaultMessage(args: ValidationArguments): string {
                    return `${args.property} field ${BulletListTypes[args.value.type]} must exist to add bullet list with type ${args.value.type}`;
                },
            },
        });
    };
}