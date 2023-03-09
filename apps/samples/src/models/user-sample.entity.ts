import { User } from '../../../users/src/models';
import { Table, Column, Model, Scopes, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Sample } from './sample.entity';

@Scopes(() => ({
    byId: (id: number) => ({ where: { id } }),
    byIsHl7ObjectGenerated: (isHl7ObjectGenerated) => ({ where: { isHl7ObjectGenerated } }),
    pagination: (query) => ({ limit: query.limit, offset: query.offset }),
    withUser: (additionalScopes: any[]) => ({
        include: [
            {
                model: User.scope(additionalScopes),
                as: 'user',
                required: false,
            },
        ]
    }),
    withSample: () => ({
        include: [
            {
                model: Sample,
                as: 'sample',
                required: false,
            },
        ]
    }),
}))
@Table({
    tableName: 'userSamples',
    timestamps: true,
    underscored: false
})
export class UserSample extends Model {
    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    userId: number;

    @ForeignKey(() => Sample)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    sampleId: number;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    })
    isHl7ObjectGenerated: boolean;

    @BelongsTo(() => User, 'userId')
    user: User;

    @BelongsTo(() => Sample, 'sampleId')
    sample: Sample;
}