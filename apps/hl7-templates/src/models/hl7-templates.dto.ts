import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/src/models/pagination.dto';
import { Hl7TemplateDto } from './hl7-template.dto';
import { Hl7Template } from './hl7-template.entity';

export class Hl7TemplatesDto {
    @ApiProperty({ type: () => [Hl7Template] })
    readonly data: Hl7TemplateDto[];

    @ApiProperty({ type: () => PaginationDto, required: true })
    readonly pagination: PaginationDto;

    constructor(hl7Templates: Hl7Template[], pagination: PaginationDto) {
        this.pagination = pagination;
        this.data = hl7Templates.map(hl7Template => new Hl7TemplateDto(hl7Template));
    }
}
