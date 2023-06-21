import { Sample } from '../../../samples/src/models/sample.entity';
import { Table, Column, Model, Scopes, DataType, ForeignKey } from 'sequelize-typescript';
import { User } from '../../../users/src/models';
import { Op } from 'sequelize';

const PRECISION = 10;
const SCALE = 2;

@Scopes(() => ({
    byId: (id: number | number[]) => ({ where: { id } }),
    byDate: (startDate?: string, endDate?: string) => {
        const opAnd = [];
        if (startDate) {
            opAnd.push({ [Op.gte]: startDate });
        }
        if (endDate) {
            opAnd.push({ [Op.lte]: endDate });
        }
        return { where: { createdAt: { [Op.and]: opAnd } } };
    },
    pagination: (query) => ({ limit: query.limit, offset: query.offset }),
    orderBy: (arrayOfOrders: [[string, string]]) => ({ order: arrayOfOrders }),
    byUserId: (userId) => ({ where: { userId } }),
}))
@Table({
    tableName: 'dnaAgeResults',
    timestamps: true,
    underscored: false
})
export class DnaAgeResult extends Model {
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
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    noMissingPerSample: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    meanMethBySample: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    minMethBySample: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    maxMethBySample: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    corSampleVSgoldstandard: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    meanAbsDifferenceSampleVSgoldstandard: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    meanXchromosome: number;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: true
    })
    isGenderOutlier: boolean;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: true
    })
    isIACOutlier: boolean;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    fractionFailed: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    DNAmAge: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    DNAmPhenoAge: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    DNAmAgeSkinBloodClock: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    DNAmGrimAge: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    IEAA: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    DNAmGrimAge2: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    DNAmGrimAge2_Tuned: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    DNAmFitAge: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    CD8T: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    CD4T: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    NK: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    Bcell: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    Mono: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    Gran: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    PlasmaBlast: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    CD8pCD28nCD45RAn: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    'CD8.naive': number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    'CD4.naive': number;

    @Column({
        type: DataType.STRING(255),
        allowNull: true
    })
    predictedTissue: string;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    DNAmTL: number;

    @Column({
        type: DataType.STRING(255),
        allowNull: true
    })
    predictedGender: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: true
    })
    predictedEthnicity: string;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    DNAmADM: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    DNAmB2M: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    DNAmCystatinC: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    DNAmGDF15: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    DNAmLeptin: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    DNAmPACKYRS: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    DNAmPAI1: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    DNAmTIMP1: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    DNAmGDF_15: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    DNAmEFEMP1: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    DNAmCystatin_C: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    DNAmTIMP_1: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    DNAmcd56: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    DNAmpai_1: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    DNAmtemp: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    DNAmADM_Zscore: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    DNAmAge_Zscore: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    DNAmB2M_Zscore: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    DNAmCystatinC_Zscore: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    DNAmGDF15_Zscore: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    DNAmLeptin_Zscore: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    DNAmPACKYRS_Zscore: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    DNAmPAI1_Zscore: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    DNAmTIMP1_Zscore: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    DNAmADM_percentile: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    DNAmB2M_percentile: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    DNAmCystatinC_percentile: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    DNAmGDF15_percentile: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    DNAmLeptin_percentile: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    DNAmPACKYRS_percentile: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    DNAmPAI1_percentile: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    DNAmTIMP1_percentile: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    DNAmAgeSkinBloodClock_Zscore: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    DNAmGrimAge_Zscore: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    DNAmGrimAge2_Tuned_Zscore: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    DNAmGrimAge2_Zscore: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    DNAmPhenoAge_Zscore: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    DNAmGrimAge_percentile: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    DNAmGrimAge2_Tuned_percentile: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    DNAmGrimAge2_percentile: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    AgeAccelGrim: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true
    })
    AgeAccelPheno: number;
}