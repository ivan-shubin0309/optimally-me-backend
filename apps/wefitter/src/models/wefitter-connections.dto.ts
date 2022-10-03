import { ApiProperty } from '@nestjs/swagger';
import { WefitterConnectionDto } from './wefitter-connection.dto';

export class WefitterConnectionsDto {
    constructor(connections: WefitterConnectionDto[]) {
        this.data = connections.map(connection => new WefitterConnectionDto(connection));
    }

    @ApiProperty({ type: () => [WefitterConnectionDto] })
    readonly data: WefitterConnectionDto[];
}