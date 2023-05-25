import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../../common/src/base/base.service';
import { Repository } from 'sequelize-typescript';
import { UserMetricGraphSetting } from './models/user-metric-graph-setting.entity';
import { MetricGraphViews } from '../../common/src/resources/users-widgets/metric-graph-views';
import { WefitterMetricTypes } from '../../common/src/resources/wefitter/wefitter-metric-types';
import { Transaction } from 'sequelize';

interface ICreateMetricGraphSetting {
    readonly userId: number;
    readonly startDate: string;
    readonly endDate: string;
    readonly activeView: MetricGraphViews;
    readonly activeMetrics: WefitterMetricTypes[];
    readonly isCollapsed: boolean;
}

@Injectable()
export class UsersMetricGraphSettingsService extends BaseService<UserMetricGraphSetting> {
    constructor(
        @Inject('USER_METRIC_GRAPH_SETTING_MODEL') protected readonly model: Repository<UserMetricGraphSetting>,
    ) { super(model); }

    async updateOrCreate(body: ICreateMetricGraphSetting, transaction?: Transaction): Promise<void> {
        const metricGraphSetting = await this.getOne([
            { method: ['byUserId', body.userId] }
        ]);

        if (metricGraphSetting) {
            await metricGraphSetting.update(body, { transaction });
        } else {
            await this.model.create(body as any, { transaction });
        }
    }
}
