import { Table, Column, Model, Scopes, DataType, ForeignKey } from 'sequelize-typescript';
import { User } from './user.entity';
import { SexTypes } from '../../../common/src/resources/filters/sex-types';
import { EthnicityTypes } from '../../../common/src/resources/filters/ethnicity-types';
import { OtherFeatureTypes } from '../../../common/src/resources/filters/other-feature-types';
import { RegistrationSteps } from '../../../common/src/resources/users/registration-steps';
import { SkinTypes } from '../../../common/src/resources/filters/skin-types';
import { RegistrationSources } from '../../../common/src/resources/users/registration-sources';

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
    ethnicity: EthnicityTypes;

    @Column({
        type: DataType.TINYINT,
        allowNull: true
    })
    otherFeature: OtherFeatureTypes;

    @Column({
        type: DataType.DATEONLY,
        allowNull: true
    })
    dateOfBirth: string;

    @Column({
        type: DataType.TINYINT,
        allowNull: true,
        defaultValue: RegistrationSteps.profileSetup
    })
    registrationStep: RegistrationSteps;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: true,
        defaultValue: false
    })
    isEmailVerified: boolean;

    @Column({
        type: DataType.TINYINT,
        allowNull: true,
    })
    skinType: SkinTypes;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: true
    })
    isSensitiveSkin: boolean;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    })
    isUserVerified: boolean;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    })
    isSelfAssesmentQuizCompleted: boolean;

    @Column({
        type: DataType.TINYINT,
        allowNull: true
    })
    registrationSource: RegistrationSources;
}