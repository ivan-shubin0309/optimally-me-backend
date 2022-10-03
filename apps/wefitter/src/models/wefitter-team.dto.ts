import { ApiProperty } from '@nestjs/swagger';

export class WefitterTeamDto {
    @ApiProperty({ type: () => String, required: false })
    readonly name: string;

    @ApiProperty({ type: () => String, required: false })
    readonly public_id: string;

    @ApiProperty({ type: () => String, required: false })
    readonly url: number;

    @ApiProperty({ type: () => String, required: false })
    readonly avatar: string;

}