import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../../common/src/base/base.service';
import { Repository } from 'sequelize-typescript';
import { UserDashboardSetting } from './models/user-dashboard-setting.entity';
import { DashboardTabTypes } from '../../common/src/resources/users-widgets/dashboard-tab-types';
import { Transaction } from 'sequelize';

interface ICreateDashboardSetting {
    readonly userId: number;
    readonly isHeatmapCollapsed: boolean;
    readonly chosenTabType: DashboardTabTypes;
}

@Injectable()
export class UsersDashboardSettingsService extends BaseService<UserDashboardSetting> {
    constructor(
        @Inject('USER_DASHBOARD_SETTING_MODEL') protected readonly model: Repository<UserDashboardSetting>,
    ) { super(model); }

    async updateOrCreate(body: ICreateDashboardSetting, transaction?: Transaction): Promise<void> {
        const dashboardSetting = await this.getOne([
            { method: ['byUserId', body.userId] }
        ]);

        if (dashboardSetting) {
            await dashboardSetting.update(body, { transaction });
        } else {
            await this.model.create(body as any, { transaction });
        }
    }
}
