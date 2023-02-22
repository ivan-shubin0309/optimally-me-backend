import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../../common/src/base/base.service';
import { Repository, Sequelize } from 'sequelize-typescript';
import { UserWidgetSetting } from './models/user-widget-setting.entity';
import { PutWidgetUserDashboardSettingsDto } from './models/put-widget-user-dashboard-settings.dto';
import { EnumHelper } from '../../common/src/utils/helpers/enum.helper';
import { DashboardWidgetTypes } from '../../common/src/resources/users-widgets/users-widgets-types';

@Injectable()
export class UsersWidgetSettingsService extends BaseService<UserWidgetSetting> {
    constructor(
        @Inject('USER_WIDGET_SETTING_MODEL') protected readonly model: Repository<UserWidgetSetting>,
        @Inject('SEQUELIZE') private readonly dbConnection: Sequelize,
    ) { super(model); }

    async bulkCreateDashboardSettings(body: PutWidgetUserDashboardSettingsDto, userId: number): Promise<void> {
        const settingsToCreate: any[] = body.data.map(widgetSetting => Object.assign({ userId }, widgetSetting));

        await this.dbConnection.transaction(async transaction => {
            await this.model
                .scope([
                    {
                        method: [
                            'byWidgetType',
                            EnumHelper
                                .toCollection(DashboardWidgetTypes)
                                .map(widgetType => widgetType.value)
                        ]
                    },
                    { method: ['byUserId', userId] }
                ])
                .destroy({ transaction });

            await this.model.bulkCreate(settingsToCreate, { transaction });
        });
    }
}
