import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EnumHelper } from '../../../common/src/utils/helpers/enum.helper';
import { DeviceDataWidgetTypes } from '../../../common/src/resources/users-widgets/users-widgets-types';

export class DeviceDataWidgetSettingDto {
    @ApiProperty({ type: () => Number, required: true, description: EnumHelper.toDescription(DeviceDataWidgetTypes) })
    @IsNotEmpty()
    @IsNumber()
    @IsEnum(DeviceDataWidgetTypes)
    readonly widgetType: number;

    @ApiProperty({ type: () => Number, required: true })
    @IsOptional()
    @IsNumber()
    @IsInt()
    @IsPositive()
    readonly order: number;
}
