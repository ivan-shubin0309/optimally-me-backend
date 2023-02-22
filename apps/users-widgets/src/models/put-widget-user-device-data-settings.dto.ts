import { IsNotEmpty, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayDistinct } from '../../../common/src/resources/common/array-distinct.decorator';
import { DeviceDataWidgetSettingDto } from './device-data-widget-setting.dto';

export class PutWidgetUserDeviceDataSettingsDto {
    @ApiProperty({ type: () => [DeviceDataWidgetSettingDto], required: true })
    @IsNotEmpty()
    @ArrayDistinct('widgetType')
    @ValidateNested()
    @Type(() => DeviceDataWidgetSettingDto)
    readonly data: DeviceDataWidgetSettingDto[];
}
