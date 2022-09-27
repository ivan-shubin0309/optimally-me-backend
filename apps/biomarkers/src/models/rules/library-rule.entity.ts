import { Table, Column, Model, Scopes, DataType, HasMany } from 'sequelize-typescript';
import { LibraryFilter } from '../filters/library-filter.entity';
import { LibraryInteraction } from '../interactions/library-interaction.entity';

@Scopes(() => ({
    withLibraryFilters: () => ({
        include: [
            {
                model: LibraryFilter,
                as: 'filters'
            }
        ]
    }),
    withInteractions: () => ({
        include: [
            {
                model: LibraryInteraction,
                as: 'interactions',
            }
        ]
    }),
    pagination: (query) => ({ limit: query.limit, offset: query.offset })
}))
@Table({
    tableName: 'rulesLibrary',
    timestamps: true,
    underscored: false
})
export class LibraryRule extends Model {

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    summary: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    whatIsIt: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    whatAreTheCauses: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    whatAreTheRisks: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    whatCanYouDo: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false
    })
    interactionsIsOn: boolean;

    @HasMany(() => LibraryFilter, 'ruleId')
    filters: LibraryFilter[];

    @HasMany(() => LibraryInteraction, 'ruleId')
    interactions: LibraryInteraction[];
}