import { Table, Column, Model, Scopes, DataType, ForeignKey } from 'sequelize-typescript';
import { User } from './user.entity';
import { SexTypes } from '../../../common/src/resources/filters/sex-types';
import { AgeTypes } from '../../../common/src/resources/filters/age-types';
import { EthnicityTypes } from '../../../common/src/resources/filters/ethnicity-types';
import { OtherFeatureTypes } from '../../../common/src/resources/filters/other-feature-types';

@Scopes(() => ({
    byUserId: (userId: number) => ({ where: { userId } }),
}))
@Table({
    tableName: 'userAdditionalFields',
    timestamps: true,
    underscored: false
})
export class UserAdditionalField extends Model {
    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    userId: number;

    @Column({
        type: DataType.TINYINT,
        allowNull: true
    })
    sex: SexTypes;

    @Column({
        type: DataType.TINYINT,
        allowNull: true
    })
    age: AgeTypes;

    @Column({
        type: DataType.TINYINT,
        allowNull: true
    })
    ethnicity: EthnicityTypes;

    @Column({
        type: DataType.TINYINT,
        allowNull: true
    })
    otherFeature: OtherFeatureTypes;
}