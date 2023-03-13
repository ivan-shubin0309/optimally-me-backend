import { Hl7ObjectStatuses } from '../../../common/src/resources/hl7/hl7-object-statuses';
import { Table, Column, Model, Scopes, DataType, ForeignKey } from 'sequelize-typescript';
import { SexTypes } from '../../../common/src/resources/filters/sex-types';
import { User } from '../../../users/src/models';
import { Op } from 'sequelize';
import { File } from '../../../files/src/models/file.entity';

@Scopes(() => ({
    bySampleCode: (sampleCode: string) => ({ where: { sampleCode } }),
    pagination: (query) => ({ limit: query.limit, offset: query.offset }),
    search: (searchString: string) => ({
        where: {
            [Op.or]: [
                { firstName: { [Op.like]: `%${searchString}%` } },
                { lastName: { [Op.like]: `%${searchString}%` } },
                { email: { [Op.like]: `%${searchString}%` } },
                { sampleCode: { [Op.like]: `%${searchString}%` } },
                { lab: { [Op.like]: `%${searchString}%` } },
                { orderId: { [Op.like]: `%${searchString}%` } },
                { testProductName: { [Op.like]: `%${searchString}%` } },
                { labId: { [Op.like]: `%${searchString}%` } },
            ]
        }
    }),
    byActivatedAtInterval: (startDate?: string, endDate?: string) => {
        const opAnd = [];
        if (startDate) {
            opAnd.push({ [Op.gte]: startDate });
        }
        if (endDate) {
            opAnd.push({ [Op.lte]: endDate });
        }
        return { where: { activatedAt: { [Op.and]: opAnd } } };
    },
    bySampleAtInterval: (startDate?: string, endDate?: string) => {
        const opAnd = [];
        if (startDate) {
            opAnd.push({ [Op.gte]: startDate });
        }
        if (endDate) {
            opAnd.push({ [Op.lte]: endDate });
        }
        return { where: { sampleAt: { [Op.and]: opAnd } } };
    },
    byLabReceivedAtInterval: (startDate?: string, endDate?: string) => {
        const opAnd = [];
        if (startDate) {
            opAnd.push({ [Op.gte]: startDate });
        }
        if (endDate) {
            opAnd.push({ [Op.lte]: endDate });
        }
        return { where: { labReceivedAt: { [Op.and]: opAnd } } };
    },
    byResultAtInterval: (startDate?: string, endDate?: string) => {
        const opAnd = [];
        if (startDate) {
            opAnd.push({ [Op.gte]: startDate });
        }
        if (endDate) {
            opAnd.push({ [Op.lte]: endDate });
        }
        return { where: { resultAt: { [Op.and]: opAnd } } };
    },
    byDateOfBirthInterval: (startDate?: string, endDate?: string) => {
        const opAnd = [];
        if (startDate) {
            opAnd.push({ [Op.gte]: startDate });
        }
        if (endDate) {
            opAnd.push({ [Op.lte]: endDate });
        }
        return { where: { dateOfBirth: { [Op.and]: opAnd } } };
    },
    byStatus: (status) => ({ where: { status } }),
    orderBy: (arrayOfOrders: [[string, string]]) => ({ order: arrayOfOrders }),
    byId: (id) => ({ where: { id } }),
    byFileId: (fileId) => ({ where: { fileId } }),
}))
@Table({
    tableName: 'hl7Objects',
    timestamps: true,
    underscored: false
})
export class Hl7Object extends Model {
    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    userId: number;

    @ForeignKey(() => File)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    fileId: number;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    lab: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    orderId: number;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    testProductName: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    sampleCode: string;

    @Column({
        type: DataType.TINYINT,
        allowNull: true
    })
    status: Hl7ObjectStatuses;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    email: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    firstName: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    lastName: string;

    @Column({
        type: DataType.DATEONLY,
        allowNull: true
    })
    dateOfBirth: string;

    @Column({
        type: DataType.TINYINT,
        allowNull: true
    })
    sex: SexTypes;

    @Column({
        type: DataType.DATEONLY,
        allowNull: true
    })
    activatedAt: Date | any;

    @Column({
        type: DataType.DATEONLY,
        allowNull: true
    })
    sampleAt: Date | any;

    @Column({
        type: DataType.DATEONLY,
        allowNull: true
    })
    labReceivedAt: Date | any;

    @Column({
        type: DataType.DATEONLY,
        allowNull: true
    })
    resultAt: Date | any;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: true
    })
    isQuizCompleted: boolean;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    labId: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    abnormalResults: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    failedTests: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    toFollow: string;
}