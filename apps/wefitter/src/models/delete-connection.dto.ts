import { ApiProperty } from '@nestjs/swagger';
import { nonWefitterConnectionSlugs } from '../../../common/src/resources/wefitter/non-wefitter-connection-slugs';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty } from 'class-validator';
import { ParseBoolean } from '../../../common/src/resources/common/parse-boolean.decorator';

export class DeleteConnectionDto {
    @ApiProperty({ type: () => String, required: true, description: Object.values(nonWefitterConnectionSlugs).join(', ') })
    @Type(() => String)
    @IsNotEmpty()
    readonly connectionSlug: string;

    @ApiProperty({ type: () => Boolean, required: true, default: false })
    @IsNotEmpty()
    @IsBoolean()
    @ParseBoolean()
    readonly deleteData: boolean;

    @ApiProperty({ type: () => Boolean, required: true, default: true })
    @IsNotEmpty()
    @IsBoolean()
    @ParseBoolean()
    readonly isWefitterConnectionSlug: boolean = true;
}