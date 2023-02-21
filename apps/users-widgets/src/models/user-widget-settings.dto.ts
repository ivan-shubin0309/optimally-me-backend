import { ApiProperty } from '@nestjs/swagger';
import { UserWidgetSettingDto } from './user-widget-setting.dto';
import { UserWidgetSetting } from './user-widget-setting.entity';

export class UserWidgetSettingsDto {
    constructor(widgetSettings: UserWidgetSetting[]) {
        this.data = widgetSettings.map(widgetSetting => new UserWidgetSettingDto(widgetSetting));
    }

    @ApiProperty({ type: () => [UserWidgetSettingDto], required: false })
    readonly data: UserWidgetSettingDto[];
}
