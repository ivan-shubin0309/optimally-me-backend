import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { WidgetSettingTypes } from '../../../common/src/resources/users-widgets/users-widgets-types';
import { EnumHelper } from '../../../common/src/utils/helpers/enum.helper';
import { Type } from 'class-transformer';

export class GetWidgetSettingsDto {
    @ApiProperty({ type: () => Number, required: true, description: EnumHelper.toDescription(WidgetSettingTypes) })
    @IsNotEmpty()
    @IsNumber()
    @IsEnum(WidgetSettingTypes)
    @Type(() => Number)
    readonly widgetSettingType: number;
}
