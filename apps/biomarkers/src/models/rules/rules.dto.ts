import { ApiProperty } from '@nestjs/swagger';
import { LibraryRuleDto } from './library-rule.dto';
import { LibraryRule } from '../rules/library-rule.entity';
import { PaginationDto } from '../../../../common/src/models/pagination.dto';

export class RulesDto {
    @ApiProperty({ type: () => [LibraryRuleDto] })
    readonly rules: LibraryRuleDto[];

    @ApiProperty({ type: () => PaginationDto, required: true })
    readonly pagination: PaginationDto;

    constructor(rules: LibraryRule[], pagination: PaginationDto) {
        this.pagination = pagination;
        this.rules = rules.map(rule => new LibraryRuleDto(rule));
    }
}