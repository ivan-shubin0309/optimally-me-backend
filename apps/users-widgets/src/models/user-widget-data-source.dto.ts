import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../../common/src/base/base.dto';
import { EnumHelper } from '../../../common/src/utils/helpers/enum.helper';
import { UserWidgetDataSource } from './user-widget-data-source.entity';
import { WefitterMetricTypes } from '../../../common/src/resources/wefitter/wefitter-metric-types';

export class UserWidgetDataSourceDto extends BaseDto<UserWidgetDataSource> {
    constructor(entity: UserWidgetDataSource) {
        super(entity);

        this.userId = entity.userId;
        this.source = entity.source;
        this.metricType = entity.metricType;
    }

    @ApiProperty({ type: () => Number, required: true })
    readonly userId: number;

    @ApiProperty({ type: () => String, required: true })
    readonly source: string;

    @ApiProperty({ type: () => Number, required: true, description: EnumHelper.toDescription(WefitterMetricTypes) })
    readonly metricType: number;
}