import { IsNotEmpty, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayDistinct } from '../../../common/src/resources/common/array-distinct.decorator';
import { PatchWidgetDataSourceDto } from './patch-widget-data-source.dto';
import { ArrayPropertyCombinationDistinct } from 'apps/common/src/resources/common/array-property-combination-distinct.decorator';

export class PatchWidgetDataSourcesDto {
    @ApiProperty({ type: () => [PatchWidgetDataSourceDto], required: true })
    @IsNotEmpty()
    @ArrayPropertyCombinationDistinct(['source', 'metricName'])
    @ArrayDistinct('source')
    @ValidateNested()
    @Type(() => PatchWidgetDataSourceDto)
    readonly data: PatchWidgetDataSourceDto[];
}
