import { ApiProperty } from '@nestjs/swagger';
import { LibraryRule } from './library-rule.entity';
import { LibraryFilterDto } from '../filters/library-filter.dto';
import { LibraryInteractionDto } from '../interactions/library-interaction.dto';


export class LibraryRuleDto {
    @ApiProperty({ type: () => Number, required: true })
    readonly id: number;

    @ApiProperty({ type: () => String, required: true })
    readonly name: string;

    @ApiProperty({ type: () => String, required: true })
    readonly summary: string;

    @ApiProperty({ type: () => String, required: true })
    readonly whatIsIt: string;

    @ApiProperty({ type: () => String, required: true })
    readonly whatAreTheCauses: string;

    @ApiProperty({ type: () => String, required: true })
    readonly whatAreTheRisks: string;

    @ApiProperty({ type: () => String, required: true })
    readonly whatCanYouDo: string;

    @ApiProperty({ type: () => Boolean, required: true })
    readonly interactionsIsOn: boolean;

    @ApiProperty({ type: () => [LibraryFilterDto], required: true })
    readonly filters: LibraryFilterDto[];

    @ApiProperty({ type: () => [LibraryInteractionDto], required: false })
    readonly interactions: LibraryInteractionDto[];

    constructor(entity: LibraryRule) {
        this.id = entity.id;
        this.name = entity.name;
        this.summary = entity.summary;
        this.whatIsIt = entity.whatIsIt;
        this.whatAreTheCauses = entity.whatIsIt;
        this.whatAreTheRisks = entity.whatAreTheRisks;
        this.whatCanYouDo = entity.whatCanYouDo;
        this.interactionsIsOn = entity.interactionsIsOn;
        this.filters = entity.filters && entity.filters.length
            ? entity.filters.map(filter => new LibraryFilterDto(filter))
            : [];
        this.interactions = entity.interactions && entity.interactions.length
            ? entity.interactions.map(interaction => new LibraryInteractionDto(interaction))
            : [];
    }
}