import { Table, Column, Model, Scopes, DataType, HasOne } from 'sequelize-typescript';
import { TestKitTypes } from '../../../common/src/resources/hl7/test-kit-types';
import { UserSample } from './user-sample.entity';

@Scopes(() => ({
    byId: (id: number) => ({ where: { id } }),
    byIsActivated: (isActivated) => ({ where: { isActivated } }),
    pagination: (query) => ({ limit: query.limit, offset: query.offset }),
    bySampleId: (sampleId) => ({ where: { sampleId } }),
    withUserSample: (userId, isRequired = false) => ({
        include: [
            {
                model: UserSample,
                as: 'userSample',
                required: isRequired,
                where: {
                    userId
                }
            },
        ]
    })
}))
@Table({
    tableName: 'samples',
    timestamps: true,
    underscored: false
})
export class Sample extends Model {
    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false
    })
    sampleId: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false
    })
    isActivated: boolean;

    @Column({
        type: DataType.TINYINT,
        allowNull: false
    })
    testKitType: TestKitTypes;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    productName: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    labName: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    labProfileId: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    orderSource: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    orderId: string;

    @Column({
        type: DataType.DATEONLY,
        allowNull: true
    })
    expireAt: Date | any;

    @HasOne(() => UserSample, 'sampleId')
    userSample: UserSample;
}