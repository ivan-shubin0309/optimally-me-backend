import { CreateFilterDto } from '../../../../biomarkers/src/models/filters/create-filter.dto';
import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import { CreateWhatAreTheRisksDto } from '../../../../biomarkers/src/models/filters/create-what-are-the-risks.dto';
import { CreateWhatAreTheCausesDto } from '../../../../biomarkers/src/models/filters/create-what-are-the-causes.dto';

export function CheckIsAllowedTextField(validationOptions?: ValidationOptions) {
    return (object: object, propertyName: string): void => {
        registerDecorator({
            name: 'CheckIsAllowedTextField',
            target: object.constructor,
            propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(entity: CreateWhatAreTheRisksDto | CreateWhatAreTheCausesDto, args: ValidationArguments): boolean {
                    const filter: CreateFilterDto = args.object as CreateFilterDto;
                    let isValidLow = true, isValidHigh = true;

                    if (typeof entity.low === 'string') {
                        isValidLow = typeof filter.criticalLow === 'number'
                            || (typeof filter.lowMin === 'number' && typeof filter.lowMax === 'number');
                    }

                    if (typeof entity.high === 'string') {
                        isValidHigh = typeof filter.criticalHigh === 'number'
                            || (typeof filter.highMin === 'number' && typeof filter.highMax === 'number');
                    }

                    return isValidLow && isValidHigh;
                },
                defaultMessage(args: ValidationArguments): string {
                    return `${args.property} allowed only if coresponding ranges are present`;
                },
            },
        });
    };
}