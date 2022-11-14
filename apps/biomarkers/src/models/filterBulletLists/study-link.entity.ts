import { Table, Column, Model, DataType, Scopes, ForeignKey } from 'sequelize-typescript';
import { FilterBulletList } from './filter-bullet-list.entity';

@Scopes(() => ({}))
@Table({
    tableName: 'studyLinks',
    timestamps: true,
    underscored: false
})
export class StudyLink extends Model {
    @ForeignKey(() => FilterBulletList)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    filterBulletListId: number;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    content: string;
}