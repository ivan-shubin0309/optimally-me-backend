import { IsBoolean, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EnumHelper } from '../../../common/src/utils/helpers/enum.helper';
import { DashboardTabTypes } from '../../../common/src/resources/users-widgets/dashboard-tab-types';

export class PutDahboardSettingsDto {
    @ApiProperty({ type: () => Boolean, required: false })
    @IsOptional()
    @IsBoolean()
    readonly isHeatmapCollapsed: boolean = null;

    @ApiProperty({ type: () => Number, required: false, description: EnumHelper.toDescription(DashboardTabTypes) })
    @IsOptional()
    @IsNumber()
    @IsEnum(DashboardTabTypes)
    readonly chosenTabType: number = null;
}
