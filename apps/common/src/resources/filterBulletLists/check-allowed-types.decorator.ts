import { CreateFilterBulletListDto } from '../../../../biomarkers/src/models/filterBulletLists/create-filter-bullet-list.dto';
import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import { CreateWhatAreTheRisksDto } from 'apps/biomarkers/src/models/filters/create-what-are-the-risks.dto';
import { BulletListTypes } from './bullet-list-types';
import { EnumHelper } from '../../utils/helpers/enum.helper';

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
                    const fields = EnumHelper
                        .toCollection(BulletListTypes)
                        .map(field => field.key)
                        .join(', ');
                    return `${args.property} fields ${fields} must exist to allow adding bullet list with coresponding type`;
                },
            },
        });
    };
}