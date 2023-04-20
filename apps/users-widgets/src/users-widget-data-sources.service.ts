import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../../common/src/base/base.service';
import { Repository, Sequelize } from 'sequelize-typescript';
import { UserWidgetDataSource } from './models/user-widget-data-source.entity';
import { WefitterMetricTypes } from '../../common/src/resources/wefitter/wefitter-metric-types';
import { Transaction } from 'sequelize';

@Injectable()
export class UsersWidgetDataSourcesService extends BaseService<UserWidgetDataSource> {
    constructor(
        @Inject('USER_WIDGET_DATA_SOURCE_MODEL') protected readonly model: Repository<UserWidgetDataSource>,
        @Inject('SEQUELIZE') private readonly dbConnection: Sequelize,
    ) { super(model); }

    async setDefaultSourceIfNotExist(userId: number, metricTypes: WefitterMetricTypes[], source: string, transaction?: Transaction): Promise<void> {
        const dataSources = await this.model
            .scope([
                { method: ['byUserId', userId] },
                { method: ['byMetricType', metricTypes] }
            ])
            .findAll({});

        const metricTypesToCreateFrom = metricTypes.filter(
            metricType => !dataSources.find(dataSource => metricType === dataSource.metricType)
        );

        await this.model.bulkCreate(metricTypesToCreateFrom.map(metricType => ({ metricType, userId, source })), { transaction });
    }

    async create(body: { metricType: WefitterMetricTypes, source: string }, transaction?: Transaction): Promise<UserWidgetDataSource> {
        await this.model.create(body, { transaction });
    }
}
