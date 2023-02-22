import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../../common/src/base/base.dto';
import { DashboardWidgetTypes, DeviceDataWidgetTypes } from '../../../common/src/resources/users-widgets/users-widgets-types';
import { EnumHelper } from '../../../common/src/utils/helpers/enum.helper';
import { UserWidgetSetting } from './user-widget-setting.entity';

export class UserWidgetSettingDto extends BaseDto<UserWidgetSetting> {
    constructor(entity: UserWidgetSetting) {
        super(entity);

        this.userId = entity.userId;
        this.widgetType = entity.widgetType;
        this.order = entity.order;
    }

    @ApiProperty({ type: () => Number, required: true })
    readonly userId: number;

    @ApiProperty({
        type: () => Number,
        required: true,
        description: [
            EnumHelper.toDescription(DashboardWidgetTypes),
            EnumHelper.toDescription(DeviceDataWidgetTypes),
        ].join('<br/>&emsp;')
    })
    readonly widgetType: number;

    @ApiProperty({ type: () => Number, required: true })
    readonly order: number;
}