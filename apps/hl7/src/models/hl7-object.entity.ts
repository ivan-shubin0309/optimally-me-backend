import { Hl7ObjectStatuses } from '../../../common/src/resources/hl7/hl7-object-statuses';
import { Table, Column, Model, Scopes, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { SexTypes } from '../../../common/src/resources/filters/sex-types';
import { User } from '../../../users/src/models';
import { literal, Op } from 'sequelize';
import { File } from '../../../files/src/models/file.entity';
import { OtherFeatureTypes } from '../../../common/src/resources/filters/other-feature-types';

@Scopes(() => ({
    bySampleCode: (sampleCode: string) => ({ where: { sampleCode } }),
    pagination: (query) => ({ limit: query.limit, offset: query.offset }),
    search: (searchString: string) => ({
        where: {
            [Op.or]: [
                literal(`CONCAT(\`Hl7Object\`.\`firstName\`, ' ', \`Hl7Object\`.\`lastName\`) LIKE '%${searchString}%'`),
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
    withFiles: () => ({
        include: [
            {
                model: File,
                as: 'file',
                required: false,
            },
            {
                model: File,
                as: 'statusFile',
                required: false,
            },
            {
                model: File,
                as: 'resultFile',
                required: false,
            },
            {
                model: File,
                as: 'pdfResultFile',
                required: false,
            },
        ]
    }),
    byStatusFileId: (statusFileId) => ({ where: { statusFileId } }),
    byResultFileId: (resultFileId) => ({ where: { resultFileId } }),
    byStatusFileAt: (statusFileAt) => ({ where: { statusFileAt } }),
    byResultFileAt: (resultFileAt) => ({ where: { resultFileAt } }),
    byUserId: (userId) => ({ where: { userId } }),
    byPdfResultFileId: (pdfResultFileId) => ({ where: { pdfResultFileId } }),
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
        allowNull: true
    })
    fileId: number;

    @ForeignKey(() => File)
    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    statusFileId: number;

    @ForeignKey(() => File)
    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    resultFileId: number;

    @ForeignKey(() => File)
    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    pdfResultFileId: number;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    lab: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    orderId: string;

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
        type: DataType.DATE,
        allowNull: true
    })
    activatedAt: Date | any;

    @Column({
        type: DataType.DATE,
        allowNull: true
    })
    sampleAt: Date | any;

    @Column({
        type: DataType.DATE,
        allowNull: true
    })
    labReceivedAt: Date | any;

    @Column({
        type: DataType.DATE,
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

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    })
    isCriticalResult: boolean;

    @Column({
        type: DataType.DATE,
        allowNull: true
    })
    statusFileAt: Date|any;

    @Column({
        type: DataType.DATE,
        allowNull: true
    })
    resultFileAt: Date|any;

    @Column({
        type: DataType.DATE,
        allowNull: true
    })
    pdfResultFileAt: Date | any;

    @Column({
        type: DataType.TINYINT,
        allowNull: true
    })
    userOtherFeature: OtherFeatureTypes;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    cancellationReason: string;

    @BelongsTo(() => File, 'fileId')
    file: File;

    @BelongsTo(() => File, 'statusFileId')
    statusFile: File;

    @BelongsTo(() => File, 'resultFileId')
    resultFile: File;

    @BelongsTo(() => File, 'pdfResultFileId')
    pdfResultFile: File;
}