import { ApiProperty } from '@nestjs/swagger';
import { DashboardTabTypes } from '../../../common/src/resources/users-widgets/dashboard-tab-types';
import { EnumHelper } from '../../../common/src/utils/helpers/enum.helper';
import { UserDashboardSetting } from './user-dashboard-setting.entity';

export class UserDashboardSettingDto {
    constructor(entity: UserDashboardSetting) {
        this.isHeatmapCollapsed = entity.isHeatmapCollapsed;
        this.chosenTabType = entity.chosenTabType;
    }

    @ApiProperty({ type: () => Boolean, required: false })
    readonly isHeatmapCollapsed: boolean;

    @ApiProperty({ type: () => Number, required: false, description: EnumHelper.toDescription(DashboardTabTypes) })
    readonly chosenTabType: DashboardTabTypes;
}