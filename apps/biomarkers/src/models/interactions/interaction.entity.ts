import { InteractionTypes } from '../../../../common/src/resources/interactions/interaction-types';
import { Table, Column, Model, Scopes, DataType, ForeignKey } from 'sequelize-typescript';
import { Filter } from '../filters/filter.entity';

@Scopes(() => ({}))
@Table({
    tableName: 'interactions',
    timestamps: true,
    underscored: false
})
export class Interaction extends Model {
    @ForeignKey(() => Filter)
    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    filterId: number;

    @Column({
        type: DataType.NUMBER,
        allowNull: false
    })
    type: InteractionTypes;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    name: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    alsoKnowAs: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    impact: number;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    effects: string;
}