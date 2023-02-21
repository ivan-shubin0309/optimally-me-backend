import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EnumHelper } from '../../../common/src/utils/helpers/enum.helper';
import { DashboardWidgetTypes } from '../../../common/src/resources/users-widgets/users-widgets-types';

export class DashboardWidgetSettingDto {
    @ApiProperty({ type: () => Number, required: true, description: EnumHelper.toDescription(DashboardWidgetTypes) })
    @IsNotEmpty()
    @IsNumber()
    @IsEnum(DashboardWidgetTypes)
    readonly widgetType: number;

    @ApiProperty({ type: () => Number, required: true })
    @IsNotEmpty()
    @IsNumber()
    @IsInt()
    @IsPositive()
    readonly order: number;
}
