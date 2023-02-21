import { IsNotEmpty, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DashboardWidgetSettingDto } from './dashboard-widget-setting.dto';
import { Type } from 'class-transformer';
import { ArrayDistinct } from 'apps/common/src/resources/common/array-distinct.decorator';

export class PutWidgetUserDashboardSettingsDto {
    @ApiProperty({ type: () => [DashboardWidgetSettingDto], required: true })
    @IsNotEmpty()
    @ArrayDistinct('widgetType')
    @ArrayDistinct('order')
    @ValidateNested()
    @Type(() => DashboardWidgetSettingDto)
    readonly data: DashboardWidgetSettingDto[];
}
