import { ApiProperty } from '@nestjs/swagger';
import { nonWefitterConnactionSlugs } from '../../../common/src/resources/wefitter/non-wefitter-connection-slugs';
import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class DeleteConnectionDto {
    @ApiProperty({ type: () => String, required: true, description: nonWefitterConnactionSlugs.join(', ') })
    @Type(() => String)
    @IsNotEmpty()
    readonly connectionSlug: string;

    @ApiProperty({ type: () => Boolean, required: true, default: false })
    @IsNotEmpty()
    @Type(() => Boolean)
    readonly deleteData: boolean;

    @ApiProperty({ type: () => Boolean, required: true, default: true })
    @IsNotEmpty()
    @Type(() => Boolean)
    readonly isWefitterConnectionSlug: boolean = true;
}