import { ApiProperty } from '@nestjs/swagger';
import { MetricGraphViews } from '../../../common/src/resources/users-widgets/metric-graph-views';
import { WefitterMetricTypes } from '../../../common/src/resources/wefitter/wefitter-metric-types';
import { DateTime } from 'luxon';
import { EnumHelper } from '../../../common/src/utils/helpers/enum.helper';
import { UserMetricGraphSetting } from './user-metric-graph-setting.entity';

export class UserMetricGraphSettingDto {
    constructor(entity: UserMetricGraphSetting) {
        this.startDate = entity.startDate;
        this.endDate = entity.endDate;
        this.activeView = entity.activeView;
        this.activeMetrics = entity.get('activeMetrics');
        this.isCollapsed = entity.isCollapsed;
    }

    @ApiProperty({ type: () => String, required: false, example: DateTime.utc().toISO() })
    readonly startDate: string;

    @ApiProperty({ type: () => String, required: false, example: DateTime.utc().toISO() })
    readonly endDate: string;

    @ApiProperty({ type: () => Number, required: false, description: EnumHelper.toDescription(MetricGraphViews) })
    readonly activeView: MetricGraphViews;

    @ApiProperty({ type: () => [Number], required: false, description: EnumHelper.toDescription(WefitterMetricTypes) })
    readonly activeMetrics: WefitterMetricTypes[];

    @ApiProperty({ type: () => Boolean, required: false })
    readonly isCollapsed: boolean;
}