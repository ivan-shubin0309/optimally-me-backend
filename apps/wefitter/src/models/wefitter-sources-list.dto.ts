import { ApiProperty } from '@nestjs/swagger';

interface ISource {
    isAvailable: boolean, 
    source: string
}

export class WefitterSourcesListDto {
    constructor(sources: ISource[]) {
        this.sources = sources;
    }

    @ApiProperty({ type: () => [SourceDto], required: true })
    readonly sources: SourceDto[];
}

class SourceDto {
    constructor(entity: ISource) {
        this.source = entity.source;
        this.isAvailable = entity.isAvailable;
    }

    @ApiProperty({ type: () => String, required: true })
    readonly source: string;

    @ApiProperty({ type: () => Boolean, required: true })
    readonly isAvailable: boolean;
}
